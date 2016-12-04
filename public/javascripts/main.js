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

                userService.getUsers().then(
                    function(users){
                        $scope.users = users;
                    }
                );

                rollupService.getTopRollups(10).then(
                    function(topMovies){
                        $scope.topMovies = topMovies;
                    }
                )
            }
        ]);
})();
