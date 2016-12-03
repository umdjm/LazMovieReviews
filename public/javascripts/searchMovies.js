(function () {
    'use strict';

    var app = angular.module('LazMovieReviews');

    app.config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/movies/:title', {
                templateUrl: 'public/templates/movieResults.html',
                controller: 'MovieResultsController'
            });
        }
    ]);

    app.component('movieSearch', {
        templateUrl: 'public/templates/searchMovies.html',
        controller: 'SearchMoviesController'
    });

    app.controller('SearchMoviesController', [
        '$scope',
        '$location',
        function($scope, $location) {
            $scope.search = function() {
                $location.path('/movies/' + $scope.title);
            }
        }
    ]);

    app.controller('MovieResultsController', [
        '$scope',
        '$routeParams',
        'Omdb',
        function($scope, $routeParams, Omdb) {
            if ($routeParams.title != '') {
                Omdb.search($routeParams.title).then(function(results) {
                    $scope.results = results;
                })
            }
        }
    ]);
})();
