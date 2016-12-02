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

            self.timeStamp = function() {
                var now    = new Date();
                var date   = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
                var time   = [now.getHours(), now.getMinutes()];
                var suffix = (time[0] < 12) ? 'AM' : 'PM';
                time[0]    = (time[0] < 12) ? time[0] : time[0] - 12;

                for (var i = 1; i < 3; i++) {
                    if (time[i] < 10) {
                        time[i] = '0' + time[i];
                    }
                }

                return date.join('/') + ' at ' + time.join(':') + ' ' + suffix;
            };

            service.postComment = function(name, comment) {
                ref.push({
                    name: name,
                    comment: comment,
                    time: self.timeStamp()
                });
            };

            service.getComments = function() {
                return $firebaseArray(ref);
            };

            return service;
        }
    ]);

})();
