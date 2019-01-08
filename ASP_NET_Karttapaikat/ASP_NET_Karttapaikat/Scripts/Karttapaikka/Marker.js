var google_map_markers = {};

google_map_markers.MapMarkers = (function (map) {

    function Markers(map) {

        this.map = map;
        this.markers;

        this.initMarkers = function () {
            this.markers = [];
            console.log("markers init");
        }

        // Adds a marker to the map.
        this.AddMarker = function(location) {
            var marker = this.CreateMarker(location, "Label", this.map);
            //AddMarkerListeners(marker, map);
            this.map.panTo(location);
        }

        this.CreateMarker = function(location, text, map) {
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                label: text,
                title: text,
                draggable: false
            });
            this.markers.push(marker);
            //Reset_WaypointContentsForm(location.lat, location.lng);
            //SetMarker(location, marker);
            //Update_current_handled_waypoint(false, -1, marker);
            return marker;
        }
    }

    return Markers;
})();