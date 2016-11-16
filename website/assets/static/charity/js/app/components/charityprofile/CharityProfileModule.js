
(function () {
    'use strict';

    angular
        .module('charity.charityprofile', [
            'charity.charityprofile.controllers',
            'charity.charityprofile.services'
        ]);

    angular
        .module('charity.charityprofile.controllers', ['ui.bootstrap.carousel']);

    angular
        .module('charity.charityprofile.services', []);
})();