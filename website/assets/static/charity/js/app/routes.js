
(function () {
    'use strict';

    angular
        .module('routes')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider.when('/register', {
            controller: 'RegisterController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/authentication/register.html',
            activeTab: 'register'
        }).when('/login', {
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/authentication/login.html',
            activeTab: 'login'
        }).when('/home', {
            controller: 'IndexController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/home/home.html',
            activeTab: 'home'
        }).when('/+:username/profile', {
            controller: 'ProfileController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_edit.html'
        }).when('/+:username/new_activity', {
            controller: 'ProfileNewActivityController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_new_activity.html'
        }).when('/+:username/activities', {
            controller: 'ProfileActivityController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_activity.html'
        }).when('/+:username/setting', {
            controller: 'ProfileSettingsController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_setting.html'
        }).when('/dashboard', {
            controller: 'DashboardController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/dashboard/dashboard.html'
        }).when('/search/:searchKeyWord', {
            controller: 'SearchController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/search/search.html'
        }).when('/charityprofile/:id', {
            controller: 'CharityProfileController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/charityprofile/charityprofile.html'
        }).otherwise({
            redirectTo: '/home'
        });
    }
})();