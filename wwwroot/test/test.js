'use strict';

describe('TimeObject', function() {
  describe('instantiate', function() {
      it('should instantiate correctly from ms_time val', function() {
        var ms_val = ((12 * 3600) + (20 * 60) + 10) * 1000;
        var time_obj = new TimeObject(ms_val);
        chai.assert.equal(12, time_obj.hours());
      });
  });
});
