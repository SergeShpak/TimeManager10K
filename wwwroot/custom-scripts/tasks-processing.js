var local_storage_tasks_key = "timer_tasks";

var isCurrent;
var isTask;
var getTasks;
var getValidTasks;

var printValidTasks = function() {
    var valid_tasks = getValidTasks();
    if (0 == valid_tasks.length) {
        console.log("No tasks yet");
        return;
    }
    for (var i = 0; i < valid_tasks.length; i++) {
        console.log(JSON.stringify(valid_tasks[i]));
    }
}

getTasks = function() {
    var tasks_string = localStorage[local_storage_tasks_key];
    return JSON.parse(tasks_string);
}

getValidTasks = function() {
    var tasks = getTasks();
    return tasks.filter(isTask).filter(isCurrent);
}

isTask = function(obj) {
    var props = Object.getOwnPropertyNames(obj).sort();
    var expected_props = ["e", "i", "n", "s"];
    if (4 != props.length) {
        return false;
    }
    for (var i = 0; i < props.length; i++) {
        if (props[i] != expected_props[i]) {
            return false;
        }
    }
    return true;
}

isCurrent = function(obj) {
    var end_date = new Date(obj.e);
    var current_date = new Date();
    if (current_date.getFullYear() == end_date.getFullYear()
        && current_date.getMonth() == end_date.getMonth()
        && current_date.getDay() == end_date.getDay()) {
            return true;
        }
    return false;
}