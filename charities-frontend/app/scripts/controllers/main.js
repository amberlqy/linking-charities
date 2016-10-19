'use strict';

/**
 * @ngdoc function
 * @name linkingCharitiesWorldwideAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the linkingCharitiesWorldwideAppApp
 */


angular.module('linkingCharitiesWorldwideAppApp')
  .controller('MainCtrl', function ($scope, $modal) {
    $scope.firstCharity = 'firstCharity';

    $scope.addCharity = function () {
      showCharityModalView({});
    };

    function showCharityModalView(charity) {
      var modalInstance = $modal.open({
        templateUrl: 'views/charity-edit-modal.html',
        controller: 'CharityModalInstanceCtrl',
        scope: $scope,
        resolve: {} // empty storage
        /*
         resolve: {
         action: function () {
         if (charity.id === undefined) {
         return 'Create';
         } else {
         return 'Edit';
         }
         },
         item: function () {
         return charity;
         }
         }*/
      });

      modalInstance.result.then(function () {
        //fetchProject();
      });
    }
  });


angular.module('linkingCharitiesWorldwideAppApp')
  .controller('LoginCtrl', function ($scope, $location, $rootScope, AuthenticationService, $localStorage) {
    // reset login status
    AuthenticationService.ClearCredentials();

    $scope.isLogin = $localStorage.isLogin;
    //alert($rootScope.globals.isLogin);

    $scope.login = function(){
      $scope.dataLoading = true;
      AuthenticationService.Login($scope.username, $scope.password, function(response) {
        if(response.success) {
          AuthenticationService.SetCredentials($scope.username, $scope.password);
          $scope.dataLoading = false;
          $scope.isLogin = true;
          $scope.error = null;
          $localStorage.isLogin = true;
          $localStorage.token = response.token;
          //$location.path('/about');
        } else {
          $scope.error = response.message;
          $scope.dataLoading = false;
          $scope.isLogin = false;
        }
      });
    }

    $scope.logout = function(){
      // reset login status
      AuthenticationService.ClearCredentials();
      $scope.isLogin = false;
      $scope.error = null;
      $scope.username = '';
      $scope.password = '';
      delete $localStorage.isLogin;
      delete $localStorage.token;
      $location.path('/');
    }
  });
