var local_storage_tasks_key = "timer_tasks";
var tasks_table_selector = "#tasks-table";
var tasks_table_body_selector = tasks_table_selector + " > tbody";

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
var getDateRepresentation;
var setTasks;
var collapseTable;
var toggleTasksButton;
var extractTasksFromTable;
var parseTaskRow;
var parceInaccurateTimeString;

/**
 * Clears the localStorage from the saved tasks and saves the the one passed
 * as the argument.
 * 
 * @param {Object[]} tasks - Array of tasks that are saved in the localStorage.
 */
setTasks = function(tasks) {
    localStorage[local_storage_tasks_key] = JSON.stringify(tasks);
}

/**
 * Prints the tasks returned by the function {@link getValidTasks} 
 * to the console.
 */
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

/**
 * Returns tasks stored in the localStorage.
 */
getTasks = function() {
    var tasks_string = localStorage[local_storage_tasks_key];
    return JSON.parse(tasks_string);
}

/**
 * Gets the tasks from the localStorage with the use of the {@link getTasks}
 * function and filters them against {@link isTaks} and {@link isCurrent}.
 * Returns the filtering result. It also deletes the tasks, that were filtered 
 * out, from the localStorage.
 */
getValidTasks = function() {
    var tasks = getTasks();
    var valid_tasks = tasks.filter(isTask).filter(isCurrent);
    setTasks(valid_tasks);
    return valid_tasks;
}

/**
 * Predicate function that defines whether the passed object is a task or not.
 * Particularly, it checks if the passed object has all the properties 
 * of a task: name, interval, start date and end date -, and does not have
 * any other ones.
 * 
 * @param {Object} obj - Object that is checked to be a task.
 */
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

/**
 * Predicate function that checks if the given task is still fresh.
 * Particularly, it checks if the end date of the task is today.
 * 
 * @param {Object} obj - Task which end date is checked.
 */
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

/**
 * If there are no valid tasks in the localStorage, hides the tasks table.
 * If there are adds them to the tasks table, using the {@link addTasksToTable}
 * function. 
 */
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
    var tasks_table_el = $(tasks_table_selector);
    tasks_table_el.toggleClass("collapsed");
    tasks_table_el.find("tr").toggle(300);
    toggleTasksButton();
}

/**
 * Adds tasks in the given tasks array to the tasks table.
 * 
 * @param {Object[]} tasks - Array of tasks to be added to the tasks table.
 */
addTasksToTable = function(tasks) {
    var tbody = $(tasks_table_body_selector);
    var current_task;
    var new_row;
    var name, start_date, end_date, duration;
    for (var i = 0; i < tasks.length; i++) {
        current_task = tasks[i];
        start_date = current_task.s;
        end_date = current_task.e;
        new_row = "<tr><td>" + getTaskName(current_task) + "</td><td>" +
                    getTaskDuration(current_task) + "</td><td>" + 
                    getDateRepresentation(start_date) + "</td><td>" +
                    getDateRepresentation(end_date) + "</td></tr>";
        tbody.append(new_row);
    }
}

/**
 * Given a task returns its name.
 * 
 * @param {Object} task - Task which name is returned.
 */
getTaskName = function(task) {
    var name = task.n;
    if (null == name) {
        return "Not specified";
    }
    return name;
}

/**
 * Given a task returns the time interval that corresponds to its duration.
 * 
 * @param {Object} task - Task which duration is returned.
 */
getTaskDuration = function(task) {
    var interval = task.i;
    var representation = generateTimerDisplay(interval);
    return representation;
}

/**
 * Given a time interval returns its readable representation.
 * 
 * @param {number} date_num - Time interval which representation is returned.
 */
getDateRepresentation = function(date_num) {
    var date =  new Date(date_num);
    var time_repr = date.toLocaleTimeString();
    var repr = time_repr;
    return repr;
}

collapseTable = function() {
    var tasks_table_el = $(tasks_table_selector);
    var collapsed_class = "collapsed";
    if (tasks_table_el.hasClass(collapsed_class)) {
        return;
    }
    tasks_table_el.addClass(collapsed_class);
    tasks_table_el.toggle();
    toggleTasksButton();
}

extractTasksFromTable = function() {
    var tasks = [];
    $(tasks_table_body_selector + " > tr").each(function(index) {
        var task = parseTaskRow(this);
        tasks.push(task);
    });
    return tasks;
}

parseTaskRow = function(row_el) {
    var cells = $(row_el).children().filter(function() {
        return $(this).is("td");
    });
    var task = {
        n: null,
        i: null,
        s: null,
        e: null
    };
    var task_times = [];
    var time_cells = cells.slice(1);
    var inaccurate_time;
    task.n = cells[0].textContent;
    for (var i = 0; i < time_cells.length; i++) {
        inaccurate_time = parceInaccurateTimeString(time_cells[i].textContent);
        task_times.push(inaccurate_time);
    }
    task.i = task_times[0];
    task.s = task_times[1];
    task.e = task_times[2];
    return task;
}

parceInaccurateTimeString = function(time_str) {
    var time_parts = time_str.split(":").map(function(time_part_str) {
        return parseInt(time_part_str);
    });
    var time_obj = {};
    time_obj.h = time_parts[0];
    time_obj.m = time_parts[1];
    time_obj.s = time_parts[2];
    return getMsFromTimeObject(time_obj);
}

toggleTasksButton = function() {
    var tasks_expand_btn_el = $("#tasks-expand-btn");
    tasks_expand_btn_el.toggleClass("btn-success");
    tasks_expand_btn_el.toggleClass("glyphicon-plus");
    tasks_expand_btn_el.toggleClass("btn-danger");
    tasks_expand_btn_el.toggleClass("glyphicon-minus");
}


$(document).ready(function() {
    collapseTable();
    showTasksIfAny();

    $("#tasks-expand-btn").click(function() {
        hideTable();
    });

});