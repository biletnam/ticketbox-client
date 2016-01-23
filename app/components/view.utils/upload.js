'use strict';

angular.module('ticketbox.view.upload', [])

    .directive('ngImageUpload', function() {
        function _create(scope, element, attrs) {
            document
                .getElementById('ngFileUpload-input')
                .addEventListener('change', function(event) { _handleFileSelectAdd(scope, event); }, false);
        }

        function _handleFileSelectAdd(scope, event) {
            var f = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    scope.image = e.target.result;
                    document.getElementById('ngFileUpload-image').src = e.target.result;
                };
            })(f);
            reader.readAsDataURL(f);
        }

        return {
            restrict: 'E',
            scope: {
                image: '='
            },
            template: '<input type="file" accept="image/*" capture="camera" id="ngFileUpload-input"><br><img src="" id="ngFileUpload-image">',
            link: _create
        };
    });