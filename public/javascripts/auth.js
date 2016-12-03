(function(){
    var app = angular.module('LazMovieReviews');

    app.config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/signup', {
                templateUrl: 'public/templates/signup.html',
                controller: 'SignupController'
            }).when('/login', {
                templateUrl: 'public/templates/login.html',
                controller: 'LoginController'
            });
        }
    ]);

    app.controller('LoginController', [
        '$scope',
        '$location',
        'AuthService',
        function($scope, $location, AuthService) {
            if (AuthService.isAuthenticated()) {
                $location.path('/');
            }

            $scope.user = {
                email: '',
                password: ''
            };

            $scope.errorMessage = '';
            $scope.login = function() {
                if ($scope.loginForm.$valid) {
                    AuthService.login($scope.user.email, $scope.user.password).then(function () {
                        $location.path('/');
                    }).catch(function(error) {
                        $scope.errorMessage = error.message;
                    });
                }
            };
        }
    ]);

    app.controller('SignupController', [
        '$scope',
        '$location',
        'AuthService',
        function($scope, $location, AuthService) {
            if (AuthService.isAuthenticated()) {
                $location.path('/');
            }

            $scope.user = {
                email: '',
                password: '',
                name: ''
            };

            $scope.errorMessage = '';
            $scope.signup = function() {
                if ($scope.signupForm.$valid) {
                    AuthService.signup($scope.user.email, $scope.user.password, $scope.user.name).then(function() {
                        $location.path('/');
                    }).catch(function(error) {
                        $scope.errorMessage = error.message;
                    });
                }
            };
        }
    ]);

    app.factory('AuthService', [
        '$q',
        '$firebaseAuth',
        'localStorageService',
        'userService',
        function($q, $firebaseAuth, LocalStorage, userService) {
            var self    = this;
            var service = {};
            var auth    = $firebaseAuth();
            self.user   = {};

            service.isAuthenticated = function() {
                if (!self.user.uid) {
                    // try to get from local storage
                    var user = LocalStorage.get('user');
                    if (user) {
                        self.user = user;
                        return true;
                    }
                }

                return self.user.uid != undefined;
            };

            service.logout = function() {
                LocalStorage.clearAll();
                self.user = {};
            };

            service.getCurrentUser = function() {
                if (!service.isAuthenticated()) {
                    return {};
                }

                return self.user;
            };

            service.login = function(email, password) {
                var deferred = $q.defer();

                auth.$signInWithEmailAndPassword(email, password).then(function(user) {
                    self.user = user;

                    userService.getStoredUser(self.user).then(function(user){
                        self.user.userId = user.objectId;
                        self.user.name = user.name;
                        LocalStorage.set('user', self.user);
                        deferred.resolve(self.user);
                    });
                }).catch(function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            service.signup = function(email, password, name) {
                var deferred = $q.defer();

                auth.$createUserWithEmailAndPassword(email, password).then(function(user) {
                    self.user = user;
                    self.user.name = name;
                    userService.addUser(self.user).then(function(userId){
                        LocalStorage.set('user', self.user);
                        deferred.resolve(self.user);
                    });
                }).catch(function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            return service;
        }
    ]);
}());
