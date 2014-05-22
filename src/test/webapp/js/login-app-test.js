describe('login app', function () {

    beforeEach(angular.mock.module('login_app'));

    describe("login controller", function () {

        var scope, controller;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller;
        }));


        it("default message should be Hello World", function () {
            controller("login_app_controller", {$scope: scope});
            expect(scope.message).toBe("Hello World");
            console.log('successfull');
        });

        it("after login message should be I m called", function () {
            controller("login_app_controller", {$scope: scope});
            scope.login('Manmay', 'Mohanty');
            expect(scope.message).toBe("I m called");
        });

    });

});
