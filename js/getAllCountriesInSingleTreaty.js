

  async function fetchWDTreatyMembers(treatycode="Q7184") {
    const query = `
        SELECT DISTINCT ?country ?isoCode WHERE {
        ?country wdt:P298 ?isoCode.  # Get all countries with ISO 3166-1 alpha-3 codes (ensuring they are countries)
        ?country p:P463 ?statement.  # Find all "member of" (P463) statements
        ?statement ps:P463 wd:${treatycode}.  # Filter for NATO (Q7184)
        
        FILTER NOT EXISTS { ?statement pq:P582 ?endTime }  # Exclude memberships with an "end time" (P582)
    
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    ORDER BY ?isoCode`;

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

