async function fetchGeoJSON() {
    const SPARQL_URL = "https://query.wikidata.org/sparql";
    const SPARQL_QUERY = `SELECT ?country ?countryLabel ?lat ?lon WHERE {
  {
    # Find all sovereign states
    ?country wdt:P31 wd:Q3624078;  # Instance of sovereign state
             wdt:P625 ?coord.      # Get the coordinate location
  }
  UNION
  {
    # Manually include the Kingdom of Denmark
    BIND(wd:Q756617 AS ?country)
    ?country wdt:P625 ?coord.  # Get Denmark's coordinate location
  }

  # Retrieve labels in English
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }

  # Extract lat/lon from WKT format
  BIND(STRDT(SUBSTR(STR(?coord), 7, STRLEN(STR(?coord)) - 8), geo:wktLiteral) AS ?wkt)
  BIND(xsd:decimal(SUBSTR(STR(?wkt), 6, STRBEFORE(STR(?wkt), " "))) AS ?lon)
  BIND(xsd:decimal(SUBSTR(STR(?wkt), STRAFTER(STR(?wkt), " "), STRLEN(STR(?wkt)) - STRAFTER(STR(?wkt), " "))) AS ?lat)
}
ORDER BY ?countryLabel`;

    const url = `${SPARQL_URL}?query=${encodeURIComponent(SPARQL_QUERY)}&format=json`;

    try {
        const response = await fetch(url, { headers: { "Accept": "application/json" } });
        const data = await response.json();

        const geojson = {
            type: "FeatureCollection",
            features: data.results.bindings.map(entry => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [parseFloat(entry.lon.value), parseFloat(entry.lat.value)]
                },
                properties: {
                    name: entry.countryLabel.value,
                    wikidataID: entry.country.value
                }
            }))
        };

        // Trigger download in the browser
        const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "sovereign_states.geojson";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("GeoJSON file downloaded.");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Run in browser
fetchGeoJSON();