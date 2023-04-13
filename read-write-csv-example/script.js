//import { analyticsTimerManager } from "./analytics-timer-browser-module.js";

window.addEventListener("load", init);

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

function init() {
  const content1Btn = document.getElementById("content-1-btn");
  const content2Btn = document.getElementById("content-2-btn");
  const experience1Btn = document.getElementById("experience-1-btn");
  const experience2Btn = document.getElementById("experience-2-btn");

  const startTimer1Btn = document.getElementById("start-timer-1-btn");
  const stopTimer1Btn = document.getElementById("stop-timer-1-btn");

  const analyticsHandler = window.analyticsHandler;

  // engagements

  content1Btn.addEventListener("click", (event) => {
    analyticsHandler.save({
      action: "Engagement - Artwork",
      ncma_digital_label_id: 15,
      ncma_digital_label_title: "Kunstkamer",
      ncma_artwork_id: 38,
      ncma_artwork_title:
        "The Black Lace Dress (Portrait of the Artist's Wife)",
      ncma_artwork_artist: "Julien Alden Wier",
      metric_type: "clicks",
    });
  });

  content2Btn.addEventListener("click", (event) => {
    analyticsHandler.save({
      action: "Engagement - Artwork",
      ncma_digital_label_id: 15,
      ncma_digital_label_title: "Kunstkamer",
      ncma_artwork_id: 43,
      ncma_artwork_title: "New Mexico",
      ncma_artwork_artist: "Ansel Adams",
      metric_type: "clicks",
    });
  });

  experience1Btn.addEventListener("click", (event) => {
    analyticsHandler.save({
      action: "Engagement - Label",
      ncma_digital_label_id: 15,
      ncma_digital_label_title: "Kunstkamer",
      ncma_artwork_id: "",
      ncma_artwork_title: "",
      ncma_artwork_artist: "",
      metric_type: "clicks",
    });
  });

  experience2Btn.addEventListener("click", (event) => {
    analyticsHandler.save({
      action: "Engagement - Label",
      ncma_digital_label_id: 18,
      ncma_digital_label_title: "African",
      ncma_artwork_id: "",
      ncma_artwork_title: "",
      ncma_artwork_artist: "",
      metric_type: "clicks",
    });
  });

  // time on task

  startTimer1Btn.addEventListener("click", (event) => {
    analyticsHandler.startTimer({
      action: "Time on task - Label",
      ncma_digital_label_id: 18,
      ncma_digital_label_title: "African",
      ncma_artwork_id: "",
      ncma_artwork_title: "",
      ncma_artwork_artist: "",
    });
  });

  stopTimer1Btn.addEventListener("click", (event) => {
    analyticsHandler.stopTimer({
      action: "Time on task - Label",
      ncma_digital_label_id: 18,
      ncma_digital_label_title: "African",
      ncma_artwork_id: "",
      ncma_artwork_title: "",
      ncma_artwork_artist: "",
    });
  });
}
