$(document).ready(function() {
    var time_input = document.querySelector("#task-time-input");

    time_input.addEventListener('input', function(e) {
        console.log("New input! Coming from this element: ", e.target);
    });
});