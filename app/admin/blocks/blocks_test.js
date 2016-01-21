'use strict';

describe('ticketbox.admin.blocks', function () {
    var $firebaseArray, $timeout, scope, ref, array;

    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is block 1'
        },
        'id2': {
            'name': 'This is block 2'
        }
    };

    beforeEach(function () {
        module('ticketbox.admin.blocks');

        inject(function (_$firebaseArray_, _$timeout_, _$rootScope_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();
            array = function() {
                return _makeArray(FIXTURE_DATA, ref);
            };

            $controller('BlocksCtrl', {$scope: scope, array: array});
            scope.$digest();
        });
    });

    describe('BlocksCtrl', function () {
        describe('$scope.blocks', function() {
            it('should contain all items', function() {
                expect(scope.blocks.$getRecord('id1')).not.toBeNull();
                expect(scope.blocks.$getRecord('id2')).not.toBeNull();
            });
        });

        describe('$scope.add()', function() {
            it('should add an item', function () {
                var initialDataLength = scope.blocks.length;
                scope.add('new block name');
                _flush();
                var eventualDataLength = scope.blocks.length;
                expect(eventualDataLength).toEqual(initialDataLength + 1);
            });

            it('should empty the newBlockName variable', function () {
                scope.newBlockName = 'newBlockNameValue';
                scope.add('new block name');
                _flush();
                expect(scope.newBlockName).toEqual('');
            });
        });

        describe('$scope.remove()', function () {
            it('should remove an item', function () {
                var item = scope.blocks.$getRecord('id1');
                expect(scope.blocks).toContain(item);
                scope.remove(item);
                _flush();
                expect(scope.blocks).not.toContain(item);
            });
        });
    });

    function _makeArray(initialData, ref) {
        if (!ref) {
            ref = _stubRef();
        }
        var obj = $firebaseArray(ref);
        if (angular.isDefined(initialData)) {
            ref.ref().set(initialData);
            ref.flush();
            $timeout.flush();
        }
        return obj;
    }

    function _stubRef() {
        return new MockFirebase('Mock://');
    }

    function _flush() {
        ref.flush();
        $timeout.flush();
    }
});