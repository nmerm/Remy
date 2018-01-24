
// AFFICHAGE DE LA MAP, on va la chercher dans 
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvdWJpZG91YXAiLCJhIjoiY2pjcWZwaWZqMTV1YTJ3bWlpZ2kycG0xMiJ9.35GbAs9ZgRbsWhX7WZpf0w';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center: [8, 46], // starting position [lng, lat]
    zoom: 7 // starting zoom
});

/*-------- CONTROLES --------*/
// Recherche
map.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken
}), 'top-left');
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
