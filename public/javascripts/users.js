(function() {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/users', {
                templateUrl: 'public/templates/users.html',
                controller: 'usersController'
            });
        }
    ]);

    app.controller('usersController', [
        '$scope',
        'userService',
        function($scope, userService) {
            var self = this;
            self.addItem = function() {
                userService.addUser(self.newUser)
                    .then(function(user){
                        $scope.users.push(user);
                        $scope.newUser = {};
                    });

                return;
            };

            userService.getUsers().then(
                function(users){
                    $scope.users = users;
                }
            );
        }
    ]);
})();
