var current_timer_value;
var is_active = false;
var is_stopped = false;
var prev_clock_val;
var timer_tick_id;
var task_storage;
var update_rate = 1000;
var previous_timer_value = CONSTANTS.default_interval();

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
var saveTask;
var saveCurrentTask;
var finishTimer;
var getInaccurateTimeObject;

/**
 * Saves all the relevant information of the passed timer period:
 * calls {@link saveCurrentTask}.
 */
saveTask = function() {
    saveCurrentTask();
}

// TODO:implement with indexdb 
saveCurrentTask = function() {
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
 * and time. Sets the function {@link updateClock} to be run every 
 * 1000 milliseconds.
 */
startTimer = function() {
    var current_time = new Date().valueOf();
    if (!is_stopped) {
        task_storage.setStartTime(current_time);
        task_storage.setInterval(current_timer_value.time_ms);
    }
    current_timer_value.setCountingPoint(current_time); 
    timer_tick_id = setInterval(updateClock, update_rate);
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
    setTimerDisplay(current_timer_value);
}

/**
 * Runs in a 1000 milliseconds cycle to track the ellapsed time.
 * While time has not ellapsed completely, updates the value of
 * the timer and the timer's display. When the time is up,
 * runs the function {@link finishTimer}.
 */
updateClock = function() {
    current_timer_value.countTimePassed(update_rate);
    if (current_timer_value.isEllapsed()) {
        finishTimer();
    }
    setTimerDisplay(current_timer_value);
}

/**
 * Sets end date and time of the current task to the current date and time.
 * Calls function {@link stopTimer}, {@link playAlarmSound}, {@link saveStats}.
 * Sets current timer value to zero and outputs it to the timer's display.
 */
finishTimer = function() {
    task_storage.setEndTime(new Date().valueOf());
    stopTimer();
    playAlarmSound();
    saveTask();
    current_timer_value = new PreciseTime(0);
    setTimerDisplay(current_timer_value);
    console.log(task_storage.toString());
    task_storage.setDataToEmpty();
    return;
}

/** Change value on the timer display to the current timer value. */
setTimerDisplay = function(time_obj) {
    var err_msg;
    var time_obj_str;
    if ( !(time_obj instanceof PreciseTime)) {
        err_msg = ['Cannot set timer display: argument passed should be an ', 
                    'instance of PreciseTime class.'].join("");
        throw new TypeError(err_msg);
    }
    time_obj_str = TimeObject.msToString(time_obj.time_ms);
    changeElementText(time_obj_str, $("#timer-display #timer-clock"));
}

/** 
 * Changes display to show the taks name.
 * @param {string} task - task name to show on the timer display. 
 */
setTimerTask = function(task) {
    changeElementText(task, $("#timer-task"));
}

/** 
 * Stops the timer and sets it (along with the display) to the previous 
 * or default value. */
resetTimer = function() {
    stopTimer();
    is_active = false;
    is_stopped = false;
    task_storage.setDataToEmpty();
    current_timer_value = new PreciseTime(previous_timer_value);
    setTimerDisplay(current_timer_value);
}

/** Plays sound of an alarm. Intended to be called when the time is up. */
playAlarmSound = function() {
    var sound = new Audio("audio/alarm.wav");
    sound.play();
}


$(document).ready(function() {
    task_storage = new Task();
    current_timer_value = new PreciseTime(CONSTANTS.default_interval());
    setTimerDisplay(current_timer_value);

    $("#timer-start-btn").click(function() {
        if (is_active) {
            return;
        }
        if (current_timer_value.isEllapsed()) {
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
