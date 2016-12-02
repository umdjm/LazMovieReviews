(function() {
    'use strict';

    var main = angular.module('LazMovieReviews')

    main.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'public/templates/main.html',
                controller: 'MainController'
            });
        }
    ]);

    main.controller('MainController', [
        '$scope',
        function MainController($scope) {
            console.log('MainController()');
        }
    ]);
})();
