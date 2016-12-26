(function () {
    'use strict';

    angular
        .module('charity.profiles.directives')
        .directive('filesModel', filesModelDirective);

    function filesModelDirective(){
        return {
            controller: function($parse, $element, $attrs, $scope){
                var exp = $parse($attrs.filesModel);

                $element.on('change', function(){
                    exp.assign($scope, this.files);
                    $scope.$apply();
                });
            }
        };
    };
})();