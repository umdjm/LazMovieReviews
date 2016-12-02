
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

    var parseService = function($http){
        var url = 'https://lazmoviereviews.herokuapp.com/parse/classes/Users';
        var config = {headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66'}};

        function addUser(data){
             return $http.post(url, data, config)
                .then(function success(response){
                    return data;
                }, function fail(response){
                    console.log(JSON.stringify(response));
                });
        }

        function getUsers(){
            return $http.get(url, config)
                .then(function success(response){
                    return response.data.results;
                }, function fail(response){
                    console.log(JSON.stringify(response));
                });
        }

        return {
            addUser: addUser,
            getUsers: getUsers
        };
    }
    app.factory('parseService', parseService);

    app.component('proofOfConcept', {
        templateUrl: '/public/templates/proofOfConcept.html',
        controller: ProofOfConceptController
    });
}())