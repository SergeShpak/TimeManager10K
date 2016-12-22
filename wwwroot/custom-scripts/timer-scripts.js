$(document).ready(function() {
    var changeTimerValue = function(text, el) {
        el.text(text);
    };

    $("#timer-start-btn").click(function() {
        changeTimerValue("Timer started", $("#timer-display p"));
    });

    $("#timer-stop-btn").click(function() {
        changeTimerValue("Timer stopped", $("#timer-display p"));
    });

    $("#timer-reset-btn").click(function() {
        changeTimerValue("Timer reset", $("#timer-display p"));
    });
});