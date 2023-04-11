window.addEventListener("load", init);

function init() {
  const content1Btn = document.getElementById("content-1-btn");
  const content2Btn = document.getElementById("content-2-btn");
  const experience1Btn = document.getElementById("experience-1-btn");
  const experience2Btn = document.getElementById("experience-2-btn");

  content1Btn.addEventListener("click", (event) => {
    const data = {
      tab: "home",
      type: "content",
      name: "content-1",
      clicked: 1,
    };

    window.csvHandler.save(event, data);
  });

  content2Btn.addEventListener("click", (event) => {
    const data = {
      tab: "home",
      type: "content",
      name: "content-2",
      clicked: 1,
    };

    window.csvHandler.save(event, data);
  });

  experience1Btn.addEventListener("click", (event) => {
    const data = {
      tab: "home",
      type: "experience",
      name: "experience-1",
      clicked: 1,
    };

    window.csvHandler.save(event, data);
  });

  experience2Btn.addEventListener("click", (event) => {
    const data = {
      tab: "home",
      type: "experience",
      name: "experience-2",
      clicked: 1,
    };

    window.csvHandler.save(event, data);
  });
}
