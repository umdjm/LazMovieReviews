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
                        return response.data.objectId;
                    }, function fail(response) {
                        console.log(JSON.stringify(response));
                    });
            }

            function updateReview(data) {
                var newUrl = url + "/" + data.objectId;
                var newData = JSON.parse(JSON.stringify(data));
                delete(newData.objectId);
                delete(newData.updatedAt);
                delete(newData.createdAt);
                return $http.put(newUrl, newData, config)
                    .then(function success(response) {
                        return response.data.objectId;
                    }, function fail(response) {
                        console.log(JSON.stringify(response));
                    });
            }

            function getMyReview(userId, movieId) {
                var where = {userId: userId, movieId: movieId};
                return $http({
                    url: url,
                    headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66' },
                    method: "GET",
                    params: {where: JSON.stringify(where)}
                }).then(function success(response) {
                        return response.data.results[0];
                    }, function fail(response){
                        console.log(JSON.stringify(response));
                    });
            }

            function getAllReviews(movieId) {
                var where = {movieId: movieId};
                return $http({
                    url: url,
                    headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66' },
                    method: "GET",
                    params: {where: JSON.stringify(where)}
                }).then(function success(response) {
                    return response.data.results;
                }, function fail(response){
                    console.log(JSON.stringify(response));
                });
            }

            return {
                addReview: addReview,
                getMyReview: getMyReview,
                getAllReviews: getAllReviews,
                updateReview: updateReview

            };
        }
    ])

    .factory('Omdb', [
        '$http', '$httpParamSerializer',
        function ($http, $httpParamSerializer) {
            var url = "https://www.omdbapi.com/?";
            function get(imdbID) {
                return $http.get(url + $httpParamSerializer({i: imdbID, plot: 'short'}))
                    .then(function success(response) {
                        return response.data;
                    }, function fail(response){
                        console.log(JSON.stringify(response));
                    });
            }
            function search(title) {
                return $http.get(url + $httpParamSerializer({s: title}))
                    .then(function success(response) {
                    return response.data;
                }, function fail(response){
                    console.log(JSON.stringify(response));
                });
            }
            return {
                get: get,
                search: search
            }
        }
    ]);
})();