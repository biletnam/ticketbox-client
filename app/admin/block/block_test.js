'use strict';

describe('ticketbox.admin.block', function () {
    var scope, location, pathSpy, fbobject, byIdSpy;

    beforeEach(function () {
        module('ticketbox.admin.block');

        inject(function (_$rootScope_, _$location_, _fbobject_, $controller) {
            scope = _$rootScope_.$new();

            location = _$location_;
            pathSpy = spyOn(location, 'path');

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId');

            var routeParams = {
                blockId: 'id1'
            };

            $controller('BlockCtrl', {$scope: scope, $location: location, fbobject: fbobject, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('BlockCtrl', function () {
        describe('$scope.block', function () {
            it('should fetch the block with id1', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/blocks', 'id1');
            });
        });

        describe('$scope.saveAndReturnToList()', function() {
            it('should call save() on block', function() {
                var block = {
                    '$save': function() {}
                };
                var saveSpy = spyOn(block, '$save');
                scope.saveAndReturnToList(block);
                expect(saveSpy).toHaveBeenCalled();
            });

            it('should redirect to blocks list', function() {
                var block = {
                    '$save': function() {}
                };
                scope.saveAndReturnToList(block);
                expect(pathSpy).toHaveBeenCalledWith('/blocks');
            });
        });
    });
});