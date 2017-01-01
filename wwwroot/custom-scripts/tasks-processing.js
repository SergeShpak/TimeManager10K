var local_storage_tasks_key = "timer_tasks";

var isCurrent;
var isTask;
var getTasks;
var getValidTasks;
var showTasksIfAny;
var printValidTasks;
var hideTable;
var addTasksToTable;
var getTaskName;
var getTaskDuration;
var getDate;

printValidTasks = function() {
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

showTasksIfAny = function() {
    var tasks = getValidTasks();
    if (0 == tasks.length) {
        hideTable();
        return;
    }
    addTasksToTable(tasks);
    return;
}

hideTable = function() {
    $("#tasks-table").toggleClass("collapsed");
    $("#tasks-table").find("tr").toggle(300);
}

addTasksToTable = function(tasks) {
    var tbody = $("#tasks-table > tbody");
    var current_task;
    var new_row;
    var name, start_date, end_date, duration;
    for (var i = 0; i < tasks.length; i++) {
        current_task = tasks[i];
        new_row = "<tr><td>" + getTaskName(current_task) + "</td><td>" + getTaskDuration(current_task) +
                 "</td><td></td><td></td></tr>";
        tbody.append(new_row);
    }
}

getTaskName = function(task) {
    var name = task.n;
    if (null == name) {
        return "Not specified";
    }
}

getTaskDuration = function(task) {
    var interval = task.i;
    var representation = generateTimerDisplay(interval);
    return representation;
}


$(document).ready(function() {
    showTasksIfAny();

    $("#tasks-expand-btn").click(function() {
        hideTable();
    });

});