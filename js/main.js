// Install dependencies: npm create vite@latest my-leaflet-map --template vanilla
// cd my-leaflet-map
// npm install leaflet
// npm run dev

// main.js
import L from 'https://unpkg.com/leaflet@1.7.1/dist/leaflet-src.esm.js';
// import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';

document.body.innerHTML = '<div id="map"></div>';

const map = L.map('map').setView([2.5, 20.0], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/icecream-v1/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibXdpc2NnIiwiYSI6ImNtN2VtbGEzNzBnaTgyam9vZXl3YzM2Ym4ifQ.YJe4CFT-CEYhl0D98Wk8aw' // Replace with your Mapbox token
}).addTo(map);

L.marker([2.5, 20.0]).addTo(map)
    .bindPopup('Geographic center of Africa')
    .openPopup();
