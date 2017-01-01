var default_interval = 1000 * 20;
var current_timer_value = default_interval;
var is_active = false;
var is_stopped = false;
var prev_clock_val;
var timer_tick_id;

var changeTimerValue;
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

saveStats = function() {
    saveCurrentTask();
}

saveCurrentTask = function() {
    //if (!localStorage.timer_tasks) {
        localStorage[local_storage_tasks_key] = JSON.stringify([]);
    //}
    tasks = JSON.parse(localStorage[local_storage_tasks_key]);
    tasks.push(current_task);
    localStorage[local_storage_tasks_key] = JSON.stringify(tasks);
}

changeTimerValue = function(val, el) {
    $(el).text(val);
}

startTimer = function() {
    prev_clock_val = new Date().getTime();
    current_task.s = prev_clock_val;
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
        current_task.e = current_clock_val;
        stopTimer();
        playAlarmSound();
        saveStats();
        current_timer_value = 0;
        setTimerDisplay();
        return;
    }
    setTimerDisplay();
}

generateTimerDisplay = function(timer_val) {
    var seconds = timer_val / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var m = Math.floor(minutes % 60);
    var s = Math.round(seconds % 60);
    var h = Math.floor(hours);
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
    var timer_string = generateTimerDisplay(current_timer_value);
    changeTimerValue(timer_string, $("#timer-display #timer-clock"));
}

setTimerTask = function(task) {
    changeTimerValue(task, $("#timer-display #timer-task"));
}

resetTimer = function(task) {
    stopTimer();
    is_active = false;
    is_stopped = false;
    current_timer_value = default_interval;
    setTimerDisplay();
}

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