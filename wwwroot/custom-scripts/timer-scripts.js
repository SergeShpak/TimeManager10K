$(document).ready(function() {
    var end_date;

    var changeTimerValue;
    var getEndTime;
    var updateClock;
    var getTimerObj;
    var getTimerString;

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
        var h = timer_obj.h.toString();
        var m = timer_obj.m.toString();
        var s = timer_obj.s.toString();
        return h + ":" + m + ":" + s;
    }

    $("#timer-start-btn").click(function() {
        var interval = new Date(0, 0, 0, 0, 25, 0, 0);
        setEndTime(interval);
        updateClock();
        setInterval(updateClock, 1000);
    });

    $("#timer-stop-btn").click(function() {
        freezeClock();
    });

    $("#timer-reset-btn").click(function() {
        changeTimerValue("Timer reset", $("#timer-display p"));
    });
});