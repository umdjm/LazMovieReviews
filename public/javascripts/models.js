(function() {
    'use strict';

    /**
     * Models
     */
    angular.module('LazMovieReviews')

    .factory('User', [
        '$q',
        function ($q) {
            function User(data) {
                if (data) {
                    this.setData(data);
                }
            }

            User.prototype = {
                setData: function(data) {
                    angular.extend(this, data);
                },
                load: function(id) {
                    console.debug('TODO: load User data');
                },
                save: function() {
                    console.debug('TODO: save User data');
                },
                delete: function() {
                    console.debug('TODO: delete User data');
                }
            };

            return User;
        }
    ])

    .factory('Movie', [
        '$q',
        function ($q) {
            function Movie(data) {
                if (data) {
                    this.setData(data);
                }
            }

            Movie.prototype = {
                setData: function(data) {
                    angular.extend(this, data);
                },
                load: function(id) {
                    console.debug('TODO: load User data');
                },
                save: function() {
                    console.debug('TODO: save User data');
                },
                delete: function() {
                    console.debug('TODO: delete User data');
                }
            };

            return Movie;
        }
    ])

    .factory('Review', [
        '$q',
        function ($q) {
            function Review(data) {
                if (data) {
                    this.setData(data);
                }
            }

            Review.prototype = {
                setData: function(data) {
                    angular.extend(this, data);
                },
                load: function(id) {
                    console.debug('TODO: load User data');
                },
                save: function() {
                    console.debug('TODO: save User data');
                },
                delete: function() {
                    console.debug('TODO: delete User data');
                }
            };

            return Review;
        }
    ])

    .factory('Comment', [
        '$q',
        function ($q) {
            function Comment(data) {
                if (data) {
                    this.setData(data);
                }
            }

            Comment.prototype = {
                setData: function(data) {
                    angular.extend(this, data);
                },
                load: function(id) {
                    console.debug('TODO: load User data');
                },
                save: function() {
                    console.debug('TODO: save User data');
                },
                delete: function() {
                    console.debug('TODO: delete User data');
                }
            };

            return Comment;
        }
    ]);
})();