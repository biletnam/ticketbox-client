'use strict';

describe('ticketbox.admin.category', function () {
    var scope, location, pathSpy, fbobject, byIdSpy;

    beforeEach(function () {
        module('ticketbox.admin.category');

        inject(function (_$rootScope_, _$location_, _fbobject_, $controller) {
            scope = _$rootScope_.$new();

            location = _$location_;
            pathSpy = spyOn(location, 'path');

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId');

            var routeParams = {
                categoryId: 'id1'
            };

            $controller('CategoryCtrl', {$scope: scope, $location: location, fbobject: fbobject, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('CategoryCtrl', function () {
        describe('$scope.category', function () {
            it('should fetch the category with id1', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/categories', 'id1');
            });
        });

        describe('$scope.saveAndReturnToList()', function() {
            it('should call save() on category', function() {
                var category = {
                    '$save': function() {}
                };
                var saveSpy = spyOn(category, '$save');
                scope.saveAndReturnToList(category);
                expect(saveSpy).toHaveBeenCalled();
            });

            it('should redirect to categories list', function() {
                var category = {
                    '$save': function() {}
                };
                scope.saveAndReturnToList(category);
                expect(pathSpy).toHaveBeenCalledWith('/categories');
            });
        });
    });
});