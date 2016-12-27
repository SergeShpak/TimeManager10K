var default_interval = 1000 * 20;
var current_timer_value = default_interval;
var is_active = false;
var is_stopped = false;
var prev_clock_val;
var timer_tick_id;

var changeTimerValue;
var startTimer;
var stopTimer;
var updateClock;
var generateTimerDisplay;
var generateTimerString;
var addZeroIfNeeded;

changeTimerValue = function(val, el) {
    $(el).text(val);
}

startTimer = function() {
    prev_clock_val = new Date().getTime();
    setTimeout(updateClock, 1000);
    timer_tick_id = setInterval(updateClock, 1000);
}

stopTimer = function() {
    if (!is_active) {
        return;
    }
    clearInterval(timer_tick_id);
    is_active = false;
}

updateClock = function() {
    var current_clock_val = new Date().getTime();
    var time_elapsed = current_clock_val - prev_clock_val;
    current_timer_value -= time_elapsed;
    prev_clock_val = current_clock_val;
    if (current_timer_value <= 0) {
        stopTimer();
        current_timer_value = 0;
        setTimerDisplay();
        return;
    }
    setTimerDisplay();
}

generateTimerDisplay = function() {
    var seconds = current_timer_value / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var h = Math.floor(hours % 24);
    var m = Math.floor(minutes % 60);
    var s = Math.round(seconds % 60);
    return generateTimerString(h, m, s);
}

generateTimerString = function(hours, minutes, seconds) {
    var hours_str = addZeroIfNeeded(hours.toString());
    var minutes_str = addZeroIfNeeded(minutes.toString());
    var seconds_str = addZeroIfNeeded(seconds.toString());
    return hours_str + ":" + minutes_str + ":" + seconds_str;
}

addZeroIfNeeded = function(time_str) {
    if (time_str.length < 2) {
        return "0" + time_str;
    }
    return time_str;
}

setTimerDisplay = function() {
    var timer_string = generateTimerDisplay();
    changeTimerValue(timer_string, $("#timer-display p"));
}


$(document).ready(function() {

    setTimerDisplay();

    $("#timer-start-btn").click(function() {
        if (is_active) {
            return;
        }
        if (current_timer_value <= 0) {
            return;
        }
        is_active = true;
        startTimer();
    });

    $("#timer-stop-btn").click(function() {
        if (!is_active) {
            return;
        }
        stopTimer();
        is_active = false;
        is_stopped = true;
    });

    $("#timer-reset-btn").click(function() {
        stopTimer();
        is_active = false;
        is_stopped = false;
        current_timer_value = default_interval;
        setTimerDisplay();
    });
});