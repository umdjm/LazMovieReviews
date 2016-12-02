(function(){
    var app = angular.module('LazMovieReviews', [
        'ngRoute'
    ]);

    app.config([
        '$locationProvider',
        '$routeProvider',
        function($locationProvider, $routeProvider) {
            $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
            });
        }
    ]);
}());
