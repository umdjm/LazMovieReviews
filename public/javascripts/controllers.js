(function() {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.controller('MainCtrl', [
        function MainCtrl() {
            console.log('MainCtrl()');
        }
    ]);

    app.controller('ProofOfConceptController', [
        '$scope',
        'parseService',
        function($scope, parseService) {
            var self = this;            self.addItem = function() {
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