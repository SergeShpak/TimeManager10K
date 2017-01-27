var current_timer_value;
var is_active = false;
var is_stopped = false;
var prev_clock_val;
var timer_tick_id;
var task_storage = {
    name: null,
    iterval: null,
    start_time: null,
    end_time: null
};
var previous_interval = new TimeObject(CONSTANTS.default_interval_str());

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
var getInaccurateTimeObject;

/**
 * Saves all the relevant information of the passed timer period:
 * calls {@link saveCurrentTask}.
 */
saveStats = function() {
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
 * and time. Sets the function {@link updateClock} to be run every 1000 milliseconds.
 */
startTimer = function() {
    prev_clock_val = new Date().getTime();
    task_storage.start_time = prev_clock_val;
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
    var time_elapsed_ms = current_clock_val - prev_clock_val;
    current_timer_value.setFromMsTime(
                            current_timer_value.total_ms() - time_elapsed_ms);
    prev_clock_val = current_clock_val;
    if (current_timer_value.total_ms() <= 0) {
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
    task_storage.end_time = new TimeObject(new Date().getTime());
    stopTimer();
    playAlarmSound();
    saveStats();
    current_timer_value = new TimeObject(0);
    setTimerDisplay(current_timer_value);
    return;
}

/** Change value on the timer display to the current timer value. */
setTimerDisplay = function(time_obj) {
    var err_msg;
    if (!(time_obj instanceof TimeObject)) {
        err_msg = ['Cannot set timer display: argument passed is not ', 
                    'an instance of a TimeObject.'].join("");
        throw new TypeError(err_msg);
    }
    changeElementText(time_obj.toString(), $("#timer-display #timer-clock"));
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
    current_timer_value = previous_interval;
    setTimerDisplay(current_timer_value);
}

/** Plays sound of an alarm. Intended to be called when the time is up. */
playAlarmSound = function() {
    var sound = new Audio("audio/alarm.wav");
    sound.play();
}


$(document).ready(function() {
    current_timer_value = new TimeObject(CONSTANTS.default_interval_str());
    setTimerDisplay(current_timer_value);

    $("#timer-start-btn").click(function() {
        if (is_active) {
            return;
        }
        if (current_timer_value.total_seconds <= 0) {
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
