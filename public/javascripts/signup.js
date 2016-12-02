(function() {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/signup', {
                templateUrl: 'public/templates/signup.html',
                controller: 'SignupController'
            });
        }
    ]);

    app.controller('SignupController', [
        '$scope',
        function SignupController($scope) {
            console.log('SignupController()');
        }
    ]);
})();
