
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

        // Updates the charity's profile
        function update(profile) {
            console.log(profile);

            var data = JSON.stringify(profile);

            return $http.post('/api/auth/charity_profile/', profile).then(updateSuccessFn, updateErrorFn);

            function updateSuccessFn(data, status, headers, config) {
                console.log('Update successful!');
            }

            function updateErrorFn(data, status, headers, config) {
                console.error('Update failed!' + status);
            }
        }
    }
})();