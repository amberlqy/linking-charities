
(function () {
    'use strict';

    angular
        .module('charity.profiles.services')
        .factory('Profile', Profile);

    Profile.$inject = ['$http', '$cookies'];

    function Profile($http, $cookies) {

        return {
            destroy: destroy,
            get: get,
            update: update
        };

        function destroy(profile) {
            return $http.delete('/api/auth/accounts/' + profile.id + '/');
        }

        function get(username) {
            return $http.get('/api/auth/accounts/' + username + '/');
        }

        function update(profile) {
            return $http.post('/api/auth/charity_profile/' + profile + '/' + $cookies.get('token') + '/');
            //return $http.put('/auth/api/accounts/' + profile.username + '/', profile);
        }
    }
})();