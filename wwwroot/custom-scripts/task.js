function Task() {
    var name, interval, start_time, end_time;
    var err_msg;
    var time_diff;
    if (4 != arguments.length && 0 != arguments.length) {
        err_msg = ["Bad number of arguments: expected 0 or 4; passed: ",
                    arguments.length.toString(), "."].join();
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
    return first.compare(second); 
};

Task.checkIntervalForConsistency = function(start_time, end_time, interval) {
    var end_time = end_time.copy();
    var diff = end_time.sub(start_time);
    var err_msg;
    if (interval > diff) {
        err_msg = ["Task duration consistecny check failed: task duration ",
                    "cannot be larger than the difference between task's ",
                    "end time and start time."].join();
        throw new TypeError(err_msg);
    }
};

// TODO: add checking with the use of end date and interval
// TODO: rewrite as triplet consistency check
Task.checkStartTimeForConsistency = function(start_time, end_time, interval) {
    var err_msg;
    if (start_time > task.end_time) {
        err_msg = ["Task start time consistency check failed: ",
                    "task's start time cannot be greater than task's ",
                    "end time."].join();
        throw new TypeError(err_msg);
    }
    if (null == task.interval) {
        return;
    }
    Task.checkIntervalForConsistency(start_time, end_time, interval);
};

//TODO: add checking with regard to the start date and interval
Task.checkEndTimeForConsistency = function(task, end_time) {
    var err_msg;
    if (end_time < task.start_time) {
        err_msg = ["Task end time consistency check failed: ",
                    "task's end time cannot be lesser than task's ",
                    "start time."].join();
        throw new Error(err_msg);
    }
};

Task.local_storage_key = "timer_tasks";

Task.prototype.saveToLocalStorage = function() {
    var stored_tasks_json;
    var stored_tasks;
    var index_for_task;
    var saveTasksToLocalStorage = function(tasks) {
        var tasks_json = JSON.stringify(tasks);
        localStorage[Task.local_storage_key] = tasks_json;
        return;
    };
    if (!localStorage[Task.local_storage_key]) {
        localStorage[Task.local_storage_key] = JSON.stringify([]);
    }
    stored_tasks_json = localStorage[Task.local_storage_key];
    stored_tasks = JSON.parse(stored_tasks_json);
    if (0 == stored_tasks.length) {
        stored_tasks = stored_tasks.push(this);
        saveTasksToLocalStorage(stored_tasks);
        return;
    }
    index_for_task = findIndexForTask(stored_tasks);
    stored_tasks.splice(index_for_task, 0);
    saveTasksToLocalStorage(stored_tasks); 
};

Task.prototype.findIndexForTask = function(tasks) {
    if (0 == tasks.length) {
        return 0;
    }
    var start_index = 0;
    var end_index = tasks.length - 1;
    var index_found = start_index;
    var current_task;
    var current_index;
    var compare_result;
    while (start_index < end_index) {
        current_index = Math.floor((end_index - start_index) / 2);
        index_found = current_index;
        current_task = tasks[current_index];
        compare_result = Task.compare(this, current_task);
        if (0 == compare_result) {
            break;
        }
        if (compare_result > 0) {
            start_index = current_index + 1;
            continue;
        }
        if (compare_result < 0) {
            end_index = current_index - 1;
            continue;
        }
    }
    return index_found;
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
                    "received ", typeof name].join();
        throw new TypeError(err_msg);
    }
    this.name = name;
};

// TODO: add type checking and that the interval is not bigger than the 
// difference between the end and the start time
Task.prototype.setInterval = function(interval) {
    var err_msg;
    if ("number" != typeof interval && !(interval instanceof TimeObject)) {
        err_msg = ["Bad argument type: the interval should be of type ",
                    "number or TimeObject. The argument of type ",
                    typeof interval, "was passed."].join();
        throw new TypeError(err_msg);
    }
    if (this.start_time && this.end_time) {
        Task.checkIntervalForConsistency(interval, this);
    }
    this.interval = interval;
};

// TODO: add type checking and checking that start time is before end time
Task.prototype.setStartTime = function(start_time) {
    var err_msg;
    if ("number" != typeof start_time && /* TODO */ true) {

    }
    this.start_time = start_time;
};

// TODO: add type checking and checking that end time is after start time
Task.prototype.setEndTime = function(end_time) {
    var err_msg;
    if ("number" != typeof start_time && /* TODO */ true) {

    }
    this.end_time = end_time;
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
