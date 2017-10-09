
angular.module('collectionsController', ['masterServices'])

    .controller('collectionsCtrl', ['$http', '$timeout', '$location', 'Master', '$scope', '$routeParams', function($http, $timeout, $location, Master, $scope, $routeParams) {

        // console.log('testing galleryController');
        var app = this;
        var thisCollection = null;

        // app.collectionid = '59be2051143d79200f352bde';
        app.collectionid = $routeParams.collectionid;
        // console.log("collection id is " + app.collectionid);
        app.tagandcategoryids = {};

        function getCollectionImages(){
            Master.getCollection(app.collectionid).then(function(data) {
                // console.log('Fetching Categories running');
                if (!data.data.success) {
                    app.uploading = false;
                    app.message = "Cannot fetch details of collections, please refresh page to retry!";
                } else {
                    app.collection = data.data.collection;
                    // console.log(app.collection);
                    // console.log('Collection details fetched successfully!');
                    $scope.collectionname = app.collection.collectionname;
                    $scope.collectioncategoryid = app.collection.categories[0]._id;
                    // console.log($scope.collectioncategoryid);
                    app.uploading = false;
                    app.tagandcategoryids.tagids = [];
                    for (var a in app.collection.tags) {
                        app.tagandcategoryids.tagids.push(app.collection.tags[a]._id);
                    }
                    app.tagandcategoryids.categoryids = [];
                    for (var b in app.collection.categories) {
                        app.tagandcategoryids.categoryids.push(app.collection.categories[b]._id);
                    }
                    // app.tagandcategoryids.test = ["59bcce8178d6830718358737"];
                    // console.log(app.tagandcategoryids);
                    Master.getImagesByTagAndCategory(app.tagandcategoryids).then(function(data) {
                        if (!data.data.success) {
                            app.uploading = false;
                            app.message = "Cannot fetch image details from tags and category, please retry!";
                        } else {
                            app.uploading = false;
                            app.message = "Collection Details fetched successfully!";
                            // console.log(data.data.images);
                            app.images = data.data.images;
                        }
                    });
                }
            });
        }

        function getAllCollections(){
            Master.getAllCollections().then(function(data) {
                if (!data.data.success) {
                    app.uploading = false;
                    app.message = "Cannot fetch all collections, please refresh page and try!";
                } else {
                    app.uploading = false;
                    app.message = "Collections fetched successfully!";
                    app.allcollections = data.data.collections;
                    // console.log(app.allcollections);
                    for (var k in app.allcollections) {
                        if (app.collectionid == app.allcollections[k]._id) {
                            app.thisCollection = k;
                            break;
                        }
                    }
                    // console.log(app.thisCollection);
                    app.allcollections.splice(app.thisCollection, 1);
                    // console.log(app.allcollections);
                }
            });
        }

        getAllCollections();
        getCollectionImages();


        // collection: 59be2454fedbde20bc569c19
        // tag: nature: 59bcce8178d6830718358737
        // category: painting: 59bcd090fd85930780b3d57d
        // category: murals: 59bce0e55873bb09fa6e6914

        // Master.getCollection('59be2454fedbde20bc569c19')



    }]);
