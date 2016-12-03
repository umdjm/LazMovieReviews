(function() {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'public/templates/main.html',
                controller: 'MainController'
            });
        }
    ]);

        app.controller('MainController', [
            '$scope',
            'userService',
            'rollupService',
            function($scope, userService, rollupService) {
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

                rollupService.getTopRollups().then(
                    function(topMovies){
                        $scope.topMovies = topMovies;
                    }
                )
            }
        ]);
})();
