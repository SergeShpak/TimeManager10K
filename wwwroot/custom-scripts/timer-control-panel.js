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

var storeControlPanelValues;
var getInputText;
var setTimerValue;

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
 * Given an object that contains hours, minutes and seconds fields, changes
 * the timer display to the corresponding value. The time object is examined
 * with the use of {@link getMsFromTimeObject} function.
 * 
 * @param {Object} parsed_time_obj - Time object that contains "h", "m" and "s"
 * fields.
 */
setTimerValue = function(parsed_time_obj) {
    var time_ms = TimeObject.getMsFromParsed(parsed_time_obj);
    current_timer_value = new PreciseTime(time_ms);
    default_interval = current_timer_value;
    setTimerDisplay(current_timer_value);
}


$(document).ready(function() {

    $("#task-set-btn").click(function() {
        var parsed_time;
        var is_input_valid;
        resetTimer();
        storeControlPanelValues();
        current_task.n = control_panel_values.task;
        is_input_valid = 
                TimeObject.isValidTimeString(control_panel_values.time_string);
        if (!is_input_valid) {
            // TODO: add error message
            return;
        }
        parsed_time = 
            TimeObject.parseTimeString(control_panel_values.time_string);
        setTimerValue(parsed_time);
        setTimerTask(control_panel_values.task);
        current_task.i = current_timer_value;
    });

});
