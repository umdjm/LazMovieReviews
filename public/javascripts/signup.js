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
        'userService',
        function SignupController($scope, userService) {
            $scope.signupSuccess = false;
            $scope.addUser = function() {
                if ($scope.signupForm.$valid) {
                    userService.addUser($scope.newUser);
                    $scope.signupSuccess = true;
                }
            };
        }
    ]);

})();
