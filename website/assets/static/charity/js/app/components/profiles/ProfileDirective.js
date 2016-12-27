// (function () {
//     'use strict';
//
//     angular
//         .module('charity.profiles.directives')
//         .directive('filesModel', filesModelDirective);
//
//     function filesModelDirective(){
//         return {
//             controller: function($parse, $element, $attrs, $scope){
//                 var exp = $parse($attrs.filesModel);
//
//                 $element.on('change', function(){
//                     exp.assign($scope, this.files);
//                     $scope.$apply();
//                 });
//             }
//         };
//     };
// })();

(function () {
    'use strict';

    angular
        .module('charity.profiles.directives')
        .directive('uploadFiles', uploadFiles);

    function uploadFiles(){
        return {
            scope: true,        //create a new scope
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var files = event.target.files;
                    //iterate files since 'multiple' may be specified on the element
                    for (var i = 0; i < files.length; i++) {
                        //emit event upward
                        scope.$emit("seletedFile", { file: files[i] });
                    }
                });
            }
        };
    };
})();