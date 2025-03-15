function filterGeoJSONByISO3(geojsonData, isoCodes) {
    if (!geojsonData || !geojsonData.features) {
        console.error("Invalid GeoJSON data");
        return null;
    }

    // Ensure isoCodes is an array
    if (!Array.isArray(isoCodes)) {
        isoCodes = [isoCodes];
    }

    // Filter features based on iso3166_3 codes
    const filteredFeatures = geojsonData.features.filter(feature =>
        isoCodes.includes(feature.properties.iso3166_3)
    );

    // Return new GeoJSON object with matching features
    return {
        type: "FeatureCollection",
        features: filteredFeatures
    };
}