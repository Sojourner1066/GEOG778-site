// This query retrieves all countries that are members of a specific type of organization (e.g., UN, EU) based on their ISO 3166-1 alpha-3 code.
// then filters the results to include only those countries that are members of the specified organization type.
// currently it is hard coded to 


async function fetchWDcountry(iso3="GBR", orgType="Q1127126") {
    const query = `
        SELECT DISTINCT ?country ?countryLabel ?membership ?membershipLabel WHERE {
            {
            SELECT DISTINCT ?country ?countryLabel ?membership ?membershipLabel ?membershipType WHERE {
                ?country wdt:P298 "${iso3}".  # Filter for United Kingdom (ISO 3166-1 alpha-3 code)
                ?country p:P463 ?statement.  # Find all "member of" (P463) statements
                ?statement ps:P463 ?membership.  # Retrieve the actual membership entity
                FILTER NOT EXISTS { ?statement pq:P582 ?endTime }  # Exclude memberships with an "end time" (P582)
            
                ?membership wdt:P31 ?membershipType.  # Get the "instance of" (P31) type (what kind of entity it is)
        
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            }
            
            FILTER (?membershipType = wd:${orgType})  # Filter for specific membership type military organization
        }
        ORDER BY ?countryLabel ?membershipLabel`;

    const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

fetchWDcountry("GBR", "Q1127126").then(data => console.log(data));