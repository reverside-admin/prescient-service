/**
 * Created by Bibhuti on 2014/04/03.
 */
var manager_app = angular.module('manager_app', ['ngRoute', 'ngCookies']);


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
            .when('/hotels/guests/:guestId/location/history', {
                'templateUrl': 'ui/guest-location-history.html',
                'controller': 'current_guest_location_history_controller'
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
            .when('/checked-in-guest/list', {
                'templateUrl': 'ui/checked-in-guest-list.html',
                'controller': 'checked_in_guest_list_controller'
            })
            .when('/checked-in-guest/:guestId', {
                'templateUrl': 'ui/checked-in-guest-detail.html',
                'controller': 'checked-in-guest-detail'
            })
            .when('/manager/guest/contact/:contactId/update', {
                'templateUrl': 'ui/update-guest-contact-list.html',
                'controller': 'update_guest_contact_list_controller'
            })
            .when('/welcome', {
                'templateUrl': '/ui/welcome-page.html'
            })
            .otherwise({
                redirectTo: '/welcome'
            });
    }]);


manager_app.controller('current_guest_location_history_controller', function ($scope, $cookieStore, $routeParams, $http) {
    console.log('current_guest_location_history_controller of manager app module is loaded');
    $scope.guest_id = $routeParams.guestId;
    $scope.current_guest_location_history;

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


});


manager_app.controller('guest_contact_list_controller', function ($scope, $cookieStore, $routeParams, $http) {
    console.log('guest_contact_list_controller of manager app module is loaded');

    $scope.contact_list;
    $scope.current_user_id = $cookieStore.get("user").id;


    <!-- get all contacts -->
    $http({
        url: 'http://localhost:8080/api/users/' + $scope.current_user_id + '/guest/contacts',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
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

manager_app.controller('create_guest_contact_controller', function ($scope, $cookieStore, $routeParams, $http, $location) {
    console.log('create_guest_contact_controller of manager app module is loaded');
    $scope.guest_contact = {};
    $scope.assigned_touch_point_list;
    $scope.guest_list;
    $scope.selected_touch_points = [];
    $scope.selected_guests = [];
    $scope.touch_point = {};
    $scope.guest = {};

    <!-- get all assigned touch points -->
    $http({
        url: 'http://localhost:8080/api/login/touchpoints',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
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
            'Authorization': $cookieStore.get("auth")
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

        console.log('no of touchpoint selected::' + $scope.selected_touch_points.length);
        console.log('no of guest selected::' + $scope.selected_guests.length)


        $scope.guest_contact.contactListTouchPoints = $scope.selected_touch_points;
        $scope.guest_contact.contactListGuests = $scope.selected_guests;
        $scope.guest_contact.owner = $cookieStore.get('user');
        console.log('create the guest contact list');

        $http({
            url: 'http://localhost:8080/api/guest/contact/create',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
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


});


manager_app.controller('view_manager_guest_contactlist_controller', function ($scope, $cookieStore, $routeParams, $http) {

    $scope.contactlist;

    $http({
        url: 'http://localhost:8080/api/guest/contacts/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
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


manager_app.controller('delete_guest_contact_list_controller', function ($scope, $cookieStore, $routeParams, $http, $location) {
    console.log('delete guest contact list controller is loaded');

    $scope.contactlist;

    <!--view contact details-->
    $http({
        url: 'http://localhost:8080/api/guest/contacts/' + $routeParams.contactId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
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
                'Authorization': $cookieStore.get("auth")
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


manager_app.controller('current_guest_location_controller', function ($scope, $http, $location, $cookieStore, $routeParams, $window) {
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


manager_app.controller('checkedin_guest_controller', function ($scope, $http, $location, $cookieStore, $routeParams, $window) {
    console.log('manager checkedin guest controller is loaded');

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


manager_app.controller('touch_point_setup_list_controller', function ($scope, $http, $location, $cookieStore, $routeParams, $window) {
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
            'Authorization': $cookieStore.get("auth")
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
            'Authorization': $cookieStore.get("auth")
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
                'Authorization': $cookieStore.get("auth")
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


manager_app.controller('manager_app_controller', function ($scope, $http, $location, $cookieStore, $window) {
    console.log('manager app controller is loaded');
    $scope.user;

    if ($cookieStore.get("user") == null) {
        console.log("User is not authenticated");
        $window.location.replace("login-app.html?manager-app.html" + $window.location.hash);
    } else {
        console.log("User is authenticated");
        $scope.user = $cookieStore.get("user");
        if ($scope.user.userType.value != "ROLE_MANAGER") {
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


manager_app.controller('touch_point_controller', function ($scope, $cookieStore, $http) {
    console.log('touch point controller of manager app module is loaded');
    $scope.assigned_touch_point_list = [];
    $scope.selected_touch_point;
    $scope.user_detail = $cookieStore.get("user");
    console.log('current user id::' + $scope.user_detail.id);

    $http({
        url: 'http://localhost:8080/api/login/touchpoints',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
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

manager_app.controller('find_guest_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log(' manager guest find controller is loaded');
    $scope.guest_list = [];

    $http({
        url: 'http://localhost:8080/api/touchpoints/' + $routeParams.TPId + '/guestCards',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
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


manager_app.controller('guest_detail_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {

    $scope.guest_detail;
    $scope.guest_id = $routeParams.guestId;
    console.log('guest detail controller is loaded...' + $scope.guest_id);


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


manager_app.controller('checked_in_guest_list_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {

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


manager_app.controller('checked-in-guest-detail', function ($scope, $http, $routeParams, $location, $cookieStore) {
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





manager_app.controller('update_guest_contact_list_controller', function ($scope, $cookieStore, $routeParams, $http,$location) {
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
            'Authorization': $cookieStore.get("auth")
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
            'Authorization': $cookieStore.get("auth")
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
            'Authorization': $cookieStore.get("auth")
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
            'Authorization': $cookieStore.get("auth")
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
            'Authorization': $cookieStore.get("auth")
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
        $scope.guest_contact.owner = $cookieStore.get('user');


        $http({
            // url: 'http://localhost:8080/api/guest/contact/create',
            url:'http://localhost:8080/api/guest/contact/' + $routeParams.contactId + '/update',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
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





