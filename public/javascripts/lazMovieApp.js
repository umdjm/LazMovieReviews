(function(){
    var app = angular.module('LazMovieReviews', [
        'ngRoute'
    ]);

    app.config([
        '$locationProvider',
        '$routeProvider',
        function($locationProvider, $routeProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            /**
             * Routes
             */
            $routeProvider.when('/', {
                templateUrl: 'public/templates/proofOfConcept.html',
                controller: 'ProofOfConceptController'
            }).when('/reviews', {
                templateUrl: 'public/templates/movieReview.html',
                controller: 'ReviewController'
            }).otherwise({ redirectTo: '/' });

        }
    ]);
}());
