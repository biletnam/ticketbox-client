'use strict';

describe('ticketbox.admin.categories', function () {
    var $firebaseArray, $timeout, scope, ref, fbarray;

    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is category 1'
        },
        'id2': {
            'name': 'This is category 2'
        }
    };

    beforeEach(function () {
        module('ticketbox.admin.categories');

        inject(function (_$firebaseArray_, _$timeout_, _$rootScope_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();
            fbarray = {
                byPath: function() {
                    return _makeArray(FIXTURE_DATA, ref);
                }
            };

            $controller('CategoriesCtrl', {$scope: scope, fbarray: fbarray});
            scope.$digest();
        });
    });

    describe('CategoriesCtrl', function () {
        describe('$scope.categories', function() {
            it('should contain all items', function() {
                expect(scope.categories.$getRecord('id1')).not.toBeNull();
                expect(scope.categories.$getRecord('id2')).not.toBeNull();
            });
        });

        describe('$scope.add()', function() {
            it('should add an item', function () {
                var initialDataLength = scope.categories.length;
                scope.add('new category name', 1, 2);
                _flush();
                var eventualDataLength = scope.categories.length;
                expect(eventualDataLength).toEqual(initialDataLength + 1);
            });

            it('should empty the newCategoryName variable', function () {
                scope.newCategoryName = 'newCategoryNameValue';
                scope.add('new category name', 1, 2);
                _flush();
                expect(scope.newCategoryName).toEqual('');
            });

            it('should empty the newCategoryPrice variable', function () {
                scope.newCategoryName = 'newCategoryPriceValue';
                scope.add('new category name', 1, 2);
                _flush();
                expect(scope.newCategoryPrice).toEqual('');
            });

            it('should empty the newCategoryReducedPrice variable', function () {
                scope.newCategoryName = 'newCategoryReducedPriceValue';
                scope.add('new category name', 1, 2);
                _flush();
                expect(scope.newCategoryReducedPrice).toEqual('');
            });
        });

        describe('$scope.remove()', function () {
            it('should remove an item', function () {
                var item = scope.categories.$getRecord('id1');
                expect(scope.categories).toContain(item);
                scope.remove(item);
                _flush();
                expect(scope.categories).not.toContain(item);
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