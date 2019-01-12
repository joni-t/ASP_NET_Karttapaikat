var google_map_infowindowApp = angular.module("google_map_infowindowApp", []);

google_map_infowindowApp.service('Handle', function () {

    return new function () {
        this.map = map_object.map;
        this.coordInfoWindow = new google.maps.InfoWindow();
        this.place_info_form_constructed = false;
        this.placeinfoform = document.getElementById('placeinfoform');
        //this.place_info_form_constructed = false;

        this.ConstructPlaceForm = function () {
            if (document.getElementById("placeinfoform") === null) {
                document.getElementById('infowindow').appendChild(this.placeinfoform);
                angular.element(document.getElementById("infowindow")).scope().$apply();

                /*document.getElementById('infowindow').innerHTML = "<div id='placeinfoform'>" +
                    "<table>" +
                    "<tr><td>Lat:</td> <td><input type='text' id='place_marker_lat'/> </td> </tr>" +
                    "<tr><td>Lon:</td> <td><input type='text' id='place_marker_lon'/> </td> </tr>" +
                    "<tr><td>Tyyppi:</td> <td><select id='place_marker_type'>" +
                    "</select> </td></tr>" +
                    "<tr><td>Kuvaus:</td> <td><input type='text' id='place_marker_description'/> </td> </tr>" +
                    "<tr><td></td><td><input type='button' ng-click='testi()' value='Save' id='save_place_marker'/>" +
                    "</td></tr>" +
                    "<tr><td><div id='message_location_saved' style='display:none'>Location saved</div></td></tr>" +
                    "</table>" +
                    "</div>"; */
            }
            document.getElementById("placeinfoform").style = 'display:block';
            this.SetPlaceTypeContents();
            //this.place_info_form_constructed = true;
            console.log("place_info_form_constructed");
        };

        this.SetPlaceTypeContents = function () {
            document.getElementById('place_marker_type').innerHTML = "<option value='testi1'>testi1</option><option value='testi2'>testi2</option><option value='testi3'>testi3</option>";
            console.log("SetPlaceTypeContents");
        };

        this.SetPlaceFormContents = function (lat, lon, type_id, description) {
            this.ConstructPlaceForm();
            document.getElementById("place_marker_lat").value = lat;
            document.getElementById("place_marker_lon").value = lon;
            document.getElementById("place_marker_type").selectedIndex = type_id;
            document.getElementById("place_marker_description").value = description;
            console.log("SetPlaceFormContents");
        };

        this.OpenPlaceContentsWindow = function (marker) {
            this.coordInfoWindow.setContent(document.getElementById('placeinfoform'));
            this.coordInfoWindow.open(this.map, marker);
            console.log("OpenPlaceContentsWindow");
        };

        console.log("google_map_infowindowApp: Handle-service: constructor");
    };   
});

google_map_infowindowApp.controller("InfoWindowCtrl", function ($scope, $injector) {
    $scope.greeting = 'Hello World!';

    $scope.place = {
        lat: '',
        lon: '',
        typeid: '',
        description: ''
    };

    $scope.testi = function () {
        $scope.place.lat = document.getElementById("place_marker_lat").value;
        $scope.place.lon = document.getElementById("place_marker_lon").value;
        $scope.place.typeid = document.getElementById("place_marker_type").selectedIndex;
        console.log("InfoWindowCtrl, map: " + $injector.get('Handle').map + ", place_typeid: " + $scope.place.lon);
        $scope.place.lat = 56;
    }
});

/*google_map_infowindowApp.directive("autofill", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            scope.$on("autofill:update", function () {
                ngModel.$setViewValue(element.val());
            });
        }
    }
});*/

/*google_map_infowindowApp.directive("myNgModel", ["$parse", function ($parse) {
    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {
            // Assume $element is input type="text"
            var modelGet = $parse($attrs["ngModel"]);
            var modelSet = modelGet.assign;

            function setValueFromInputElement() {
                modelSet($scope, $element.val());
            }

            $scope.$watch($attrs["ngModel"], function () {
                $element.val(modelGet($scope));
            });

            $element.bind("change", function () {
                setValueFromInputElement();
            });

            $scope.$on("$myNgModelSet", function () {
                setValueFromInputElement();
            })
        }
    }
}]);*/