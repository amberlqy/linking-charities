
(function () {
    'use strict';

    angular
        .module('charity.profiles', [
            'charity.profiles.controllers',
            'charity.profiles.services'
        ]);

    angular
        .module('charity.profiles.controllers', ['ngSanitize', 'ui.bootstrap']);

    angular
        .module('charity.profiles.services', []);
})();