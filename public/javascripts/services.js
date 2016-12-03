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
        'rollupService',
        function($http, rollupService) {
            var url = 'https://lazmoviereviews.herokuapp.com/parse/classes/Reviews';
            var config = {headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66'}};

            function addReview(data, movie) {
                return $http.post(url, data, config)
                    .then(function success(response) {
                        var reviewId = response.data.objectId;
                        return updateRollup(movie).then(function(rollup){
                            return {objectId: reviewId, rollup: rollup};
                        })
                    }, function fail(response) {
                        console.log(JSON.stringify(response));
                    });
            }

            function updateReview(data, movie) {
                var newUrl = url + "/" + data.objectId;
                var reviewId = data.objectId;
                return $http.put(newUrl, removeParsePrivateData(data), config)
                    .then(function success(response) {
                        return updateRollup(movie).then(function(rollup){
                            return {objectId: reviewId, rollup: rollup};
                        })
                    }, function fail(response) {
                        console.log(JSON.stringify(response));
                    });
            }

            function updateRollup(movie){
                return getAllReviews(movie.objectId)
                    .then(function(reviews){
                        return rollupService.save(movie, reviews)
                            .then(function(rollup){
                                return rollup;
                            })
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

                function rollupData(movie, reviews) {
                    var result = {movieId: movie.objectId, Poster: movie.Poster, Title: movie.Title, imdbID: movie.imdbID, count: 0, stars: 0, averageStars: 0};
                    for(var reviewId in reviews){
                        var review = reviews[reviewId];
                        result.count++;
                        result.stars += review.stars;
                        result.averageStars = result.stars/result.count;
                    };
                    return result;
                }

                function addRollup(rollup) {
                    return $http.post(url, rollup, config)
                        .then(function success(response) {
                            rollup.objectId = response.data.objectId;
                            return rollup;
                        }, function fail(response) {
                            console.log(JSON.stringify(response));
                        });
                }

                function updateRollup(rollupId, rollup) {
                    var newUrl = url + "/" + rollupId;
                    return $http.put(newUrl, removeParsePrivateData(rollup), config)
                        .then(function success(response) {
                            return rollup;
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

                function saveRollup(movie, reviews){
                    var rollup = rollupData(movie, reviews);
                    return getRollup(movie.objectId).then(function(existingRollup){
                        if(existingRollup != null){
                            return updateRollup(existingRollup.objectId, rollup);
                        }
                        else {
                            return addRollup(rollup);
                        }
                    })
                }

                function getTopRollups(limitTo){
                    return $http({
                        url: url,
                        headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66' },
                        method: "GET",
                        params: {order: "averageStars", limit: limitTo}
                    }).then(function success(response) {
                        return response.data.results;
                    }, function fail(response){
                        console.log(JSON.stringify(response));
                    });
                }

                function getRollupsForMovies(movies){
                    if(!movies || movies.length == 0)
                        return [];

                    var where = {"$or": []};
                    for (var i = 0; i < movies.length; i++) {
                        var movieId = movies[i].imdbID;
                        where.$or.push({"movieId" : movieId});
                    }

                    return $http({
                        url: url,
                        headers: { 'X-Parse-Application-Id':'9d300721-df9d-42bc-8411-1659efbbed66' },
                        method: "GET",
                        params: {where: JSON.stringify(where)}
                    }).then(function success(response) {
                        var ratings = response.data.results;

                        for (var i = 0; i < movies.length; i++) {
                            var movie = movies[i];
                            movie.averageStars = 0;
                            movie.stars = 0;
                            movie.count = 0;
                            for (var j = 0; j < ratings.length; j++) {
                                var rating = ratings[j];
                                if(rating.movieId == movie.imdbID){
                                    movie.averageStars = rating.averageStars;
                                    movie.stars = rating.stars;
                                    movie.count = rating.count;
                                }
                            }
                        }
                        return movies;
                    }, function fail(response){
                        console.log(JSON.stringify(response));
                    });

                    return where;
                }

                return {
                    get: getRollup,
                    save: saveRollup,
                    getTopRollups: getTopRollups,
                    getRollupsForMovies: getRollupsForMovies
                };
            }
        ])


        app.factory('Omdb', [
        '$http', '$httpParamSerializer', 'rollupService',
        function ($http, $httpParamSerializer, rollupService) {
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
                        return rollupService.getRollupsForMovies(response.data.Search)
                            .then(function(ratedMovies){
                                return response.data;
                            })
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