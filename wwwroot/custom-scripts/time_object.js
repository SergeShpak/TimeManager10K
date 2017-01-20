function TimeObject(time_val) {
    var err_msg;
    var parsed_time;

    var initialiseFromString = function(time_obj, time_string) {
        var is_valid = TimeObject.isValidTimeString(time_string);
        var err_msg;
        var parsed_time;
        if (!is_valid) {
            err_msg = ["Bad argument for TimeObject initialisation. ",
                "Cannot initialise TimeObject with '" + time_string + "'. ",
                "time_val must be a string of format 'hh:mm:ss'."].join("");
                throw new TypeError(err_msg);
        }
        parsed_time = TimeObject.parseTimeString(time_string);
        TimeObject.setFromParsed(time_obj, parsed_time);
    };

    if ("number" !== typeof time_val && "string" !== typeof time_val) {
        err_msg = ["Bad argument type for TimeObject initialisation. ",
                    "Cannot initialise TimeObject with '" + time_val + "'. ",
                    "time_val must be a number or a string."].join("");
        throw new TypeError(err_msg);
    }
    if ("number" === typeof time_val) {
        this.setFromMsTime(time_val);
        
    }
    if ("string" === typeof time_val) {
        initialiseFromString(this, time_val);
    }
};

TimeObject.parseMsTime = function(time_val) {
    var seconds = time_val / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    return {
        h: Math.floor(hours),
        m: Math.floor(minutes % 60),
        s: Math.floor(seconds % 60)
    };
};

TimeObject.parseTimeString = function(time_string) {
    var time_parts = time_string.split(":");
    return {
        h: time_parts[0].toString(),
        m: time_parts[1].toString(),
        s: time_parts[2].toString()
    };
};

TimeObject.isValidTimeString = function(time_str) {
    var is_valid = 
            /^(([0-9]{1,2}:)?([0-5]?[0-9]:))?([0-5]?[0-9])$/.test(time_str);
    return is_valid;
};

TimeObject.compare = function(first, second) {
    return first.compareTo(second);
};

TimeObject.setFromParsed = function(time_object, parsed_time) {
    var ms_time;
    time_object.hours = function() { return parsed_time.h; };
    time_object.minutes = function() { return parsed_time.m; };
    time_object.seconds = function() { return parsed_time.s; };
    ms_time = (time_object.hours * 3600 + time_object.minutes * 60 + 
                time_object.seconds) * 1000

    time_object.total_ms = function () {
        return ms_time;
    };
};

TimeObject.prototype.toString = function() {
    var addZeroIfNeeded = function(time_val) {
        if (time_val < 10) {
            return "0" + time_val.toString(); 
        }
    };
    var result_parts = [addZeroIfNeeded(this.h), addZeroIfNeeded(this.m), 
                    addZeroIfNeeded(this.s)];
    var result = result_parts.join(":");
    return result;
};

TimeObject.prototype.add = function(that) {
    this.setFromMsTime(this.total_ms() + that.total_ms());
};

TimeObject.prototype.sub = function(that) {
    if (this.total_ms() <= 0) {
        return;
    }
    var diff = this.total_ms() - that.total_ms();
    if (diff <= 0) {
        diff = 0;
    }
    this.setFromMsTime(diff);
};

TimeObject.prototype.setFromMsTime = function(ms_time) {
    var parsed_time;
    if (ms_time < 0) {
        err_msg = ["Bad argument for TimeObject initialisation. ",
                "Cannot initialise TimeObject with '" + time_val + "'. ",
                "time_val must be positive."].join("");
        throw new TypeError(err_msg);
    }
    parsed_time = TimeObject.parseMsTime(ms_time);
    TimeObject.setFromParsed(this, parsed_time);
};

TimeObject.prototype.valueOf = function() {
    return this.total_ms();
};

//TODO: add type checking
TimeObject.prototype.compareTo = function(that) {
    if (this === that) {
        return 0;
    }
    return this.total_ms() - that.total_ms();
};

TimeObject.prototype.copy = function() {
    return new TimeObject(this.total_ms());
};
