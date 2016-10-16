'use strict';

var MyFirstController = function($scope, $http, userData, imageIcon, gitHubUserLookup) {
  $scope.data = userData.user;

  $scope.getPictureFromUrl = function() {
    return imageIcon.getPictureFromUrl();
  };

  $scope.getGitHubUser = function(username) {
    console.log("username: " + username);
    gitHubUserLookup.lookupUser(username).then(onLookupComplete, onError);
  };

  var onLookupComplete = function(response) {
    $scope.user = response.data;
    $scope.status = response.status;

  };

  var onError = function(reason) {
    $scope.error = "Ooops, something went wrong..";
  };
};

app.controller("TestInfoCtrl", MyFirstController);
