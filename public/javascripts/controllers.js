(function() {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.controller('MainCtrl', [
        function MainCtrl() {
            console.log('MainCtrl()');
        }
    ]);

    app.controller('ProofOfConceptController', [
        'parseService',
        function(parseService) {
            var self = this;
            self.addItem = function(){
                parseService.addUser(self.newUser)
                    .then(function(user){
                        self.users.push(user);
                        self.newUser = {};
                    });

                return;
            };

            parseService.getUsers().then(
                function(users){
                    self.users = users;
                }
            );
        }
    ]);
})();