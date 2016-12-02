(function() {
    'use strict';

    var app = angular.module('LazMovieReviews');

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/comments', {
                templateUrl: 'public/templates/comments.html',
                controller: 'CommentsController'
            });
        }
    ]);

    app.controller('CommentsController', [
        '$scope',
        'CommentService',
        function CommentsController($scope, CommentService) {
            $scope.comments = CommentService.getComments();

            $scope.postComment = function() {
                if ($scope.commentForm.$valid) {
                    CommentService.postComment($scope.name, $scope.comment);
                }
            }
        }
    ]);

    app.factory('CommentService', [
        '$q',
        '$firebaseArray',
        function($q, $firebaseArray) {
            var self    = this;
            var service = {};

            var ref = firebase.database().ref().child('comments');

            self.comments = [];
            ref.on('child_added', function(snapshot) {
                var comment = snapshot.val();
                self.comments.push(comment);
            });

            service.postComment = function(name, comment) {
                ref.push({
                    name: name,
                    comment: comment,
                    time: (new Date()).getTime()
                });
            };

            service.getComments = function() {
                return $firebaseArray(ref);
            };

            return service;
        }
    ]);

    app.filter('ordinalDate', [
        '$filter',
        function($filter) {
            var suffixes = ['th', 'st', 'nd', 'rd'];

            return function (input, format) {
                var filter = new $filter('date')(input, format);
                if (!filter) {
                    return input;
                }

                var day    = parseInt($filter('date')(input, 'dd'));
                var offset = (day < 30) ? day % 20 : day % 30;
                var suffix = (offset <= 3) ? suffixes[offset] : suffixes[0];

                return filter.replace('oo', suffix);
            };
        }
    ]);

})();
