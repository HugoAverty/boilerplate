'use strict';
app.controller('todoCtrl', function($scope) {
    $scope.todos = [
        {
            text:'Learn AngularJS',
            categorie: false,
            priority: false,
            assigned: false,
            status: false
        },
        {
            text: 'Build an app',
            categorie: false,
            priority: false,
            assigned: false,
            status: false
        }
    ];

    $scope.getTotalTodos = function () {
        return $scope.todos.length;
    };


    $scope.addTodo = function () {
        $scope.todos.push(
            {
                text: $scope.formTodoText,
                categorie: false,
                priority: false,
                assigned: false,
                status: false
            }
        );
        $scope.formTodoText = '';
    };

    $scope.clearCompleted = function () {
        $scope.todos = _.filter($scope.todos, function(todo){
            return !todo.status;
        });
    };
});