/**
 * Created by Bibhuti on 2014/03/19.
 */
var admin_app = angular.module('admin_app', ['ngRoute', 'ngCookies']);

admin_app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/users/list', {
                'templateUrl': 'ui/user-list.html',
                'controller': 'list_users_controller'
            })
            .when('/users/accesscard', {
                'templateUrl': 'ui/access-card.html',
                'controller': 'access_card_controller'
            })
            .when('/users/accesscard/import', {
                'templateUrl': 'ui/import-access-cards.html',
                'controller': 'access_card_controller'
            })
            .when('/users/accesscard/register', {
                'templateUrl': 'ui/register-access-cards.html',
                'controller': 'access_card_controller'
            })
            .when('/users/touchpoint', {
                'templateUrl': 'ui/touchpoint-list.html',
                'controller': 'touch_point_controller'
            })
            .when('/touchpoint/setup/:setupId', {
                'templateUrl': 'ui/touchpoint-setup.html',
                'controller': 'touch_point_setup_controller'
            })

            .when('/touchpoint/:tpid/setups', {
                'templateUrl': 'ui/touchpoint-setup-list.html',
                'controller': 'setup_list_controller'
            })

            .when('/touchpoint/:tpId/setups/:setupId', {
                'templateUrl': 'ui/view-touchpoint-setup.html',
                'controller': 'setup_view_controller'
            })
            .when('/touchpoint/:tpId/setup/update/:setupId', {
                'templateUrl': 'ui/edit-touchpoint-setup.html',
                'controller': 'edit_setup_controller'
            })

            .when('/touchpoint/:tpId/setup/delete/:setupId', {
                'templateUrl': 'ui/delete-touchpoint-setup.html',
                'controller': 'delete_setup_controller'
            })
            .when('/users/create', {
                'templateUrl': 'ui/create-user.html',
                'controller': 'create_users_controller'
            })
            .when('/users/view/:userId', {
                'templateUrl': 'ui/view-user.html',
                'controller': 'view_users_controller'
            })
            .when('/users/reset/:userId/password', {
                'templateUrl': 'ui/reset-user-password.html',
                'controller': 'reset_users_controller'
            })
            .when('/users/update/:userId', {
                'templateUrl': 'ui/update-user.html',
                'controller': 'update_users_controller'
            })
            .when('/users/:userId/update/status/:userStatus', {
                'templateUrl': 'ui/delete-user.html',
                'controller': 'delete_users_controller'
            })
            .when('/users/:uId/departments/add', {
                'templateUrl': 'ui/add-department.html',
                'controller': 'add_departments_controller'
            })
            .when('/users/:uId/touchpoints/add', {
                'templateUrl': 'ui/add-touchpoint.html',
                'controller': 'add_touch_points_controller'
            })
            .when('/welcome', {
                'templateUrl': '/ui/welcome-page.html'

            })

            .otherwise({
                redirectTo: '/welcome'
            });
    }]);


admin_app.controller('admin_app_controller', function ($scope, $http, $location, $cookieStore, $window) {

    $scope.user;

    if ($cookieStore.get("user") == null) {
        console.log("User is not authenticated");
        $window.location.replace("login-app.html?admin-app.html" + $window.location.hash);
    } else {
        console.log("User is authenticated");
        $scope.user = $cookieStore.get("user");
        if ($scope.user.userType.value != "ROLE_ADMIN") {
            $window.location.replace("login-app.html");
        }
    }


    $scope.logout = function () {
        console.log('logout method is called');
        $cookieStore.remove("user");
        $cookieStore.remove("auth");
        $window.location.replace("login-app.html");
    };

});

