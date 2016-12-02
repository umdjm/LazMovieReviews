(function() {
    'use strict';

    var app = angular.module('LazMovieReviews');

    app.component('navigation', {
        templateUrl: 'public/templates/navigation.html',
        controller: 'NavigationController'
    });

    app.controller('NavigationController', [
        '$scope',
        function NavigationController($scope) {
            console.log('NavigationController()');
        }
    ]);
})();
