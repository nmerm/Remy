mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvdWJpZG91YXAiLCJhIjoiY2pjcWZwaWZqMTV1YTJ3bWlpZ2kycG0xMiJ9.35GbAs9ZgRbsWhX7WZpf0w';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center: [-74.50, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});