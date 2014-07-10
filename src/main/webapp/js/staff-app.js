/**
 * Created by Bibhuti on 2014/04/03.
 */
var staff_app = angular.module('staff_app', ['ngRoute', 'ngCookies', 'ngDialog']);


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
staff_app.controller('create_guest_controller', function ($scope, $http, $routeParams, $cookieStore, $location, ngDialog) {

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


    $scope.open_passport_popup = function (data) {
        console.log('passport popup' + data);
        $scope.guest_detail = data;
        console.log('passport popup  again' + $scope.guest_detail);
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Duplicate Passport Number is Found !!</h4>' +

                '</body>', plain: true,
            className: 'ngdialog-theme-default'
        });
    }


    $scope.open_id_popup = function () {
        console.log('open popup for this window');
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Duplicate Id Number Found !!</h4>' +
                '</body>', plain: true,
            className: 'ngdialog-theme-default'
        });
    }


})
    .directive('uniquePassport', function ($http, $cookieStore) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                //when the scope changes, check the email.
                scope.$watch(attr.ngModel, function (value) {


                    // call to some API that returns { isValid: true } or { isValid: false }

                    if (value != undefined) {
                        $http({
                            url: 'http://localhost:8080/api/guest/passport/' + value + '/details',
                            method: 'get',
                            headers: {
                                'Authorization': $cookieStore.get("auth")
                            }
                        }).
                            success(function (data, status) {
                                if (data.firstName == undefined) {
                                    console.log('passport is not available in the database')
                                    scope.passport_validator_flag = true;
                                }
                                else {
                                    console.log('Data returned from server' + data.firstName);
                                    scope.passport_validator_flag = false;
                                    //scope.guest_detail=data;
                                    scope.open_passport_popup(data);
                                }
                            })
                            .error(function (error) {
                                console.log(error);
                            });
                    }

                })
            }
        }
    })

    .directive('uniqueIdnumber', function ($http, $cookieStore) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                //when the scope changes, check the email.
                scope.$watch(attr.ngModel, function (value) {


                    // call to some API that returns { isValid: true } or { isValid: false }

                    if (value != undefined) {
                        $http({
                            url: 'http://localhost:8080/api/guest/uniqueid/' + value + '/details',
                            method: 'get',
                            headers: {
                                'Authorization': $cookieStore.get("auth")
                            }
                        }).
                            success(function (data, status) {
                                if (data.firstName == undefined) {
                                    console.log('id is not available in the database')
                                    scope.id_validator_flag = true;
                                }
                                else {
                                    console.log('Data returned from server' + data.firstName);
                                    scope.id_validator_flag = false;
                                    scope.open_id_popup();
                                }
                            })
                            .error(function (error) {
                                console.log(error);
                            });
                    }

                })
            }
        }
    });


