(function(){
    var app = angular.module('LazMovieReviews', [
        'ngRoute',
        'firebase',
        'LocalStorageModule'
    ]);

    app.config([
        '$locationProvider',
        'localStorageServiceProvider',
        function($locationProvider, localStorageServiceProvider) {
            $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
            });

            localStorageServiceProvider.setPrefix('LazMovieReviews');
        }
    ]);

    app.controller('AppController', [
        '$scope',
        '$rootScope',
        'AuthService',
        function($scope, $rootScope, AuthService) {
            $scope.isAuthenticated = AuthService.isAuthenticated();

            $scope.user = {
                email: '',
                password: ''
            };

            $scope.login = function() {
                AuthService.login($scope.user.email, $scope.user.password).then(function() {
                    $scope.isAuthenticated = AuthService.isAuthenticated();
                });
            };

            $rootScope.logout = function() {
                AuthService.logout();
                $scope.isAuthenticated = AuthService.isAuthenticated();
            };

            $scope.signup = function() {
                console.log('signing up');
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
                    console.error('Authentication failed:', error);
                    deferred.reject();
                });

                return deferred.promise;
            };

            return service;
        }
    ]);
}());
