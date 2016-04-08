app.controller('timeCtrl', function($scope, $interval) {
    var tick = function() {
        $scope.clock = Date.now();
        $scope.day = moment().format("DD");
        $scope.month = moment().format("MMMM");
    }
    tick();
    $interval(tick, 1000);
});