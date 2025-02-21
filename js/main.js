// Install dependencies: npm create vite@latest my-leaflet-map --template vanilla
// cd my-leaflet-map
// npm install leaflet
// npm run dev

// main.js
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

document.body.innerHTML = '<div id="map"></div>';

const map = L.map('map').setView([2.5, 20.0], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/icecream-v1/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN' // Replace with your Mapbox token
}).addTo(map);

L.marker([2.5, 20.0]).addTo(map)
    .bindPopup('Geographic center of Africa')
    .openPopup();
