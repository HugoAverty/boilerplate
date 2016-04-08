'use strict';
app.controller('searchCtrl', function($scope, $location, $window) {
    $scope.submit = function() {
        $window.open('https://www.google.fr/#q=test', '_blank');
    };
});