
(function () {
    'use strict';

    angular
        .module('charity.navbar', [
            'charity.navbar.controllers',
            'charity.navbar.directives'
        ]);

    angular
        .module('charity.navbar.controllers', ['angucomplete-alt', 'ui.bootstrap']);

    angular
        .module('charity.navbar.directives', []);
})();