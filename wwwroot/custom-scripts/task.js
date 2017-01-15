function Task(name, interval, start_time, end_time) {
    var err_msg;
    if (typeof name !== 'string' || typeof interval !== 'number'
        || typeof start_time !== 'number' || typeof end_time !== 'number') {
            err_msg = ["Bad arguments types for Task object initialization. ",
                        "Task constructor signature is ",
                        "Task(string, number, number, number)."].join();
            throw new TypeError(msg);
    }
    if (interval < 0 || start_time < 0 || end_time < 0) {
        err_msg = ["Bad arguments for Task object initialization. ",
                    "interval, start_time and end_time should all be ",
                    "positive numbers"].join();
        throw new TypeError(err_msg);
    }
    if ((start_time - end_time) < interval) {
        err_msg = ["Bad arguments for Task object initialization. ",
                    "interval argument cannot be greater than the difference ",
                    "start_time and end_time."].join();
        throw new TypeError(err_msg);
    }
    this.name = name;
    this.interval = interval;
    this.start_time = start_time;
    this.end_time = end_time;
};

Task.prototype.stringifyStartTime = function() {

};

//TODO: change to use a closure instead of a "private" function
Task.prototype._stringifyTime = function(time_val) {
    
};