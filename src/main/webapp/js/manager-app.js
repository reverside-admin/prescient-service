/**
 * Created by Bibhuti on 2014/04/03.
 */
var manager_app = angular.module('manager_app', ['ngRoute', 'LocalStorageModule', 'ngDialog']);

manager_app.service('sharedProperties', function () {
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

manager_app.service('sharedPreferenceProperties', function () {
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


manager_app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/manager/touchpoints', {
                'templateUrl': 'ui/touch_point.html',
                'controller': 'touch_point_controller'
            })
            .when('/manager/touchpoint/list', {
                'templateUrl': 'ui/manager-touchpoint.html',
                'controller': 'touch_point_controller'
            })
            .when('/manager/touchpoint/:tpId/setups', {
                'templateUrl': 'ui/manager-touchpoint-setup-list.html',
                'controller': 'touch_point_setup_list_controller'
            })
            .when('/touchpoint/:TPId/guests', {
                'templateUrl': 'ui/find-guest.html',
                'controller': 'find_guest_controller'
            })
            .when('/hotels/guests/checkedin', {
                'templateUrl': 'ui/find-checkedin-guest.html',
                'controller': 'checkedin_guest_controller'
            })

            .when('/hotels/guests/:guestId/position', {
                'templateUrl': 'ui/current-guest-location.html',
                'controller': 'current_guest_location_controller'
            })

            .when('/manager/guest/contacts', {
                'templateUrl': 'ui/guest-contact-list.html',
                'controller': 'guest_contact_list_controller'
            })

            .when('/manager/guest/contact/view/:contactId', {
                'templateUrl': 'ui/view-manager-guest-contactlist.html',
                'controller': 'view_manager_guest_contactlist_controller'
            })

            .when('/manager/guest/contact/:contactId/delete', {
                'templateUrl': 'ui/delete-guest-contact-list.html',
                'controller': 'delete_guest_contact_list_controller'
            })


            .when('/manager/guest/contact/create', {
                'templateUrl': 'ui/create-guest-contact.html',
                'controller': 'create_guest_contact_controller'
            })
            .when('/guest/:guestId', {
                'templateUrl': 'ui/guest-detail.html',
                'controller': 'guest_detail_controller'
            })

            .when('/manager/guest/contact/:contactId/update', {
                'templateUrl': 'ui/update-guest-contact-list.html',
                'controller': 'update_guest_contact_list_controller'
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
manager_app.controller('guest_list_controller', function ($scope, $http, $routeParams, localStorageService) {

    $scope.guests = {};

    $http({
        url: 'http://localhost:8080/api/guest/all',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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

manager_app.controller('guest_details_controller', function ($scope, $http, $routeParams, localStorageService,$timeout) {

    $scope.guest_detail = {};
    $scope.assign_card_flag=true;
    $scope.guest_image_list;
    $scope.selected_guest_image;
    $scope.selected_guest_image_data;
    $scope.filename;
    $scope.ext;
    $scope.attach_image_flag = false;


    //check is guest is currently staying in the hotel or not.
    //if he/she stays then we can give assign him the card otherwise we can't assign the card.
    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/lateststay',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200 && (data.length!=0)) {
                 $scope.assign_card_flag=false;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });




    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_detail = data;
                console.log('guest details ::' + $scope.guest_detail);
                console.log('guest date of birth::' + new Date($scope.guest_detail.dob));

                //added 27-8-2014
                if($scope.guest_detail.guestImagePath!=null)
                {
                    $scope.ext = $scope.guest_detail.guestImagePath.substr($scope.guest_detail.guestImagePath.lastIndexOf('.') + 1);
                    $scope.filename = $scope.guest_detail.guestImagePath.substr(0, $scope.guest_detail.guestImagePath.lastIndexOf('.'));

                    //$scope.selected_guest_image is assigned to the saved file name so that we can view in the ui
                    $scope.selected_guest_image = $scope.guest_detail.guestImagePath;
                    console.log('file name from DataBase::' + $scope.filename);
                    console.log('file extension from DataBase::' + $scope.ext)

                    //call a method to get the guests saved image
                    $scope.viewImage($scope.filename, $scope.ext);
                    //end of added 27-8-2014
                }


            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    //added following method 27-8-2014
    //take the guest image file name from database and read that file from local system
    $scope.viewImage = function (filename, ext) {
        $http({
            url: 'http://localhost:8080/api/guest/image/' + filename + '/' + ext,
            method: 'get',
            headers: {
                'Authorization': localStorageService.get("auth")
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
//added below  27-8-2014
    //Find all images from the guest image directory
    $http({
        url: 'http://localhost:8080/api/guest/photos',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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
    //end of added 27-8-2014



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
                'Authorization': localStorageService.get("auth")
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

        $scope.save_status_message;
    }

    $scope.attachGuestImage = function () {
        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/image/' + $scope.filename + '/' + $scope.ext + '/update',
            method: 'get',
            headers: {
                'Authorization': localStorageService.get("auth")
            }
        }).
            success(function (data, status) {
                console.log('get success code::' + status);
                if (status == 200) {
                    console.log('image path is saved');
                   // $location.url('/checked-in-guest/list');
                    $scope.save_status_message='Image saved successfully';
                    console.log($scope.save_status_message);
                    $timeout(function () { $scope.save_status_message ='';console.log('after 1.2 seconds message is::'+$scope.save_status_message); }, 1200);
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }





});


<!--Create A Guest-->
manager_app.controller('create_guest_controller', function ($scope, $http, $routeParams, localStorageService, $location, ngDialog, sharedProperties) {

    $scope.guest = {};
    $scope.dob;
    $scope.hotel = {};
    $scope.hotel.id = localStorageService.get("user").hotel.id;
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
        if($scope.guest.passportNumber!=undefined)
        {
            if($scope.guest.passportNumber.length!=0)
            {
                console.log('unfocusing  with value::'+$scope.guest.passportNumber);

                $http({
                    url: 'http://localhost:8080/api/guest/passport/' + $scope.guest.passportNumber + '/details',
                    method: 'get',
                    headers: {
                        'Authorization': localStorageService.get("auth")
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

        }

    }

    $scope.OnIdBlur=function()
    {
        if( $scope.guest.idNumber!=undefined)
        {
            if($scope.guest.idNumber.length!=0)
            {
                $http({
                    url: 'http://localhost:8080/api/guest/uniqueid/' + $scope.guest.idNumber + '/details',
                    method: 'get',
                    headers: {
                        'Authorization': localStorageService.get("auth")
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

        }


    }

    $scope.onIdChange=function()
    {
        console.log('on id change method');
        if($scope.guest.idNumber.length==0)
        {
            $scope.id_validator_flag = true;
        }
    }

    $scope.onPassportChange=function()
    {
        console.log('on passport change method');
        if($scope.guest.passportNumber.length==0)
        {
            $scope.passport_validator_flag = true;
        }
    }


    $scope.create = function (app_form) {

        //check if form is valid or not
        if (!app_form.$valid) {
            return;
        }

        //check if passport no is valid or not
        if ($scope.passport_validator_flag == false) {
            $scope.open_passport_popup();
            console.log('Duplicate passport no found');
             return;
        }

        //check if user id is valid or not
        if ($scope.id_validator_flag == false) {
            $scope.open_id_popup();
            console.log('duplicate id no found');
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
                'Authorization': localStorageService.get("auth")
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



manager_app.controller('passport_popup_controller', function ($scope, $http, $routeParams, localStorageService, sharedProperties) {

    $scope.guest_profile_data;
    $scope.flag=true;
    $scope.getValue = function () {
        $scope.guest_profile_data = sharedProperties.getProperty();
        $scope.flag=false;
    }

});


manager_app.controller('id_popup_controller', function ($scope, $http, $routeParams, localStorageService, sharedProperties) {

    $scope.guest_profile_data;
    $scope.flag=true;
    $scope.getValue = function () {
        $scope.guest_profile_data = sharedProperties.getProperty();
        $scope.flag=false;
    }

});


manager_app.controller('update_details_controller', function ($scope, localStorageService, $routeParams, $http, $location, ngDialog,sharedProperties) {
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
            'Authorization': localStorageService.get("auth")
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
                'Authorization': localStorageService.get("auth")
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
                "Please Fill All Required Fields !!</h4>" +
                '</body>', plain: true,
            className: 'ngdialog-theme-default'
        });
    }


    $scope.onPassportChange=function()
    {
        if($scope.guest_detail.passportNumber.length==0)
        {
            $scope.passport_validator_flag=true;
        }
    }

    $scope.onIdChange=function()
    {
        if($scope.guest_detail.idNumber.length==0)
        {
            $scope.id_validator_flag=true;
        }
    }


    $scope.checkPassport = function () {

        if($scope.guest_detail.passportNumber!=undefined)
        {
            if($scope.guest_detail.passportNumber.length!=0)
            {
                console.log('ckecking the passport');
                $http({
                    url: 'http://localhost:8080/api/guest/passport/' + $scope.guest_detail.passportNumber + '/details',
                    method: 'get',
                    headers: {
                        'Authorization': localStorageService.get("auth")
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
        }

    }


    $scope.checkUniqueId = function () {
        if($scope.guest_detail.idNumber!=undefined)
        {
            if($scope.guest_detail.idNumber.length!=0)
            {
                console.log('ckecking the id');
                $http({
                    url: 'http://localhost:8080/api/guest/uniqueid/' + $scope.guest_detail.idNumber + '/details',
                    method: 'get',
                    headers: {
                        'Authorization': localStorageService.get("auth")
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
        }


    }


});


<!--View guest Preference data-->

manager_app.controller('view_guest_preference_data_controller', function ($scope, $http, $routeParams, localStorageService) {

    $scope.guest_data = {};

    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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

manager_app.controller('add_guest_preference_controller', function ($scope, $http,ngDialog, $routeParams, localStorageService, $location,sharedPreferenceProperties) {

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
            'Authorization': localStorageService.get("auth")
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
                'Authorization': localStorageService.get("auth")
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
                'Authorization': localStorageService.get("auth")
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
                'Authorization': localStorageService.get("auth")
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


manager_app.controller('update_preference_popup_controller', function ($scope, $http,ngDialog, $routeParams, localStorageService, $location,sharedPreferenceProperties) {
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
                'Authorization': localStorageService.get("auth")
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


<!--View guest stay details-->

manager_app.controller('view_guest_stay_details_controller', function ($scope, $http, $routeParams, localStorageService) {

    $scope.guest_stay_detail = {};

    $scope.guest_profile_detail = {};


    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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
            'Authorization': localStorageService.get("auth")
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
manager_app.controller('add_stay_details_controller', function ($scope, $http, $routeParams, localStorageService, $location) {

    console.log('add stay detail controller is loaded');
    $scope.current_user_hotel_id = localStorageService.get("user").hotel.id;
    $scope.current_hotel = localStorageService.get("user").hotel;
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

    $scope.update_flag=false;
    $scope.update_page_flag=false;

    $http({
        url: 'http://localhost:8080/api/guest/'+ $routeParams.guestId + '/lateststay ',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                if(data.id != undefined)
                {
                    console.log('guest stay is found');
                    $scope.guest_history=data;

                    $scope.guest_rooms=data;
                    //bind model
                    $scope.arrival_date=new Date(data.arrivalTime).getDate().toString();
                    $scope.arrival_year=new Date(data.arrivalTime).getFullYear().toString();
                    $scope.arrival_month=new Date(data.arrivalTime).getMonth().toString();

                    $scope.arrival_time=$scope.arrival_year+'-'+("0"+(new Date(data.arrivalTime).getMonth() +1)).slice(-2)+'-'+$scope.arrival_date;


                    $scope.arrival_hour=new Date(data.arrivalTime).getHours().toString();
                    $scope.arrival_min=new Date(data.arrivalTime).getMinutes().toString();
                    $scope.arrival_sec=new Date(data.arrivalTime).getSeconds().toString();
                    $scope.arrival_millisec=new Date(data.arrivalTime).getMilliseconds().toString();
                    $scope.startTime=("0"+(new Date(data.arrivalTime).getHours())).slice(-2)+":"+("0"+(new Date(data.arrivalTime).getMinutes())).slice(-2);

                    //$scope.departure_time=data.departureTime;

                    $scope.departure_date=new Date(data.departureTime).getDate().toString();
                    $scope.departure_year=new Date(data.departureTime).getFullYear().toString();
                    $scope.departure_month=new Date(data.departureTime).getMonth().toString();
                    $scope.departure_time=$scope.departure_year+'-'+("0"+(new Date(data.departureTime).getMonth() +1)).slice(-2)+'-'+$scope.departure_date;

                    $scope.departure_hour=new Date(data.departureTime).getHours().toString();
                    $scope.departure_min=new Date(data.departureTime).getMinutes().toString();
                    $scope.departure_sec=new Date(data.departureTime).getSeconds().toString();
                    $scope.departure_millisec=new Date(data.departureTime).getMilliseconds().toString();
                    $scope.endTime=("0"+(new Date(data.departureTime).getHours())).slice(-2)+":"+("0"+(new Date(data.departureTime).getMinutes())).slice(-2);



                    $scope.update_page_flag=true;
                    $scope.update_flag=true;
                    $scope.button_flag=false;
                    $scope.assigned_rooms=data.rooms;
                    $scope.allFreeRooms();

                }

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });



    $scope.getLatestStay=function()
    {
        $http({
            url: 'http://localhost:8080/api/guest/'+ $routeParams.guestId + '/lateststay ',
            method: 'get',
            headers: {
                'Authorization': localStorageService.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    if(data.id != undefined)
                    {
                        $scope.assigned_rooms=data.rooms;

                    }

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }





    //get all available rooms
    $scope.allFreeRooms=function()
    {
        console.log('get free rooms');
        $http({
            url: 'http://localhost:8080/api/hotel/' + $scope.current_user_hotel_id + '/rooms',
            method: 'post',
            headers: {
                'Authorization': localStorageService.get("auth")
            },
            data:$scope.guest_history
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.available_hotel_rooms = data;
                    console.log('get all available rooms::'+$scope.available_hotel_rooms);
                    $scope.preCalculated1();


                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }


    //pre calculation for room extending

    $scope.preCalculated2=function()
    {
        var temp=[];
        var j;
        var i;
        var size=$scope.available_hotel_rooms.length;
        console.log('pre calculated');
        for(i=0;i<$scope.assigned_rooms.length;i++)
        {
            console.log('first for loop');
            for(j=0;j<$scope.available_hotel_rooms.length;j++)
            {
                console.log('value of j::'+j);

                if($scope.assigned_rooms[i].id==$scope.available_hotel_rooms[j].id)
                {
                    console.log('removed element from left'+$scope.available_hotel_rooms[j].roomNumber);
                    $scope.available_hotel_rooms.splice(j,1);
                    console.log('available hotel room length::'+$scope.available_hotel_rooms.length);
                    break;
                }
                else if(j==$scope.available_hotel_rooms.length-1)
                {
                    temp.push($scope.assigned_rooms[i]);
                    //$scope.assigned_rooms.splice(i,1);
                    console.log('pushed elememt::'+$scope.assigned_rooms[i].roomNumber);
                }

            }
            console.log('value of j last::'+j);

            /* if(j==$scope.available_hotel_rooms.length)
             {
             temp.push($scope.assigned_rooms[i]);
             //$scope.assigned_rooms.splice(i,1);
             console.log('pushed elememt::'+$scope.assigned_rooms[i].roomNumber);
             }*/

        }



        for(var k=0;k<temp.length;k++)
        {
            console.log('second for loop');
            for(var l=0;l<$scope.assigned_rooms.length;l++)
            {
                if(temp[k].id==$scope.assigned_rooms[l].id)
                {
                    $scope.assigned_rooms.splice(l,1);
                }
            }
        }
    }


//pre calculation for change room
    $scope.preCalculated1=function()
    {
        var temp=[];
        var j;
        var i;
        var size=$scope.available_hotel_rooms.length;
        console.log('pre calculated');
        for(i=0;i<$scope.assigned_rooms.length;i++)
        {
            console.log('first for loop');
            for(j=0;j<$scope.available_hotel_rooms.length;j++)
            {
                console.log('value of j::'+j);

                if($scope.assigned_rooms[i].id==$scope.available_hotel_rooms[j].id)
                {
                    console.log('removed element from left'+$scope.available_hotel_rooms[j].roomNumber);
                    $scope.available_hotel_rooms.splice(j,1);
                    console.log('available hotel room length::'+$scope.available_hotel_rooms.length);
                    break;
                }
            }
            console.log('value of j last::'+j);

            /*if(j==$scope.available_hotel_rooms.length)
             {
             temp.push($scope.assigned_rooms[i]);
             //$scope.assigned_rooms.splice(i,1);
             console.log('pushed elememt::'+$scope.assigned_rooms[i].roomNumber);
             }*/

        }



        /*for(var k=0;k<temp.length;k++)
         {
         console.log('second for loop');
         for(var l=0;l<$scope.assigned_rooms.length;l++)
         {
         if(temp[k].id==$scope.assigned_rooms[l].id)
         {
         $scope.assigned_rooms.splice(l,1);
         }
         }
         }*/
    }











//switch the vie when arrival date or departure date is changed
    $scope.onChangeArrivalOrDepartureDate=function()
    {
        /*$scope.button_flag=true;
         $scope.room_flag=false;
         //$scope.update_flag=false;*/

        $scope.button_flag=true;
        $scope.room_flag=false;
        $scope.update_flag=false;

        $scope.getLatestStay();



    }




//get all available rooms when button is clicked
    $scope.gsh={};
    $scope.guest={};
    $scope.button_flag=true;
    $scope.room_flag=false;

    $scope.getAvailableRooms=function(app_form)
    {
        console.log('get all available rooms');
        if(!app_form.$valid)
        {
            return;
        }
        else{
            //$scope.gsh.arrivalTime=$scope.arrival_time;
            //$scope.gsh.departureTime=$scope.departure_time;

            var arr_date=new Date($scope.arrival_time).getDate().toString();
            var arr_year=new Date($scope.arrival_time).getFullYear().toString();
            var arr_month=new Date($scope.arrival_time).getMonth().toString();


            if($scope.startTime==undefined)
            {
                $scope.gsh.arrivalTime = new Date(arr_year,arr_month,arr_date,14,00,00);
            }
            else
            {
                var arr_hour=$scope.startTime.toString().split(':');
                console.log('hour in add is:::'+arr_hour[0]);
                $scope.gsh.arrivalTime = new Date(arr_year,arr_month,arr_date,arr_hour[0],arr_hour[1],00);
            }

            var dep_date=new Date($scope.departure_time).getDate().toString();
            var dep_year=new Date($scope.departure_time).getFullYear().toString();
            var dep_month=new Date($scope.departure_time).getMonth().toString();

            if($scope.endTime ==undefined)
            {
                $scope.gsh.departureTime = new Date(dep_year,dep_month,dep_date,11,30,00);

            }
            else
            {
                var dep_hour=$scope.endTime.toString().split(':');
                console.log('hour in add is:::'+dep_hour[0]);
                $scope.gsh.departureTime = new Date(dep_year,dep_month,dep_date,dep_hour[0],dep_hour[1],00);
            }
            //

            $scope.guest.id=$routeParams.guestId;
            $scope.gsh.guest=$scope.guest;

            console.log('get all available rooms');

            $http({
                url: 'http://localhost:8080/api/hotel/' + $scope.current_user_hotel_id + '/rooms',
                method: 'post',
                headers: {
                    'Authorization': localStorageService.get("auth")
                },
                data:$scope.gsh
            }).
                success(function (data, status) {
                    if (status == 200) {
                        $scope.available_hotel_rooms = data;

                        // $scope.assigned_rooms=$scope.guest_history.rooms;
                        //$scope.assigned_rooms=$scope.guest_rooms.rooms;
                        //$scope.getLatestStay();

                        console.log('get available room button is clicked');
                        //console.log('assigned room length:'+$scope.assigned_rooms.length);
                        //console.log('guest history room length:'+$scope.guest_history.rooms.length);

                        //added 1:41PM

                        if($scope.update_page_flag==true)
                        {
                            $scope.button_flag=false;
                            $scope.room_flag=false;
                            $scope.update_flag=true;
                        }
                        else{
                            $scope.button_flag=false;
                            $scope.room_flag=true;
                        }

                        /*$scope.room_flag=true;
                         $scope.button_flag=false;
                         $scope.update_flag=true;*/
                        // $scope.allFreeRooms();
                        $scope.preCalculated2();

                    } else {
                        console.log('status:' + status);
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }
    }
    $scope.add = function () {
        console.log('adding stay details');

        $scope.arrival_date1=new Date($scope.arrival_time).getDate().toString();
        $scope.arrival_year1=new Date($scope.arrival_time).getFullYear().toString();
        $scope.arrival_month1=new Date($scope.arrival_time).getMonth().toString();

        if($scope.startTime==undefined)
        {
            $scope.stay_detail.arrivalTime = new Date($scope.arrival_year1,$scope.arrival_month1,$scope.arrival_date1,14,00,00);

        }
        else
        {
            var arrival_hour=$scope.startTime.toString().split(':');
            console.log('hour in add is:::'+arrival_hour[0]);
            $scope.stay_detail.arrivalTime = new Date($scope.arrival_year1,$scope.arrival_month1,$scope.arrival_date1,arrival_hour[0],arrival_hour[1],00);

        }


        $scope.departure_date1=new Date($scope.departure_time).getDate().toString();
        $scope.departure_year1=new Date($scope.departure_time).getFullYear().toString();
        $scope.departure_month1=new Date($scope.departure_time).getMonth().toString();

        if($scope.endTime==undefined)
        {
            $scope.stay_detail.departureTime = new Date($scope.departure_year1,$scope.departure_month1,$scope.departure_date1,11,30,00);

        }
        else
        {
            var departure_hour=$scope.endTime.toString().split(':');
            console.log('hour in add is:::'+departure_hour[0]);
            $scope.stay_detail.departureTime = new Date($scope.departure_year1,$scope.departure_month1,$scope.departure_date1,departure_hour[0],departure_hour[1],00);
        }

        $scope.stay_detail.hotel = $scope.current_hotel;
        $scope.stay_detail.rooms = $scope.y.available_hotel_rooms;


        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/addstaydetails',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorageService.get("auth")
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


//before update we have to push and pop
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


    $scope.update = function () {
        if($scope.arrival_time== undefined)
        {
            var arr_date=new Date($scope.guest_history.arrivalTime).getDate().toString();
            var arr_year=new Date($scope.guest_history.arrivalTime).getFullYear().toString();
            var arr_month=new Date($scope.guest_history.arrivalTime).getMonth().toString();

            var arr_hour=$scope.startTime.toString().split(':');
            console.log('hour in add is:::'+arr_hour[0]);
            $scope.stay_detail.arrivalTime = new Date(arr_year,arr_month,arr_date,arr_hour[0],arr_hour[1],00);
        }else
        {
            var arr_date=new Date($scope.arrival_time).getDate().toString();
            var arr_year=new Date($scope.arrival_time).getFullYear().toString();
            var arr_month=new Date($scope.arrival_time).getMonth().toString();

            var arr_hour=$scope.startTime.toString().split(':');
            console.log('hour in add is:::'+arr_hour[0]);
            $scope.stay_detail.arrivalTime = new Date(arr_year,arr_month,arr_date,arr_hour[0],arr_hour[1],00);


        }


        if($scope.departure_time== undefined)
        {
           // $scope.stay_detail.departureTime = new Date($scope.guest_history.departureTime);
             var dep_date=new Date($scope.guest_history.departureTime).getDate().toString();
             var dep_year=new Date($scope.guest_history.departureTime).getFullYear().toString();
             var dep_month=new Date($scope.guest_history.departureTime).getMonth().toString();

             var dep_hour=$scope.endTime.toString().split(':');
             console.log('hour in add is:::'+dep_hour[0]);
            $scope.stay_detail.departureTime = new Date(dep_year,dep_month,dep_date,dep_hour[0],dep_hour[1],00);

        }
        else
        {
            //$scope.stay_detail.departureTime=$scope.departure_time;
            var dep_date=new Date($scope.departure_time).getDate().toString();
            var dep_year=new Date($scope.departure_time).getFullYear().toString();
            var dep_month=new Date($scope.departure_time).getMonth().toString();

            var dep_hour=$scope.endTime.toString().split(':');
            console.log('hour in add is:::'+dep_hour[0]);
            $scope.stay_detail.departureTime = new Date(dep_year,dep_month,dep_date,dep_hour[0],dep_hour[1],00);

        }

        $scope.stay_detail.hotel = $scope.current_hotel;
        $scope.stay_detail.rooms = $scope.assigned_rooms;

        $http({
            url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/updatestaydetails',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorageService.get("auth")
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

<!--View guest Room Card  data-->

manager_app.controller('view_guest_room_card_controller', function ($scope, $http, $routeParams, localStorageService) {

    $scope.guest_cards;
    $scope.guest_detail = {};


    //get a guest detail
    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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
            'Authorization': localStorageService.get("auth")
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
manager_app.controller('maintain_room_key_cards_controller', function ($scope, $http, $routeParams, localStorageService, $location) {

    $scope.guest_id = $routeParams.guestId;
    $scope.guest_detail;
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


    //get the guest profile detail.

    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/details',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guest_detail=data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });



    //get all cards given to a guest.
    $http({
        url: 'http://localhost:8080/api/guest/' + $routeParams.guestId + '/roomcarddetails',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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
            'Authorization': localStorageService.get("auth")
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
                'Authorization': localStorageService.get("auth")
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
                'Authorization': localStorageService.get("auth")
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
                'Authorization': localStorageService.get("auth")
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

manager_app.controller('guest_contact_list_controller', function ($scope, localStorageService, $routeParams, $http) {
    console.log('guest_contact_list_controller of manager app module is loaded');

    $scope.contact_list;
    $scope.current_user_id = localStorageService.get("user").id;


    <!-- get all contacts -->
    $http({
        url: 'http://localhost:8080/api/users/' + $scope.current_user_id + '/guest/contacts',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.contact_list = data;
                console.log('all contacts ::' + $scope.contact_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


});

manager_app.controller('create_guest_contact_controller', function ($scope, localStorageService, $routeParams, $http, $location, ngDialog) {
    console.log('create_guest_contact_controller of manager app module is loaded');
    $scope.guest_contact = {};
    $scope.assigned_touch_point_list;
    $scope.guest_list;
    $scope.selected_touch_points = [];
    $scope.selected_guests = [];
    $scope.touch_point = {};
    $scope.guest = {};

    $scope.contactlist={};
    $scope.contactlist_validation_flag=true;


//    $scope.contact={};


    $scope.OnContactListNameBlur=function()
    {
//        $scope.contact.id=$scope.contactlist.owner.id;
//        $scope.contact.name=$scope.guest_contact.name;
        console.log('inside OnContactListNameBlur contact name:'+$scope.guest_contact.name);
        $http({
            url: 'http://localhost:8080/api/manager/' +localStorageService.get("user").id + '/contactlistname',
            method: 'get',
            headers: {
                'Authorization': localStorageService.get("auth")
            }
        }).
            success(function (data, status) {

                $scope.contact_list=data;
                console.log("success contact list name url::"+$scope.contact_list);


                for (var i = 0; i < $scope.contact_list.length; i++) {

                    console.log("contact_list names::"+i + $scope.contact_list[i]);

                    if ($scope.contact_list[i].toLowerCase() == $scope.guest_contact.name.toLowerCase()) {
                        console.log("ngmodel data and database data are matched");
                        $scope.contactlist_validation_flag=false;
                        $scope.open_contactlist_popup();
                        return;

                    }else{
                        $scope.contactlist_validation_flag=true;
                    }

                }

            })
            .error(function (error) {
                console.log(error);
            });
    }



    <!-- get all assigned touch points -->
    $http({
        url: 'http://localhost:8080/api/login/touchpoints',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::' + status);
            if (status == 200) {
                $scope.assigned_touch_point_list = data;
                console.log('All Touch Points::' + $scope.assigned_touch_point_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!-- get all guests in the hotel -->

    $http({
        url: 'http://localhost:8080/api/guests',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::' + status);
            if (status == 200) {
                $scope.guest_list = data;
                console.log('All Touch Points::' + $scope.guest_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.onSelectTouchPoint = function (touchpoint_id) {
        console.log('touch point with Id::' + touchpoint_id + ' is clicked');

        for (var i = 0; i < $scope.selected_touch_points.length; i++) {

            if ($scope.selected_touch_points[i].touchPoint.id == touchpoint_id) {
                $scope.selected_touch_points.splice(i, 1);
                return;
            }
        }
        //$scope.touch_point.push({"id":touchpoint_id});
        $scope.touch_point.id = touchpoint_id;
        $scope.selected_touch_points.push({"touchPoint": $scope.touch_point});
        $scope.touch_point = {};

    };


    $scope.onSelectGuest = function (guest_id) {
        console.log('guest with Id::' + guest_id + ' is clicked');

        for (var i = 0; i < $scope.selected_guests.length; i++) {

            if ($scope.selected_guests[i].guest.id == guest_id) {
                $scope.selected_guests.splice(i, 1);
                return;
            }
        }
        $scope.guest.id = guest_id;
        $scope.selected_guests.push({"guest": $scope.guest});
        $scope.guest = {};

    };


    $scope.create = function () {

        if ($scope.contactlist_validation_flag == false) {
            $scope.open_contactlist_popup();
            return;
        }

        console.log('no of touchpoint selected::' + $scope.selected_touch_points.length);
        console.log('no of guest selected::' + $scope.selected_guests.length)

        $scope.guest_contact.contactListTouchPoints = $scope.selected_touch_points;
        $scope.guest_contact.contactListGuests = $scope.selected_guests;
        $scope.guest_contact.owner = localStorageService.get('user');
        console.log('create the guest contact list');

        $http({
            url: 'http://localhost:8080/api/guest/contact/create',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorageService.get("auth")
            },
            data: $scope.guest_contact
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('Guest contact created successfully');
                    console.log($scope.guest_contact.name);
                    $location.url('/manager/guest/contacts');


                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }

    $scope.open_contactlist_popup = function(){
        console.log('pop function is calling');
        ngDialog.open({
            template: '<body style="text-align:center;color: RED;"><h4>' +
                'This list name is already exist!!</h4>' +
                '</body>',
            plain:true,
            className:'ngdialog-theme-default'

        });
    }






});

manager_app.controller('view_manager_guest_contactlist_controller', function ($scope, localStorageService, $routeParams, $http) {

    $scope.contactlist;

    $http({
        url: 'http://localhost:8080/api/guest/contacts/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.contactlist = data;
                console.log('contact details ::' + $scope.contactlist);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});


manager_app.controller('delete_guest_contact_list_controller', function ($scope, localStorageService, $routeParams, $http, $location) {
    console.log('delete guest contact list controller is loaded');

    $scope.contactlist;

    <!--view contact details-->
    $http({
        url: 'http://localhost:8080/api/guest/contacts/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.contactlist = data;
                console.log('contact details ::' + $scope.contactlist);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.delete = function () {

        $http({
            url: 'http://localhost:8080/api/guest/contacts/' + $routeParams.contactId + '/delete',
            method: 'put',
            headers: {
                'Authorization': localStorageService.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('contact is deleted');
                    $location.url('manager/guest/contacts');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
        console.log('deleted......');

    }

});


manager_app.controller('current_guest_location_controller', function ($scope, $http, $location, localStorageService, $routeParams, $window) {
    console.log('current guest location  controller is loaded');
    $scope.guest_id = $routeParams.guestId;
    $scope.guest_current_position;
    $scope.current_guest_location_history;
    $scope.guest_detail;
    $scope.flag=false;

    <!-- get guest detail by guests id  -->
    $scope.room_message='';
    $scope.rooms={};

    $http({
        url: 'http://localhost:8080/api/guest/' + $scope.guest_id,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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

                $scope.room_message=$scope.room_message.trim();
                $scope.room_message=$scope.room_message.substr(1,$scope.room_message.length-1);
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
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('current guest location is returned from the server');

            if (status == 200 && data.length !=0) {
                console.log('data coming length::'+data.length);
                $scope.guest_current_position = data;
                console.log('current guest position detail ::' + $scope.guest_current_position);
                for(var i=0;i<$scope.guest_current_position.length;i++)
                {
                    console.log('current location@@@@'+$scope.guest_current_position[i]);
                    $scope.location_message=$scope.location_message+' , '+$scope.guest_current_position[i].zoneId;
                }
                $scope.location_message=$scope.location_message.trim();
                $scope.location_message=$scope.location_message.substr(1,$scope.location_message.length-1);
                console.log('currently found locations::'+$scope.location_message);

            } else {
                console.log('status on success:' + status);
               // $scope.location_message='No where';
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
                'Authorization': localStorageService.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.current_guest_location_history = data;
                    console.log('current guest location history ::' + $scope.current_guest_location_history);
                    console.log('current guest location history length'+$scope.current_guest_location_history.length);
                    if($scope.current_guest_location_history.length==0)
                    {
                      $scope.flag=true;
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


manager_app.controller('checkedin_guest_controller', function ($scope, $http, $location, localStorageService, $routeParams, $window) {
    console.log('manager checkedin guest controller is loaded');

    $scope.checkedin_guest_list;
    $scope.hotel_id = localStorageService.get("user").hotel.id;

    <!--  get all checkedin guest list -->
    $http({
        url: 'http://localhost:8080/api/hotels/' + $scope.hotel_id + '/guests/checkedIn',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
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


manager_app.controller('touch_point_setup_list_controller', function ($scope, $http, $location, localStorageService, $routeParams, $window) {
    console.log('manager touchpoint setup  list controller is loaded');

    $scope.touch_point_setups;
    $scope.current_touch_point_id = $routeParams.tpId;
    $scope.current_setup = {};

    $scope.testModel = -1;

    <!-- get current setup detail -->
    $http({
        url: 'http://localhost:8080/api/touchpoint/' + $scope.current_touch_point_id + '/setups/current',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.current_setup = data;
                console.log('current setup name::' + $scope.current_setup.setupName);
                $scope.testModel = $scope.current_setup.id;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    <!-- get all setups by touchpointid -->

    $http({
        url: 'http://localhost:8080/api/tp/' + $routeParams.tpId + '/setups',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.touch_point_setups = data;
                console.log('touch point setups::' + $scope.touch_point_setups);
                console.log($scope.touch_point_setups.length);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.setCurrentSetup = function () {
        console.log('set current setup method is called');

        $http({
            url: 'http://localhost:8080/api/touchpoint/' + $scope.current_touch_point_id + '/setup/' + $scope.testModel,
            method: 'get',
            headers: {
                'Authorization': localStorageService.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('setup successfully done');
                    $location.url('manager/touchpoint/list');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    };
});


manager_app.controller('manager_app_controller', function ($scope, $http, $location, localStorageService, $window) {
    console.log('manager app controller is loaded');
    $scope.user;

    if (localStorageService.get("user") == null) {
        console.log("User is not authenticated");
        $window.location.replace("login-app.html?manager-app.html" + $window.location.hash);
    } else {
        console.log("User is authenticated");
        $scope.user = localStorageService.get("user");
        if ($scope.user.userType.value != "ROLE_MANAGER") {
            $window.location.replace("index.html");
        }
    }


    $scope.logout = function () {
        console.log('logout method is called');
        localStorageService.remove("user");
        localStorageService.remove("auth");
        $window.location.replace("login-app.html");
    };
});


manager_app.controller('touch_point_controller', function ($scope, localStorageService, $http) {
    console.log('touch point controller of manager app module is loaded');
    $scope.assigned_touch_point_list = [];
    $scope.selected_touch_point;
    $scope.user_detail = localStorageService.get("user");
    console.log('current user id::' + $scope.user_detail.id);

    $http({
        url: 'http://localhost:8080/api/login/touchpoints',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::' + status);
            if (status == 200) {
                $scope.assigned_touch_point_list = data;
                console.log('All Touch Points::' + $scope.assigned_touch_point_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});

manager_app.controller('find_guest_controller', function ($scope, $http, $routeParams, $location, localStorageService) {
    console.log(' manager guest find controller is loaded');
    $scope.guest_list = [];

    $http({
        url: 'http://localhost:8080/api/touchpoints/' + $routeParams.TPId + '/guestCards',
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::' + status);
            if (status == 200) {
                $scope.guest_list = data;
                console.log('All Guest List::' + $scope.guest_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});


manager_app.controller('guest_detail_controller', function ($scope, $http, $routeParams, $location, localStorageService) {

    $scope.guest_detail;
    $scope.guest_id = $routeParams.guestId;
    console.log('guest detail controller is loaded...' + $scope.guest_id);


    $http({
        url: 'http://localhost:8080/api/guest/' + $scope.guest_id,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            console.log('get success code::' + status);
            if (status == 200) {
                $scope.guest_detail = data;
                console.log('Guest Detail::' + $scope.guest_detail);

                console.log($scope.guest_detail.arrivalTime);
                console.log($scope.guest_detail.departureTime);

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.back=function()
    {
        window.history.back();
    }

});


manager_app.controller('update_guest_contact_list_controller', function ($scope, localStorageService, $routeParams, $http, $location) {
    $scope.selected_TouchPoints;//model
    $scope.selected_Guest;//model
    $scope.name;//model

    $scope.touch_point = {};
    $scope.contactlist = {};
    $scope.touchPointsInContacts = {};
    $scope.touchPointsNotInContact = {};
    $scope.guestsInContact = {};
    $scope.guestNotInContact = {};
    $scope.current_touch_points = [];
    $scope.guest_contact = {};
    $scope.guest = {};
    $scope.current_guests = [];


    <!--view contact details-->
    $http({
        url: 'http://localhost:8080/api/guest/contacts/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.contactlist = data;
                $scope.name = $scope.contactlist.name;
                console.log('contact details ::' + $scope.contactlist);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    <!-- get all aguestlist  in contactlist -->
    $http({
        url: 'http://localhost:8080/api/guest/contactguests/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guestsInContact = data;
                console.log('contact details not in contacts ::' + $scope.guestsInContact);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!-- get all touchpoints  in contactlist -->
    $http({
        url: 'http://localhost:8080/api/guest/contacttp/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.touchPointsInContacts = data;
                console.log('contact details not in contacts ::' + $scope.touchPointsInContacts);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    <!-- get all guestlist not in contactlist -->
    $http({
        url: 'http://localhost:8080/api/guest/notincontacts/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.guestNotInContact = data;
                console.log('contact details not in contacts ::' + $scope.guestNotInContact);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    <!-- get all touchpoints not in contactlist -->
    $http({
        url: 'http://localhost:8080/api/guest/notselecttp/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': localStorageService.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.touchPointsNotInContact = data;
                console.log('contact details not in contacts ::' + $scope.touchPoints);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    <!--TODO: Handle Proper add and remove from the element for touchpoints -->
    $scope.pushTouchPointToRight = function () {
        console.log('selected touchpoint::' + $scope.selected_TouchPoints.name);
        if ($scope.selected_TouchPoints != null) {

            for (var i = 0; i < $scope.touchPointsInContacts.length; i++) {

                if ($scope.touchPointsInContacts[i].id == $scope.selected_TouchPoints.id) {
                    $scope.touchPointsInContacts.splice(i, 1);
                    $scope.touchPointsNotInContact.push($scope.selected_TouchPoints);
                    return;
                }
            }
        }

    }

    $scope.pushTouchPointToLeft = function () {
        console.log($scope.selected_TouchPoints);
        if ($scope.selected_TouchPoints != null) {
            for (var i = 0; i < $scope.touchPointsNotInContact.length; i++) {

                if ($scope.touchPointsNotInContact[i].id == $scope.selected_TouchPoints.id) {
                    $scope.touchPointsNotInContact.splice(i, 1);
                    $scope.touchPointsInContacts.push($scope.selected_TouchPoints);
                    console.log($scope.touchPointsInContacts);
                    return;
                }
            }
            console.log($scope.touchPointsInContacts);
        }
    }


    <!--TODO: Handle Proper add and remove from the element for guestlist -->
    $scope.pushGuestToRight = function () {
        // console.log('selected guest::' + $scope.selected_TouchPoints.name);
        if ($scope.selected_Guest != null) {

            for (var i = 0; i < $scope.guestsInContact.length; i++) {

                if ($scope.guestsInContact[i].id == $scope.selected_Guest.id) {
                    $scope.guestsInContact.splice(i, 1);
                    $scope.guestNotInContact.push($scope.selected_Guest);
                    return;
                }
            }
        }

    }

    $scope.pushGuestToLeft = function () {
        //console.log($scope.selected_TouchPoints);
        if ($scope.selected_Guest != null) {
            for (var i = 0; i < $scope.guestNotInContact.length; i++) {

                if ($scope.guestNotInContact[i].id == $scope.selected_Guest.id) {
                    $scope.guestNotInContact.splice(i, 1);
                    $scope.guestsInContact.push($scope.selected_Guest);
                    return;
                }
            }

        }
    }


    //creating and formating  the object before update
    $scope.preUpdate = function () {
        for (var i = 0; i < $scope.touchPointsInContacts.length; i++) {
            $scope.touch_point.id = $scope.touchPointsInContacts[i].id;
            $scope.current_touch_points.push({"touchPoint": $scope.touch_point});
            $scope.touch_point = {};
        }
        console.log("current touchpoints list size", $scope.current_touch_points.length);


        for (var i = 0; i < $scope.guestsInContact.length; i++) {
            $scope.guest.id = $scope.guestsInContact[i].id;
            $scope.current_guests.push({"guest": $scope.guest});
            $scope.guest = {};
        }
    }


    $scope.update = function () {
        //get the formatted data
        $scope.preUpdate();

        //bind the formatted object
        $scope.guest_contact.name = $scope.name;
        $scope.guest_contact.contactListTouchPoints = $scope.current_touch_points;
        $scope.guest_contact.contactListGuests = $scope.current_guests;
        $scope.guest_contact.owner = localStorageService.get('user');


        $http({
            // url: 'http://localhost:8080/api/guest/contact/create',
            url: 'http://localhost:8080/api/guest/contact/' + $routeParams.contactId + '/update',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorageService.get("auth")
            },
            data: $scope.guest_contact
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('Guest contact created successfully');
                    //console.log($scope.guest_contact.name);
                    $location.url('/manager/guest/contacts');


                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }
});





