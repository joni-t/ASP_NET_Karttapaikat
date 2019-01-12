var map_object;
var markers_object;
var info_window_app;
var google_map_infowindowApp_HandleService;

function click_handleri(event) {
    markers_object.AddMarker(event.latLng);
    console.log("map click: " + event.latLng);
}

initMapPlace = function () {
    map_object = new google_map.Google_Map();
    map_object.initMap();
    markers_object = new google_map_markers.MapMarkers(map_object.map);
    markers_object.initMarkers();
    map_object.addClickListener(click_handleri);
    info_window_app = angular.injector(['ng', 'google_map_infowindowApp']);
    google_map_infowindowApp_HandleService = info_window_app.get('Handle');
    
}