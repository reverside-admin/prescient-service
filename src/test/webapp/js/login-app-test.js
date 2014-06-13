describe('Unit: Login app', function() {

    // Load the module with MainController
    beforeEach(angular.mock.module('login_app'));

    var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('login_app_controller', {
            $scope: scope
        });
    }));

    it('scope.error should be undefined',
        function() {
            var loginForm=['mrunmay','secret'];
            expect(scope.error).toBeUndefined();

        });
});