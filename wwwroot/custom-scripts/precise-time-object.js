function PreciseTime(time_ms) {
    this.time_ms = time_ms;  // TODO: hide this field
    this.counting_point = null;
};

PreciseTime.prototype.sub = function(ms_val) {
    var subbed = this.time_ms - ms_val;
    this.time_ms = subbed < 0 ? 0 : subbed;
};

PreciseTime.prototype.add = function(ms_val) {
    this.time_ms = this.time_ms + ms_val;
};

PreciseTime.prototype.countTimePassed = function(diff) {
    var err_msg;
    if (null == this.counting_point) {
        err_msg = "Counting point has not been set yet";
        throw new TypeError(err_msg);
    }
    this.sub(diff);
    this.setCountingPoint(this.time_ms);
};

PreciseTime.prototype.isEllapsed = function() {
    return 0 == this.time_ms;
};

PreciseTime.prototype.setCountingPoint = function() {
    var counting_point = arguments[0];
    var counting_point_type = typeof counting_point;
    'undefined' !== counting_point_type ? 
            this.counting_point = counting_point : 
            this.counting_point = new Date().valueOf();
};

PreciseTime.prototype.isCountingPointSet = function() {
    return null != this.counting_point;
};
