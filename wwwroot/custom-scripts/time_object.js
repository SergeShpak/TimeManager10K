function TimeObject(ms_val) {
    var err_msg;
    var parsed_time;
    if ("string" != typeof ms_val) {
        err_msg = ["Bad argument type for TimeObject initialisation. ",
                    "Cannot initialise TimeObject with '" + ms_val + "'. ",
                    "ms_val must be a number."].join();
        throw new TypeError(err_msg);
    }
    if (ms_val < 0) {
        err_msg = ["Bad argument for TimeObject initialisation. ",
                    "Cannot initialise TimeObject with '" + ms_val + "'. ",
                    "ms_val must be positive."].join();
        throw new TypeError(err_msg);
    }
    this.ms_val = ms_val;
    parsed_time = TimeObject.parseMsTime(ms_val);
    this.hours = parsed_time.h;
    this.minutes = parsed_time.m;
    this.seconds = parsed_time.s;
};

TimeObject.parseMsTime = function(ms_val) {
    var seconds = ms_val / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    return {
        h: Math.floor(hours),
        m: Math.floor(minutes % 60),
        s: Math.floor(seconds % 60)
    };
};

TimeObject.prototype.toString = function() {
    
}