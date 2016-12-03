(function() {
    'use strict';

    var app = angular.module('LazMovieReviews');

    app.factory('userService', [
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
    ]);

    app.factory('reviewService', [
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
                return $http.put(newUrl, removeParsePrivateData(data), config)
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
    ]);

    app.factory('rollupService', [
            '$http',
            function($http) {
                var url = 'https://lazmoviereviews.herokuapp.com/parse/classes/Rollups';
                var config = {headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66'}};

                function rollupData(movieId, reviews) {
                    var result = {movieId: movieId, count: 0, stars: 0};
                    for(var reviewId in reviews){
                        var review = reviews[reviewId];
                        result.count++;
                        result.stars += review.stars;
                    };
                    return result;
                }

                function addRollup(movieID, rollup) {
                    return $http.post(url, rollup, config)
                        .then(function success(response) {
                            return response.data.objectId;
                        }, function fail(response) {
                            console.log(JSON.stringify(response));
                        });
                }

                function updateRollup(rollupId, rollup) {
                    var newUrl = url + "/" + rollupId;
                    return $http.put(newUrl, removeParsePrivateData(rollup), config)
                        .then(function success(response) {
                            return response.data.objectId;
                        }, function fail(response) {
                            console.log(JSON.stringify(response));
                        });
                }

                function getRollup(movieId) {
                    var where = {movieId: movieId};
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

                function saveRollup(movieId, reviews){
                    var rollup = rollupData(movieId, reviews);
                    return getRollup(movieId).then(function(existingRollup){
                        if(existingRollup != null){
                            return updateRollup(existingRollup.objectId, rollup);
                        }
                        else {
                            return addRollup(movieId, rollup);
                        }
                    })

                }

                return {
                    save: saveRollup,
                    get: getRollup

                };
            }
        ])


        app.factory('Omdb', [
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

    function removeParsePrivateData(data){
        var newData = JSON.parse(JSON.stringify(data));
        delete(newData.objectId);
        delete(newData.updatedAt);
        delete(newData.createdAt);
        return newData;
    }
})();