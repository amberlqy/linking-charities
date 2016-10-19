'use strict';

angular.module('linkingCharitiesWorldwideAppApp')
  .controller('SignUpCtrl', function ($scope, $modal, $http) {

    $scope.newSignup = function () {
      showSignUpModalView({});
    };

    function showSignUpModalView() {
      var modalInstance = $modal.open({
        templateUrl: 'views/sign-up-modal.html',
        controller: 'SignUpCtrl',
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

    $scope.save = function () {
      loading();

      saveSignup();

      function saveSignup() {
        // use $.param jQuery function to serialize data from JSON
        var data = $.param({
          fName: $scope.firstName,
          lName: $scope.lastName
        });

        var dataObj = {
          name : $scope.name,
          employees : $scope.employees,
          headoffice : $scope.headoffice
        };

        var res = $http.post('URL Here', dataObj);
        res.success(function(data, status, headers, config) {
          $scope.message = data;
        });
        res.error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });

        $modalInstance.close();

        /*
         var config = {
         headers : {
         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
         }
         }

         // 3 parameters for content-type
         $http.post('/ServerRequest/PostDataResponse', data, config)
         .success(function (data, status, headers, config) {
         alert('aaaa');
         $scope.PostDataResponse = data;
         })
         .error(function (data, status, header, config) {
         alert('bbb');
         $scope.ResponseDetails = "Data: " + data +
         "<hr />status: " + status +
         "<hr />headers: " + header +
         "<hr />config: " + config;
         });*/
      };

      //Charity.save($scope.item).then(function () {
      //$modalInstance.close();
      //});
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    /*
     $scope.action = action;

     $scope.remove = function () {
     loading();
     Charity.remove($scope.item).then(function () {
     $modalInstance.close();
     });
     };
     */

    function loading() {
      document.getElementById('signup-button-save').disabled = true;
      document.getElementById('signup-button-cancel').disabled = true;
      document.getElementById('loading-icon').style.visibility = 'visible';
    }
  });
