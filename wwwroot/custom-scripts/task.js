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
    this.interval = TimeObject(interval);
    this.start_time = TimeObject(start_time);
    this.end_time = TimeObject(end_time);
};

Task.compare = function(first, second) {
    var interval_comparison = 
        TimeObject.compare(first.interval, second.interval);
    var start_time_comparison = 
        TimeObject.compare(first.start_time, second.start_time);
    var end_time_comparison = 
        TimeObject.compare(first.end_time, second.end_time);
    if (first.name == second.name 
        && !interval_comparison && !start_time_comparison 
        && !end_time_comparison) {
            return 0;
    }
    return interval_comparison || first.name.localeCompare(second.name)
            || start_time_comparison || end_time_comparison;
};