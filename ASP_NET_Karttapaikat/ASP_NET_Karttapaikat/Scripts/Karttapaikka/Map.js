var google_map = {};

google_map.Google_Map = (function () {

    function Map() {

        var home = { lat: 61.204465, lng: 28.790744 };
        this.map;

        this.initMap = function () {
            this.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: home,
                zoomControl: true,
                mapTypeControl: true,
                disableDefaultUI: true
            });
            console.log("map init: " + this.map);
        }

        this.addClickListener = function (handler) {
            this.map.addListener('click', function (event) {
                handler(event);
            });
            console.log("map: add click event");
        }
    }

    return Map;
})();