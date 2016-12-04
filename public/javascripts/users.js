(function() {
    'use strict';

    var app = angular.module('LazMovieReviews')

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/users', {
                templateUrl: 'public/templates/users.html',
                controller: 'usersController'
            });
        }
    ]);

    app.controller('usersController', [
        '$scope',
        'userService',
        function($scope, userService) {
            var self = this;

            userService.getUsers().then(
                function(users){
                    $scope.users = users;
                }
            );
        }
    ]);


    app.factory('userService', [
        '$http',
        function($http) {
            var url = 'https://lazmoviereviews.herokuapp.com/parse/classes/Users';
            var config = {headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66'}};

            function addUser(data) {
                var user = {};
                user.uid = data.uid;
                user.email = data.email;
                user.name = data.name;
                return $http.post(url, user, config)
                    .then(function success(response) {
                        data.userId = response.data.objectId;
                        return data;
                    }, function fail(response) {
                        console.log(JSON.stringify(response));
                    });
            }

            function getUsers() {
                return $http.get(url, config)
                    .then(function success(response) {
                        return response.data.results;
                    }, function fail(response){
                        console.log(JSON.stringify(response));
                    });
            }

            function getStoredUser(user){
                var where = {uid: user.uid};
                return $http({
                    url: url,
                    headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66' },
                    method: "GET",
                    params: {where: JSON.stringify(where)}
                }).then(function success(response) {
                    if(response.data.results.length > 0) {
                        var foundUser = response.data.results[0];
                        return foundUser;
                    }
                    return addUser(user).then(function(userId){
                        return {objectId: userId};
                    })
                }, function fail(response){
                    console.log(JSON.stringify(response));
                });
            }

            return {
                addUser: addUser,
                getUsers: getUsers,
                getStoredUser: getStoredUser
            };
        }
    ]);
})();
