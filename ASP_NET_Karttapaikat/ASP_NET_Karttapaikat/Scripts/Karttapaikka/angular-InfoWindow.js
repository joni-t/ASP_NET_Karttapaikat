//Toteutettu lomakkeiden käsittely
var google_map_infowindowApp = angular.module("google_map_infowindowApp", []);

//infoikkunan palveluita
google_map_infowindowApp.service('Handle', function () {

    return new function () {

        this.map = map_object.map;
        this.coordInfoWindow = map_object.coordInfoWindow;
        this.placeinfoform = document.getElementById('placeinfoform');
        this.marker;
        //this.place_info_form_constructed = false;

        console.log("google_map_infowindowApp: Handle-service: constructor");

        this.ConstructPlaceForm = function () {
            if (document.getElementById("placeinfoform") === null) {
                document.getElementById('infowindow').appendChild(this.placeinfoform);
                document.getElementById('save_place_marker').style.display = 'block';
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
            //this.SetPlaceTypeContents();
            //this.place_info_form_constructed = true;
            console.log("place_info_form_constructed");
        };

        /*this.SetPlaceTypeContents = function () {
            document.getElementById('place_marker_type').innerHTML = "<option value='testi1'>testi1</option><option value='testi2'>testi2</option><option value='testi3'>testi3</option>";
            console.log("SetPlaceTypeContents");
        };*/

        //lomakkeelle tiedot
        this.SetPlaceFormContents = function (lat, lon, type_id, description) {
            this.ConstructPlaceForm();
            document.getElementById("place_marker_lat").value = lat;
            document.getElementById("place_marker_lon").value = lon;
            document.getElementById("place_marker_type").selectedIndex = type_id;
            document.getElementById("place_marker_description").value = description;
            console.log("SetPlaceFormContents");
        };

        //avaa infoikkunan
        this.OpenPlaceContentsWindow = function (marker) {
            this.marker = marker;
            this.coordInfoWindow.setContent(document.getElementById('placeinfoform'));
            this.coordInfoWindow.open(this.map, marker);
            this.map.infoWindow_isOpen = true;
            console.log("OpenPlaceContentsWindow");
        };
    };   
});

//Infoikkunan kontrolleri
google_map_infowindowApp.controller("InfoWindowCtrl", function ($scope, $injector, $http, $templateCache) {
    $scope.place = {
        lat: '',
        lon: '',
        typeid: '',
        description: ''
    };

    //paikan tallennustoiminto ja tietojen lähetys palvelimelle
    $scope.save_place = function () {
        if (document.getElementById("place_marker_type").selectedIndex > 0) {
            $scope.place.lat = document.getElementById("place_marker_lat").value;
            $scope.place.lon = document.getElementById("place_marker_lon").value;
            $scope.place.typeid = document.getElementById("place_marker_type").selectedIndex;

            markers_object.markers[markers_object.current_ind].setTitle(document.getElementById("place_marker_type")[document.getElementById("place_marker_type").value].text);
            markers_object.markers[markers_object.current_ind].setLabel(document.getElementById("place_marker_type")[document.getElementById("place_marker_type").value].text);

            document.getElementById('save_place_marker').style.display = 'none';

            var data = {
                Lat: $scope.place.lat,
                Lon: $scope.place.lon,
                TyyppiId: $scope.place.typeid,
                Kuvaus: $scope.place.description
            };
            var url = api_url + "paikkamerkinta";
            document.getElementById('message_place_marker_saving').style.display = 'block';
            $http({ method: 'POST', url: url, data: data, cache: $templateCache }).
                then(function (response) {
                    console.log("status: " + response.status);
                    console.log("data: " + response.data);
                    markers_object.markers[markers_object.current_ind].id = response.data;
                    document.getElementById('message_place_marker_saving').style.display = 'none';
                    document.getElementById('message_place_marker_saved').style.display = 'block';
                    setTimeout(function () {
                        document.getElementById('message_place_marker_saved').style.display = 'none';
                        $injector.get('Handle').coordInfoWindow.close();
                        $injector.get('Handle').map.infoWindow_isOpen = false;
                        markers_object.current_ind = -1;
                    }, 3000);
                }, function (response) {
                    alert("Virhe tietojen lähettämisessä");
                    console.log("status: " + response.status);
                    console.log("data: " + response.data || 'Request failed');
                });            

            //console.log($injector.get('Handle').map);

            console.log("save_place, lat: " + $scope.place.lat + ", lon: " + $scope.place.lon);
        }
        else
        {
            alert("Tarkista lomake");
        }                
    }

    //ikkunan sulkeminen
    $scope.close_save_place = function () {
        $injector.get('Handle').coordInfoWindow.close();
        $injector.get('Handle').map.infoWindow_isOpen = false;
        console.log("close_save_place");
    }

    //tietojen haku
    $scope.show_place_contents = function () {
        document.getElementById('show_place_marker_contents').style.display = 'none';
        console.log("markers_object.current_ind: " + markers_object.current_ind);
        var url = api_url + "paikkamerkinta/" + markers_object.markers[markers_object.current_ind].id;
        document.getElementById('message_place_marker_get_data').style.display = 'block';
        $http({ method: 'GET', url: url, cache: $templateCache }).
            then(function (response) {
                console.log("status: " + response.status);
                console.log("data: " + response.data);
                //$scope.place.typeid = response.data.tyyppiId;
                //$scope.place.description = response.data.kuvaus;
                //document.getElementById("place_marker_type").selectedIndex = response.data.tyyppiId;
                document.getElementById("place_marker_type").value = response.data.tyyppiId;
                document.getElementById("place_marker_description").value = response.data.kuvaus;
                document.getElementById('message_place_marker_get_data').style.display = 'none';
                console.log("show_place_contents2, typeid: " + document.getElementById("place_marker_type").selectedIndex + ", kuvaus: " + document.getElementById("place_marker_description").value);
                console.log("show_place_contents2, typeid: " + response.data.tyyppiId + ", kuvaus: " + response.data.kuvaus);
            }, function (response) {
                alert("Virhe tietojen hakemisessa");
                console.log("status: " + response.status);
                console.log("data: " + response.data || 'Request failed');
            });

        //console.log("show_place_contents, typeid: " + $scope.place.typeid + ", kuvaus: " + $scope.place.description);
    }
});

//kontrolleri kohteiden näyttämisen lomakkeelle
google_map_infowindowApp.controller("ShowPlacesCtrl", function ($scope, $injector, $http, $templateCache) {
    $scope.selectedtypes = [];

    $scope.show_places = function () {
        markers_object.DeleteMarkers();

        if ($scope.selectedtypes.length > 0) {
            var url = api_url + "paikkamerkinta/getselected/type";
            document.getElementById('message_get_places').style.display = 'block';
            $http({ method: 'POST', url: url, data: $scope.selectedtypes, cache: $templateCache }).
                then(function (response) {
                    console.log("status: " + response.status);
                    console.log("data: " + response.data);
                    var data = response.data;
                    var i = 0;
                    for (i = 0; i < data.length; i++) {
                        var location = { lat: data[i].lat, lng: data[i].lon };
                        console.log("data[i].paikkaid: " + data[i].paikkaId);
                        markers_object.AddMarker(location, data[i].tyyppi.tyyppi, data[i].paikkaId);
                    }
                    markers_object.FitBounds();
                    document.getElementById('message_get_places').style.display = 'none';
                    document.getElementById('message_show_places').style.display = 'block';
                    setTimeout(function () {
                        document.getElementById('message_show_places').style.display = 'none';
                    }, 3000);
                }, function (response) {
                    alert("Virhe tietojen hakemisessa");
                    console.log("status: " + response.status);
                    console.log("data: " + response.data || 'Request failed');
                });
        }
    }
});

//kiertueiden näyttämisen lomakkeen kontrolleri
google_map_infowindowApp.controller("ShowToursCtrl", function ($scope, $injector, $http, $templateCache, $compile) {
    $scope.newtour = {
        kiertueid: '',
        movingtype: '',
        descr: ''
    };

    //uuden kiertueen lisääminen
    $scope.add_tour = function () {
        if (document.getElementById("new_tour_moving_type").selectedIndex > 0) {
            $scope.newtour.descr = document.getElementById("new_tour_descr").value;
            $scope.newtour.movingtype = document.getElementById("new_tour_moving_type").selectedIndex;

            document.getElementById('add_tour_btn').style.display = 'none';

            var data = {
                siirtymistapaId: $scope.newtour.movingtype,
                kuvaus: $scope.newtour.descr
            };
            var siirtymistapa = document.getElementById("new_tour_moving_type").options[document.getElementById("new_tour_moving_type").selectedIndex].text;
            var url = api_url + "kiertue";
            document.getElementById('tour_saving').style.display = 'block';
            $http({ method: 'POST', url: url, data: data, cache: $templateCache }).
                then(function (response) {
                    console.log("status: " + response.status);
                    console.log("data: " + response.data);
                    $scope.newtour.kiertueid = response.data; //id
                    document.getElementById('tour_saving').style.display = 'none';
                    document.getElementById('tour_saved').style.display = 'block';
                    document.getElementById('add_tour_btn').style.display = 'block';
                    console.log("add_tour, id: " + $scope.newtour.kiertueid);

                    var table = document.getElementById("Tours");
                    var row = table.insertRow(1);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    cell1.innerHTML = data.kuvaus;
                    cell2.innerHTML = siirtymistapa;
                    var html_elements = "<input type='button' ng-click=\"show_tour('" + $scope.newtour.kiertueid + "')\" value='Näytä' id='show_tour_" + $scope.newtour.kiertueid + "' />"
                    html_elements += "<div id='tour_fethcing_" + $scope.newtour.kiertueid + "' style='display:none'>Haetaan...</div>"
                    html_elements += "<div id='tour_fetched_" + $scope.newtour.kiertueid + "' style='display:none'>Haettu</div>";
                    console.log(html_elements);
                    cell3.innerHTML = html_elements;
                    $compile(cell3)($scope);                    

                    var option = document.createElement("option");
                    option.text = data.kuvaus;
                    option.value = $scope.newtour.kiertueid;
                    document.getElementById("select_tour").add(option);
                }, function (response) {
                    alert("Virhe tietojen lähettämisessä");
                    console.log("status: " + response.status);
                    console.log("data: " + response.data || 'Request failed');
                });
        }
        else {
            alert("Tarkista lomake");
        }
    }


    $scope.tourcontents = {
        selectedtour: ''
    };

    //uuden etapin lisääminen kiertueelle
    $scope.add_step_to_tour = function () {
        if (document.getElementById("select_tour").selectedIndex > 0 && markers_object.current_ind > (-1)) {
            $scope.tourcontents.selectedtour = document.getElementById("select_tour").selectedIndex;

            document.getElementById('add_tour_btn').style.display = 'none';

            var data = {
                PaikkaId: markers_object.markers[markers_object.current_ind].id,
                KiertueId: $scope.tourcontents.selectedtour
            };
            console.log("add_step_to_tour, data.PaikkaId: " + data.PaikkaId + ", data.KiertueId: " + data.KiertueId);

            var url = api_url + "kiertueetappi";
            document.getElementById('step_saving').style.display = 'block';
            $http({ method: 'POST', url: url, data: data, cache: $templateCache }).
                then(function (response) {
                    console.log("status: " + response.status);
                    console.log("data: " + response.data);
                    //... = response.data; //id
                    document.getElementById('step_saving').style.display = 'none';
                    document.getElementById('step_saved').style.display = 'block';
                    document.getElementById('add_step_to_tour_btn').style.display = 'block';
                    console.log("add_step_to_tour, id: " + response.data);
                }, function (response) {
                    alert("Virhe tietojen lähettämisessä");
                    console.log("status: " + response.status);
                    console.log("data: " + response.data || 'Request failed');
                });
        }
        else {
            alert("Tarkista lomake");
        }
    }

    //kiertueen näyttäminen
    $scope.show_tour = function (kiertueId, siirtymistapaId) {
        markers_object.DeleteMarkers();

        console.log("show_tour, kiertueId: " + kiertueId);

        var url = api_url + "paikkamerkinta/getselected/route";
        document.getElementById('show_tour_' + kiertueId).style.display = 'none';
        document.getElementById('tour_fethcing_' + kiertueId).style.display = 'block';
        $http({ method: 'POST', url: url, data: kiertueId, cache: $templateCache }).
            then(function (response) {
                console.log("status: " + response.status);
                console.log("data: " + response.data);
                var data = response.data;
                //markers_object.AddTour(data);
                markers_object.AddRoute(data, siirtymistapaId);
                document.getElementById('tour_fethcing_' + kiertueId).style.display = 'none';
                document.getElementById('tour_fetched_' + kiertueId).style.display = 'block';
                setTimeout(function () {
                    document.getElementById('tour_fetched_' + kiertueId).style.display = 'none';
                    document.getElementById('show_tour_' + kiertueId).style.display = 'block';
                }, 3000);
            }, function (response) {
                alert("Virhe tietojen hakemisessa");
                console.log("status: " + response.status);
                console.log("data: " + response.data || 'Request failed');
            });
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