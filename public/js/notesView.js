(function(angular) {
    var theModule = angular.module('notesView', ['ui.bootstrap']);

    theModule.controller('notesViewController',
        ['$scope', '$window', '$http',
            function($scope, $window, $http) {
                $scope.notes = [];

                $scope.newNote = createBlankNote();

                var urlParts = $window.location.pathname.split('/');
                var categoryName = urlParts[urlParts.length - 1];

                var notesUrl = '/api/notes/' + categoryName;

                $http.get(notesUrl)
                    .then(function(result) {
                        $scope.notes = result.data.notes;
                    }, function(err) {
                        alert(err);
                        console.log(err);
                    });


                var socket = io.connect();

                socket.emit('join category', categoryName);

                socket.on('broadcast note', function(note) {
                    $scope.notes.push(note);
                    $scope.$apply();
                });


                $scope.save = function() {
                    $http.post(notesUrl, $scope.newNote)
                        .then(function(result) {
                            $scope.notes.push(result.data);
                            $scope.newNote = createBlankNote();
                            socket.emit('newNote', { categoryName: categoryName, note: result.data })
                        }, function(err) {
                            alert(err);
                            console.log(err);
                        });
                }
            }
        ]);

    function createBlankNote() {
        return {
            note: '',
            color: 'yellow'
        };
    }
})(window.angular);