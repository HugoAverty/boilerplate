'use strict';
app.controller('todoCtrl', function($scope, $http) {
    $scope.todos = [
        {
            text:'Learn AngularJS',
            category: 'CE',
            priority: false,
            assigned: false,
            status: false
        },
        {
            text: 'Build an app',
            category: 'DNS',
            priority: false,
            assigned: false,
            status: false
        }
    ];

    $scope.getTotalTodos = function () {
        return $scope.todos.length;
    };


    $scope.addTodo = function () {
        console.log($scope.csrf);
        $scope.todos.push(
            {
                text: $scope.titleTodo,
                category: $scope.categoryTodo,
                priority: false,
                assigned: false,
                status: false
            }
        );
        $http({
            method: 'POST',
            url: '/todo'
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(error) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        $scope.titleTodo = '';
        $scope.categoryTodo = '';
    };

    $scope.clearCompleted = function () {
        $scope.todos = _.filter($scope.todos, function(todo){
            return !todo.status;
        });
    };
});