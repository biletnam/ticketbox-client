'use strict';

describe('ticketbox.components.mailer', function () {
    describe('mailer', function () {
        var mailer, postSpy, mailerUrl;

        beforeEach(module('ticketbox.components.mailer', function ($provide) {
            var http = {
                post: function() { }
            };
            postSpy = spyOn(http, 'post');
            $provide.value('$http', http);

            mailerUrl = 'http://example.com';
            $provide.value('MAILERURL', mailerUrl)
        }));

        beforeEach(inject(function (_mailer_) {
            mailer = _mailer_;
        }));

        describe('mailer.order()', function() {
            it('should post the order to the order endpoint', function () {
                expect(postSpy).not.toHaveBeenCalled();
                mailer.order('oid');
                expect(postSpy).toHaveBeenCalledWith(mailerUrl + '/order', { 'orderId': 'oid' });
            });
        });

        describe('mailer.sell()', function() {
            it('should post the order to the sell endpoint', function () {
                expect(postSpy).not.toHaveBeenCalled();
                mailer.sell('oid');
                expect(postSpy).toHaveBeenCalledWith(mailerUrl + '/sell', { 'orderId': 'oid' });
            });
        });
    });
});