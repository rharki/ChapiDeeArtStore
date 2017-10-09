
angular.module('masterServices', [])

    .factory('Master', ['$http', function($http) {
        // console.log('Hello from masterServices');
        masterFactory = {};

        // Master.getCategory()
        masterFactory.getCategory = function(){
            return $http.get('/api/category/getcategories/');
        };

        // Master.getTag()
        masterFactory.getTag = function(){
            return $http.get('/api/tag/gettags/');
        };

        // Master.getImageByImageID(imageid)
        masterFactory.getImageByImageID = function(imageid){
            return $http.get('/api/getimagebyimageid/' + imageid);
        };

        // Master.getPhotosByCategory(categoryid)
        masterFactory.getPhotosByCategory = function(categoryid){
            return $http.get('/api/getphotosbycategory/' + categoryid);
        };

        // Master.getAllCollections()
        masterFactory.getAllCollections = function(){
            return $http.get('/api/getallcollections/');
        };

        // Master.getCollection(collectionid)
        masterFactory.getCollection = function(collectionid){
            return $http.get('/api/getcollection/' + collectionid);
        };

        // Master.getImagesByTagAndCategory(tagandcategoryids)
        masterFactory.getImagesByTagAndCategory = function(tagandcategoryids){
            return $http.post('/api/getimagesbytagandcategory', tagandcategoryids);
        };

        // Master.createTag(tagname)
        masterFactory.createTag = function(tagname){
            return $http.post('/api/createtag/' + tagname);
        };

        // Master.createCategory(categoryname)
        masterFactory.createCategory = function(categoryname){
            return $http.post('/api/createcategory/' + categoryname);
        };

        // Master.createCollection(collectiondetails)
        masterFactory.createCollection = function(collectiondetails){
            return $http.post('/api/createcollection', collectiondetails);
        };

        // Master.editImage(editPhotoDetails)
        masterFactory.editImage = function(editPhotoDetails){
            return $http.post('/api/editimage', editPhotoDetails);
        };

        // Master.editCollection(editCollectionDetails)
        masterFactory.editCollection = function(editCollectionDetails){
            return $http.post('/api/editcollection', editCollectionDetails);
        };

        // Master.getBannerImages()
        masterFactory.getBannerImages = function(){
            return $http.get('/api/getbannerimages/');
        };

        // Master.sendEmailQuery(sendEmailQueryDetails)
        masterFactory.sendEmailQuery = function(sendEmailQueryDetails){
            // console.log("received mail send request in Master");
            return $http.post('/api/sendemailquery', sendEmailQueryDetails);
        };

        return masterFactory;
    }]);
