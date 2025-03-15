export function updateDeckLayer(map, countryCentroids, selectedCountries, startingPoint) {
    // Remove existing deck.gl layers
    map.eachLayer(layer => {
        if (layer instanceof DeckGlLeaflet.LeafletLayer) {
            map.removeLayer(layer);
        }
    });

    // Create a new deck.gl layer with updated data
    const deckLayer = new DeckGlLeaflet.LeafletLayer({
        views: [
            new deck.MapView({ repeat: true })
        ],
        layers: [
            new deck.ArcLayer({
                id: 'arcs',
                data: countryCentroids,
                dataTransform: d => d.features.filter(f => selectedCountries.includes(f.properties.iso3166_3)),
                // Styles
                getSourcePosition: f => startingPoint, 
                getTargetPosition: f => f.geometry.coordinates,
                getSourceColor: [0, 128, 200],
                getTargetColor: [200, 0, 80],
                getWidth: 1
            })
        ]
    });

    // Add the new layer to the map
    map.addLayer(deckLayer);
}