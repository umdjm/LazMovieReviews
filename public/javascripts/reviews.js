(function() {
    'use strict';

    var app = angular.module('LazMovieReviews');

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/reviews/:imdbID', {
                templateUrl: 'public/templates/movieReview.html',
                controller: 'ReviewController'
            });
        }
    ]);

    app.controller('IndividualMovieReviewListController', [
        '$scope',
        'reviewService',
        function($scope, reviewService) {
            var self = this;
            $scope.userId = self.userId;
            $scope.movieId = self.movieId;

            reviewService.getAllReviews($scope.movieId).then(
                function(reviews) {
                    $scope.allreviews = {};
                    reviews.forEach(function(review) {
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

    app.controller('ReviewController', [
        '$scope',
        '$routeParams',
        'reviewService',
        'rollupService',
        'AuthService',
        'Omdb',
        function($scope, $routeParams, reviewService, rollupService, authService, Omdb) {
            $scope.user = authService.getCurrentUser();
            $scope.userId = $scope.user.userId;
            $scope.movieId = $routeParams.imdbID;
            $scope.myreview = {movieId: $scope.movieId, userId: $scope.user.userId, userName: $scope.user.name, stars:null, blog: null};

            Omdb.get($scope.movieId).then(
                function(movie){
                    movie.objectId = $scope.movieId;
                    $scope.movie = movie;
                }
            );

            $scope.addReview = function() {
                $scope.flag = false;
                $scope.buttonClicked = function() {
                    $scope.flag = true;
                    Service.doService.then(function(){
                        $scope.flag = false;
                    }).error(function(){
                        $scope.flag = false;
                    })
                }

                if ($scope.myreview['objectId']) {
                    return reviewService.updateReview($scope.myreview, $scope.movie)
                        .then(function(response){
                            setRollupData(response.rollup);
                        });
                } else {
                    return reviewService.addReview($scope.myreview, $scope.movie)
                        .then(function(response){
                            $scope.myreview.objectId = response.objectId;
                            setRollupData(response.rollup);
                        });
                }
            };

            reviewService.getMyReview($scope.myreview.userId, $scope.myreview.movieId).then(
                function(review){
                    if (review) {
                        $scope.myreview = review;
                        $scope.myreview.userName = $scope.user.name;
                    }
                }
            );

            function getRollupData() {
                rollupService.get($scope.myreview.movieId).then(setRollupData);
            }
            function setRollupData(rollup){
                if (!rollup) {
                    rollup = {count: 0, stars: 0, averageStars: 0};
                }
                $scope.averageStars = rollup.averageStars;
            }
            getRollupData();

        }
    ]);

    app.filter('notMine', function() {
        return function(array, userId) {
            if (!angular.isObject(array)) {
                return array;
            }

            var newObj = {};
            for (var key in array) {
                if (array.hasOwnProperty(key)) {
                    var value = array[key];
                    if (value.userId != userId) {
                        newObj[key] = value;
                    }
                }
            }

            return newObj;
        }
    })
})();