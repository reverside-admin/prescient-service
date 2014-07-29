/**
 * Created by Bibhuti on 2014/04/03.
 */
var staff_app = angular.module('staff_app', ['ngRoute', 'ngCookies', 'ngDialog']);

staff_app.service('sharedProperties', function () {
    var guest_property;

    return {
        getProperty: function () {
            return guest_property;
        },
        setProperty: function (value) {
            guest_property = value;
        }
    };
});

staff_app.service('sharedPreferenceProperties', function () {
    var preference_type_property;
    var preference_desc_property;


    return {
        getTypeProperty: function () {
            return preference_type_property;
        },
        setTypeProperty: function (value) {
            preference_type_property = value;
        },
        getDescProperty: function () {
            return  preference_desc_property;
        },
        setDescProperty: function (value) {
            preference_desc_property = value;
        }
    };
});







staff_app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/staffs/touchpoints', {
                'templateUrl': 'ui/touch_point.html',
                'controller': 'touch_point_controller'
            })
            .when('/touchpoint/:TPId/guests', {
                'templateUrl': 'ui/find-guest.html',
                'controller': 'find_guest_controller'
            })
            .when('/guest/:guestId', {
                'templateUrl': 'ui/guest-detail.html',
                'controller': 'guest_detail_controller'
            })
            .when('/hotels/guests/checkedin', {
                'templateUrl': 'ui/find-checkedin-guest.html',
                'controller': 'checkedin_guest_controller'
            })
            .when('/hotels/guests/:guestId/position', {
                'templateUrl': 'ui/current-guest-location.html',
                'controller': 'current_guest_location_controller'
            })

            .when('/hotels/guests/:guestId/location/history', {
                'templateUrl': 'ui/guest-location-history.html',
                'controller': 'current_guest_location_history_controller'
            })
            .when('/checked-in-guest/list', {
                'templateUrl': 'ui/checked-in-guest-list.html',
                'controller': 'checked_in_guest_list_controller'
            })
            .when('/checked-in-guest/:guestId', {
                'templateUrl': 'ui/checked-in-guest-detail.html',
                'controller': 'checked-in-guest-detail'
            })

            .when('/maintain/guest/guestlist', {
                'templateUrl': 'ui/guest-list.html',
                'controller': 'guest_list_controller'
            })

            .when('/maintain/guest/:guestId/details', {
                'templateUrl': 'ui/view-guest-detail.html',
                'controller': 'guest_details_controller'
            })

            .when('/maintain/guest/createguest', {
                'templateUrl': 'ui/create-guest.html',
                'controller': 'create_guest_controller'
            })
            .when('/maintain/guest/:guestId/update', {
                'templateUrl': 'ui/update-guest-detail.html',
                'controller': 'update_details_controller'
            })

            .when('/maintain/guest/:guestId/guestpreference', {
                'templateUrl': 'ui/view-guest-preference-data.html',
                'controller': 'view_guest_preference_data_controller'
            })

            .when('/maintain/guest/:guestId/preferences/add', {
                'templateUrl': 'ui/add-guest-preference.html',
                'controller': 'add_guest_preference_controller'
            })

            .when('/maintain/guest/:guestId/gueststaydetails', {
                'templateUrl': 'ui/view-guest-stay-details.html',
                'controller': 'view_guest_stay_details_controller'
            })
            .when('/maintain/guest/:guestId/addstaydetails', {
                'templateUrl': 'ui/add-stay-details.html',
                'controller': 'add_stay_details_controller'
            })

            .when('/maintain/guest/:guestId/roomcarddetails', {
                'templateUrl': 'ui/view-guest-room-card.html',
                'controller': 'view_guest_room_card_controller'
            })
            .when('/maintain/guest/:guestId/maintaincard', {
                'templateUrl': 'ui/maintain-room-key-cards.html',
                'controller': 'maintain_room_key_cards_controller'
            })
            .when('/welcome', {
                'templateUrl': '/ui/welcome-page.html'
            })
            .otherwise({
                redirectTo: '/welcome'
            });
    }]);


<!--Guest Management -->
<!--display the guest list-->
staff_app.controller('guest_list_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.guests = {};

    $http({
        url: 'http://localhost:8080/api/guest/all',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guests = data;
                console.log('guest details ::' + $scope.guests);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});

<!--view a particular guest detail-->

staff_app.controller('guest_details_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.guest_detail = {};


    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_detail = data;
                console.log('guest details ::' + $scope.guest_detail);
                console.log('guest date of birth::' + new Date($scope.guest_detail.dob));

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});


