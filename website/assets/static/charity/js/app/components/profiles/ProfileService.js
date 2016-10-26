
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
            //return $http.post('/api/auth/charity_profile/' + profile + '/');// + $cookies.get('token') + '/');
            //return $http.put('/auth/api/accounts/' + profile.username + '/', profile);
            var parameter = JSON.stringify(
                {
                    "charity_name": "Test",
                    "location": "London",
                    "goal": "Cure",
                    "address": "14 London",
                    "phone_number": "0789456"
                }
            );

            /*
            var res = $http.post('/auth/api/charity_profile/', parameter);
		    res.success(function(data, status, headers, config) {
			    alert("Success: " + JSON.stringify({data: data}));

                //$scope.message = data;
		    });
		    res.error(function(data, status, headers, config) {
			    alert( "failure message: " + JSON.stringify({data: data}));
		    });*/


            return $http({
                method: 'POST',
                url: '/api/auth/charity_profile/',
                //url: '/auth/api/charity_profile/',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // Change profile to parameter if it doesn't work
                data: profile//parameter//profile
            })
        }
    }
})();