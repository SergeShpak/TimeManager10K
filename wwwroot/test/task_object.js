'use strict'

var good_task_fields = {
    name: "Good",
    interval: "00:20:00",
    start_time: "14:20:00",
    end_time: "14:40:00"
};

describe('Task', function() {
    describe('Instantiate', function() {
        it('Should instantiate correctly with 0 arguments passed.', 
            function() {
                var task = new Task();
                chai.assert.instanceOf(task, Task);
                chai.assert.isNull(task.name);
                chai.assert.isNull(task.interval);
                chai.assert.isNull(task.start_time);
                chai.assert.isNull(task.end_time);
        });

        it('Should instantiate correctly with 4 arguments passed.',
            function() {
                var name = good_task_fields.name;
                var interval = 
                            new TimeObject(good_task_fields.interval);
                var start_time = 
                            new TimeObject(good_task_fields.start_time);
                var end_time = new TimeObject(good_task_fields.end_time);
                var task = new Task(name, interval, start_time, end_time);
                chai.assert.equal(name, task.name);
                chai.assert.equal(0, interval.compareTo(task.interval));
                chai.assert.equal(0, start_time.compareTo(task.start_time));
                chai.assert.equal(0, end_time.compareTo(task.end_time));
            });
    });
});
