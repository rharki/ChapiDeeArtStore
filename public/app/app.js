

var artWebsiteApp = angular.module('artWebsiteApp', ['artWebsiteAppRoutes', 'mainController', 'userController', 'homeController', 'collectionsController', 'productController', 'masterServices', 'uploadController', 'uploadcollectionController', 'uploadFileService', 'routeStyles', 'fileModelDirective', 'ngAnimate']);

artWebsiteApp.config(['$httpProvider', function($httpProvider){
  // console.log('from app.js file - testing Main application!');
  // $httpProvider.interceptors.push('AuthInterceptors');
}]);
