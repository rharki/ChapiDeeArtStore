
var artWebsiteAppRoutes = angular.module('artWebsiteAppRoutes', ['ngRoute']);

artWebsiteAppRoutes.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    // console.log('testing artWebsiteAppRoutes');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $routeProvider
    .when('/home', {
      templateUrl: 'app/views/pages/home.html',
      controller: 'homeCtrl',
      controllerAs: 'home',
      css: ['assets/css/main.css', 'assets/css/font-awesome.min.css', 'assets/css/mystyles.css']
    })
    .when('/collections/:collectionid', {
      templateUrl: 'app/views/pages/collections.html',
      controller: 'collectionsCtrl',
      controllerAs: 'collections',
      css: ['assets/css/main.css', 'assets/css/font-awesome.min.css', 'assets/css/mystyles.css']
    })
    .when('/product/:imageid', {
      templateUrl: 'app/views/pages/product/product.html',
      controller: 'productCtrl',
      controllerAs: 'product',
      css: ['assets/css/main.css', 'assets/css/font-awesome.min.css', 'assets/css/mystyles.css']
    })
    .when('/admin', {
      templateUrl: 'app/views/pages/admin/admin.html',
      css: ['assets/css/bootstrap/bootstrap.css', 'assets/css/bootstrap/bootstrap.min.css', 'assets/css/bootstrap/mybootstrap.css']
    })
    .when('/admin/photo', {
      templateUrl: 'app/views/pages/admin/upload.html',
      controller: 'uploadCtrl',
      controllerAs: 'upload',
      css: ['assets/css/bootstrap/bootstrap.css', 'assets/css/bootstrap/bootstrap.min.css', 'assets/css/bootstrap/mybootstrap.css']
    })
    .when('/admin/collection', {
      templateUrl: 'app/views/pages/admin/collection.html',
      controller: 'uploadcollectionCtrl',
      controllerAs: 'collection',
      css: ['assets/css/bootstrap/bootstrap.css', 'assets/css/bootstrap/bootstrap.min.css', 'assets/css/bootstrap/mybootstrap.css']
    })
    .otherwise({
      redirectTo: '/home'
    });
}]);
