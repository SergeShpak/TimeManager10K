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