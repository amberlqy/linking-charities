
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
            getCurrent: getCurrentCharityProfile,
            getProfile: getSpecificCharityProfile,
            getAuthenticatedAccount: getAuthenticatedAccount,
            getActivity: getCharityActivity,
            uploadActivityPicture: uploadActivityPicture
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
        function getCurrentCharityProfile() {
            return $http.get('/api/auth/charity_profile/');
        }

        // Return the specific profile information.
        function getSpecificCharityProfile(profileName) {
            return $http.get('/api/charity/charity_search/', {params: {"id": profileName}});
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
            return $http.get('/api/charity/get_activity/', {params: {"id": profileName}});
        }

        // Upload activity picture
        function uploadActivityPicture() {
            return $resource('/api/images/:pk/', {'pk': '@pk'}, { // Change into our URL
                'save': {
                    method: 'POST',
                    transformRequest: transformImageRequest,
                    headers: {'Content-Type':undefined}
                }
            });
        }

        // Transform uploaded image
        function transformImageRequest(data) {
            if (data === undefined)
                return data;

            var fd = new FormData();
            angular.forEach(data, function(value, key) {
                if (value instanceof FileList) {
                    if (value.length == 1) {
                        fd.append(key, value[0]);
                    } else {
                        angular.forEach(value, function(file, index) {
                            fd.append(key + '_' + index, file);
                        });
                    }
                } else {
                    fd.append(key, value);
                }
            });

            return fd;
        }
    }
})();