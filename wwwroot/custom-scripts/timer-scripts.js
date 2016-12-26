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
        end_date = new Date();
        end_date.setHours(end_date.getHours() + interval.getHours());
        end_date.setMinutes(end_date.getMinutes() + interval.getMinutes());
        end_date.setSeconds(end_date.getSeconds() + interval.getSeconds());
    }

    updateClock = function() {
        var diff = end_date - new Date();
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

    freezeClock = function() {
        time_left = end_date - new Date();
        clearInterval(timer_loop_id);
    }

    $("#timer-start-btn").click(function() {
        var interval;
        if (is_active) {
            return;
        }
        is_active = true;
        interval = new Date(0, 0, 0, 0, 25, 0, 0);
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