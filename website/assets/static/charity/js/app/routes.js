
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
        }).when('/profile/:name', {
            controller: 'ProfileController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_edit.html',
            resolve: {
                profilePrepService: function($route, Profile){
                    var name = $route.current.params.name;
                    return Profile.getProfile(name);
                },
                ratingPrepService: function($route, Profile){
                    var name = $route.current.params.name;
                    return Profile.getRating(name);
                }
            }
        }).when('/profile/:name/new_activity', {
            controller: 'ProfileNewActivityController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_new_activity.html'
        }).when('/profile/:name/activities', {
            controller: 'ProfileActivityController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_activity.html',
            resolve: {
                activityPrepService: function($route, Profile){
                    var name = $route.current.params.name;
                    return Profile.getActivity(name);
                }
            }
        }).when('/profile/:name/activity/:id', {
            controller: 'ProfileActivityAlbumController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_activity_album.html'
        }).when('/profile/:name/setting', {
            controller: 'ProfileSettingsController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/profiles/profile_setting.html',
            resolve: {
                settingPrepService: function($route, Profile){
                    var name = $route.current.params.name;
                    return Profile.getSetting(name);
                }
            }
        }).when('/dashboard', {
            controller: 'DashboardController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/dashboard/dashboard.html'
        }).when('/search/:searchKey', {
            controller: 'SearchController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/search/search.html',
            resolve: {
                searchPrepService: function($route, $location, Search){
                    var prefixKey = $route.current.params.searchKey;
                    var searchKey = $location.search();
                    if (prefixKey != "key" || (searchKey.name == undefined && searchKey.filter == undefined && searchKey.country == undefined
                        && searchKey.city == undefined && searchKey.tag == undefined)) {
                        alert("Page Not Found. We could not find the page you requested.");
                        $location.url('/home');
                        return;
                    }
                    // Set search key param(s)
                    if (searchKey.filter == undefined && searchKey.country == undefined && searchKey.city == undefined && searchKey.tag == undefined) {
                        return Search.search(searchKey);
                    } else {
                        return Search.advanceSearch(searchKey);
                    }
                }
            }
        }).when('/payment', {
            controller: 'PaymentController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/payment/payment.html'
        }).when('/payment_confirmation/:charity_username', {
            controller: 'PaymentController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/payment/payment_confirmation.html'
        }).when('/user/:name', {
            controller: 'UserController',
            controllerAs: 'vm',
            templateUrl: '/static/charity/js/app/components/user/user.html'
        }).otherwise({
            redirectTo: '/home'
        });
    }
})();