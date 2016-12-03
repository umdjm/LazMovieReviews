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
                $routeProvider.when('/reviews/:imdbID', {
                    templateUrl: 'public/templates/movieReview.html',
                    controller: 'ReviewController'
                });
            }
        ]);

    app.controller('ReviewController', [
            '$scope',
            '$routeParams',
            'reviewService',
            'rollupService',
            'Omdb',
            function($scope, $routeParams, reviewService, rollupService, Omdb) {
                var movieID = $routeParams.imdbID;
                $scope.myreview = {movieId: movieID, userId: "F7ahm9dW5M", userName: "Alex", stars:null, blog: null};

                Omdb.get(movieID).then(
                    function(movie){
                        $scope.movie = movie;
                    }
                );

                $scope.isCurrentUser = function(review){
                    return function(review){
                        return review.userId == $scope.myreview.userId;
                    };
                };

                $scope.addReview = function(){
                    if ($scope.myreview['objectId']) {
                        reviewService.updateReview($scope.myreview)
                            .then(function(){
                                $scope.allreviews[$scope.myreview.objectId] = $scope.myreview;
                                rollupService.save($scope.myreview.movieId, $scope.allreviews);
                            });
                    } else {
                        reviewService.addReview($scope.myreview)
                            .then(function(objectId){
                                $scope.myreview.objectId = objectId;
                                $scope.allreviews[objectId] = $scope.myreview;
                                rollupService.save($scope.myreview.movieId, $scope.allreviews);
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

                reviewService.getAllReviews($scope.myreview.movieId).then(
                    function(reviews){
                        $scope.allreviews = {};
                        reviews.forEach(function(review){
                            $scope.allreviews[review.objectId] = review;
                        });
                    }
                );
            }
        ]);

    app.filter('notMine', function() {
        return function(array, userId) {
            if(!angular.isObject(array)) return array;
            else {
                var newObj = {}
                for(var key in array) {
                    var value = array[key];
                    if(value.userId != userId) {
                        newObj[key] = value;
                    }
                }
                return newObj;
            }
        }
    })
})();