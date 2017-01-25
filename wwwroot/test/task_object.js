'use strict'

var initFromTaskStoreObject,
    initTripletFromTaskStoreObject;

var good_task_fields,
    start_greater_end,
    duration_greater_diff,
    tasks_store_desc,
    consistent_triplet,
    start_greater_end_triplet,
    duration_greater_diff_triplet;



good_task_fields = {
    name: "Good",
    interval: "00:20:00",
    start_time: "14:20:00",
    end_time: "14:40:00"
};

start_greater_end = {
    name: "Bad",
    interval: "00:20:00",
    end_time: "14:20:00",
    start_time: "14:40:00"
};

duration_greater_diff = {
    name: "Bad",
    interval: "00:25:00",
    start_time: "14:20:00",
    end_time: "14:40:00"
};

tasks_store_desc = [
    {
        name: "B",
        interval: "00:30:00",
        start_time: "00:00:00",
        end_time: "00:30:00"
    },

    {
        name: "A",
        interval: "00:25:00",
        start_time: "00:30:00",
        end_time: "00:55:00"
    },
    
    {
        name: "A",
        interval: "00:25:00",
        start_time: "00:40:00",
        end_time: "01:05:00"
    },

    {
        name: "A",
        interval: "00:25:00",
        start_time: "00:40:00",
        end_time: "01:20:00"
    }
];

initTripletFromTaskStoreObject = function(task_store_obj) {
    return {
        interval: new TimeObject(task_store_obj.interval),
        start_time: new TimeObject(task_store_obj.start_time),
        end_time: new TimeObject(task_store_obj.end_time)
    };
};

consistent_triplet = initTripletFromTaskStoreObject(good_task_fields);

start_greater_end_triplet = initTripletFromTaskStoreObject(start_greater_end);

duration_greater_diff_triplet = 
    initTripletFromTaskStoreObject(duration_greater_diff);

initFromTaskStoreObject = function(task_store_obj) {
    var name = task_store_obj.name;
    var interval = new TimeObject(task_store_obj.interval);
    var start_time = new TimeObject(task_store_obj.start_time);
    var end_time = new TimeObject(task_store_obj.end_time);
    var task = new Task(name, interval, start_time, end_time); 
    return task;
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
                var task = initFromTaskStoreObject(good_task_fields); 
                var interval, start_time, end_time;
                chai.assert.equal(good_task_fields.name, task.name);
                interval = new TimeObject(good_task_fields.interval);
                chai.assert.equal(0, interval.compareTo(task.interval));
                start_time = new TimeObject(good_task_fields.start_time);
                chai.assert.equal(0, start_time.compareTo(task.start_time));
                end_time = new TimeObject(good_task_fields.end_time);
                chai.assert.equal(0, end_time.compareTo(task.end_time));
            });

        it(['Should throw a TypeError when start time is greater than  ',
                'end time.'].join(""), function() {
            chai.expect(function() {
                var task = initFromTaskStoreObject(start_greater_end);
                }).to.throw(TypeError);
        });

        it(['Should throw a TypeError when task duration is larger ',
            'than difference between end time and start time.'].join(""),
        function() {
            chai.expect(function() {
                var task = initFromTaskStoreObject(duration_greater_diff);
            }).to.throw(TypeError); 
        }); 
    });

    describe('compare', function() {
        it('Should compare task objects correctly', function() {
            var tasks_desc = tasks_store_desc.map(initFromTaskStoreObject);
            var equal_task;
            for (var i = 0; i < 3; i++) {
                chai.assert
                    .isTrue(tasks_desc[i].compare(tasks_desc[i + 1]) > 0); 
                chai.assert
                    .isTrue(tasks_desc[3 - i].compare(tasks_desc[2 - i]) < 0);
            }
            var equal_task = initFromTaskStoreObject(tasks_store_desc[0]);
            chai.assert.equal(0, equal_task.compare(tasks_desc[0]));
        });

        it('Should throw a TypeError if compared object is not a task', 
            function() {
                var task = initFromTaskStoreObject(good_task_fields);
                var some_obj = { first: "foremost" };
                chai.expect(function() {
                    task.compare(some_obj);
                }).to.throw(TypeError);
            });
    });
    
    describe('areValidStartEndTimes', function() {
        it('Should recognize valid start and end times.', function() {
            chai.assert.isTrue(Task.areValidStartEndTimes(
                                    consistent_triplet.start_time, 
                                    consistent_triplet.end_time)); 
        });

        it('Should recognize invalid start and end times.', function() {
            chai.assert.isFalse(Task.areValidStartEndTimes(
                                    start_greater_end_triplet.start_time,
                                    start_greater_end_triplet.end_time));
        });
    });

    describe('isValidInterval', function() {
        it('Should recognize consistent interval.', function() {
            chai.assert.isTrue(Task.isValidInterval(
                                    consistent_triplet.interval,
                                    consistent_triplet.start_time,
                                    consistent_triplet.end_time));
        });

        it('Should recognize inconsistent interval.', function() {
            chai.assert.isFalse(Task.isValidInterval(
                                    duration_greater_diff_triplet.interval,
                                    duration_greater_diff_triplet.start_time,
                                    duration_greater_diff_triplet.end_time));
        });
    });

    describe('setDataToEmpty', function() {
        it('Should set task fields to null.', function() {
            var task = new Task("Task",
                                consistent_triplet.interval,
                                consistent_triplet.start_time,
                                consistent_triplet.end_time);
            task.setDataToEmpty();
            chai.assert.isNull(task.interval);
            chai.assert.isNull(task.start_time);
            chai.assert.isNull(task.end_time);
        }); 
    });

    describe('setName', function() {
        it('Should set task\'s name correctly.', function() {
            var task = new Task();
            var name = "My task";
            task.setName("My task");
            chai.assert.equal(name, task.name);
        });

        it('Should raise TypeError when passed argument is not a string',
            function() {
                var task= new Task();
                var bad_name = 4;
                chai.expect(function() {
                    task.setName(bad_name);
                }).to.throw(TypeError);
            });
    });
});
