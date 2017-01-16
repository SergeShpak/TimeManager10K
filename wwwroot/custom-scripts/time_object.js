function TimeObject(time_val) {
    var err_msg;
    var parsed_time;

    var parent = this;

    var initialiseFromParsed = function(parsed_time) {
        parent.hours = parsed_time.h;
        parent.minutes = parsed_time.m;
        parent.seconds = parsed_time.s;
    };
    
    var initialiseFromNumber = function(ms_time) {
        var parsed_time;
        if (ms_time < 0) {
            err_msg = ["Bad argument for TimeObject initialisation. ",
                    "Cannot initialise TimeObject with '" + time_val + "'. ",
                    "time_val must be positive."].join();
            throw new TypeError(err_msg);
        }
        parsed_time = TimeObject.parseMsTime(ms_time);
        initialiseFromParsed(parsed_time);
    };

    var initialiseFromString = function(time_string) {
        var is_valid = TimeObject.isValidTimeString(time_string);
        var err_msg;
        var parsed_time;
        if (!is_valid) {
            err_msg = ["Bad argument for TimeObject initialisation. ",
                "Cannot initialise TimeObject with '" + time_string + "'. ",
                "time_val must be a string of format 'hh:mm:ss'."].join();
                throw new TypeError(err_msg);
        }
        parsed_time = TimeObject.parseTimeString(time_string);
        initialiseFromParsed(parsed_time);
    };

    if ("number" !== typeof time_val && "string" !== typeof time_val) {
        err_msg = ["Bad argument type for TimeObject initialisation. ",
                    "Cannot initialise TimeObject with '" + time_val + "'. ",
                    "time_val must be a number or a string."].join();
        throw new TypeError(err_msg);
    }
    if ("number" === typeof time_val) {
        initialiseFromNumber(time_val);
        
    }
    if ("string" === typeof time_val) {
        initialiseFromString(time_val);
    }
    this.total_seconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
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
            /^([0-9]{1,2}:)?([0-5]?[0-9]:)?([0-5]?[0-9])$/.test(time_str);
    return is_valid;
};

TimeObject.compare = function(first, second) {
    return first.total_seconds - second.total_seconds;
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