//Google mapsin hallinta
var google_map = {};

google_map.Google_Map = (function () {

    function Map() {
        var home = { lat: 61.0544235, lng: 28.1874435 }; //lappeenranta
        this.map; //google map
        this.coordInfoWindow; //infoikkuna kohteille
        this.infoWindow_isOpen = false;

        this.initMap = function () {
            this.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: home,
                zoomControl: true,
                mapTypeControl: true,
                disableDefaultUI: true
            });
            this.coordInfoWindow = new google.maps.InfoWindow();
            console.log("map init: " + this.map);
        }

        //klikkausten hallinta
        this.addClickListener = function (handler) {
            this.map.addListener('click', function (event) {
                if (this.infoWindow_isOpen) {
                    alert("Käsittele ensin avoinna oleva hallintaikkuna.");
                }
                else if (!markers_object.MoveNonSavedMarker(event.latLng))
                {
                    handler(event);
                }
            });
            console.log("map: add click event");
        }
    }

    return Map;
})();