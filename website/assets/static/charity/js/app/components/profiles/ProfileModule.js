
(function () {
    'use strict';

    angular
        .module('charity.profiles', [
            'charity.profiles.controllers',
            'charity.profiles.services',
            'charity.profiles.directives',
            'chart.js'
        ]);

    angular
        .module('charity.profiles.controllers', ['ngSanitize', 'ui.bootstrap', 'ngResource']);

    angular
        .module('charity.profiles.services', []);

    angular
        .module('charity.profiles.directives', []);
})();