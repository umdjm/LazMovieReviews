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
        '$rootScope',
        '$location',
        'AuthService',
        function($scope, $rootScope, $location, AuthService) {
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
                        $rootScope.isAuthenticated = true;
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
        '$rootScope',
        '$location',
        'AuthService',
        function($scope, $rootScope, $location, AuthService) {
            if (AuthService.isAuthenticated()) {
                $location.path('/');
            }

            $scope.user = {
                email: '',
                password: ''
            };

            $scope.errorMessage = '';
            $scope.signup = function() {
                if ($scope.signupForm.$valid) {
                    AuthService.signup($scope.user.email, $scope.user.password).then(function() {
                        $rootScope.isAuthenticated = true;
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
        function($q, $firebaseAuth, LocalStorage) {
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
                if (!self.isAuthenticated) {
                    return {};
                }

                return self.user;
            };

            service.login = function(email, password) {
                var deferred = $q.defer();

                auth.$signInWithEmailAndPassword(email, password).then(function(user) {
                    self.user = user;
                    LocalStorage.set('user', self.user);
                    deferred.resolve(self.user);
                }).catch(function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            service.signup = function(email, password) {
                var deferred = $q.defer();

                auth.$createUserWithEmailAndPassword(email, password).then(function(user) {
                    self.user = user;
                    LocalStorage.set('user', self.user);
                    deferred.resolve(self.user);
                }).catch(function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            return service;
        }
    ]);
}());
