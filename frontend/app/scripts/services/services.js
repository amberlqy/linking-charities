'use strict';

app.factory('userData', function() {
    return {
        user: {
            firstName: 'Pat',
            lastName: 'Khaolaorr',
            startDate: new Date(2016, 9, 14), // month value is 0 based, others are 1 based.
            dashes: 'remove space between words'
        }
    }
});

// If there is REST API, we can get or post data via http command
app.factory('gitHubUserLookup', function($http) {
    return {
        lookupUser: function(user) {
            console.log('Looking up user: ' + user);
            return $http.get("https://api.github.com/users/" + user)
                .then(function(response) {
                        return response;
                    },
                    // error handler
                    function(response) {
                        return response;
                    });
        }
    }
});

app.factory('imageIcon', function() {
    return {
          getPictureFromUrl: function() {
          return 'https://www.facebook.com/images/fb_icon_325x325.png';
        }
    }
});
