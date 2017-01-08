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

/**
 * Checks if a given time string is a valid time input with the use of
 * {@link isValidAgainstRegex} function.
 * 
 * @param {String} time_string - Validated time string.
 */
validateTimeInput = function(time_string) {
    var is_valid = isValidAgainstRegex(time_string);
    return is_valid;
}

/**
 * Checks if a given time string has a valid format. The valid format is
 * [hh:][mm:][s]s.
 * 
 * @param {String} time_str - Validated time string.
 */
isValidAgainstRegex = function(time_str) {
    var is_valid = /^([0-9]{1,2}:)?([0-5]?[0-9]:)?([0-5]?[0-9])$/.test(time_str);
    return is_valid;
}

/**
 * Stores user values from the control panel in the control_panel_values object.
 */
storeControlPanelValues = function() {
    control_panel_values.task = getInputText("#task-input");
    control_panel_values.time_string = getInputText("#task-time-input");
}

/**
 * Gets text of the HTML element specified by the selector.
 * 
 * @param {String} input_selector - Selector that specifies an HTML object.
 */
getInputText = function(input_selector) {
    var input_el = document.querySelector(input_selector);
    var text = input_el.value;
    return text;
}

/**
 * Given a string validated by {@link isValidAgainstRegex} function, parses 
 * it and returns object that contains hours, minutes and seconds fileds
 * that correspond to the passed time string.
 * 
 * @param {String} time_string - Parsed time string.
 */
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

/**
 * Given an object that contains hours, minutes and seconds fields, returns
 * a corresponding time interval in milliseconds.
 * 
 * @param {Object} time_obj - Time object that is represented as a time
 * interval in milliseconds. Should contain fields "h", "m" and "s".
 */
getMsFromTimeObject = function(time_obj) {
    return 1000 * (time_obj.s + time_obj.m * 60 + time_obj.h * 60 * 60);
}

/**
 * Given an object that contains hours, minutes and seconds fields, changes
 * the timer display to the corresponding value. The time object is examined
 * with the use of {@link getMsFromTimeObject} function.
 * 
 * @param {Object} parsed_time_obj - Time object that contains "h", "m" and "s"
 * fields.
 */
setTimerValue = function(parsed_time_obj) {
    current_timer_value = getMsFromTimeObject(parsed_time_obj);
    default_interval = current_timer_value;
    setTimerDisplay();
}


$(document).ready(function() {

    $("#task-set-btn").click(function() {
        printValidTasks();
        var parsed_time;
        var is_input_valid;
        resetTimer();
        storeControlPanelValues();
        current_task.n = control_panel_values.task;
        is_input_valid = validateTimeInput(control_panel_values.time_string);
        if (!is_input_valid) {
            return;
        }
        parsed_time = parseTimeString(control_panel_values.time_string);
        setTimerValue(parsed_time);
        setTimerTask(control_panel_values.task);
        current_task.i = current_timer_value;
    });

});