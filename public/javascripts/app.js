(function(){
    var app = angular.module('LazMovieReviews', [
        'ngRoute',
        'firebase',
        'LocalStorageModule'
    ]);

    app.config([
        '$locationProvider',
        'localStorageServiceProvider',
        function($locationProvider, localStorageServiceProvider) {
            $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
            });

            localStorageServiceProvider.setPrefix('LazMovieReviews');
        }
    ]);

    app.controller('AppController', [
        '$scope',
        '$location',
        '$rootScope',
        'AuthService',
        function($scope, $location, $rootScope, AuthService) {
            $scope.isAuthenticated = AuthService.isAuthenticated();

            $rootScope.logout = function() {
                AuthService.logout();
                $scope.isAuthenticated = false;
                $location.path('/login');
            };

            $scope.$on('$routeChangeStart', function() {
                var url = $location.url();
                $scope.isAuthenticated = AuthService.isAuthenticated();
                if (!$scope.isAuthenticated && url != '/login' && url != '/signup') {
                    $location.path('/login');
                }
            });
        }
    ]);
}());
