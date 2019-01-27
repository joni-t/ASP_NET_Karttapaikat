var map_object;
var markers_object;
var info_window_app;
var google_map_infowindowApp_HandleService;
var api_url = "https://localhost:5001/api/";

function MapClick_handleri(event) {
    var marker = markers_object.AddMarker(event.latLng, "Uusi", -1);
    google_map_infowindowApp_HandleService.SetPlaceFormContents(event.latLng.lat(), event.latLng.lng(), 0, "");
    google_map_infowindowApp_HandleService.OpenPlaceContentsWindow(marker);
    console.log("map click: " + event.latLng);
}

function MarkerClick_handleri(marker) {
    if (markers_object.markers[markers_object.current_ind].id > (-1)) {
        var location = marker.position;

        console.log("markers_object.markers: " + markers_object.markers.length);

        console.log("location: " + location);
        google_map_infowindowApp_HandleService.SetPlaceFormContents(location.lat(), location.lng(), 0, "");
        google_map_infowindowApp_HandleService.OpenPlaceContentsWindow(marker);

        console.log("marker click, marker.id: " + marker.id);
        console.log("markers_object.current_ind ensin: " + markers_object.current_ind);

        if (marker.id > (-1)) {
            document.getElementById('save_place_marker').style.display = 'none';
            document.getElementById('show_place_marker_contents').style.display = 'block';
            var i = 0;
            for (i = 0; i < markers_object.markers.length; i++) {
                if (markers_object.markers[i].id === marker.id) {
                    markers_object.current_ind = i;
                    console.log("markers_object.current_ind jalkeen: " + markers_object.current_ind);
                }
            }
        }
        else {
            markers_object.current_ind = markers_object.markers.length - 1;
        }
    } else {
        alert("Käsittele ensin avoinna oleva hallintaikkuna.");
    }
    console.log("markers_object.current_ind ihan lopussa: " + markers_object.current_ind);
}

initMapPlace = function () {
    map_object = new google_map.Google_Map();
    map_object.initMap();
    markers_object = new google_map_markers.MapMarkers(map_object.map);
    markers_object.initMarkers();
    map_object.addClickListener(MapClick_handleri);
    info_window_app = angular.injector(['ng', 'google_map_infowindowApp']);
    google_map_infowindowApp_HandleService = info_window_app.get('Handle');    
}