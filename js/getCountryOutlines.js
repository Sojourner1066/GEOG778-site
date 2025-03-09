async function fetchWikidataGeoShapes() {
    const endpointUrl = "https://query.wikidata.org/sparql";
    const sparqlQuery = `
        SELECT ?country ?countryLabel ?iso3166_3 ?geoShape WHERE {
          ?country wdt:P31 wd:Q3624078;  # Instance of sovereign state
                   wdt:P3896 ?geoShape;  # Has GeoShape property
                   wdt:P298 ?iso3166_3.  # ISO 3166-1 alpha-3 code
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        ORDER BY ?iso3166_3
    `;

    const fullUrl = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery) + "&format=json";

    try {
        const response = await fetch(fullUrl, { headers: { "Accept": "application/json" } });
        if (!response.ok) throw new Error("Failed to fetch SPARQL results");

        const data = await response.json();
        // return data 
        return data.results.bindings.map(item => ({
            iso3166_3: item.iso3166_3.value,
            geoShape: item.geoShape.value.replace("http", "https") + "&action=raw",
            countryLabel: item.countryLabel.value
        }));
    } catch (error) {
        console.error("Error fetching Wikidata GeoShapes:", error);
        return [];
    }
}

async function mergeGeoShapes() {
    const countries = await fetchWikidataGeoShapes();
    console.log(countries)

    let mergedGeoJSON = {
        type: "FeatureCollection",
        features: []
    };

    for (const country of countries) {
        // const geoShapeUrl = `https://commons.wikimedia.org/wiki/Special:EntityData/${country.geoShape}`;
        
        try {
            const response = await fetch(country.geoShape);
            if (!response.ok) throw new Error(`Failed to fetch ${country.geoShape}`);

            const geojsonData = await response.json();

            if (geojsonData.type === "FeatureCollection") {
                geojsonData.features.forEach(feature => {
                    feature.properties = { ...feature.properties, iso3166_3: country.iso3166_3 };
                    mergedGeoJSON.features.push(feature);
                });
            } else if (geojsonData.type === "Feature") {
                geojsonData.properties = { ...geojsonData.properties, iso3166_3: country.iso3166_3 };
                mergedGeoJSON.features.push(geojsonData);
            }

        } catch (error) {
            console.error(`Error fetching GeoJSON for ${country.iso3166_3}:`, error);
        }
    }

    return mergedGeoJSON;
}

// Export the function for use in your HTML
export { mergeGeoShapes };