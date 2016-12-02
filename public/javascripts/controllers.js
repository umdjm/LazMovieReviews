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

        app.config([
            '$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/reviews', {
                    templateUrl: 'public/templates/movieReview.html',
                    controller: 'ReviewController'
                });
            }
        ]);

    app.controller('ReviewController', [
            '$scope',
            'reviewService',
            'movieService',
            function($scope, reviewService, movieService) {
                $scope.movieId = "tt0096895";
                movieService.getMovie().then(
                    function(movie){
                        $scope.movie = movie;
                    }
                );

                $scope.addItem = function(){
                    $scope.userId = "";
                    var newReview = {userId: $scope.userId, movieId: $scope.movieId, stars: $scope.stars, blog: $scope.blog};
                    reviewService.addReview(newReview)
                        .then(function(review){
                            $scope.reviews.push(review);
                        });

                    return;
                };

                reviewService.getReviews().then(
                    function(reviews){
                        $scope.reviews = reviews;
                    }
                );
            }
        ]);
})();