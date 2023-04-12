import {
  createAnalyticsTimer,
  findAnalyticsTimer,
  analyticsTimer,
} from "./analytics-timer.js";

window.addEventListener("load", init);

/**
 * final data format
 *
 * date
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

function init() {
  const content1Btn = document.getElementById("content-1-btn");
  const content2Btn = document.getElementById("content-2-btn");
  const experience1Btn = document.getElementById("experience-1-btn");
  const experience2Btn = document.getElementById("experience-2-btn");

  const startTimerBtn = document.getElementById("start-timer-btn");
  const stopTimerBtn = document.getElementById("stop-timer-btn");

  function sendCsvData(event, data) {
    window.csvHandler.save(event, data);
  }

  content1Btn.addEventListener("click", (event) => {
    sendCsvData(event, {
      tab: "home",
      type: "content",
      name: "content-1",
      metric_type: "clicks",
      clicks: 1,
    });
  });

  content2Btn.addEventListener("click", (event) => {
    sendCsvData(event, {
      tab: "home",
      type: "content",
      name: "content-2",
      metric_type: "clicks",
      clicks: 1,
    });
  });

  experience1Btn.addEventListener("click", (event) => {
    sendCsvData(event, {
      tab: "home",
      type: "experience",
      name: "experience-1",
      metric_type: "clicks",
      clicks: 1,
    });
  });

  experience2Btn.addEventListener("click", (event) => {
    sendCsvData(event, {
      tab: "home",
      type: "experience",
      name: "experience-2",
      metric_type: "clicks",
      clicks: 1,
    });
  });

  startTimerBtn.addEventListener("click", (event) => {
    const timer = createAnalyticsTimer({
      tab: "home",
      type: "timer",
      name: "test-timer-1",
      metric_type: "avg_duration",
    });

    timer.start();
  });

  stopTimerBtn.addEventListener("click", (event) => {
    const timer = findAnalyticsTimer({
      tab: "home",
      type: "timer",
      name: "test-timer-1",
      metric_type: "avg_duration",
    });

    if (timer) {
      timer.stop();
    }
  });
}
