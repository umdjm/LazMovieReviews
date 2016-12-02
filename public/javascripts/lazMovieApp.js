(function(){
    var app = angular.module('LazMovieReviews', [
        'ngRoute',
        'firebase'
    ]);

    app.config([
        '$locationProvider',
        function($locationProvider) {
            $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
            });
        }
    ]);
}());
