var validateTimeInput;
var isValidAgainstRegex;

validateTimeInput = function() {
    var time_input_el = document.querySelector("#task-time-input");
    var time_str = time_input_el.value;
    var is_valid = isValidAgainstRegex(time_str);
    if (is_valid) {
        console.log(time_str, " is a valid time string");
        return;
    }
    console.log(time_str, " is not a valid time string");
}

isValidAgainstRegex = function(time_str) {
    var is_valid = /^([0-9]{1,2}:)?([0-5]?[0-9]:)?([0-5]?[0-9])$/.test(time_str);
    return is_valid;
}

$(document).ready(function() {
    $("#task-set-btn").click(function() {
        validateTimeInput();
    });
});