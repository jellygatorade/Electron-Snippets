import { saveData } from "./csv-data.js";

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
});

/*
Use of require in csv-data.js prevents window onload event from firing
Must move the code that currrently is in csv-data.js to a main process module
*/

window.addEventListener("load", init);

function init() {
  console.log("loaded");
  //   content1Btn = document.getElementById("content-1-btn");
  //   content2Btn = document.getElementById("content-2-btn");
  //   experience1Btn = document.getElementById("experience-1-btn");
  //   experience2Btn = document.getElementById("experience-2-btn");

  //   content1Btn.addEventListener("click", () => {
  //     saveData("home", "content", "content-1", 1);
  //     console.log("clicked");
  //   });

  //   content2Btn.addEventListener("click", () => {
  //     saveData("home", "content", "content-2", 1);
  //   });

  //   experience1Btn.addEventListener("click", () => {
  //     saveData("home", "experience", "experience-1", 1);
  //   });

  //   experience2Btn.addEventListener("click", () => {
  //     saveData("home", "experience", "experience-2", 1);
  //   });
}
