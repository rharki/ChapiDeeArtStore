
angular.module('uploadFileService', [])

    .service('uploadFile', ['$http', function($http) {
        this.upload = function(file, tagids, categoryid, imagename, imagedesc) {
            var fd = new FormData();
            fd.append('myFile', file.upload);
            return $http.post('/api/fileupload/' + categoryid + '?tag=' + tagids + '&name=' + imagename + "&desc=" + imagedesc, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };
    }]);
