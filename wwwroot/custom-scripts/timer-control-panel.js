var control_panel_values = {
    task: null,
    time_string: null
};

var validateTimeInput;
var isValidAgainstRegex;
var storeControlPanelValues;
var getInputText;
var parseTimeString;
var setTimerValue;

validateTimeInput = function() {
    var is_valid = isValidAgainstRegex(control_panel_values.time_string);
    if (is_valid) {
        console.log(control_panel_values.time_str, " is a valid time string");
        return is_valid;
    }
    console.log(control_panel_values.time_str, " is not a valid time string");
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

setTimerValue = function(parsed_time_obj) {
    current_timer_value = 1000 * (parsed_time_obj.s + parsed_time_obj.m * 60 + parsed_time_obj.h * 60 * 60);
    setTimerDisplay();
}

$(document).ready(function() {

    $("#task-set-btn").click(function() {
        var parsed_time;
        var is_input_valid;
        storeControlPanelValues();
        is_input_valid = validateTimeInput();
        if (!is_input_valid) {
            return;
        }
        parsed_time = parseTimeString(control_panel_values.time_string);
        setTimerValue(parsed_time);
    });

});