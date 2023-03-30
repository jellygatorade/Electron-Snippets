window.onload = function () {
  var today = new Date();

  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  var csvContent;

  document.addEventListener("keyup", function (event) {
    if (event.keyCode == 9) {
      if (document.querySelector(".admin-panel").style.display == "block") {
        document.querySelector(".admin-panel").style.display = "none";
      } else {
        document.querySelector(".admin-panel").style.display = "block";
      }
    }
  });

  // Read full data
  Papa.parse(readTextFile(`file:/${__dirname}/CSVs/fullData.csv`), {
    header: true,
    complete: function (results) {
      csvContent = results.data;
      csvContent.forEach((line) => {
        var node = document.createElement("p");
        node.className = "row";
        node.innerHTML = `<span class='data'>${line.tab},</span> <span class='data'>${line.type},</span> <span class='data'>${line.name},</span> <span class='data'>${line.clicked}</span>`;
        document.querySelector(".total-data").appendChild(node);
      });
    },
  });

  var todayCsvContent;

  // Read or create today's data
  if (fs.existsSync(`resources/app/CSVs/${date}.csv`)) {
    Papa.parse(readTextFile(`file:/${__dirname}/CSVs/${date}.csv`), {
      header: true,
      complete: function (results) {
        todayCsvContent = results.data;
        todayCsvContent.forEach((line) => {
          var node = document.createElement("p");
          node.className = "row";
          node.innerHTML = `<span class='data'>${line.tab},</span> <span class='data'>${line.type},</span> <span class='data'>${line.name},</span> <span class='data'>${line.clicked}</span>`;
          document.querySelector(".today-data").appendChild(node);
        });
      },
    });
  } else {
    let writeStream1 = fs.createWriteStream(`resources/app/CSVs/${date}.csv`);
    let firstLine1 = ["tab", "type", "name", "clicked"];
    writeStream1.write(firstLine1.join(",") + "\n", () => {});
    for (let index = 0; index < csvContent.length; index++) {
      const someObject = csvContent[index];
      let newLine1 = [];
      newLine1.push(someObject.tab);
      newLine1.push(someObject.type);
      newLine1.push(someObject.name);
      newLine1.push("0");
      if (index === csvContent.length - 1) {
        writeStream1.write(newLine1.join(","), () => {});
      } else {
        writeStream1.write(newLine1.join(",") + "\n", () => {});
      }
    }
    writeStream1.end();
    writeStream1
      .on("finish", () => {
        console.log("main write stream finished, moving along");
        Papa.parse(readTextFile(`file:/${__dirname}/CSVs/${date}.csv`), {
          header: true,
          complete: function (results) {
            todayCsvContent = results.data;
            todayCsvContent.forEach((line) => {
              var node = document.createElement("p");
              node.className = "row";
              node.innerHTML = `<span class='data'>${line.tab},</span> <span class='data'>${line.type},</span> <span class='data'>${line.name},</span> <span class='data'>${line.clicked}</span>`;
              document.querySelector(".today-data").appendChild(node);
            });
          },
        });
      })
      .on("error", (err) => {
        console.log(err);
      });
  }

  function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var response;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          response = rawFile.responseText;
        }
      }
    };
    rawFile.send(null);
    return response;
  }

  function saveData(tab, type, name, clicked) {
    let writeStream1 = fs.createWriteStream(`resources/app/CSVs/fullData.csv`);
    let firstLine1 = ["tab", "type", "name", "clicked"];
    writeStream1.write(firstLine1.join(",") + "\n", () => {});
    for (let index = 0; index < csvContent.length; index++) {
      const someObject = csvContent[index];
      let newLine1 = [];
      newLine1.push(someObject.tab);
      newLine1.push(someObject.type);
      newLine1.push(someObject.name);
      newLine1.push(someObject.clicked);
      if (index === csvContent.length - 1) {
        writeStream1.write(newLine1.join(","), () => {});
      } else {
        writeStream1.write(newLine1.join(",") + "\n", () => {});
      }
    }
    writeStream1.end();
    writeStream1
      .on("finish", () => {
        document.querySelectorAll(".row").forEach((row) => {
          row.parentElement.removeChild(row);
        });
        csvContent.forEach((line) => {
          var node = document.createElement("p");
          node.className = "row";
          node.innerHTML = `<span class='data'>${line.tab},</span> <span class='data'>${line.type},</span> <span class='data'>${line.name},</span> <span class='data'>${line.clicked}</span>`;
          document.querySelector(".total-data").appendChild(node);
        });
      })
      .on("error", (err) => {
        console.log(err);
      });
    let writeStream = fs.createWriteStream(`resources/app/CSVs/${date}.csv`);
    let firstLine = ["tab", "type", "name", "clicked"];
    writeStream.write(firstLine.join(",") + "\n", () => {});
    for (let index = 0; index < csvContent.length; index++) {
      const someObject = todayCsvContent[index];
      let newLine = [];
      newLine.push(someObject.tab);
      newLine.push(someObject.type);
      newLine.push(someObject.name);
      newLine.push(someObject.clicked);
      if (index === csvContent.length - 1) {
        writeStream.write(newLine.join(","), () => {});
      } else {
        writeStream.write(newLine.join(",") + "\n", () => {});
      }
    }
    writeStream.end();
    writeStream
      .on("finish", () => {
        // document.querySelectorAll('.row').forEach(row => {
        //   row.parentElement.removeChild(row)
        // })
        todayCsvContent.forEach((line) => {
          var node = document.createElement("p");
          node.className = "row";
          node.innerHTML = `<span class='data'>${line.tab},</span> <span class='data'>${line.type},</span> <span class='data'>${line.name},</span> <span class='data'>${line.clicked}</span>`;
          document.querySelector(".today-data").appendChild(node);
        });
      })
      .on("error", (err) => {
        console.log(err);
      });
  }
};
