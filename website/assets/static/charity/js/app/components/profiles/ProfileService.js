
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
            return $http.delete('/auth/api/accounts/' + profile.id + '/');
        }

        function get(username) {
            return $http.get('/auth/api/accounts/' + username + '/');
        }

        function update(profile) {
            return $http.post('/auth/api/charity_profile/' + profile + '/' + $cookies.get('token') + '/');
            //return $http.put('/auth/api/accounts/' + profile.username + '/', profile);
        }
    }
})();