<!--Create A Guest-->
staff_app.controller('create_guest_controller', function ($scope, $http, $routeParams, $cookieStore, $location, ngDialog, sharedProperties) {

    $scope.guest = {};
    $scope.dob;
    $scope.hotel = {};
    $scope.hotel.id = $cookieStore.get("user").hotel.id;
    $scope.passport_validator_flag;
    $scope.id_validator_flag;

    $scope.guest_detail;

    $scope.gender = ['Male', 'Female', 'Trans gender'];
    // $scope.months=[{"id":0,"name":"jan"}];
    $scope.months = [
        {"id": 0, "name": "Jan"},
        {"id": 1, "name": "Feb"},
        {"id": 2, "name": "Mar"},
        {"id": 3, "name": "Apr"},
        {"id": 4, "name": "May"},
        {"id": 5, "name": "June"},
        {"id": 6, "name": "July"},
        {"id": 7, "name": "Aug"},
        {"id": 8, "name": "Sep"},
        {"id": 9, "name": "Oct"},
        {"id": 10, "name": "Nov"},
        {"id": 11, "name": "Dec"}
    ];

    $scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];



    $scope.OnPassportBlur=function()
    {
        console.log('unfocusing  with value::'+$scope.guest.passportNumber);

        $http({
            url: 'http://localhost:8080/api/guest/passport/' + $scope.guest.passportNumber + '/details',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (data.firstName == undefined) {
                    console.log('passport is not available in the database')
                    $scope.passport_validator_flag = true;
                }
                else {
                    console.log('Data returned from server' + data.firstName);
                    $scope.passport_validator_flag = false;
                    //scope.guest_detail=data;

                    //if the guest is found with that passport no then set the guest in the shared data.
                    sharedProperties.setProperty(data);

                    $scope.open_passport_popup();
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

    $scope.OnIdBlur=function()
    {
        $http({
            url: 'http://localhost:8080/api/guest/uniqueid/' + $scope.guest.idNumber + '/details',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (data.firstName == undefined) {
                    console.log('id is not available in the database')
                    $scope.id_validator_flag = true;
                }
                else {
                    console.log('Data returned from server' + data.firstName);
                    $scope.id_validator_flag = false;

                    sharedProperties.setProperty(data);

                    $scope.open_id_popup();
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }


    $scope.create = function (app_form) {

        //check if form is valid or not
        if (!app_form.$valid) {
            return;
        }

        //check if passport no is valid or not
        if ($scope.passport_validator_flag == false) {
            $scope.open_passport_popup();
            return;
        }

        //check if user id is valid or not
        if ($scope.id_validator_flag == false) {
            $scope.open_id_popup();
            return;
        }

        //END OF VALIDATION CODE


        console.log('create the guest contact list');
        $scope.guest.dob = new Date(9999, $scope.month, $scope.day);
        $scope.guest.hotel = $scope.hotel;


        $http({
            url: 'http://localhost:8080/api/guest/create',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.guest
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('Create A Guest invoked successfully');
                    $location.url('/maintain/guest/guestlist');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

    $scope.open_passport_popup = function () {
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Duplicate Passport Number is Found !!</h4>' +
                '<a class="btn btn-primary" ng-click="getValue()" ng-show="flag">Detail</a>' +
                '<div style="width: 100%; margin-left: auto;margin-right: auto;" ng-show="guest_profile_data"> <table class=" table table-responsive">'+
                '<tr><td>Title</td><td><input type="text" name="title" ng-model="guest_profile_data.title"></td></tr>'+
                '<tr><td>First Name</td><td><input type="text" name="title" ng-model="guest_profile_data.firstName"></td></tr>'+
                '<tr><td>Sur Name</td><td><input type="text" name="title" ng-model="guest_profile_data.surname"></td></tr>'+
                '<tr><td>Passport Number</td><td><input type="text" name="title" ng-model="guest_profile_data.passportNumber"></td></tr>'+
                '<tr><td>Id</td><td><input type="text" name="title" ng-model="guest_profile_data.idNumber"></td></tr>'+
                '</table></div>'+
                '</body>',
            plain:true,
            className:'ngdialog-theme-default',
            controller:'passport_popup_controller'

        });
    }

    $scope.open_id_popup = function () {
        console.log('open popup for this window');
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Duplicate Id Number is Found !!</h4>' +
                '<a class="btn btn-primary" ng-click="getValue()" ng-show="flag">Detail</a>' +
                '<div style="width: 100%; margin-left: auto;margin-right: auto;" ng-show="guest_profile_data"> <table class=" table table-responsive">'+
                '<tr><td>Title</td><td><input type="text" name="title" ng-model="guest_profile_data.title"></td></tr>'+
                '<tr><td>First Name</td><td><input type="text" name="title" ng-model="guest_profile_data.firstName"></td></tr>'+
                '<tr><td>Sur Name</td><td><input type="text" name="title" ng-model="guest_profile_data.surname"></td></tr>'+
                '<tr><td>Passport Number</td><td><input type="text" name="title" ng-model="guest_profile_data.passportNumber"></td></tr>'+
                '<tr><td>Id</td><td><input type="text" name="title" ng-model="guest_profile_data.idNumber"></td></tr>'+
                '</table></div>'+
                '</body>',
            plain:true,
            className:'ngdialog-theme-default',
            controller:'id_popup_controller',
            plain: true,
            className: 'ngdialog-theme-default'
        });
    }


});


staff_app.controller('passport_popup_controller', function ($scope, $http, $routeParams, $cookieStore, sharedProperties) {

    $scope.guest_profile_data;
    $scope.flag=true;
    $scope.getValue = function () {
        $scope.guest_profile_data = sharedProperties.getProperty();
        $scope.flag=false;
    }

});


staff_app.controller('id_popup_controller', function ($scope, $http, $routeParams, $cookieStore, sharedProperties) {

    $scope.guest_profile_data;
    $scope.flag=true;
    $scope.getValue = function () {
        $scope.guest_profile_data = sharedProperties.getProperty();
        $scope.flag=false;
    }

});

staff_app.controller('update_details_controller', function ($scope, $cookieStore, $routeParams, $http, $location, ngDialog,sharedProperties) {
    console.log('update guest controller is loaded');

    $scope.guest_id = $routeParams.guestId;

    $scope.guest_detail = {};
    $scope.guest_birthday_day;
    $scope.guest_birthday_month;

    $scope.passport_validator_flag;
    $scope.id_validator_flag;

    $scope.genders = ['Male', 'Female', 'Trans gender'];
    $scope.months = [
        {"id": 0, "name": "Jan"},
        {"id": 1, "name": "Feb"},
        {"id": 2, "name": "Mar"},
        {"id": 3, "name": "Apr"},
        {"id": 4, "name": "May"},
        {"id": 5, "name": "June"},
        {"id": 6, "name": "July"},
        {"id": 7, "name": "Aug"},
        {"id": 8, "name": "Sep"},
        {"id": 9, "name": "Oct"},
        {"id": 10, "name": "Nov"},
        {"id": 11, "name": "Dec"}
    ];

    $scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];


    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_detail = data;
                console.log('guest details ::' + $scope.guest_detail);

                console.log('guest dob' + $scope.guest_detail.dob);
                var date = new Date($scope.guest_detail.dob);
                $scope.guest_birthday_day = date.getDate();
                $scope.guest_birthday_month = $scope.months[date.getMonth()].id;
                // console.log($scope.guest_birthday_month);
                // console.log($scope.guest_birthday_day);

                //console.log(date);
                //console.log(date.getDate());


            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.update = function (guest_update_form) {
        console.log('Guest details  updating............. ');


        //validate the form
        if (!guest_update_form.$valid) {
            $scope.open_invalid_form_popup();
            return;
        }

        //check if passport is valid or not
        if ($scope.passport_validator_flag == false) {
            $scope.open_passport_popup();
            return;
        }
        //check if user id is valid or not
        if ($scope.id_validator_flag == false) {
            $scope.open_id_popup();
            return;
        }
        //End Of Validation


        $scope.birth_date = new Date(9999, $scope.guest_birthday_month, $scope.guest_birthday_day);
        $scope.guest_detail.dob = $scope.birth_date;

        //console.log('date before update::' + $scope.guest_birthday_day);
        //console.log($scope.guest_birthday_day);


        $http({

            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/update',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.guest_detail
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('Guest details  updated successfully');
                    $location.url('maintain/guest/' + $routeParams.guestId + '/details');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

    $scope.cancel = function () {
        $location.url('maintain/guest/' + $routeParams.guestId + '/details');
    }

    $scope.open_passport_popup = function () {
        console.log('passport popup');
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Duplicate Passport Number is Found !!</h4>' +
                '<a class="btn btn-primary" ng-click="getValue()" ng-show="flag">Detail</a>' +
                '<div style="width: 100%; margin-left: auto;margin-right: auto;" ng-show="guest_profile_data"> <table class=" table table-responsive">'+
                '<tr><td>Title</td><td><input type="text" name="title" ng-model="guest_profile_data.title"></td></tr>'+
                '<tr><td>First Name</td><td><input type="text" name="title" ng-model="guest_profile_data.firstName"></td></tr>'+
                '<tr><td>Sur Name</td><td><input type="text" name="title" ng-model="guest_profile_data.surname"></td></tr>'+
                '<tr><td>Passport Number</td><td><input type="text" name="title" ng-model="guest_profile_data.passportNumber"></td></tr>'+
                '<tr><td>Id</td><td><input type="text" name="title" ng-model="guest_profile_data.idNumber"></td></tr>'+
                '</table></div>'+
                '</body>',
            plain:true,
            className:'ngdialog-theme-default',
            controller:'passport_popup_controller'

        });
    }


    $scope.open_id_popup = function () {
        console.log('id popup');
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Duplicate id is Found !!</h4>' +
                '<a class="btn btn-primary" ng-click="getValue()" ng-show="flag">Detail</a>' +
                '<div style="width: 100%; margin-left: auto;margin-right: auto;" ng-show="guest_profile_data"> <table class=" table table-responsive">'+
                '<tr><td>Title</td><td><input type="text" name="title" ng-model="guest_profile_data.title"></td></tr>'+
                '<tr><td>First Name</td><td><input type="text" name="title" ng-model="guest_profile_data.firstName"></td></tr>'+
                '<tr><td>Sur Name</td><td><input type="text" name="title" ng-model="guest_profile_data.surname"></td></tr>'+
                '<tr><td>Passport Number</td><td><input type="text" name="title" ng-model="guest_profile_data.passportNumber"></td></tr>'+
                '<tr><td>Id</td><td><input type="text" name="title" ng-model="guest_profile_data.idNumber"></td></tr>'+
                '</table></div>'+
                '</body>',
            plain:true,
            className:'ngdialog-theme-default',
            controller:'id_popup_controller'
        });
    }


    $scope.open_invalid_form_popup = function () {
        console.log('invalid form popup');
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4 style="align-content: stretch">' +
                "Form Can't Be Empty!!</h4>" +
                '</body>', plain: true,
            className: 'ngdialog-theme-default'
        });
    }


    $scope.checkPassport = function () {
        console.log('ckecking the passport');
        $http({
            url: 'http://localhost:8080/api/guest/passport/' + $scope.guest_detail.passportNumber + '/details',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (data.firstName == undefined) {
                    console.log('passport is not available in the database')
                    $scope.passport_validator_flag = true;
                    return;
                }
                if (data.id == $scope.guest_id) {
                    console.log('this passport no belongs to the same guest');
                    $scope.passport_validator_flag = true;
                    return;
                }
                if (data.id != $scope.guest_id) {
                    console.log('Data returned from server' + data.firstName);
                    $scope.passport_validator_flag = false;
                    //scope.guest_detail=data;
                    //store guest data to the shared resource
                    sharedProperties.setProperty(data);

                    $scope.open_passport_popup();
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }


    $scope.checkUniqueId = function () {
        console.log('ckecking the id');
        $http({
            url: 'http://localhost:8080/api/guest/uniqueid/' + $scope.guest_detail.idNumber + '/details',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (data.firstName == undefined) {
                    console.log('Id is not available in the database')
                    $scope.id_validator_flag = true;
                    return;
                }
                if (data.id == $scope.guest_id) {
                    console.log('this id no belongs to the same guest');
                    $scope.id_validator_flag = true;
                    return;
                }
                if (data.id != $scope.guest_id) {
                    console.log('Data returned from server' + data.firstName);
                    $scope.id_validator_flag = false;
                    //scope.guest_detail=data;
                    //store the data in the shared property
                    sharedProperties.setProperty(data);
                    $scope.open_id_popup();
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }


});
<!--End Of Guest Management -->


<!--Guest Preference Management-->

<!--View guest Preference data-->
staff_app.controller('view_guest_preference_data_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.guest_data = {};

    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_data = data;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});

<!-- add guest preference -->
staff_app.controller('add_guest_preference_controller', function ($scope, $http,ngDialog, $routeParams, $cookieStore, $location,sharedPreferenceProperties) {

    $scope.guest_id = $routeParams.guestId;
    $scope.guest_preference_types;
    $scope.guest_preference_type = {};
    $scope.guest_preference = {};
    $scope.guest_preference_description = '';
    $scope.message = '';
    $scope.all_preferences_of_given_type;
    $scope.flag=false;
    $scope.selected_preference={};



    $http({
        url: 'http://localhost:8080/api/guest/preference/types',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_preference_types = data;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.addPreference = function () {
        console.log('add preferences');

        //bind the variables
        $scope.guest_preference.guestPreferenceType = $scope.guest_preference_type;
        $scope.guest_preference.description = $scope.guest_preference_description;
        console.log('guest preference type' + $scope.guest_preference_type);


        $http({

            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/preference/add',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.guest_preference
        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('Guest preference added successfully');
                    $scope.message = 'Guest Preferences added Successfully';
                    //get all preference of the selected preferenceTypeId.
                    $scope.all_preferences_of_given_type=data;
                    $scope.guest_preference_description='';
                    console.log('all preferences of the given id::'+data);
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }




    $scope.cancelPage = function () {
        $location.url('maintain/guest/' + $scope.guest_id + '/guestpreference');
    }

    $scope.onSelectPreferenceType = function () {
        $scope.message = '';
        //get the guest preferences if this guest have any preferences of the selected type.
        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/preference/' + $scope.guest_preference_type.id,
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.all_preferences_of_given_type=data;
                    $scope.guest_preference_description='';

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

    $scope.onSelectPreference=function()
    {
        $scope.flag = true;
        $scope.message = '';
        console.log('you have selected the preference with id::'+$scope.selected_preference);

    }

    $scope.deletePreference=function()
    {
        console.log('deleting the preference');
        $http({
            url: 'http://localhost:8080/api/guest/preference/delete' ,
            method: 'post',
            headers: {
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.selected_preference

        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('preference deleted successfully');
                    $scope.guest_preference_description = '';
                    $scope.message = 'Preference Deleted Successfully';
                    $scope.all_preferences_of_given_type=data;
                    $scope.flag=false;
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

    $scope.updatePreference=function()
    {
        //we can store the type and description in a shared property and open a popup
        // then show the value from the shared property.
        console.log('setting the value in the sharedPreferenceService');
        sharedPreferenceProperties.setTypeProperty($scope.guest_preference_type);
        sharedPreferenceProperties.setDescProperty($scope.selected_preference);
        console.log('setting the value in the sharedPreferenceService');
        console.log('type::'+sharedPreferenceProperties.getTypeProperty());
        console.log('desc::'+sharedPreferenceProperties.getDescProperty());
        $scope.flag = false;

        //open a popup to update preference.
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Update Preference !!  {{message}}</h4>' +
                '<div style="width: 100%; margin-left: auto;margin-right: auto;"> <table class=" table table-responsive">'+
                '<tr><td>Type</td>' +
                '<td>' +
                '<select ng-model="preferenceTypeId" ng-options="obj.id as obj.name for obj in preferenceTypeEle"></select>'+
                '</td>' +
                '</tr>'+
                '<tr><td>Description</td><td><input type="text" name="title" ng-model="preferenceDescription.description" ng-focus="reset()"></td></tr>'+
                '</table><a class="btn btn-primary" ng-click="updatePreference()" style="text-align: center;">Update</a></div>'+
                '</body>',
            plain:true,
            className:'ngdialog-theme-default',
            controller:'update_preference_popup_controller'
        });
    }
});

staff_app.controller('update_preference_popup_controller', function ($scope, $http,ngDialog, $routeParams, $cookieStore, $location,sharedPreferenceProperties) {
    $scope.preferenceType=sharedPreferenceProperties.getTypeProperty();//getting type
    $scope.preferenceDescription=sharedPreferenceProperties.getDescProperty();//getting description

    //assigned so that item  will be selected at the time of displaying
    $scope.preferenceTypeId=$scope.preferenceType.id;

    //array is used to display a drop down.
    $scope.preferenceTypeEle=[];
    //storing the selected element in the array.
    $scope.preferenceTypeEle[0]=$scope.preferenceType;
    console.log('selected preference type name::'+$scope.preferenceType.name);
    console.log('selected preference id name::'+$scope.preferenceType.id);

    //$scope.preferenceDescription contain the object that we need to update its description
    //for avoiding confusion we declared below preference object and assigned the $scope.preferenceDescription to it.
    $scope.preference=$scope.preferenceDescription;
    //message
    $scope.message='';

    $scope.updatePreference=function()
    {
        $http({
            url: 'http://localhost:8080/api/guest/preference/update',
            method: 'post',
            headers: {
                'Authorization': $cookieStore.get("auth")
            },
            data:$scope.preference

        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('preference description amended successfully');
                    $scope.message='updated successfully';
                    $scope.close();
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }


    $scope.reset=function()
    {
        $scope.message='';
    }
    $scope.close=function()
    {
        ngDialog.close();
    }



});

<!-- End Of Guest Preference Management -->



<!--Guest Stay Management-->

<!--View guest stay details-->
staff_app.controller('view_guest_stay_details_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.guest_stay_detail = {};

    $scope.guest_profile_detail = {};


    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_profile_detail = data;


            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/gueststaydetails',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_stay_detail = data;
                console.log('guest stay details ::' + $scope.guest_stay_detail);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});

<!--Add Stay Details-->
staff_app.controller('add_stay_details_controller', function ($scope, $http, $routeParams, $cookieStore, $location) {

    console.log('add stay detail controller is loaded');
    $scope.current_user_hotel_id = $cookieStore.get("user").hotel.id;
    $scope.current_hotel = $cookieStore.get("user").hotel;
    $scope.current_guest_id=$routeParams.guestId;


    //get all rooms
    $scope.available_hotel_rooms;
    $scope.departure_time;
    $scope.arrival_time;
    $scope.rooms = [];
    $scope.selected_room = {};

    //object to bind
    $scope.stay_detail = {};

    //flag to switch between add and update screen
    $scope.view_switcher_flag=false;

    //bind multiple selection objects.
    $scope.y = {available_hotel_rooms: []};

    //store all rooms assigned to the guest
    $scope.assigned_rooms=[];

    //model element
    $scope.selected_room;

    //new rooms to be allocated to the guest on guest request
    $scope.new_rooms=[];


    //store the latest record if the guest is in the hotel
    $scope.guest_history={};

    //check guests current stay(if guest record is found then only we can update his details)

    $http({
        url: 'http://localhost:8080/api/guest/'+ $routeParams.guestId + '/lateststay ',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                if(data.id != undefined)
                {
                    console.log('guest stay is found');
                    $scope.guest_history=data;
                    $scope.view_switcher_flag=true;
                    $scope.assigned_rooms=data.rooms;
                }

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    //get all available rooms in the hotel  to allocate to a guest
    $http({
        url: 'http://localhost:8080/api/hotel/' + $scope.current_user_hotel_id + '/rooms',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.available_hotel_rooms = data;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.pushRoomToRight=function()
    {
        console.log('push to right');

        if ($scope.selected_room != null) {
            for (var i = 0; i < $scope.available_hotel_rooms.length; i++) {

                if ($scope.available_hotel_rooms[i].id == $scope.selected_room.id) {
                    $scope.available_hotel_rooms.splice(i, 1);
                    $scope.assigned_rooms.push($scope.selected_room);
                    return;
                }
            }
        }


    }

    $scope.pushRoomToLeft=function()
    {
        console.log('push to left');
        if ($scope.selected_room != null) {
            for (var i = 0; i < $scope.assigned_rooms.length; i++) {

                if ($scope.assigned_rooms[i].id == $scope.selected_room.id) {
                    $scope.assigned_rooms.splice(i, 1);
                    $scope.available_hotel_rooms.push($scope.selected_room);
                    return;
                }
            }
        }
    }




    $scope.add = function () {
        console.log('adding stay details');
        $scope.stay_detail.arrivalTime = new Date($scope.arrival_time);
        $scope.stay_detail.departureTime = new Date($scope.departure_time);
        $scope.stay_detail.hotel = $scope.current_hotel;
        $scope.stay_detail.rooms = $scope.y.available_hotel_rooms;


        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/addstaydetails',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.stay_detail
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('Add hotel stay details successfully');
                    $location.url('maintain/guest/' + $routeParams.guestId + '/gueststaydetails');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }




    $scope.update = function () {
        if($scope.arrival_time== undefined)
        {
            $scope.stay_detail.arrivalTime = new Date($scope.guest_history.arrivalTime);
        }else
        {
            $scope.stay_detail.arrivalTime=$scope.arrival_time;

        }


        if($scope.departure_time== undefined)
        {
            $scope.stay_detail.departureTime = new Date($scope.guest_history.departureTime);
        }
        else
        {
            $scope.stay_detail.departureTime=$scope.departure_time;

        }

        $scope.stay_detail.hotel = $scope.current_hotel;
        $scope.stay_detail.rooms = $scope.assigned_rooms;

        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/updatestaydetails',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.stay_detail
        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('Add hotel stay details successfully');
                    $location.url('maintain/guest/' + $routeParams.guestId + '/gueststaydetails');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });



    }


});

<!--End Of Guest Stay Management-->



<!--Guest Room Card Management-->

<!--View guest Room Card  data-->
staff_app.controller('view_guest_room_card_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.guest_cards;
    $scope.guest_detail = {};


    //get a guest detail
    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_detail = data;
                console.log('guest details ::' + $scope.guest_detail);
                console.log('guest date of birth::' + new Date($scope.guest_detail.dob));

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/roomcarddetails',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_cards = data;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});

<!-- maintain guest Room Key Card -->
staff_app.controller('maintain_room_key_cards_controller', function ($scope, $http, $routeParams, $cookieStore, $location) {

    $scope.guest_id = $routeParams.guestId;
    $scope.roomcard_data = {};     //store  room card detail
    $scope.guest_room_key_cards;  //all available cards
    $scope.message = '';          //confirmation message
    $scope.room_card_status;
    $scope.card;
    $scope.issue_flag=false;
    $scope.return_flag=false;
    $scope.return_all_flag=false;


    //all cards holding by the guest
    $scope.current_key_cards;

    //object to bind
    $scope.guest_card = {};
    //array of bind objects
    $scope.guest_cards = [];

    $scope.y = {guest_room_key_cards: []};


    //get all cards given to a guest.
    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/roomcarddetails',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if(data.length!=0)
            {
                console.log('all cards are returned successfully');
                $scope.current_key_cards=data;
                $scope.return_all_flag=true;
                $scope.return_flag=false;
                $scope.issue_flag=false;

            }
            else{
                $scope.return_all_flag=false;
                $scope.return_flag=false;
                $scope.issue_flag=true;
            }

        })
        .error(function (error) {
            console.log(error);
        });


    //get all guest room key cards data that are available.
    $http({
        url: 'http://localhost:8080/api/guest/roomkeycards',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_room_key_cards = data;
                //$scope.flag=true;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });



    $scope.onSelectCardFromList=function()
    {
        console.log('card is selected'+$scope.current_card.magStripeNo);
        $scope.return_flag=true;
        $scope.return_all_flag=false;
        $scope.issue_flag=false;
    }

    $scope.onClickIssueButton=function()
    {
        $scope.issue_flag=true;
        $scope.return_all_flag=false;
        $scope.return_flag=false;
    }

    $scope.issueCard = function () {
        $scope.obj = {};
        //doing pre calculation
        for (var i = 0; i < $scope.y.guest_room_key_cards.length; i++) {
            console.log($scope.y.guest_room_key_cards[i].magStripeNo);
            $scope.obj.card = $scope.y.guest_room_key_cards[i];
            $scope.guest_cards.push($scope.obj);
            $scope.obj = {};
        }

        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/cards/assign',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            //data:$scope.guest_cards
            data: $scope.guest_cards
        }).
            success(function (data, status) {
                // $scope.guest_cards=[];
                console.log('saved successfully');
                $location.url('maintain/guest/'+$routeParams.guestId+'/roomcarddetails');
            })
            .error(function (error) {
                console.log(error);
            });
    }


    $scope.returnCard = function () {
        console.log('returning the guest room key card');

        $http({
            url: 'http://localhost:8080/api/guest/' + $scope.current_card.id + '/returncard',
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {

                    console.log('card is returned successfully');
                    $location.url('maintain/guest/' + $routeParams.guestId + '/roomcarddetails');

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

    $scope.returnAllCards=function()
    {
        console.log('return all cards from the guest');
        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/returncards',
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {

                    console.log('all cards are returned successfully');
                    $location.url('maintain/guest/' + $routeParams.guestId + '/roomcarddetails');

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }
});

<!--End Of Guest Room Card Management-->

staff_app.controller('staff_app_controller', function ($scope, $http, $location, $cookieStore, $window) {
    console.log('staff app controller is loaded');
    $scope.user;

    if ($cookieStore.get("user") == null) {
        console.log("User is not authenticated");
        $window.location.replace("login-app.html?staff-app.html" + $window.location.hash);
    } else {
        console.log("User is authenticated");
        $scope.user = $cookieStore.get("user");
        if ($scope.user.userType.value != "ROLE_STAFF") {
            $window.location.replace("index.html");
        }
    }


    $scope.logout = function () {
        console.log('logout method is called');
        $cookieStore.remove("user");
        $cookieStore.remove("auth");
        $window.location.replace("login-app.html");


    };
});

staff_app.controller('touch_point_controller', function ($scope,$cookieStore,$http) {
console.log('touch point controller of staff app module is loaded');
    $scope.assigned_touch_point_list=[];
    $scope.selected_touch_point;
    $scope.user_detail=$cookieStore.get("user");
    console.log('current user id::'+$scope.user_detail.id);

    $http({
        url: 'http://localhost:8080/api/login/touchpoints',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::'+status);
            if (status == 200) {
                $scope.assigned_touch_point_list = data;
                console.log('All Touch Points::'+$scope.assigned_touch_point_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});

staff_app.controller('find_guest_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log(' staff guest find controller is loaded');
    $scope.guest_list=[];

    $http({
        url: 'http://localhost:8080/api/touchpoints/'+ $routeParams.TPId + '/guestCards',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::'+status);
            if (status == 200) {
                $scope.guest_list = data;
                console.log('All Guest List::'+$scope.guest_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});

staff_app.controller('guest_detail_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {

    $scope.guest_detail;
    $scope.guest_id=$routeParams.guestId;
    console.log('guest detail controller is loaded...'+$scope.guest_id);
    $http({
        url: 'http://localhost:8080/api/guest/'+$scope.guest_id,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::'+status);
            if (status == 200) {
                $scope.guest_detail = data;
                console.log('Guest Detail::'+$scope.guest_detail);

                console.log($scope.guest_detail.arrivalTime);
                console.log($scope.guest_detail.departureTime);

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});

staff_app.controller('checkedin_guest_controller', function ($scope, $http, $location, $cookieStore, $routeParams, $window) {
    console.log('staff checkedin guest controller is loaded');

    $scope.checkedin_guest_list;
    $scope.hotel_id = $cookieStore.get("user").hotel.id;

    <!--  get all checkedin guest list -->
    $http({
        url: 'http://localhost:8080/api/hotels/'+ $scope.hotel_id +'/guests/checkedIn',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.checkedin_guest_list = data;
                console.log('checkedin guest list::' + $scope.checkedin_guest_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});

staff_app.controller('current_guest_location_controller', function ($scope, $http, $location, $cookieStore, $routeParams, $window) {
    console.log('current guest location  controller is loaded');
    $scope.guest_id = $routeParams.guestId;
    $scope.guest_current_position;
    $scope.current_guest_location_history;
    $scope.guest_detail;
    console.log('current guest location::' + $scope.guest_id);

    <!-- get guest detail by guests id  -->
    $scope.room_message='';
    $scope.rooms={};

    $http({
        url: 'http://localhost:8080/api/guest/' + $scope.guest_id,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::' + status);
            if (status == 200) {
                $scope.guest_detail = data;
                $scope.rooms=data.rooms;
                for(var i=0;i<$scope.rooms.length;i++)
                {
                    $scope.room_message=$scope.room_message+','+$scope.rooms[i].roomNumber;
                }

                console.log('Guest Detail::' + $scope.guest_detail);
                console.log('room details::'+$scope.room_message);



            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.location_message='';

    $http({
        url: 'http://localhost:8080/api/guests/' + $scope.guest_id + '/locations',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200 && data != null) {

                $scope.guest_current_position = data;
                console.log('current guest position detail ::' + $scope.guest_current_position);
                for(var i=0;i<$scope.guest_current_position.length;i++)
                {
                    $scope.location_message=$scope.location_message+','+$scope.guest_current_position[i].zoneId;
                }
                console.log('currently found locations::'+$scope.location_message);

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.showHistory = function () {
        $http({
            url: 'http://localhost:8080/api/guests/' + $scope.guest_id + '/location/history',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.current_guest_location_history = data;
                    console.log('current guest location history ::' + $scope.current_guest_location_history);
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

});

staff_app.controller('current_guest_location_history_controller', function ($scope, $cookieStore,$routeParams, $http) {
    console.log('current_guest_location_history_controller of staff app module is loaded');
    $scope.guest_id=$routeParams.guestId;
    $scope.current_guest_location_history;

    $http({
        url: 'http://localhost:8080/api/guests/'+$scope.guest_id+'/location/history',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.current_guest_location_history = data;
                console.log('current guest location history ::' + $scope.current_guest_location_history);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


});

staff_app.controller('checked_in_guest_list_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {

    console.log('checked in guest list controller is loaded');


    $scope.checkedin_guest_list;
    $scope.hotel_id = $cookieStore.get("user").hotel.id;

    <!--  get all checkedin guest list -->
    $http({
        url: 'http://localhost:8080/api/hotels/' + $scope.hotel_id + '/guests/checkedIn',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.checkedin_guest_list = data;
                console.log('checkedin guest list::' + $scope.checkedin_guest_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});

staff_app.controller('checked-in-guest-detail', function ($scope, $http, $routeParams, $location, $cookieStore) {
    $scope.checked_in_guest_detail;
    $scope.guest_image_list;
    $scope.selected_guest_image;
    $scope.selected_guest_image_data;
    $scope.filename;
    $scope.file_path;
    $scope.ext;
    $scope.attach_image_flag=false;
    $scope.guest_id = $routeParams.guestId;

    console.log('checked in guest list detail controller is loaded');

    //Find guest detail
    $http({
        url: 'http://localhost:8080/api/guest/' + $scope.guest_id,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::' + status);
            if (status == 200) {
                $scope.checked_in_guest_detail = data;
                console.log('Guest Detail::' + $scope.checked_in_guest_detail);


                $scope.ext = $scope.checked_in_guest_detail.guest.guestImagePath.substr($scope.checked_in_guest_detail.guest.guestImagePath.lastIndexOf('.') + 1);
                $scope.filename = $scope.checked_in_guest_detail.guest.guestImagePath.substr(0, $scope.checked_in_guest_detail.guest.guestImagePath.lastIndexOf('.'));

                //$scope.selected_guest_image is assigned to the saved file name so that we can view in the ui
                $scope.selected_guest_image = $scope.checked_in_guest_detail.guest.guestImagePath;
                console.log('file name from DataBase::' + $scope.filename);
                console.log('file extension from DataBase::' + $scope.ext)

                //call a method to get the guests saved image
                $scope.viewImage($scope.filename, $scope.ext);


            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    //take the guest image file name from database and read that file from local system
    $scope.viewImage = function (filename, ext) {
        $http({
            url: 'http://localhost:8080/api/guest/image/' + filename + '/' + ext,
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                console.log('get success code::' + status);
                if (status == 200) {
                    $scope.selected_guest_image_data = data;
                    //console.log('image data' + $scope.selected_guest_image_data);
                    console.log('file name from DataBase2::' + $scope.filename);
                    console.log('file extension from DataBase2::' + $scope.ext);
                    //console.log('image data is retrieved successfully');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }


    //Find all images from the guest image directory
    $http({
        url: 'http://localhost:8080/api/guest/photos',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code in guest image service invoker::' + status);
            if (status == 200) {
                $scope.guest_image_list = data;
                console.log('guest image list' + $scope.guest_image_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.getGuestImage = function () {
        console.log('selected image' + $scope.selected_guest_image);

        //call a service which will return a image
        $scope.filename = $scope.selected_guest_image.substr(0, $scope.selected_guest_image.lastIndexOf('.'));
        $scope.ext = $scope.selected_guest_image.substr($scope.selected_guest_image.lastIndexOf('.') + 1);

        var url = 'http://localhost:8080/api/guest/image/' + $scope.filename + '/' + $scope.ext;
        console.log('URL::::' + url);

        $http({
            url: url,
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                console.log('get success code::' + status);
                if (status == 200) {
                    $scope.selected_guest_image_data = data;
                    //console.log('image data' + $scope.selected_guest_image_data);
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

    $scope.attachGuestImage = function () {
        $http({
            url: 'http://localhost:8080/api/guest/' + $scope.guest_id + '/image/' + $scope.filename + '/' + $scope.ext + '/update',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                console.log('get success code::' + status);
                if (status == 200) {
                    console.log('image path is saved');
                    $location.url('/checked-in-guest/list');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }
});

