const analyticsTimers = [];
const minimumTimeToSave = 10 * 1000; // 10 seconds

/**
 * Circular depedency workaround
 *
 * See replies by Will Stern and Nicolas Gramlich in this thread
 * How to deal with cyclic dependencies in Node.js
 * https://stackoverflow.com/questions/10869276/how-to-deal-with-cyclic-dependencies-in-node-js
 */

module.exports.analyticsTimerManager = {
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
    const timer = this.create(true, data);
    timer.start();
  },

  saveReset: function (data) {
    const timer = this.find(data);

    if (timer) {
      timer.stop();
    }
  },

  create: function (bool, data) {
    const existingTimer = this.find(data);

    if (existingTimer) {
      return existingTimer;
    } else {
      return new analyticsTimer(bool, data);
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

const saveData = require("./csv-data-current-day.js").saveData;

class analyticsTimer {
  constructor(startOnInitialize, data) {
    this.__identity = {
      action: data.action,
      ncma_digital_label_id: data.ncma_digital_label_id,
      ncma_digital_label_title: data.ncma_digital_label_title,
      ncma_artwork_id: data.ncma_artwork_id,
      ncma_artwork_title: data.ncma_artwork_title,
      ncma_artwork_artist: data.ncma_artwork_artist,
    };

    this.__initial = null;
    this.__history = [];

    // populate former history to keep weighted average accurate across sessions
    if (data.last_session_avg_duration && data.last_session_avg_count) {
      for (let i = 0; i < data.last_session_avg_count; i++) {
        this.__history.push(data.last_session_avg_duration * 1000); // convert back to milliseconds
      }
    }

    analyticsTimers.push(this);

    if (startOnInitialize) {
      this.start();
    }
  }

  start() {
    this.__initial = Date.now();
  }

  stop() {
    if (this.__initial) {
      const duration = Date.now() - this.__initial;
      this.__initial = null; // clear

      if (duration < minimumTimeToSave) {
        // do not save
        // console.log("duration under minimum, not saving");
        return;
      }

      this.__history.push(duration);

      // calculate history of times average
      const average = (array) => array.reduce((a, b) => a + b) / array.length;
      this.__average = average(this.__history);

      // convert to seconds
      this.__average = this.__average / 1000;

      //console.log(this.__history, this.__average, this.__history.length);

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
        avg_count: this.__history.length,
      });
    }
  }
}
