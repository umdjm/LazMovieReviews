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
    ]),

        app.controller('ReviewController', [
            'reviewService',
            function(reviewService) {
                console.log("called reviewController route");
                /*var self = this;
                self.addItem = function(){
                    reviewService.addReview(self.newReview)
                        .then(function(review){
                            self.reviews.push(review);
                            self.newReview = {};
                        });

                    return;
                };

                reviewService.getReviews().then(
                    function(reviews){
                        self.reviews = reviews;
                    }
                );*/
            }
        ]);
})();