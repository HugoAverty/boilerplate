'use strict';
app.controller('weatherCtrl',['$scope', 'owm', function($scope, owm) {
    owm.current.find('Toulouse').then(function(weather) {
        console.log(weather);
        $scope.weather = weather;
    });
}]);