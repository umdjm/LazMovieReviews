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
            'parseService',
            function($scope, parseService) {
                var self = this;
                self.addItem = function() {
                    parseService.addUser(self.newUser)
                        .then(function(user){
                            $scope.users.push(user);
                            $scope.newUser = {};
                        });

                    return;
                };

                parseService.getUsers().then(
                    function(users){
                        $scope.users = users;
                    }
                );
            }
        ]);
})();
