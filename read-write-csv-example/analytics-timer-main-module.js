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

---

Do I want to store the timer __history in csv? -- this would mean creating the timers when csv is parsed, right?
Peristing this would require this calculation in csv-data-main-module.js
// firstMatch.avg_duration = (firstMatch.avg_duration * firstMatch.count + avg_duration * timer.__history.length) / (firstMatch.count + timer.__history.length);
And moving this script to main process

Maybe start with moving this script to main process...

--- 

And then I need to create the scheme that reads the previous day and sends it to API and marks it as stored

*/

/**
 * final data format
 *
 * (date)
 * action
 * ncma_digital_label_id
 * ncma_digital_label_title
 * ncma_artwork_id
 * ncma_artwork_title
 * ncma_artwork_artist
 * metric_type
 * clicks
 * avg_duration
 */

const analyticsTimers = [];

const saveData = require("./csv-data-main-module.js"); // initializes csv file

const analyticsTimerManager = {
  /**
   *
   * @param {object} data - object used to identify the timer and build analytics csv row
   *
   * @param {string} data.action
   * @param {number} data.ncma_digital_label_id
   * @param {string} data.ncma_digital_label_title
   * @param {number} data.ncma_artwork_id
   * @param {string} data.ncma_artwork_title
   * @param {string} data.ncma_artwork_artist
   */
  setupStart: function (data) {
    const timer = this.create(data);
    timer.start();
  },

  saveReset: function (data) {
    const timer = this.find(data);

    if (timer) {
      timer.stop();
    }
  },

  create: function (data) {
    const existingTimer = this.find(data);

    if (existingTimer) {
      return existingTimer;
    } else {
      return new analyticsTimer(data);
    }
  },

  find: function (data) {
    const firstMatch = analyticsTimers.find((timer) => {
      return (
        timer.__identity.action === data.action &&
        timer.__identity.ncma_digital_label_id === data.ncma_digital_label_id &&
        timer.__identity.ncma_digital_label_title ===
          data.ncma_digital_label_title &&
        timer.__identity.ncma_artwork_id === data.ncma_artwork_id &&
        timer.__identity.ncma_artwork_title === data.ncma_artwork_title &&
        timer.__identity.ncma_artwork_artist === data.ncma_artwork_artist
      );
    });
    return firstMatch;
  },

  stopAll: function () {
    analyticsTimers.forEach((timer, i) => {
      timer.stop();
    });
  },

  // __formatParams: function (tab, type, name, metric_type) {
  //   // not currently used
  //   return {
  //     tab: tab,
  //     type: type,
  //     name: name,
  //     metric_type: metric_type,
  //   };
  // },
};

class analyticsTimer {
  constructor(data) {
    this.__identity = data;

    analyticsTimers.push(this);
    this.start();
  }

  start() {
    this.__initial = Date.now();
  }

  stop() {
    if (this.__initial) {
      const duration = Date.now() - this.__initial;
      this.__initial = null; // clear
      this.__history.push(duration);

      // calculate list average
      const average = (array) => array.reduce((a, b) => a + b) / array.length;
      this.__average = average(this.__history);

      // convert to seconds
      this.__average = this.__average / 1000;

      // store in csv
      saveData({
        action: this.__identity.action,
        ncma_digital_label_id: this.__identity.ncma_digital_label_id,
        ncma_digital_label_title: this.__identity.ncma_digital_label_title,
        ncma_artwork_id: this.__identity.ncma_artwork_id,
        ncma_artwork_title: this.__identity.ncma_artwork_title,
        ncma_artwork_artist: this.__identity.ncma_artwork_artist,
        metric_type: "avg_duration",
        avg_duration: this.__average,
      });
    }
  }

  __initial = null;
  __history = [];
}

//export { analyticsTimerManager };
module.exports = analyticsTimerManager;