staff_app.controller('update_details_controller', function ($scope, $cookieStore, $routeParams, $http, $location, ngDialog) {
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
                console.log($scope.guest_birthday_month);
                console.log($scope.guest_birthday_day);

                console.log(date);
                console.log(date.getDate());


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
        if(!guest_update_form.$valid)
        {
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

        console.log('date before update::' + $scope.guest_birthday_day);
        console.log($scope.guest_birthday_day);


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
                    $location.url('maintain/guest/'+$routeParams.guestId+'/details');
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
                'Duplicate Passport Number is  Found !!</h4>' +

                '</body>', plain: true,
            className: 'ngdialog-theme-default'
        });
    }


    $scope.open_id_popup = function () {
        console.log('id popup');
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'Duplicate Id Number is Found !!</h4>' +
                '</body>', plain: true,
            className: 'ngdialog-theme-default'
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


    $scope.checkPassport=function()
    {
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
                if(data.id==$scope.guest_id)
                {
                    console.log('this passport no belongs to the same guest');
                    $scope.passport_validator_flag = true;
                    return;
                }
                if(data.id!=$scope.guest_id){
                    console.log('Data returned from server' + data.firstName);
                    $scope.passport_validator_flag = false;
                    //scope.guest_detail=data;
                    $scope.open_passport_popup();
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }


    $scope.checkUniqueId=function()
    {
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
                if(data.id==$scope.guest_id)
                {
                    console.log('this id no belongs to the same guest');
                    $scope.id_validator_flag = true;
                    return;
                }
                if(data.id!=$scope.guest_id){
                    console.log('Data returned from server' + data.firstName);
                    $scope.id_validator_flag = false;
                    //scope.guest_detail=data;
                    $scope.open_id_popup();
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }



});


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

staff_app.controller('add_guest_preference_controller', function ($scope, $http, $routeParams, $cookieStore, $location) {

    $scope.guest_id = $routeParams.guestId;
    $scope.guest_preference_types;
    $scope.guest_preference_type = {};
    $scope.guest_preference = {};
    $scope.guest_preference_description = '';
    $scope.message = '';

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


    $scope.add = function () {
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
                    $scope.guest_preference_description = '';
                    $scope.message = 'Guest Preferences added Successfully';
                    $scope.guest_preference_type = {};

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

    $scope.update = function () {

        $scope.guest_preference.guestPreferenceType = $scope.guest_preference_type;
        $scope.guest_preference.description = $scope.guest_preference_description;
        console.log('guest preference type' + $scope.guest_preference_type);


        $http({

            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/preference/update',
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
                    $scope.message = 'Guest Preferences updated successfully';

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }


    $scope.cancel = function () {
        $location.url('maintain/guest/' + $scope.guest_id + '/guestpreference');
    }

    $scope.reset = function () {
        $scope.message = '';
    }


    $scope.delete = function () {
        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/preference/' + $scope.guest_preference_type.id + '/delete',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('preference deleted successfully');
                    $scope.guest_preference_description = '';
                    $scope.message = 'Preference Deleted Successfully';
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

    $scope.onSelectType = function () {
        $scope.message = '';
        $scope.flag = false;


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
                    $scope.guest_preference_description = data.description;
                    if (data.description != undefined) {
                        $scope.flag = true;
                    }


                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

});


<!--View guest stay details-->

staff_app.controller('view_guest_stay_details_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.guest_stay_detail = {};


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

    $scope.current_user_hotel_id = $cookieStore.get("user").hotel.id;
    $scope.hotel_rooms;
    $scope.stay_detail = {};
    $scope.departure_time;
    $scope.arrival_time;
    $scope.selected_room;
    $scope.flag;
    $scope.current_guest_id=$routeParams.guestId;
    $scope.room = {};
    $scope.details = {};
    $scope.hotel = {"id": $scope.current_user_hotel_id};

    $scope.ind=[
        {"id":0}
    ];
    $scope.current_stay_status;


//to view the guest stay details if it any
    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/gueststaydetails',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {


            $scope.details = data;
            //bind these below two variables so that while update, if user does not change  the guest arrival and departure date then it will bind the previous arrival and departure date.
            $scope.arrival_time = $scope.details.arrivalTime;
            $scope.departure_time = $scope.details.departureTime;


            if ($scope.details.room != null) {
                $scope.selected_room = $scope.details.room.roomNumber;
                $scope.room.roomNumber = $scope.selected_room;
                //flag is used to switch the appearance of add and update button.
                $scope.flag = true;
            }

            if ($scope.details.currentStayIndicator == 1) {
                $scope.stay_detail.currentStayIndicator = 1;
                $scope.ind[0].name='True';
                $scope.current_stay_status=0;


            }
            if ($scope.details.currentStayIndicator == 0) {
                $scope.stay_detail.currentStayIndicator = 0;
                $scope.ind[0].name='False';
                $scope.current_stay_status=0;

            }

        })
        .error(function (error) {
            console.log(error);
        });


    //get all rooms of the hotel that the current user belong so that he/she can assign the rooms of the same hotel to the guest.
    $http({
        url: 'http://localhost:8080/api/hotel/' + $scope.current_user_hotel_id + '/rooms',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.hotel_rooms = data;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.add = function () {
        $scope.stay_detail.arrivalTime = new Date($scope.arrival_time);
        $scope.stay_detail.departureTime = new Date($scope.departure_time);

        $scope.room.roomNumber = $scope.selected_room;

        $scope.stay_detail.room = $scope.room;
        $scope.stay_detail.hotel = $scope.hotel;


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
        console.log('changing the stay details');


        $scope.stay_detail.arrivalTime = new Date($scope.arrival_time);
        $scope.stay_detail.departureTime = new Date($scope.departure_time);

        $scope.room.roomNumber = $scope.selected_room;

        $scope.stay_detail.room = $scope.room;
        $scope.stay_detail.hotel = $scope.hotel;


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
                    console.log('Update hotel stay details successfully');
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



<!--View guest Room Card  data-->

staff_app.controller('view_guest_room_card_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.roomcard_data = {};
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
                $scope.roomcard_data = data;
                console.log("guest room status::" + $scope.roomcard_data);

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

    $scope.guest_id=$routeParams.guestId;
    $scope.roomcard_data = {};     //store  room card detail
    $scope.guest_room_key_cards;  //all available cards
    $scope.message = '';          //confirmation message
    $scope.room_card_status;
    $scope.card_id;
    $scope.flag;

    $scope.guest_key_card_status = [
        {"id": 0, "name": "False"},
        {"id": 1, "name": "True"}
    ];

    $scope.current_key_card=[{"id": 0}];





    //get the guest card allowcation details of the current guest.
    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/roomcarddetails',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                //$scope.roomcard_data = data;
                //console.log("guest room status::" + $scope.roomcard_data);
                //$scope.card_id=data.card.magStripeNo;
                if(data.card!=undefined)
                {
                    $scope.card_id=data.card.id;
                    $scope.flag = true;
                    $scope.current_key_card[0].magStripeNo=data.card.magStripeNo;
                    $scope.current_card=0;
                }
                else{
                    $scope.flag = false;
                }




            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    //get all guest room key cards data
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



    //view the guest room key card data for testing purpose only
    $scope.onSelectMSN=function(){
        console.log("onselectmsn method calling.......")

        $http({
            url: 'http://localhost:8080/api/'+$scope.card_id +'/roomcarddetails',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.roomcard_data = data;
                    console.log("guest room status::" + $scope.roomcard_data.status);


                    if($scope.roomcard_data.status ==1){
                        $scope.room_card_status=1;
                        // $scope.flag = true;
                        console.log("room card status is found::" + $scope.room_card_status);
                    }
                    else{
                        $scope.room_card_status=0;
                        //$scope.flag=false;
                    }



                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });


    }

    $scope.issueCard = function () {
        console.log('issue room key cards.....');

        //bind the variables
        console.log('guest room key cards' + $scope.guest_room_key_card);

        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/keycard/'+$scope.card_id+'/assign',
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {

                    console.log('card is assigned successfully');
                    $location.url('maintain/guest/'+$routeParams.guestId+'/roomcarddetails');

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }


    $scope.returnCard=function()
    {
        console.log('returning the guest room key card');

        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/keycard/return',
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {

                    console.log('card is returned successfully');
                    $location.url('maintain/guest/'+$routeParams.guestId+'/roomcarddetails');

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

});


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
                console.log('Guest Detail::' + $scope.guest_detail);


            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });



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

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.showHistory = function(){
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

