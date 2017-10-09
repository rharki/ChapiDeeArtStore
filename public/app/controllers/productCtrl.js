
angular.module('productController', ['masterServices'])

    .controller('productCtrl', ['$http', '$timeout', '$location', 'Master', '$scope', '$routeParams', function($http, $timeout, $location, Master, $scope, $routeParams) {

        // console.log('testing productController');
        var app = this;
        app.uploading = false;
        app.message = "";
        app.imageid = $routeParams.imageid;
        console.log("image id is " + app.imageid);

        function getImageByImageIDMaster(imageid) {
            Master.getImageByImageID(imageid).then(function(data) {
                if (!data.data.success) {
                    app.uploading = true;
                    // app.message = "Cannot fetch image details from tags and category, please retry!";
                } else {
                    app.uploading = false;
                    app.message = "Collection Details fetched successfully!";
                    // console.log(data.data.image);
                    app.image = data.data.image;
                    $scope.keyimage = angular.copy(app.image);
                    console.log($scope.keyimage);
                }
            });
        }

        getImageByImageIDMaster(app.imageid);



    }]);
