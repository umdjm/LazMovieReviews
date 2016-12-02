(function(){
<<<<<<< HEAD
    var app = angular.module('LazMovieReviews', [
        'ngRoute'
    ]);
=======
    var app = angular.module('LazMovieReviews', ['ngResource']).controller('MainCtrl', function MainCtrl() {});

    function ProofOfConceptController(parseService) {
        var self = this;
        self.addItem = function(){
            parseService.addUser(self.newUser)
                .then(function(user){
                    self.users.push(user);
                    self.newUser = {};
                })
>>>>>>> 811e9e73e3929c20d149c1c0661819bb962f78dc

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
            }).otherwise({ redirectTo: '/' });
        }
    ]);
}());
