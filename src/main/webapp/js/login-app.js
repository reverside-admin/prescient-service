/**
 * Created by Bibhuti on 2014/03/29.
 */
var login_app = angular.module('login_app', ['ngRoute', 'ngCookies']);

login_app.controller("login_app_controller", function ($scope, $http, $cookieStore, $window) {

    $scope.error;

    $scope.user_name = "";

    $scope.password = "";

    $scope.reset_mode = false;

    $scope.reset_password_error;

    $scope.user;

    $scope.login = function (loginform) {

        if (!loginform.$valid)  return;

        var url = 'http://localhost:8080/login/' + $scope.user_name + '/' + $scope.password;

        console.log(url);

        $http({
            method: 'GET',
            url: url,
            headers: {
            }
        }).success(function (data, status) {
                console.log('status:' + status + ' response:' + data);
                if (status == 200) {
                    <!--  var redirect_url = $window.location.search.replace('?','') + $window.location.hash;-->

                    if (data.userStatus.value != 'enable') {
                        $scope.error = 'Please contact to the Administrator';
                        return;
                    }

                    if ($scope.password == 'password') {
                        console.log("Reset password please");
                        $scope.user = data;
                        $scope.reset_mode = true;
                        return;
                    }

                    var token = 'Basic ' + $scope.decode($scope.user_name + ':' + $scope.password);
                    $cookieStore.put("user", data);
                    $cookieStore.put("auth", token);

                    if (data.userType.value == 'ROLE_ADMIN') {
                        redirect_url = "admin-app.html";
                    }
                    if (data.userType.value == 'ROLE_STAFF') {
                        redirect_url = "staff-app.html";
                    }
                    if (data.userType.value == 'ROLE_MANAGER') {
                        redirect_url = "manager-app.html";
                    }
                    $window.location.replace(redirect_url);


                    // console.log("Redirect To URL : " + redirect_url);


                }
                else {
                    $scope.error = "Invalid Username or Password";
                }

            }
        ).
            error(function (error, status) {
                <!--console.log(error);-->
                <!--$scope.error = error;-->
                console.log('status code::' + status);
                 if (status == 500) {
                    $scope.error = 'Invalid UserName or Password';
                }
            });
    };


    $scope.resetPassword = function (passwordResetform, new_password, confirm_password) {



        if (!passwordResetform.$valid)return;

        if (new_password != confirm_password) {
            $scope.reset_password_error = 'password mismatched';
            return;
        }
        if (new_password == 'password') {
            $scope.reset_password_error = 'password canot be password';
            return;
        }

        console.log("reset password for user " + $scope.user_name + " , password " + $scope.password + "new password : " + new_password);

        var token = 'Basic ' + $scope.decode($scope.user_name + ':' + $scope.password);


        $http({
            url: '/api/login/reset/password/' + new_password,
            method: 'GET',
            headers: {
                'Authorization': token
            }
        }).
            success(function (data, status) {
                if (status == 200) {
                    console.log('password changed successfully');
                    <!-- update auth in cookie-->

                    var token = 'Basic ' + $scope.decode($scope.user_name + ':' + new_password);
                    $cookieStore.put("user", $scope.user);
                    $cookieStore.put("auth", token);

                    if ($scope.user.userType.value == 'ROLE_ADMIN')
                        $window.location.replace("admin-app.html");

                    if ($scope.user.userType.value == 'ROLE_STAFF')
                        $window.location.replace("staff-app.html");

                    if ($scope.user.userType.value == 'ROLE_MANAGER')
                        $window.location.replace("manager-app.html");

                }

            })
            .error(function (error) {
                console.log(error);
            });

    };

    $scope.decode = function (input) {
        var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    }


})
;
