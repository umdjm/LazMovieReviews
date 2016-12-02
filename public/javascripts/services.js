(function() {
    'use strict';

    angular.module('LazMovieReviews')

    .factory('parseService', [
        '$http',
        function($http) {
            var url = 'https://lazmoviereviews.herokuapp.com/parse/classes/Users';
            var config = {headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66'}};

            function addUser(data) {
                return $http.post(url, data, config)
                    .then(function success(response) {
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

            return {
                addUser: addUser,
                getUsers: getUsers
            };
        }
    ])

    .factory('reviewService', [
        '$http',
        function($http) {
            var url = 'https://lazmoviereviews.herokuapp.com/parse/classes/Reviews';
            var config = {headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66'}};

            function addReview(data) {
                return $http.post(url, data, config)
                    .then(function success(response) {
                        debugger;;
                        return data;
                    }, function fail(response) {
                        console.log(JSON.stringify(response));
                    });
            }

            function getReviews() {
                return $http.get(url, config)
                    .then(function success(response) {
                        return response.data.results;
                    }, function fail(response){
                        console.log(JSON.stringify(response));
                    });
            }

            return {
                addReview: addReview,
                getReviews: getReviews
            };
        }
    ])

    .factory('movieService', [
        '$http',
        function($http) {
            var url = 'https://www.omdbapi.com/?i=tt0096895&plot=short&r=json';

            function getMovie() {
                return $http.get(url)
                    .then(function success(response) {
                        return response.data;
                    }, function fail(response){
                        console.log(JSON.stringify(response));
                    });
            }

            return {
                getMovie: getMovie
            };
        }
    ]);

})();