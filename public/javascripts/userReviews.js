(function() {
    'use strict';

    var app = angular.module('LazMovieReviews');

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/userReviews/:userId', {
                templateUrl: 'public/templates/userReviews.html',
                controller: 'UserReviewsController'
            });
        }
    ]);

    app.controller('IndividualUserReviewListController', [
        '$scope',
        'reviewService',
        'Omdb',
        function($scope, reviewService, Omdb) {
            var self = this;
            $scope.userId = self.userId;
            $scope.allUserMovies = [];
            reviewService.getUserReviews($scope.userId).then(
                function(results) {
                    $scope.userReviews = results[0].userName;
                    $scope.reviews = results;
                    for (var i = 0; i < results.length; i++) {
                        var movieId = results[i].movieId;
                        Omdb.get(movieId).then(
                            function(movie){
                                $scope.allUserMovies.push(movie);
                        });
                    }
                }
            );
        }
    ]);

    app.component('individualUserReviewList', {
        templateUrl: 'public/templates/IndividualUserReviewList.html',
        controller: 'IndividualUserReviewListController',
        bindings: {
            movieId: '<',
            userId: '<'
        }
    });

    app.controller('UserReviewsController', [
        '$scope',
        '$routeParams',
        'reviewService',
        'rollupService',
        'AuthService',
        'Omdb',
        function($scope, $routeParams, reviewService, rollupService, authService, Omdb) {
            $scope.userId = $routeParams.userId;
        }
    ]);

    app.filter('match', function () {
        return function(inputs,filterValues) {
            var output = [];
            angular.forEach(inputs, function (input) {
                if (filterValues.indexOf(input.id) !== -1)
                    output.push(input);
            });
            return output;
        };
    });
})();