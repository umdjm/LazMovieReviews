
(function(){
    var app = angular.module('LazMovieReviews', []).controller('MainCtrl', function MainCtrl() {});

    function ProofOfConceptController(parseService) {
        var self = this;
        self.addItem = function(){
            parseService.addUser(self.newUser)
                .then(function(user){
                    self.users.push(user);
                    self.newUser = {};
                })

            return;
        };
        parseService.getUsers().then(
            function(users){
                self.users = users;
            }
        );
    }

    app.component('proofOfConcept', {
        templateUrl: 'public/templates/proofOfConcept.html',
        controller: ProofOfConceptController
    });
}())