
// AFFICHAGE DE LA MAP, on va la chercher dans 
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvdWJpZG91YXAiLCJhIjoiY2pjcWZwaWZqMTV1YTJ3bWlpZ2kycG0xMiJ9.35GbAs9ZgRbsWhX7WZpf0w';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center: [8, 46], // starting position [lng, lat]
    zoom: 7 // starting zoom
});

// CONTROLES SUR LA MAP (Recherche)
map.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken
}));
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {

    map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": "json/world_cabanes.geojson"
        },
        "layout": {
            "icon-image": "lodging-15",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        }
    });

});