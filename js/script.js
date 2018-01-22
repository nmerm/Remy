mapboxgl.accessToken = 'pk.eyJ1Ijoibm1lcm0iLCJhIjoiY2piNmVjdmFsOHFrNDJ3bnE1ajJ0Ymg3ZiJ9.UYhpPkbczYcIiwybM9KArA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/nmerm/cjb6kd9f02omm2sl6m5y24f17',
    center: [-79.4512, 43.6568],
    zoom: 13
});

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));