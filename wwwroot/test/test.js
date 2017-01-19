'use strict';

var time_val_fixt = {
    ms_val: (12 * 3600 + 20 * 60 + 10) * 1000,
    time_str: "12:20:10",
    h: 12,
    m: 20,
    s: 10
};

var bigger_time_val_fixt = {
    ms_val: (14 * 3600 + 10 * 60 + 12) * 1000,
    time_str: "14:10:12",
    h: 14,
    m: 10,
    s: 12
};

describe('TimeObject', function() {
    describe('Instantiate', function() {
        it('Should instantiate correctly from ms_time val', function() {
            var ms_val = time_val_fixt.ms_val;
            var time_obj = new TimeObject(ms_val);
            chai.assert.equal(time_val_fixt.h, time_obj.hours());
            chai.assert.equal(time_val_fixt.m, time_obj.minutes());
            chai.assert.equal(time_val_fixt.s, time_obj.seconds());
      });
  });
});

describe('TimeObject', function() {
    describe('Instantiate', function() {
        it('Should instantiate correctly from well-formed string', function() {
            var time_str = time_val_fixt.time_str;
            var time_obj = new TimeObject(time_str);
            chai.assert.equal(time_val_fixt.h, time_obj.hours());
            chai.assert.equal(time_val_fixt.m, time_obj.minutes());
            chai.assert.equal(time_val_fixt.s, time_obj.seconds());
        });
    });
});

describe('TimeObject', function() {
    describe('Instantiate', function() {
        it(['Should raise a TypeError when instantiated not with a number or ',
            'a string.'].join(""), function() {
            chai.expect(function() {
                var time_obj = new TimeObject({});
            }).to.throw(TypeError);
        });
    });
});

describe('TimeObject', function() {
    describe('ParseMsTime', function() {
        it(['Should return an object with fields "h", "m", and "s" with ',
            'valid values.'].join(""), function() {
            var ms_val = time_val_fixt.ms_val;
            var parsed_time = TimeObject.parseMsTime(ms_val);
            chai.assert.isTrue(parsed_time.hasOwnProperty("h"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("m"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("s"));
            chai.assert.equal(time_val_fixt.h, parsed_time.h);
            chai.assert.equal(time_val_fixt.m, parsed_time.m);
            chai.assert.equal(time_val_fixt.s, parsed_time.s);
        });
    });
});

describe('TimeObject', function() {
    describe('ParseTimeString', function() {
        it(['Should return an object with fields "h", "m", and "s" with ',
            'valid values.'].join(""), function() {
            var time_str = time_val_fixt.time_str;
            var parsed_time = TimeObject.parseTimeString(time_str);
            chai.assert.isTrue(parsed_time.hasOwnProperty("h"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("m"));
            chai.assert.isTrue(parsed_time.hasOwnProperty("s"));
            chai.assert.equal(time_val_fixt.h, parsed_time.h);
            chai.assert.equal(time_val_fixt.m, parsed_time.m);
            chai.assert.equal(time_val_fixt.s, parsed_time.s);
        });
    });
});
