
angular.module('uploadcollectionController', ['masterServices'])

    .controller('uploadcollectionCtrl', ['$http', '$timeout', '$location', 'Master', '$scope', function($http, $timeout, $location, Master, $scope) {

        // console.log('testing uploadcollectionController');
        var app = this;
        app.message = "";
        app.uploading = false;
        app.selectedcategoryid = [];
        app.selectedtagname = [];

        function getCategoryAndTag(){
            app.uploading = false;
            Master.getCategory().then(function(data) {
                // console.log('Fetching Categories running');
                if (data.data.success) {
                    app.categories = data.data.categories;
                    // app.uploading = true;
                    // app.message = 'Category list fetched successfully!';
                    // console.log('Category list fetched successfully!');
                    // console.log(app.categories);
                } else {
                    app.uploading = true;
                    $scope.alert = "alert alert-danger";
                    app.message = "Cannot fetch list of categories, please refresh page to retry!";
                }
            });
            Master.getTag().then(function(data) {
                // console.log('Fetching Tags running');
                app.uploading = false;
                if (data.data.success) {
                    app.tags = data.data.tags;
                    // app.uploading = true;
                    // app.message = 'Tag list fetched successfully!';
                    // console.log('Tag list fetched successfully!');
                    // console.log(app.tags);
                } else {
                    app.uploading = true;
                    $scope.alert = "alert alert-danger";
                    app.message = "Cannot fetch list of tags, please refresh page to retry!";
                }
            });
        }

        function getPhotosByCategory(categoryid) {
            app.uploading = false;
            Master.getPhotosByCategory(categoryid).then(function(data) {
                // console.log('Fetching Images of this category running');
                if (data.data.success) {
                    app.images = data.data.images;
                    // app.uploading = true;
                    // app.message = "Images for the required category fetched!";
                } else {
                    app.uploading = true;
                    $scope.alert = "alert alert-danger";
                    app.message = "Cannot fetch list of images of this category, please refresh page to retry!";
                }
            });
        }

        function getAllCollections(){
            app.uploading = false;
            Master.getAllCollections().then(function(data) {
                if (!data.data.success) {
                    app.uploading = true;
                    $scope.alert = "alert alert-danger";
                    app.message = "Cannot fetch collections, please refresh page and try!";
                } else {
                    // app.uploading = true;
                    // $scope.alert = "alert alert-success";
                    // app.message = "Collections fetched successfully!";
                    // console.log(data.data.collections);
                    app.allcollections = data.data.collections;
                }
            });
        }

        getCategoryAndTag();
        getPhotosByCategory('59bcd090fd85930780b3d57d');

        function resetValues() {
            app.selectedcategoryid = [];
            for (var key in app.selectedtagname) {
                app.selectedtagname[key] = null;
            }
            app.selectedcollname = "";
            app.selectedcolldesc = "";
        }

        app.createColl = function() {
            $scope.pagetitle = "Create New Collection";
            $scope.pagecalltoaction = "Create Collection";
            $scope.createCollactive = true;
            resetValues();
        };

        app.editColl = function() {
            $scope.pagetitle = "Edit Collection";
            $scope.pagecalltoaction = "Save Edited Collection";
            $scope.createCollactive = false;
            getAllCollections();
            resetValues();

        };

        app.editCollectionChanged = function(i) {
            var indexChanged = null;
            for (var k in app.allcollections) {
                if (i == app.allcollections[k]._id) {
                    indexChanged = k;
                    break;
                }
            }
            resetValues();
            app.selectedcollname = app.allcollections[indexChanged].collectionname;
            app.selectedcolldesc = app.allcollections[indexChanged].collectiondesc;
            app.displaysequence = app.allcollections[indexChanged].displaysequence;
            app.coverimage = app.allcollections[indexChanged].coverimage;
            app.selectedtags = app.allcollections[indexChanged].tags;
            for (var b in app.selectedtags) {
                for (var a in app.tags) {
                    if (app.selectedtags[b] == app.tags[a]._id) {
                        app.selectedtagname[a] = true;
                    }
                }
            }
            app.selectedcategories = app.allcollections[indexChanged].categories;
            for (var c in app.selectedcategories) {
                for (var d in app.categories) {
                    if (app.selectedcategories[c] == app.categories[d]._id) {
                        app.selectedcategoryid[d] = true;
                    }
                }
            }
        };

        this.createColl();
        // this.editColl();

        app.Submit = function() {
            app.uploading = false;
            app.newcollection = {};
            app.newcollection.tags = [];
            app.newcollection.categories = [];
            for (var key in app.tags) {
                if (app.selectedtagname[key] == true) {
                    // console.log(app.tags[key].tagname);
                    app.newcollection.tags.push(app.tags[key]._id);
                }
            }
            // console.log(app.newcollection.tags);
            for (var c in app.categories) {
                if (app.selectedcategoryid[c] == true) {
                    // console.log(app.categories[c].categoryname);
                    app.newcollection.categories.push(app.categories[c]._id);
                }
            }
            if ($scope.createCollactive == true) {
                // console.log(app.newcollection.categories);
                app.newcollection.collectionname = app.selectedcollname;
                app.newcollection.collectiondesc = app.selectedcolldesc;
                app.newcollection.displaysequence = app.displaysequence;
                app.newcollection.coverimage = app.coverimage;
                // console.log(app.newcollection);
                Master.createCollection(app.newcollection).then(function successCallback(data) {
                    console.log(data.data.success);
                    console.log(data.data.message);
                    if (data.data.success) {
                        //create and show success message
                        app.message = data.data.message;
                        $scope.alert = "alert alert-success";
                        app.uploading = true;
                    } else {
                        //create and show failure message
                        app.message = data.data.message;
                        $scope.alert = "alert alert-danger";
                        app.uploading = true;
                    }
                }, function errorCallback(response) {
                    console.log('Server returned error!');
                    app.message = 'Server returned error!';
                    app.uploading = true;
                });
            } else if ($scope.createCollactive == false) {
                // action for saving the edited collection
                app.editCollectionDetails = {};
                app.editCollectionDetails.collectionid = app.editCollectionId;
                app.editCollectionDetails.collectionname = app.selectedcollname;
                app.editCollectionDetails.collectiondesc = app.selectedcolldesc;
                app.editCollectionDetails.coverimage = app.coverimage;
                app.editCollectionDetails.displaysequence = app.displaysequence;
                app.editCollectionDetails.tags = app.newcollection.tags;
                app.editCollectionDetails.categories = app.newcollection.categories;
                // console.log(app.editCollectionDetails);
                Master.editCollection(app.editCollectionDetails).then(function successCallback(data) {
                    // console.log(data.data.message);
                    app.uploading = true;
                    $scope.alert = "alert alert-success";
                    app.message = data.data.message;
                }, function errorCallback(err) {
                    console.log(data.data.message);
                    app.uploading = true;
                    $scope.alert = "alert alert-danger";
                    app.message = data.data.message;
                });
            }

        };


    }]);
