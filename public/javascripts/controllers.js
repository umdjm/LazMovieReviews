(function() {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.controller('MainCtrl', [
        function MainCtrl() {
            console.log('MainCtrl()');
        }
    ]);

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/reviews/:imdbID', {
                templateUrl: 'public/templates/movieReview.html',
                controller: 'ReviewController'
            });
        }
    ]);

    /* Get rid of component for now since breaks more than one issue
    app.controller('IndividualMovieReviewListController', [
        '$scope',
        'reviewService',
        function($scope, reviewService) {
            $scope.userId = this.userId;
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

    app.component('individualMovieReviewList', {
        templateUrl: 'public/templates/IndividualMovieReviewList.html',
        controller: 'IndividualMovieReviewListController',
        bindings: {
            movieId: '<',
            userId: '<'
        }
    });
    */

    app.controller('ReviewController', [
            '$scope',
            '$routeParams',
            'reviewService',
            'rollupService',
            'Omdb',
            function($scope, $routeParams, reviewService, rollupService, Omdb) {
                var movieID = $routeParams.imdbID;
                $scope.myreview = {movieId: movieID, userId: "vS2gdwcbGF", userName: "Kayla", stars:null, blog: null};

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

                reviewService.getAllReviews($scope.myreview.movieId).then(
                    function(reviews){
                        $scope.allreviews = {};
                        reviews.forEach(function(review){
                            if (review.userId != $scope.myreview.userId)
                                $scope.allreviews[review.objectId] = review;
                        });
                    }
                );

                function getRollupData() {
                    rollupService.get($scope.myreview.movieId).then(
                        function (rollup) {
                            if (!rollup) {
                                rollup = {count: 0, stars: 0};
                            }
                            $scope.averageStars = rollup.count > 0 ? (rollup.stars / rollup.count) : 0;
                        }
                    );
                }
                getRollupData();

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