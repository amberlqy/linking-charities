
(function () {
    'use strict';

    angular
        .module('charity.profiles.services')
        .factory('Profile', Profile);

    Profile.$inject = ['$http', 'Authentication'];

    function Profile($http, Authentication) {
        return {
            update: update,
            getProfile: getSpecificCharityProfile,
            getAuthenticatedAccount: getAuthenticatedAccount,
            getActivity: getCharityActivity,
            getSetting: getSettingInfo,
            setSetting: setSettingInfo,
            getRating: getRatingInfo
        };

        // Return the specific profile information.
        function getSpecificCharityProfile(profileName) {
            return $http.get('/api/charity/get_charity/', {params: {"name": profileName}});
        }

        // Returns important details about the authenticated user/charity
        function getAuthenticatedAccount() {
            return Authentication.getAuthenticatedAccount();
        }

        // Updates the charity's profile
        function update(profile) {
            return $http.post('/api/auth/charity_profile/', profile);
        }

        // Return activity information.
        function getCharityActivity(profileName) {
            return $http.get('/api/charity/get_activity/', {params: {"name": profileName}});
        }

        // Return account setting
        function getSettingInfo(profileName){
            return $http.get('/api/charity/settings/', {params: {"name": profileName}});
        }

        function setSettingInfo(setting){
            return $http.post('/api/charity/settings/', setting);
        }

        // Return rating info
        function getRatingInfo(profileName){
            return $http.get('/api/charity/charity_rating_aggregates/', {params: {"charity_name": profileName}});
        }
    }
})();