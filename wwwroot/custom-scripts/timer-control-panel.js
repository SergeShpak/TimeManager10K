var control_panel_values = {
    task: null,
    time_string: null,
};
var alert_duration = 3000;
var is_error_anounced = false;
var error_show_id;

var storeControlPanelValues;
var getInputText;
var setTimerValue;
var setInputBoxToAlert;

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": alert_duration,
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

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

alertUserOnTimeValidation = function() {
    var toast_msg = "Hmm... something's wrong with the time";
    toastr.error(toast_msg);
    setInputBoxToAlert();
};

setInputBoxToAlert = function() {
    var task_time_input = document.getElementById("task-time-input");
    var border_size = 0;
    var style_template = "px solid red";
    var interval_set = false;
    var turnOnErrorState = function() {
        is_error_anounced = true;
        if (border_size > 3) {
            clearInterval(error_show_id);
            return;
        }
        console.log("Border size " + border_size);
        border_size++;
        task_time_input.style.border = border_size.toString() + style_template;
    };
    var turnOffErrorState = function() {
        // This is the case if user has focused on the task time input
        if (!is_error_anounced) {
            return;
        }
        if (border_size <= 0) {
            task_time_input.style.border = "";
            clearInterval(error_show_id);
            is_error_anounced = false;
            return;
        }
        console.log("Border size " + border_size);
        border_size--;
        task_time_input.style.border = border_size.toString() + style_template;
        // This is for the mechanism of sequential setTimeour and 
        // setInterval activations
        if (!interval_set) {
            console.log("setting interval");
            error_show_id = setInterval(turnOffErrorState, 10);
            interval_set = true;
        }
    };
    var error_show_id = setInterval(turnOnErrorState, 20);
    setTimeout(turnOffErrorState, alert_duration - 20);
};


$(document).ready(function() {

    $("#task-set-btn").click(function() {
        var parsed_time;
        var is_input_valid;
        resetTimer();
        storeControlPanelValues();
        task_storage.n = control_panel_values.task;
        is_input_valid = 
                TimeObject.isValidTimeString(control_panel_values.time_string);
        if (!is_input_valid) {
            if (is_error_anounced) {
                return;
            }
            alertUserOnTimeValidation();
            return;
        }
        parsed_time = 
            TimeObject.parseTimeString(control_panel_values.time_string);
        setTimerValue(parsed_time);
        setTimerTask(control_panel_values.task);
        task_storage.i = current_timer_value.time_ms;
        previous_timer_value = current_timer_value.time_ms;
    });

    $("#task-time-input").focus(function() {
        clearInterval(error_show_id);
        this.style.border = "";
        is_error_anounced = false;
    });

});
