
(function () {
    'use strict';

    angular
        .module('charity.profiles', [
            'charity.profiles.controllers',
            'charity.profiles.services',
            'chart.js'
        ]);

    angular
        .module('charity.profiles.controllers', ['ngSanitize', 'ui.bootstrap']);

    angular
        .module('charity.profiles.services', []);
})();