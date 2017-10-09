
angular.module('homeController', ['masterServices'])

    .controller('homeCtrl', ['$http', '$timeout', '$location', 'Master', '$scope', function($http, $timeout, $location, Master, $scope) {

        // console.log('testing homeController');
        var app = this;
        var numberofimages = 4;
        $scope.bannerimages = [];
        $scope.currentimageindex = 0;

        getBannerImages();

        function getBannerImages() {
            Master.getBannerImages().then(function(data) {
                app.allbannerimages = data.data.bannerimages;
                if (numberofimages > app.allbannerimages.length) {
                    numberofimages = app.allbannerimages.length;
                }
                for (var i = 0; i < numberofimages; i++) {
                    $scope.bannerimages[i] = app.allbannerimages[i];
                }
                $scope.currentimagename = $scope.bannerimages[$scope.currentimageindex];
                // console.log($scope.currentimagename);
            });
        }

        app.plusSlides = function (n) {
        	app.showSlides($scope.currentimageindex += n);
        };

        app.showSlides = function (n) {
            // console.log(numberofimages);
        	var i;
        	if (n > numberofimages - 1) {
        		$scope.currentimageindex = 0;
        	} else if (n < 0) {
        		$scope.currentimageindex = numberofimages - 1;
        	} else {
                $scope.currentimageindex = n;
            }
            $scope.currentimagename = $scope.bannerimages[$scope.currentimageindex];
        };

        function getAllCollections(){
            Master.getAllCollections().then(function(data) {
                if (!data.data.success) {
                    app.uploading = false;
                    app.message = "Cannot fetch collections, please refresh page and try!";
                } else {
                    app.uploading = false;
                    app.message = "Collections fetched successfully!";
                    // console.log(data.data.collections);
                    $scope.collections = data.data.collections;
                }
            });
        }

        getAllCollections();

    }]);
