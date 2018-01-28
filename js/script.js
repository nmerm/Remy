
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

    map.addSource('cabanes', {
        "type": "geojson",
        "data": "json/world_cabanes.geojson"
    });

    map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": "cabanes",
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

    // Source pour le buffer
    map.addSource('buffer', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [
            ]
        }
    });

    // Listen for the `geocoder.input` event that is triggered when a user
    // makes a selection and add a symbol that matches the result.
    // Tiré de : https://www.mapbox.com/mapbox-gl-js/example/point-from-geocoder-result/
    geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);

        // Rend les coordonnées du point renvoyé par le geocoder
        var centreCoord = ev.result.geometry.coordinates;

        // Crée un objet de type point pour turf
        var pointCentreBuffer = turf.point(centreCoord);

        // Calcule un buffer de 10km autour du point
        var polygonBuffer = turf.buffer(pointCentreBuffer, 10, {units: "kilometers"});

        // Crée une bounding box adaptée au buffer
        var bbox = turf.bbox(polygonBuffer);

        // Ajuste la vue à la bounding box
        map.fitBounds(bbox);

        // Ajoute le polygon du buffer comme source pour Mapbox
        map.getSource('buffer').setData(polygonBuffer);

        // Affiche le layer contenant le buffer
        map.addLayer({
            "id": "buffer",
            "source": "buffer",
            "type": "fill",
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.1,
                'fill-outline-color': "#000"
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
    // map.on('click', 'points', function (e) {
    //     map.flyTo({center: e.features[0].geometry.coordinates});
    // });
});
