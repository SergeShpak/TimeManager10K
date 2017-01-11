var default_interval = 1000 * 20;
var current_timer_value = default_interval;
var is_active = false;
var is_stopped = false;
var prev_clock_val;
var timer_tick_id;

var changeElementText;
var startTimer;
var stopTimer;
var resetTimer;
var updateClock;
var generateTimerDisplay;
var generateTimerString;
var addZeroIfNeeded;
var setTimerTask;
var playAlarmSound;
var saveStats;
var saveCurrentTask;
var finishTimer;

/**
 * Saves all the relevant information of the passed timer period:
 * calls {@link saveCurrentTask}.
 */
saveStats = function() {
    saveCurrentTask();
}

// TODO: finish comment
/** 
 * Saves current task in the localStorage as a stringified object.
 * 
 */
saveCurrentTask = function() {
    if (!localStorage.timer_tasks) {
        localStorage[local_storage_tasks_key] = JSON.stringify([]);
    }
    tasks = JSON.parse(localStorage[local_storage_tasks_key]);
    tasks.push(current_task);
    localStorage[local_storage_tasks_key] = JSON.stringify(tasks);
    addToTable(current_task);
}

/**
 * Changes text of the given DOM element.
 * 
 * @param {string} text_to_set - new text of the DOM element.
 * @param {string} el - selector that specifies the target element.  
 */
changeElementText = function(text_to_set, el) {
    $(el).text(text_to_set);
}

/**
 * Sets the start date and time of the current task to the current date
 * and time. Sets the function {@link updateClock} to be run every 1000 milliseconds.
 */
startTimer = function() {
    prev_clock_val = new Date().getTime();
    current_task.s = prev_clock_val;
    setTimeout(updateClock, 1000);
    timer_tick_id = setInterval(updateClock, 1000);
}

/**
 * If the timer is not active, returns silently.
 * If the timer is active, changes the timer status to non-active, 
 * stops the periodically running function {@link updateClock}.
 */
stopTimer = function() {
    if (!is_active) {
        return;
    }
    clearInterval(timer_tick_id);
    is_active = false;
}

/**
 * Runs in a 1000 milliseconds cycle to track the ellapsed time.
 * While time has not ellapsed completely, updates the value of
 * the timer and the timer's display. When the time is up,
 * runs the function {@link finishTimer}.
 */
updateClock = function() {
    var current_clock_val = new Date().getTime();
    var time_elapsed = current_clock_val - prev_clock_val;
    current_timer_value -= time_elapsed;
    prev_clock_val = current_clock_val;
    if (current_timer_value <= 0) {
        finishTimer();
    }
    setTimerDisplay();
}

/**
 * Sets end date and time of the current task to the current date and time.
 * Calls function {@link stopTimer}, {@link playAlarmSound}, {@link saveStats}.
 * Sets current timer value to zero and outputs it to the timer's display.
 */
finishTimer = function() {
    current_task.e = new Date().getTime();
    stopTimer();
    playAlarmSound();
    saveStats();
    current_timer_value = 0;
    setTimerDisplay();
    return;
}

/**
 * Returns a string representation of the time value given in milliseconds.
 * The result representation is a string generated with the use of {@link generateTimerString}
 * function.
 * @param {number} timer_val - time value in milliseconds to be represented.
 */
generateTimerDisplay = function(timer_val) {
    var seconds = timer_val / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var m = Math.floor(minutes % 60);
    var s = Math.round(seconds % 60);
    var h = Math.floor(hours);
    return generateTimerString(h, m, s);
}

/**
 * Represents given time as a string of the format hh:mm:ss.
 * @param {number} hours - number of hours in the given time value.
 * @param {number} minutes - number of minutes in the given time value.
 * @param {number} seconds - number of seconds in the given time value.
 */
generateTimerString = function(hours, minutes, seconds) {
    var hours_str = addZeroIfNeeded(hours.toString());
    var minutes_str = addZeroIfNeeded(minutes.toString());
    var seconds_str = addZeroIfNeeded(seconds.toString());
    return hours_str + ":" + minutes_str + ":" + seconds_str;
}

/**
 * Adds a zero to the beginning of the string if its lenght is less than two symbols.
 * If length of the string is greater or equal to 2, returns the original string.
 * Used to represent hours, minutes and seconds on the timer display as two-digits
 * values.
 * @param {string} time_str - string to be checked.
 */
addZeroIfNeeded = function(time_str) {
    if (time_str.length < 2) {
        return "0" + time_str;
    }
    return time_str;
}

/** Change value on the timer display to the current timer value. */
setTimerDisplay = function() {
    var timer_string = generateTimerDisplay(current_timer_value);
    changeElementText(timer_string, $("#timer-display #timer-clock"));
}

/** 
 * Changes display to show the taks name.
 * @param {string} task - task name to show on the timer display. 
 */
setTimerTask = function(task) {
    changeElementText(task, $("#timer-task"));
}

/** Stops the timer and sets it (along with the display) to the previous or default value. */
resetTimer = function() {
    stopTimer();
    is_active = false;
    is_stopped = false;
    current_timer_value = default_interval;
    setTimerDisplay();
}

/** Plays sound of an alarm. Intended to be called when the time is up. */
playAlarmSound = function() {
    var sound = new Audio("audio/alarm.wav");
    sound.play();
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
        resetTimer();
    });
});