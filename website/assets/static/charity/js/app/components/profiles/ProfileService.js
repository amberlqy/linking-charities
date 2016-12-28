
(function () {
    'use strict';

    angular
        .module('charity.profiles.services')
        .factory('Profile', Profile);

    Profile.$inject = ['$http', 'Authentication', '$resource'];

    function Profile($http, Authentication, $resource) {
        return {
            destroy: destroy,
            get: get,
            update: update,
            getProfile: getSpecificCharityProfile,
            getAuthenticatedAccount: getAuthenticatedAccount,
            getActivity: getCharityActivity,
            getSetting: getSettingInfo,
            setSetting: setSettingInfo
        };

        function destroy(profile) {
            // TODO: outdated
            return $http.delete('/api/auth/accounts/' + profile.id + '/');
        }

        function get(username) {
            // TODO: outdated
            return $http.get('/api/auth/accounts/' + username + '/');
        }

        // Return the specific profile information.
        function getSpecificCharityProfile(profileName) {
            return $http.get('/api/charity/charity_search/', {params: {"name": profileName}});
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

        // Return activity information.
        function getCharityActivity(profileName) {
            return $http.get('/api/charity/get_activity/', {params: {"name": profileName}});
        }

        // TODO : GET + POST Setting Info
        // Return account setting
        function getSettingInfo(profileName){
            return $http.get('URL', {params: {"name": profileName}});
        }

        function setSettingInfo(setting){
            return $http.post('URL', setting).then(updateSuccessFn, updateErrorFn);

            function updateSuccessFn(data, status, headers, config) {
                console.log('Update successful!');
            }

            function updateErrorFn(data, status, headers, config) {
                console.error('Update failed!' + status);
            }
        }
    }
})();