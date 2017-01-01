var control_panel_values = {
    task: null,
    time_string: null,
};
var current_task = {
    n: null,
    i: null,
    s: null,
    e: null
};

var validateTimeInput;
var isValidAgainstRegex;
var storeControlPanelValues;
var getInputText;
var parseTimeString;
var setTimerValue;
var getMsFromTimeObject;


validateTimeInput = function() {
    var is_valid = isValidAgainstRegex(control_panel_values.time_string);
    return is_valid;
}

isValidAgainstRegex = function(time_str) {
    var is_valid = /^([0-9]{1,2}:)?([0-5]?[0-9]:)?([0-5]?[0-9])$/.test(time_str);
    return is_valid;
}

storeControlPanelValues = function() {
    control_panel_values.task = getInputText("#task-input");
    control_panel_values.time_string = getInputText("#task-time-input");
}

getInputText = function(input_selector) {
    var input_el = document.querySelector(input_selector);
    var text = input_el.value;
    return text;
}

parseTimeString = function(time_string) {
    var time_parsed = [0, 0, 0];
    var time_tokens = time_string.split(":");
    var tokens_count = time_tokens.length;
    for (var i = 0; i < tokens_count; i++) {
        time_parsed[3 - tokens_count + i] = Number(time_tokens[i].trim());
    }
    return {
        h: time_parsed[0],
        m: time_parsed[1],
        s: time_parsed[2]
    };
}

getMsFromTimeObject = function(time_obj) {
    return 1000 * (time_obj.s + time_obj.m * 60 + time_obj.h * 60 * 60);
}

setTimerValue = function(parsed_time_obj) {
    current_timer_value = getMsFromTimeObject(parsed_time_obj);
    default_interval = current_timer_value;
    setTimerDisplay();
    setTimerTask(control_panel_values.task);
}


$(document).ready(function() {

    $("#task-set-btn").click(function() {
        printValidTasks();
        var parsed_time;
        var is_input_valid;
        resetTimer();
        storeControlPanelValues();
        current_task.n = control_panel_values.task;
        is_input_valid = validateTimeInput();
        if (!is_input_valid) {
            return;
        }
        parsed_time = parseTimeString(control_panel_values.time_string);
        setTimerValue(parsed_time);
        current_task.i = current_timer_value;
    });

});