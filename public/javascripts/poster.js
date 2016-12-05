(function() {
    'use strict';

    var app = angular.module('LazMovieReviews');

    app.component('poster', {
        templateUrl: 'public/templates/poster.html',
        bindings: {
            movie: '<'
        }
    });
})();