//paikkamerkkien hallinta
var google_map_markers = {};

google_map_markers.MapMarkers = (function (map) {

    function Markers(map) {

        this.map = map;
        this.markers; //kohteet
        this.poly_path; //kiertueen etappien väliset viivat
        this.current_ind; //hallittavana oleva kohde
        this.directionsDisplay;
        this.directionsService = new google.maps.DirectionsService();
        this.infowindowApp_HandleService = angular.injector(['ng', 'google_map_infowindowApp']).get('Handle');

        this.initMarkers = function () {
            this.markers = [];
            this.poly_path = new google.maps.Polyline({
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            this.poly_path.setMap(this.map);
            this.directionsDisplay = new google.maps.DirectionsRenderer();
            //this.directionsDisplay.setMap(map);
            this.current_ind = -1;
            console.log("markers init");
        }

        // Adds a marker to the map.
        this.AddMarker = function (location, text, id) {
            var marker = this.CreateMarker(location, text, this.map);
            marker.id = id;
            this.map.panTo(location);

            console.log("AddMarker, id: " + marker.id);

            this.addClickListener(marker);            

            return marker;
        }

        //viivan vetäminen 2 kohteen välille
        this.AddPolyPath = function (marker) {
            var path = this.poly_path.getPath();
            path.push(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
        }

        //uuden kohteen lisääminen
        this.CreateMarker = function (location, text, map) {
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                label: text,
                title: text,
                draggable: false
            });

            this.markers.push(marker);
            this.current_ind = this.markers.length-1;

            //Reset_WaypointContentsForm(location.lat, location.lng);
            //SetMarker(location, marker);
            //Update_current_handled_waypoint(false, -1, marker);
            return marker;
        }

        //klikkauksen hallinta
        this.addClickListener = function (marker) {
            marker.addListener('click', function () {
                MarkerClick_handleri(this);
            });
            console.log("marker: add click event, id: " + marker.id);
        }

        //kohteen siirtäminen (vain, jos ei ole tallennettu)
        this.MoveNonSavedMarker = function (location) {
            if (this.current_ind > (-1) && this.markers[this.current_ind].id == (-1)) {
                this.markers[this.current_ind].setPosition(location);
                this.infowindowApp_HandleService.SetPlaceFormContents(location.lat(), location.lng(), 0, "");
                this.infowindowApp_HandleService.OpenPlaceContentsWindow(this.markers[this.current_ind]);
                return true;
            }
            return false;
        }

        //kohteiden poistaminen kartalta
        this.DeleteMarkers = function () {
            google_map_infowindowApp_HandleService.coordInfoWindow.close();
            google_map_infowindowApp_HandleService.map.infoWindow_isOpen = false;
            var i = 0;
            for (i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers = [];
            this.current_ind = -1;
            this.poly_path.getPath().clear();
        }

        //kartan zoomaus kohteiden mukaan
        this.FitBounds = function () {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < this.markers.length; i++) {
                bounds.extend(this.markers[i].getPosition());
            }
            this.map.fitBounds(bounds);
        }

        this.AddTour = function (data) {
            var i = 0;
            for (i = 0; i < data.length; i++) {
                var location = { lat: data[i].lat, lng: data[i].lon };
                console.log("data[i].paikkaid: " + data[i].paikkaId);
                var marker = this.AddMarker(location, data[i].tyyppi.tyyppi, data[i].paikkaId);
                this.AddPolyPath(marker);
            }
            this.FitBounds();
        }

        this.AddRoute = function (data, siirtymistapaId) {
            var request = {
                travelMode: google.maps.TravelMode.DRIVING
            };
            if (siirtymistapaId == 2) {
                request = {
                    travelMode: google.maps.TravelMode.BICYCLING
                };
            } else if (siirtymistapaId == 3) {
                request = {
                    travelMode: google.maps.TravelMode.WALKING
                };
            }
            console.log("request: " + request + ", travelMode: " + request.travelMode);
            var i = 0;
            for (i = 0; i < data.length; i++) {
                var location = { lat: data[i].lat, lng: data[i].lon };
                console.log("data[i].paikkaid: " + data[i].paikkaId);
                var marker = this.AddMarker(location, data[i].tyyppi.tyyppi, data[i].paikkaId);

                if (i == 0) request.origin = marker.getPosition();
                else if (i == this.markers.length - 1) request.destination = marker.getPosition();
                else {
                    if (!request.waypoints) request.waypoints = [];
                    request.waypoints.push({
                        location: marker.getPosition(),
                        stopover: true
                    });
                }
            }

            this.directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    markers_object.directionsDisplay.setDirections(response);
                    markers_object.directionsDisplay.setMap(map);
                } else {
                    alert("Directions Request from " + markers_object.markers[0].position.toUrlValue(6) + " to " + markers_object.markers[markers_object.markers.length-1].position.toUrlValue(6) + " failed: " + status);
                }
            });
        }
    }

    return Markers;
})();