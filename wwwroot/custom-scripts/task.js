function Task() {
    var name, interval, start_time, end_time;
    var err_msg;
    var time_diff;
    if (4 != arguments.length && 0 != arguments.length) {
        err_msg = ["Bad number of arguments: expected 0 or 4; passed: ",
                    arguments.length.toString(), "."].join("");
        throw new TypeError(err_msg);
    }
    if (0 == arguments.length) {
        this.setDataToEmpty();
        return;
    }
    name = arguments[0];
    interval = arguments[1];
    start_time = arguments[2];
    end_time = arguments[3];
    if (typeof name !== 'string' || !(interval instanceof TimeObject)
        || !(start_time instanceof TimeObject) 
        || !(end_time instanceof TimeObject)) {
            err_msg = ["Bad arguments types for Task object initialization. ",
                "Task constructor signature is ",
                "Task(string, TimeObject, TimeObject, TimeObject)."].join("");
            throw new TypeError(err_msg);
    }
    if (start_time.compareTo(end_time) > 0) {
        err_msg = ["Bad arguments for Task object initialization. ",
                "Start time cannot be greater than the end time."].join("");
        throw new TypeError(err_msg);
    }
    time_diff = end_time.copy().sub(start_time);
    if (time_diff.compareTo(interval) < 0) {
        err_msg = ["Bad arguments for Task object initialization. ",
                    "Task duration cannot be greater than the difference ",
                    "between start time and end time."].join("");
        throw new TypeError(err_msg);
    }
    this.name = name;
    this.interval = interval;
    this.start_time = start_time;
    this.end_time = end_time;
};

Task.compare = function(first, second) {
    if (!(first instanceof Task)) {
        throw new TypeError("First argument is not a Task.");
    }
    return first.compare(second); 
};

Task.validateTriplet = function(interval, start_time, end_time, err_vals) {
        var err_msg;
        var current_arg;
        if (!(start_time && end_time)) {
            return;
        }
        if (!Task.areValidStartEndTimes(start_time, end_time)) {
            throw new TypeError(err_vals[0]);
        }
        if (!interval) {
            return;
        }
        if (!Task.isValidInterval(interval, start_time, end_time)) {
            throw new TypeError(err_vals[1]);
        }
        return;
};

Task.areValidStartEndTimes = function(start_time, end_time) {
    if (start_time.compareTo(end_time) <= 0) {
        return true;
    } 
    return false;
};

Task.isValidInterval = function(interval, start_time, end_time) {
    var diff = end_time.copy().sub(start_time);
    if (interval.compareTo(diff) <= 0) {
        return true;
    }
    return false;
};

Task.validateTimeVal = function(time_val) {
    var err_msg;
    if ("string" != typeof time_val && "number" != typeof time_val 
                                    && !(time_val instanceof TimeObject)) {
        err_msg = ["Bad argument type: time value should be of type ",
                    "number or TimeObject. The argument of type ",
                    typeof time_val, "was passed."].join("");
        throw new TypeError(err_msg);
    }
    if (!(time_val instanceof TimeObject)) {
        time_val = new TimeObject(time_val);
    }
    return time_val;
};

Task.prototype.setDataToEmpty = function() {
    this.name = null;
    this.interval = null;
    this.start_time = null;
    this.end_time = null;
};

Task.prototype.setName = function(name) {
    var err_msg;
    if ("string" != typeof name) {
        err_msg = ["Bad type of the argument passed: expected string, ",
                    "received ", typeof name].join("");
        throw new TypeError(err_msg);
    }
    this.name = name;
};

Task.prototype.setInterval = function(interval) {
    var err_msg;
    var is_valid_interval;
    interval = Task.validateTimeVal(interval); 
    if (!(this.start_time && this.end_time)) {
        this.interval = interval;
        return this;
    }
    is_valid_interval = 
        Task.isValidInterval(interval, this.start_time, this.end_time);
    if (!is_valid_interval) {
        err_msg = ['Inconsistent task duration value. Duration cannot be ',
                    'greater than the difference between task\'s end and ',
                    'start times.'].join("");
        throw new TypeError(err_msg);
    }
    this.interval = interval;
    return this;
};

Task.prototype.setStartTime = function(start_time) {
    var err_msgs = [
        ['Inconsistent task\'s start time. Start time cannot be ',
                    'greater than the end time.'].join(""),
        ['Inconsistent task\'s start time. Duration cannot be ',
                    'greater than the difference between task\'s end and ',
                    'start times.'].join("")
    ];
    var is_valid_start_time;
    start_time = Task.validateTimeVal(start_time); 
    Task.validateTriplet(this.interval, start_time, this.end_time, err_msgs); 
    this.start_time = start_time;
    return this;
};

Task.prototype.setEndTime = function(end_time) {
    var err_msgs = [
        ['Inconsistent task\'s end time. End time cannot ',
                    'be smaller than start time.'].join(""),
        ['Inconsistent task\'s end time. Duration cannot be ',
                    'greater than the difference between task\'s end and ',
                    'start time.'].join("")
    ];
    end_time = Task.validateTimeVal(end_time);
    Task.validateTriplet(this.interval, this.start_time, end_time);
    this.end_time = end_time;
    return this;
};

Task.prototype.compare = function(that) {
    var err_msg;
    if (!(that instanceof Task)) {
        err_msg = ['Cannot compare Task to an object that is not ',
                            'an instance of Task.'].join("");
        throw new TypeError(err_msg);
    }
    if (this === that) {
        return 0;
    }
    var interval_comparison = 
        TimeObject.compare(this.interval, that.interval);
    var start_time_comparison = 
        TimeObject.compare(this.start_time, that.start_time);
    var end_time_comparison = 
        TimeObject.compare(this.end_time, that.end_time);
    return interval_comparison || this.name.localeCompare(that.name)
            || -start_time_comparison || -end_time_comparison;
};

Task.prototype.toString = function() {
    var repr_parts = [];
    var repr_string;
    var result;
    repr_parts.push("Name: " + this.name);
    repr_parts.push("Interval: " + this.interval.toString());
    repr_parts.push("Start: " + this.start_time.toString());
    repr_parts.push("End: " + this.end_time.toString());
    repr_string = repr_parts.join(", ");
    result = ["{ ", repr_string, " }"].join("");
    return result;
}