<!--list user  controller -->
admin_app.controller('list_users_controller', function ($scope, $http, $routeParams, $cookieStore) {

    $scope.user_list = [];
    $scope.name = $routeParams.userName;
    $scope.user = {};
    $http({
        url: 'http://localhost:8080/api/users',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});

admin_app.controller('view_users_controller', function ($scope, $http, $routeParams, $cookieStore) {
    $scope.uId = $routeParams.userId;
    $scope.user_detail;
    $scope.can_reset_password = false;
    $scope.can_edit = false;


    $http({
        url: 'http://localhost:8080/api/users/' + $scope.uId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_detail = data;

                if ($scope.user_detail.userStatus.status == 'disable') {
                    $scope.can_reset_password = true;
                    $scope.can_edit = true;
                }
                if ($scope.user_detail.id == $cookieStore.get("user").id) {
                    $scope.can_reset_password = true;
                }
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});


admin_app.controller('update_users_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    $scope.uId = $routeParams.userId;
    $scope.user_status_list = [];
    $scope.user_type_list = [];
    $scope.hotel_list = [];

    $scope.assigned_department_list = [];
    $scope.not_assigned_department_list = [];

    $scope.user = {};

    <!-- get user details first -->
    $http({
        url: 'http://localhost:8080/api/users/' + $scope.uId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!-- get status -->
    $http({
        url: 'http://localhost:8080/api/status',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_status_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!-- get user type -->

    $http({
        url: 'http://localhost:8080/api/roles',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_type_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!-- get hotel list -->

    $http({
        url: 'http://localhost:8080/api/hotels',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.hotel_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    <!-- get all assigned departments -->
    $http({
        url: 'http://localhost:8080/api/hotels/' + $scope.uId + '/dept/having',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                console.log('All assigned department are retrieved');
                $scope.assigned_department_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!-- get all not assigned departments -->

    $http({
        url: 'http://localhost:8080/api/hotels/' + $scope.uId + '/dept/notHaving',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                console.log('All not assigned department are retrieved');
                $scope.not_assigned_department_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.update = function () {
        console.log('update');
        console.log($scope.user);
        $http({
            url: 'http://localhost:8080/api/users/update/' + $scope.uId,
            method: 'put',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.user


        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('User updated successfully');
                    $location.url('/users/list');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }


    $scope.cancel = function () {
        $location.url('/users/view/' + $scope.uId);
    }
});


admin_app.controller('create_users_controller', function ($scope, $http, $location, $cookieStore) {

    $scope.hotel_list = [];
    $scope.hotel_department_list = [];
    $scope.touch_point_list = [];
    $scope.user_type_list = [];
    $scope.user_status_list = [];
    $scope.selected_hotel_flag = true;
    $scope.user = {};
    $scope.checked_departments = [];
    $scope.checked_touch_points = [];

    $scope.onDepartmentSelection = function (department) {
        for (var i = 0; i < $scope.checked_departments.length; i++) {
            if ($scope.checked_departments[i].id == department.id) {
                $scope.checked_departments.splice(i, 1);
                $scope.getTouchPointsFromDepartments();
                return;
            }
        }
        $scope.checked_departments.push(department);
        $scope.getTouchPointsFromDepartments();
    };


    $scope.onTouchPointSelection = function (touch_point) {
        for (var i = 0; i < $scope.checked_touch_points.length; i++) {
            if ($scope.checked_touch_points[i].id == touch_point.id) {
                $scope.checked_touch_points.splice(i, 1);

            }
        }
        $scope.checked_touch_points.push(touch_point);

    };

    <!-- Get Role -->
    $http({
        url: 'http://localhost:8080/api/roles',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_type_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!--Get Status-->
    $http({
        url: 'http://localhost:8080/api/status',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_status_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!--Get Hotel-->
    $http({
        url: 'http://localhost:8080/api/hotels',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.hotel_list = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    <!-- Get Departments -->

    $scope.getDepartmentByHotelId = function () {
        $scope.checked_departments = [];
        $scope.hotel_department_list = [];
        $scope.touch_point_list = [];
        if ($scope.user.hotel.id == null) return;

        $http({
            url: 'http://localhost:8080/api/hotels/' + $scope.user.hotel.id + '/departments',
            method: 'get',
            headers: {
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.hotel_department_list = data;
                    console.log('Response data::' + data);
                    console.log('department list::' + $scope.hotel_department_list);
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    };

    <!-- get touchPoint list  of all selected departments-->
    $scope.getTouchPointsFromDepartments = function () {
        $scope.checked_touch_points = [];
        $http({
            url: 'http://localhost:8080/api/departments/touchpoints',
            method: 'post',
            headers: {
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.checked_departments
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.touch_point_list = data;
                    console.log('got touch point list:' + $scope.touch_point_list);

                } else {
                    console.log('status:' + status);
                    console.log('data coming::' + data);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    };


    $scope.create = function (my_form) {

        console.log('verified' + my_form);
        console.log(my_form.$valid);

        if (!my_form.$valid) return;

        console.log($scope.user);

        $scope.user.departments = $scope.checked_departments;
        $scope.user.touchPoints = $scope.checked_touch_points;

        $http({
            url: 'http://localhost:8080/api/users',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.user
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('User created successfully');
                    console.log($scope.user.userName);

                    $location.url('/users/list');

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    };

    $scope.cancel = function () {
        $location.url('/users/list');
    }


});


admin_app.controller('add_departments_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    $scope.dept_list_assigned = [];
    $scope.dept_list_not_assigned = [];
    $scope.selected_assigned_dept;
    $scope.selected_not_assigned_dept;


    console.log('add department controller is loaded');
    console.log('user id passed from URL is::' + $routeParams.uId);

    $http({
        url: 'http://localhost:8080/api/hotels/' + $routeParams.uId + '/dept/notHaving',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.dept_list_not_assigned = data;
                console.log('department list not assigned:' + $scope.dept_list_not_assigned);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $http({
        url: 'http://localhost:8080/api/hotels/' + $routeParams.uId + '/dept/having',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.dept_list_assigned = data;
                console.log('department list assigned:' + $scope.dept_list_assigned);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
    <!--TODO: Handle Proper push and pop from the element -->
    $scope.pushDataFromLeft = function () {
        console.log($scope.selected_not_assigned_dept);
        if ($scope.selected_not_assigned_dept != null) {
            $scope.dept_list_assigned.push($scope.selected_not_assigned_dept);
            $scope.dept_list_not_assigned.pop($scope.selected_not_assigned_dept);
        }

    }

    $scope.pushDataFromRight = function () {
        console.log($scope.selected_assigned_dept);
        if ($scope.selected_assigned_dept != null) {
            $scope.dept_list_not_assigned.push($scope.selected_assigned_dept);
            $scope.dept_list_assigned.pop($scope.selected_assigned_dept);
        }
    }


    $scope.addDepartments = function () {
        console.log('add departments......');
        $http({
            url: 'http://localhost:8080/api/users/assignDept/' + $routeParams.uId,
            method: 'put',
            headers: {'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")},
            data: $scope.dept_list_assigned
        }).
            success(function (data, status) {
                if (status == 201) {

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

});


admin_app.controller('delete_users_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log('delete user controller is loaded');
    $scope.confirm_flag = false;
    $scope.delete_button_status;
    $scope.delete_message;
    $scope.uId = $routeParams.userId;
    $scope.userStatus=$routeParams.userStatus;
    $scope.user_detail = {};
    $http({
        url: 'http://localhost:8080/api/users/' + $scope.uId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_detail = data;
                if ($scope.user_detail.userStatus.value == 'disable') {
                    $scope.delete_button_status = true;
                    $scope.delete_message = 'First make the user enable then Delete';
                }
                else {
                    $scope.delete_button_status = false;
                    $scope.delete_message = 'Are you sure to delete?';

                }


            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.delete = function () {

        if($routeParams.userStatus=='enable')
        {
            $scope.userStatus=1;
        }
        else{
            $scope.userStatus=0;
        }
        console.log('delete');

                $http({
            url: 'http://localhost:8080/api/users/' + $scope.uId + '/update/status/'+$scope.userStatus,
            method: 'get',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    $scope.delete_message = 'User Deleted Successfully';
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
                console.log(error.message);
                $scope.delete_message = error.message;
            });
    }
    $scope.cancel = function () {
        $location.url('/users/view/' + $scope.uId);
    }

    $scope.showDialog = function () {
        $scope.confirm_flag = true;
    }
});


admin_app.controller('access_card_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    $scope.reset_mode = false;
    $scope.content;
    $scope.magStripeNo;
    $scope.rfidTagNo;
    $scope.message;
    $scope.guest_cards;
    $scope.editable=true;
    $scope.access_card_detail = {};
    $scope.card_detail={};

    <!-- find all guest cards -->


    $http({
        url: 'http://localhost:8080/api/guestcards/all',
        method: 'get',
        headers: { 'Content-Type': 'application/json',
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                console.log('all guest cards returned successfully');

                $scope.guest_cards = data;

            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $scope.showContent = function ($fileContent) {
        $scope.content = $fileContent;
        $scope.data = {"fileData": $scope.content};
        console.log('File Data::' + $scope.data.fileData);
        console.log('File Content Type is::' + typeof $scope.content);
    };

    $scope.import = function () {
        console.log('import is in progress');
        $http({
            url: 'http://localhost:8080/api/guestcards',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.data
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('imported successfully');
                    $location.url('users/accesscard');

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

    $scope.checkCard = function () {
        console.log('check card function is called...');


        $http({
            url: 'http://localhost:8080/api/guestcards/' + $scope.access_card_detail.magStripeNo + '/detail',
            method: 'get',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('check successful');

                    $scope.access_card_detail.rfidTagNo = data.rfidTagNo;
                    $scope.magStripeNo = data.magStripeNo;
                    console.log('magStripeNO::' + data.magStripeNo);
                    if (!data.magStripeNo) {
                        $scope.message = 'Invalid Room Key Card';
                    }

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }


    $scope.reset = function () {
        console.log('reset values');
        $scope.magStripeNo = null;
        $scope.message = null;
    }

    $scope.save=function(magstripeno,rfidtagno)
    {
        $scope.card_detail.magStripeNo=magstripeno;
        $scope.card_detail.rfidTagNo=rfidtagno;
        console.log('test method is called...'+$scope.card_detail.magStripeNo+'::'+$scope.card_detail.rfidTagNo);

        $http({
            url: 'http://localhost:8080/api/guestcards/' + $scope.card_detail.magStripeNo,
            method: 'put',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.card_detail
        }).
            success(function (data, status) {
                    console.log('saved'+status);
                $scope.editable=true;
             })
            .error(function (error) {
                console.log(error);
            });
    }

    $scope.saveCard = function () {
        console.log('save card is called......');
        console.log($scope.access_card_detail.magStripeNo);
        console.log($scope.access_card_detail.rfidTagNo);


        $http({
            url: 'http://localhost:8080/api/guestcards/' + $scope.access_card_detail.magStripeNo,
            method: 'put',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.access_card_detail


        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('successfully done');
                    $scope.magStripeNo = null;
                    $scope.access_card_detail.magStripeNo = null;
                    $scope.message = 'saved successfully';
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }
})
    .directive('onReadFile', function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function (onLoadEvent) {
                        scope.$apply(function () {
                            fn(scope, {$fileContent: onLoadEvent.target.result});
                        });
                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    });


admin_app.controller('touch_point_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log('touch point controller of admin is loaded');
    $scope.current_user_id = $cookieStore.get("user").id;
    $scope.touch_point_list = [];
    console.log('current user id::' + $scope.current_user_id);

    <!-- get all assigned Touch Points -->
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
                $scope.touch_point_list = data;
                console.log('All Touch Points::' + $scope.touch_point_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
});


admin_app.controller('touch_point_setup_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log('touch point setup controller of admin application is loaded');
    $scope.current_user_id = $cookieStore.get("user").id;
    $scope.current_touch_point_list = [];
    $scope.tpsetup = {};
    $scope.selectedtouchpoint={};

    $scope.current_touch_point_id = $routeParams.setupId;
    console.log('current user id::' + $scope.current_user_id);
    console.log('current touchpoint id::' + $scope.current_touch_point_id);
    <!-- get all assigned touch point for the current user -->


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
                $scope.current_touch_point_list = data;
                console.log('All Touch Points::' + $scope.current_touch_point_list);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.setup = function (setup_form) {

        console.log('setup is clicked');
        console.log('selected tp::'+$scope.selectedtouchpoint);
        //console.log('touch point setup object::' + $scope.setup);

        //console.log('create setup for TouchPoint::'+$scope.setup.touchPoint.id);

        <!-- setup the touch point -->

        $scope.tpsetup.touchPoint=$scope.selectedtouchpoint;
        $http({
            url: 'http://localhost:8080/api/tp/setup',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.tpsetup
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('touch point  setup is successfull');
                    var redirect_url = 'touchpoint/' + $scope.current_touch_point_id + '/setups';
                    $location.url(redirect_url);
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });

    }
});


admin_app.controller('setup_list_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log(' setup list  controller is loaded.....');
    $scope.touch_point_setups;
    $scope.current_touch_point_id = $routeParams.tpid;

    <!-- get all setups by touchpointid -->

    $http({
        url: 'http://localhost:8080/api/tp/' + $routeParams.tpid + '/setups',
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
});


admin_app.controller('setup_view_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log(' setup view  controller is loaded.....');
    $scope.setup_detail;
    $scope.current_touch_point_id = $routeParams.tpId;

    <!-- get  setup detail by setupid -->

    $http({
        url: 'http://localhost:8080/api/tpsetup/' + $routeParams.setupId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.setup_detail = data;
                console.log('setup detail::' + $scope.setup_detail);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

});


admin_app.controller('edit_setup_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log('edit setup controller is loaded');
    $scope.setup_detail = {};
    $scope.current_touch_point_id = $routeParams.tpId;

    <!-- view  setup detail by setupid -->

    $http({
        url: 'http://localhost:8080/api/tpsetup/' + $routeParams.setupId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.setup_detail = data;
                console.log('setup detail::' + $scope.setup_detail);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.update = function () {
        console.log('update setup is called');
        $http({
            url: 'http://localhost:8080/api/tpsetup/' + $routeParams.setupId,
            method: 'put',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.setup_detail


        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('touch point setup updated successfully');
                    var redirect_url = '/touchpoint/' + $scope.current_touch_point_id + '/setups/' + $scope.setup_detail.id
                    $location.url(redirect_url);
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

});


admin_app.controller('delete_setup_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log('delete setup controller is loaded');
    $scope.setup_detail;
    $scope.current_touch_point_id = $routeParams.tpId;

    <!-- view  setup detail by setupid -->

    $http({
        url: 'http://localhost:8080/api/tpsetup/' + $routeParams.setupId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.setup_detail = data;
                console.log('setup detail::' + $scope.setup_detail);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.delete = function () {
        console.log('delete setup is called');
        $http({
            url: 'http://localhost:8080/api/tpsetup/' + $routeParams.setupId + '/delete',
            method: 'delete',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 301) {
                    console.log('touch point setup deleted successfully');
                } else {
                    console.log('status:' + status);
                    console.log('error in delete setup');
                }
            })
            .error(function (error) {
                console.log(error);
            });
        console.log('deleted......');
        $location.url('touchpoint/' + $scope.current_touch_point_id + '/setups');
    }
});


admin_app.controller('reset_users_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {
    console.log('reset user controller is loaded');
    $scope.user_detail = {};
    $scope.uId = $routeParams.userId;
    $http({
        url: 'http://localhost:8080/api/users/' + $scope.uId,
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")

        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.user_detail = data;
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.reset = function () {
        console.log('password reset is called');
        $http({
            url: 'http://localhost:8080/api/users/' + $scope.uId + '/reset/password',
            method: 'get',
            headers: { 'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    $location.url('users/view/' + $scope.uId);
                    console.log('password reset successfully');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }
});


admin_app.controller('add_touch_points_controller', function ($scope, $http, $routeParams, $location, $cookieStore) {

    $scope.touchpoint_list_assigned = [];
    $scope.touchpoint_list_not_assigned = [];
    $scope.selected_assigned_touchpoint;
    $scope.selected_not_assigned_touchpoint;
    console.log('add touch point controller is added.....');
    $http({
        url: 'http://localhost:8080/api/users/' + $routeParams.uId + '/tp/notHaving',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.touchpoint_list_not_assigned = data;
                console.log('touch point list not assigned:' + $scope.touchpoint_list_not_assigned);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });


    $http({
        url: 'http://localhost:8080/api/users/' + $routeParams.uId + '/tp/having',
        method: 'get',
        headers: {
            'Authorization': $cookieStore.get("auth")
        }
    }).
        success(function (data, status) {
            if (status == 200) {
                $scope.touchpoint_list_assigned = data;
                console.log('touch point list assigned:' + $scope.touchpoint_list_assigned);
            } else {
                console.log('status:' + status);
            }
        })
        .error(function (error) {
            console.log(error);
        });
    $scope.show = function () {
        console.log('show function is invoked');
    }

    $scope.pushDataFromLeft = function () {
        console.log('push data from left');
        if ($scope.selected_not_assigned_touchpoint != null) {
            $scope.touchpoint_list_assigned.push($scope.selected_not_assigned_touchpoint);
            $scope.touchpoint_list_not_assigned.pop($scope.selected_not_assigned_touchpoint);
        }
    }

    $scope.pushDataFromRight = function () {
        console.log('push data from Right');
        if ($scope.selected_assigned_touchpoint != null) {
            $scope.touchpoint_list_not_assigned.push($scope.selected_assigned_touchpoint);
            $scope.touchpoint_list_assigned.pop($scope.selected_assigned_touchpoint);
        }
    }

    $scope.addTouchPoints = function () {
        console.log('add touch point...');
        $http({
            url: 'http://localhost:8080/api/users/assignTP/' + $routeParams.uId,
            method: 'put',
            headers: {'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.touchpoint_list_assigned
        }).
            success(function (data, status) {
                if (status == 201) {

                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

});

admin_app.controller('import_key_card_controller', function ($scope, $http, $location, $cookieStore, $window) {
    console.log('import room key card controller is loaded');
    $scope.reset_mode = false;
    $scope.content;
    $scope.magStripeNo;
    $scope.rfidTagNo;
    $scope.access_card_detail = {};

    $scope.showContent = function ($fileContent) {
        $scope.content = $fileContent;
        $scope.data = {"fileData": $scope.content};
        console.log('File Data::' + $scope.data.fileData);
        console.log('File Content Type is::' + typeof $scope.content);
    };

    $scope.import = function () {
        console.log('import is in progress');
        $http({
            url: 'http://localhost:8080/api/guestcards',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $cookieStore.get("auth")
            },
            data: $scope.data
        }).
            success(function (data, status) {
                if (status == 201) {
                    console.log('imported successfully');
                } else {
                    console.log('status:' + status);
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }

});

admin_app.controller('register_cards_controller', function ($scope, $http, $location, $cookieStore, $window) {
    console.log('register room key card controller is loaded');
});