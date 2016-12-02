(function () {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/searchMovies', {
                templateUrl: 'public/templates/searchMovies.html',
                controller: 'SearchMoviesController'
            });
        }
    ]);

    app.controller('SearchMoviesController', [
        '$scope',
        'Omdb',
        function($scope, Omdb) {
            $scope.search = function() {
                Omdb.search($scope.title).then(function(response) {
                    $scope.results = response.data;
                })
            }

        }
    ]);
})();