'use strict';
app.controller('fileUploadCtrl', function($scope, $location, $http) {
    $http({
        method: 'GET',
        url: '/files'
    }).then(function successCallback(files) {
        $scope.directory_files = files.data;
        console.log(files.data);
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
});