var default_interval = new TimeObject("25:00");
var current_timer_value = new TimeObject(default_interval.getTotalSeconds * 1000);
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

// TODO: finish comment
/** 
 * Saves current task in the localStorage as a stringified object.
 * 
 */
saveCurrentTask = function() {
    var tasks;
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
    prev_clock_val = new TimeObject(new Date().getTime());
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
    var current_clock_val = new TimeObject(new Date().getTime());
    var time_elapsed = current_clock_val.sub(prev_clock_val);
    current_timer_value = current_timer_value.sub(time_elapsed);
    prev_clock_val = current_clock_val;
    if (current_timer_value.getTotalSeconds() <= 0) {
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
    task_storage.end_time = new TimeObject(new Date().getTime());
    // TODO: continue
    stopTimer();
    playAlarmSound();
    saveStats();
    current_timer_value = 0;
    setTimerDisplay();
    return;
}

/** Change value on the timer display to the current timer value. */
setTimerDisplay = function() {
    changeElementText(current_timer_value.toString(), 
                        $("#timer-display #timer-clock"));
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