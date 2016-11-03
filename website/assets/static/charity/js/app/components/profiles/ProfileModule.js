
(function () {
    'use strict';

    angular
        .module('charity.profiles', [
            'charity.profiles.controllers',
            'charity.profiles.services'
        ]);

    angular
        .module('charity.profiles.controllers', ['ngSanitize']);

    angular
        .module('charity.profiles.services', []);
})();