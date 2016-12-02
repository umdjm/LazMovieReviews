(function() {
    'use strict';

    var login = angular.module('LazMovieReviews')

    login.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'public/templates/login.html',
                controller: 'LoginController'
            });
        }
    ]);

    login.controller('LoginController', [
        '$scope',
        function LoginController($scope) {
            console.log('LoginController()');
        }
    ]);
})();
