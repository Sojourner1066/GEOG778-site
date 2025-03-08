// // Initialize the map at the geographic center of Africa
// const map = L.map('map').setView([2.5, 20.0], 5);

// // Add Mapbox basemap
// L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/icecream-v1/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdpc2NnIiwiYSI6ImNtN2VtbGEzNzBnaTgyam9vZXl3YzM2Ym4ifQ.YJe4CFT-CEYhl0D98Wk8aw', {
//     attribution: '© Mapbox © OpenStreetMap',
//     tileSize: 512,
//     zoomOffset: -1
// }).addTo(map);

// // Add a marker at the center of Africa
// L.marker([2.5, 20.0]).addTo(map)
//     .bindPopup('Geographic center of Africa')
//     .openPopup();

document.body.innerHTML = '<div id="map"></div>';

const map = L.map('map').setView([2.5, 20.0], 5);
// "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/1/0/0.mvt?access_token=pk.eyJ1IjoibXdpc2NnIiwiYSI6ImNtN2VtbGEzNzBnaTgyam9vZXl3YzM2Ym4ifQ.YJe4CFT-CEYhl0D98Wk8aw"
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdpc2NnIiwiYSI6ImNtN2VtbGEzNzBnaTgyam9vZXl3YzM2Ym4ifQ.YJe4CFT-CEYhl0D98Wk8aw', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibXdpc2NnIiwiYSI6ImNtN2VtbGEzNzBnaTgyam9vZXl3YzM2Ym4ifQ.YJe4CFT-CEYhl0D98Wk8aw' // Replace with your Mapbox token
}).addTo(map);

L.marker([2.5, 20.0]).addTo(map)
    .bindPopup('Geographic center of Africa')
    .openPopup();


// Initialize the map
// var map = L.map('map').setView([0, 0], 2); // Set to your preferred center and zoom

// // Add Mapbox Light as a tile layer
// L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN', {
//     tileSize: 512,
//     zoomOffset: -1,
//     attribution: '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN'
// }).addTo(map);