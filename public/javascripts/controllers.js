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
                $scope.myreview = {movieId: "tt0096895", userId: "mvU3ePaqJd", stars:null, blog: null};
                movieService.getMovie().then(
                    function(movie){
                        $scope.movie = movie;
                    }
                );


                $scope.addReview = function(){
                    if ($scope.myreview['objectId']) {
                        reviewService.updateReview($scope.myreview)
                            .then(function(){
                                $scope.allreviews[$scope.myreview.objectId] = $scope.myreview;
                            });
                    } else {
                        reviewService.addReview($scope.myreview)
                            .then(function(objectId){
                                $scope.myreview.objectId = objectId;
                                $scope.allreviews[objectId] = $scope.myreview;
                            });
                    }
                    return;
                };

                reviewService.getMyReview($scope.myreview.userId, $scope.myreview.movieId).then(
                    function(review){
                        if (review)
                          $scope.myreview = review;
                    }
                );

                reviewService.getAllReviews($scope.movieId).then(
                    function(reviews){
                        $scope.allreviews = {};
                        reviews.forEach(function(review){
                            $scope.allreviews[review.objectId] = review;
                        });
                    }
                );
            }
        ]);
})();