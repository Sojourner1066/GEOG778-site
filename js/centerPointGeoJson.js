
// Function to fetch and convert Wikidata SPARQL results into GeoJSON
async function fetchWikidataGeoJSON() {
    const query = `
    SELECT ?country ?countryLabel ?iso3166_3 ?coord WHERE {
      ?country wdt:P31 wd:Q3624078;  # Sovereign state
               wdt:P298 ?iso3166_3;   # ISO 3166-1 alpha-3 code
               wdt:P625 ?coord.       # Coordinates

      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }`;

    const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        
        // Convert SPARQL results to GeoJSON
        const geoJSON = {
            type: "FeatureCollection",
            features: data.results.bindings.map(item => {
                // Extract latitude and longitude from 'Point(LONG LAT)'
                const match = item.coord.value.match(/Point\(([^ ]+) ([^ ]+)\)/);
                if (!match) return null; // Skip if coordinates are missing

                const [_, lon, lat] = match.map(Number);

                return {
                    type: "Feature",
                    properties: {
                        name: item.countryLabel.value,
                        iso3166_3: item.iso3166_3.value
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    }
                };
            }).filter(feature => feature !== null) // Remove any invalid entries
        };

        return geoJSON;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// function getCoordinatesByISO3(geojsonData, iso3) {
//     for (let feature of geojsonData.features) {
//         if (feature.properties.iso3166_3 === iso3) {
//             return feature.geometry.coordinates;
//         }
//     }
//     return null; // If no matching ISO3 code found
// }