
(function () {
    'use strict';

    angular
        .module('charity.profiles.services')
        .factory('Profile', Profile);

    Profile.$inject = ['$http', '$cookies', 'Authentication'];

    function Profile($http, $cookies, Authentication) {

        return {
            destroy: destroy,
            get: get,
            update: update,
            getCurrent: getCurrentCharityProfile,
            getAuthenticatedAccount: getAuthenticatedAccount
        };

        function destroy(profile) {
            // TODO: outdated
            return $http.delete('/api/auth/accounts/' + profile.id + '/');
        }

        function get(username) {
            // TODO: outdated
            return $http.get('/api/auth/accounts/' + username + '/');
        }

        // Returns the profile information of the currently logged in charity. No parameters are needed.
        function getCurrentCharityProfile(){
            return $http.get('/api/auth/charity_profile/');
        }

        // Returns important details about the authenticated user/charity
        function getAuthenticatedAccount() {
            return Authentication.getAuthenticatedAccount();
        }

        // Updates the charity's profile
        function update(profile) {

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