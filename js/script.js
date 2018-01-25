
// AFFICHAGE DE LA MAP, on va la chercher dans 
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvdWJpZG91YXAiLCJhIjoiY2pjcWZwaWZqMTV1YTJ3bWlpZ2kycG0xMiJ9.35GbAs9ZgRbsWhX7WZpf0w';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/outdoors-v9', // stylesheet location
    center: [8, 46], // starting position [lng, lat]
    zoom: 7 // starting zoom
});

/*-------- CONTROLES --------*/
// Recherche
// On utilise une variable geocoder pour pouvoir récupérer plus loin les coordonnées du point qui sert à créer le cercle
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});
map.addControl(geocoder, 'top-left');

// Controle +/-
map.addControl(new mapboxgl.NavigationControl());
// Géolocalisation
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}), 'top-left');
/*-------- fin contrôles --------*/


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

    // Coordonnées (vide pour l'instant) du point qui servira de centre pour le cercle
    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    // Listen for the `geocoder.input` event that is triggered when a user
    // makes a selection and add a symbol that matches the result.
    // Tiré de : https://www.mapbox.com/mapbox-gl-js/example/point-from-geocoder-result/
    // Calcul du rayon du cercle adapté de : https://stackoverflow.com/a/37794326
    geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);

        map.addLayer({
            "id": "point",
            "source": "single-point",
            "type": "circle",
            "paint": {
                "circle-radius": {
                    stops: [
                        [0, 0],
                        [20, (10000 / 0.075 / Math.cos( ev.result.geometry.coordinates[0] * Math.PI / 180))]
                    ],
                    base: 2
                },
                "circle-color": "rgba(255, 255, 255, 0)",
                "circle-stroke-width": 5,
                "circle-stroke-color": "#000000",
                "circle-stroke-opacity": 1
            }
        });
    });

    //var nbClicks = 0;

    // Tout simple, on set que l'élément est clickable
    map.on('click', 'points', function (e) {
        
        //setTimeout(function(){

        new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML('<b>'+e.features[0].properties.title+'</b>'
                +'<br>Alt: '+e.features[0].properties.elevation+' m.')
        .addTo(map);

        //}, 100);

        /* POUR FAIRE QUE SI IL RE APPUIE SUR LE MEME ICONE LA BOX DISPARAIT
        nbClicks++;
        popup = new mapboxgl.Popup();
        if(nbClicks < 2){
            popup
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML('<b>'+e.features[0].properties.title+'</b>'
                    +'<br>Alt: '+e.features[0].properties.elevation+' m.')
            .addTo(map);
        } else {
            popup.remove();
            nbClicks = 0;
        } 
        */
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'points', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'points', function () {
        map.getCanvas().style.cursor = '';
    });

    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    map.on('click', 'points', function (e) {
        map.flyTo({center: e.features[0].geometry.coordinates});
    });
});
