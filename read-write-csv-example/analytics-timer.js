/*

Requirements

Start a timer on action
Stop it from somewhere else in program

---

What timers will there be?
- In label overall
- Within artwork

Will need to be able to identify the correct timer to stop in the stop function

---

And then will need to 
store all timed durations same analytic in a list 
and take an average of each list
and then store that average in csv

---

Timer will be identifed per analytic ?

Start action will pass data for the analytic
Stop action will pass the same data
Also need a stop all timers function in case

*/

window.analyticsTimers = [];

function createAnalyticsTimer(data) {
  const existingTimer = findAnalyticsTimer(data);

  if (existingTimer) {
    return existingTimer;
  } else {
    return new analyticsTimer(data);
  }
}

function findAnalyticsTimer(data) {
  const firstMatch = window.analyticsTimers.find((timer) => {
    return (
      timer.__identity.tab === data.tab &&
      timer.__identity.type === data.type &&
      timer.__identity.name === data.name &&
      timer.__identity.metric_type === data.metric_type
    );
  });
  return firstMatch;
}

function stopAllAnalyticsTimers() {
  window.analyticsTimers.forEach((timer, i) => {
    timer.stop();
  });
}

class analyticsTimer {
  constructor(data, params) {
    this.__identity = data;

    window.analyticsTimers.push(this);
    this.start();
  }

  // public
  start() {
    this.__initial = Date.now();
  }

  stop() {
    if (this.__initial) {
      const duration = Date.now() - this.__initial;
      this.__initial = null;
      this.__list.push(duration);

      // calculate list average
      // convert to seconds?
      // store in csv
      const average = (array) => array.reduce((a, b) => a + b) / array.length;
      this.__average = average(this.__list);

      window.csvHandler.save(null, {
        tab: this.__identity.tab,
        type: this.__identity.type,
        name: this.__identity.name,
        metric_type: this.__identity.metric_type,
        avg_duration: this.__average,
      });
    }
  }

  // "private"
  __initial = null;
  __list = [];
}

// const testTimer1 = new analyticsTimer({
//   tab: "home",
//   type: "experience",
//   name: "experience-1",
//   metric_type: "avg_duration",
//   avg_duration: 1,
// });

// const testTimer2 = new analyticsTimer({
//   tab: "home",
//   type: "experience",
//   name: "experience-2",
//   metric_type: "avg_duration",
//   avg_duration: 1,
// });

//stopAllAnalyticsTimers();

export { createAnalyticsTimer, findAnalyticsTimer, analyticsTimer };
