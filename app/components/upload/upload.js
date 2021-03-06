'use strict';

angular.module('ticketbox.components.upload', [])

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
                    scope.ngModel = e.target.result;
                    scope.$apply();
                    //document.getElementById('ngFileUpload-image').src = e.target.result;
                };
            })(f);
            reader.readAsDataURL(f);
        }

        return {
            restrict: 'E',
            scope: {
                ngModel: '='
            },
            template: '<input type="file" accept="image/*" capture="camera" id="ngFileUpload-input">',
            link: _create
        };
    });