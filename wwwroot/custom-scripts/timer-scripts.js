$(document).ready(function() {
    var end_date;
    var time_left;
    var was_stopped;
    var is_active;
    var timer_loop_id;

    var changeTimerValue;
    var getEndTime;
    var updateClock;
    var getTimerObj;
    var getTimerString;
    var addZeroIfNeeded;
    var freezeClock;
    var getInterval;
    var setTimeLeft;

    addZeroIfNeeded = function(time_str) {
        if (time_str.length < 2) {
            return "0" + time_str;
        }
        return time_str;
    }

    changeTimerValue = function(val, el) {
        $(el).text(val);
    }

    setEndTime = function(interval) {
        end_date = new Date().getTime() + interval;
    }

    updateClock = function() {
        var diff = end_date - new Date().getTime();
        if (diff <= 0) {
            changeTimerValue("Time's up!", $("#timer-display p"))
        }
        timer_string = getTimerString(diff);
        changeTimerValue(timer_string, $("#timer-display p"));
    }

    getTimerObj = function(time) {
        var h = Math.floor((time / (1000 * 60 * 60)) % 24);
        var m = Math.floor((time / (1000 * 60)) % 60);
        var s = Math.floor((time / (1000)) % 60);
        return {
            "h": h,
            "m": m,
            "s": s
        };
    }

    getTimerString = function(time) {
        var timer_obj = getTimerObj(time);
        var h = addZeroIfNeeded(timer_obj.h.toString());
        var m = addZeroIfNeeded(timer_obj.m.toString());
        var s = addZeroIfNeeded(timer_obj.s.toString());
        return h + ":" + m + ":" + s;
    }

    setTimeLeft = function() {
        time_left = end_date - new Date().getTime();
    }

    freezeClock = function() {
        setTimeLeft();
        clearInterval(timer_loop_id);
    }

    getInterval = function() {
        var interval;
        if (was_stopped) {
            return time_left;
        }
        interval = 25 * 1000 * 60;
        return interval;
    }

    $("#timer-start-btn").click(function() {
        var interval;
        if (is_active) {
            return;
        }
        is_active = true;
        interval = getInterval();
        setEndTime(interval);
        updateClock();
        timer_loop_id = setInterval(updateClock, 1000);
    });

    $("#timer-stop-btn").click(function() {
        if (!is_active) {
            return;
        }
        is_active = false;
        freezeClock();
        was_stopped = true;
    });

    $("#timer-reset-btn").click(function() {
        changeTimerValue("Timer reset", $("#timer-display p"));
    });
});