
angular.module('uploadController', ['masterServices', 'fileModelDirective'])

    .controller('uploadCtrl', ['$http', '$timeout', '$location', 'Master', '$scope', 'uploadFile', function($http, $timeout, $location, Master, $scope, uploadFile) {

        // console.log('testing uploadController');
        var app = this;
        app.defaultcategoryid = '59bcd090fd85930780b3d57d';
        app.uploading = false;
        app.message = false;
        $scope.file = {};
        app.selectedexercise = false;
        app.showuploadoptions = false;
        app.selectedcategoryid = null;
        app.selectedtagname = [];

        function getCategoryAndTag(){
            app.uploading = false;
            Master.getCategory().then(function(data) {
                // console.log('Fetching Categories running');
                if (data.data.success) {
                    app.categories = data.data.categories;
                    app.uploading = true;
                    // console.log('Category list fetched successfully!');
                    // console.log(app.categories);
                } else {
                    app.uploading = true;
                    app.message = "Cannot fetch list of categories, please refresh page to retry!";
                }
            });
            Master.getTag().then(function(data) {
                app.uploading = false;
                // console.log('Fetching Tags running');
                if (data.data.success) {
                    app.tags = data.data.tags;
                    app.uploading = true;
                    // console.log('Tag list fetched successfully!');
                    // console.log(app.tags);
                } else {
                    app.uploading = true;
                    app.message = "Cannot fetch list of tags, please refresh page to retry!";
                }
            });
        }

        getCategoryAndTag();

        $scope.photoChanged = function(files) {
            // console.log(app.selectedexercise);
            if (files.length > 0 && files[0].name.match(/\.(jpeg|jpg|png)$/)) {
                app.uploading = true;
                var file = files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    // console.log('inside if loop');
                    $timeout(function() {
                        $scope.thumbnail = {};
                        $scope.thumbnail.dataUrl = e.target.result;
                        app.uploading = false;
                        app.message = false;
                        // console.log('finished generating preview');
                    });
                };
            } else {
                console.log('failed to generate preview');
                $scope.thumbnail = {};
                $scope.alert = "alert alert-danger";
                app.message = 'Sorry, failed to generate preview';
                app.uploading = true;
            }
        };

        app.Submit = function() {
            app.uploading = false;
            if ($scope.uploadPhotoactive == true) {
                app.tagids = "";
                for (var key in app.tags) {
                    if (app.selectedtagname[key] == true) {
                        // console.log(app.tags[key].tagname);
                        app.tagids += app.tags[key]._id + ",";
                    }
                }
                if (app.tagids.length > 0) {
                    app.tagids = app.tagids.substring(0, app.tagids.length - 1);
                }
                app.selectedimagename = app.selectedimagename;
                app.selectedimagedesc = app.selectedimagedesc;
                // console.log(app.tagids);
                // app.tagnames = "nature,citylife";
                // app.categoryname = "paintings";
                app.categoryid = app.selectedcategoryid;
                uploadFile.upload($scope.file, app.tagids, app.categoryid, app.selectedimagename, app.selectedimagedesc).then(function(data) {
                    if (data.data.success) {
                        app.uploading = true;
                        $scope.alert = "alert alert-success";
                        app.message = data.data.message;
                        $scope.file = {};
                    } else {
                        app.uploading = true;
                        $scope.alert = "alert alert-danger";
                        app.message = data.data.message;
                        $scope.file = {};
                    }
                });
            } else if ($scope.uploadPhotoactive == false) {
                // action for saving the edited photo
                app.editPhotoDetails = {};
                app.editPhotoDetails.imageid = app.editPhotoId;
                app.editPhotoDetails.keyitemname = app.selectedimagename;
                app.editPhotoDetails.keyitemdesc = app.selectedimagedesc;
                app.editPhotoDetails.primarycategory = app.selectedcategoryid;
                app.editPhotoDetails.tags = [];
                for (var k in app.tags) {
                    if (app.selectedtagname[k] == true) {
                        // console.log(app.tags[key].tagname);
                        app.editPhotoDetails.tags.push(app.tags[k]._id);
                    }
                }
                console.log(app.editPhotoDetails);
                Master.editImage(app.editPhotoDetails).then(function successCallback(data) {
                    console.log(data.data.message);
                    app.uploading = false;
                    $scope.alert = "alert alert-success";
                    app.message = data.data.message;
                }, function errorCallback(err) {
                    console.log(data.data.message);
                    app.uploading = false;
                    $scope.alert = "alert alert-danger";
                    app.message = data.data.message;
                });
            }
        };

        function resetValues() {
            app.selectedcategoryid = "";
            for (var key in app.selectedtagname) {
                app.selectedtagname[key] = null;
            }
            app.selectedimagename = "";
            app.selectedimagedesc = "";
        }

        app.editPhotoChanged = function(i) {
            // console.log(i);
            var indexChanged = null;
            for (var k in app.photos) {
                if (i == app.photos[k]._id) {
                    indexChanged = k;
                    break;
                }
            }
            resetValues();
            app.selectedimagename = app.photos[indexChanged].keyitemname;
            app.selectedimagedesc = app.photos[indexChanged].keyitemdesc;
            app.selectedcategoryid = app.photos[indexChanged].primarycategory;
            app.selectedtags = app.photos[indexChanged].tags;
            for (var b in app.selectedtags) {
                for (var a in app.tags) {
                    if (app.selectedtags[b] == app.tags[a]._id) {
                        app.selectedtagname[a] = true;
                    }
                }
            }
        };

        app.uploadPhoto = function() {
            $scope.pagetitle = "Upload New Photo";
            $scope.pagecalltoaction = "Upload Photo";
            $scope.uploadPhotoactive = true;
            resetValues();
        };

        app.editPhoto =function() {
            $scope.pagetitle = "Edit Photo";
            $scope.pagecalltoaction = "Edit Photo";
            $scope.uploadPhotoactive = false;
            Master.getPhotosByCategory(app.defaultcategoryid).then(function(data) {
                // console.log('Fetching Images running');
                if (data.data.success) {
                    app.photos = data.data.images;
                    app.uploading = true;
                    // console.log('Photos list fetched successfully!');
                    // console.log(app.photos);
                } else {
                    app.uploading = true;
                    app.message = "Cannot fetch list of photos, please refresh page to retry!";
                }
            });
            resetValues();

        };

        this.uploadPhoto();
        // this.editPhoto();
    }]);
