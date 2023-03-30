const fs = require("fs");

const today = new Date();
const date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

// Read full data
let csvContent;
let fields;

Papa.parse(await readTextFile(`file:/${__dirname}/full-data.csv`), {
  header: true,
  complete: function (results) {
    results.data.forEach((entry) => (entry.clicked = parseInt(entry.clicked)));

    csvContent = results.data;
    fields = results.meta.fields;

    console.log(csvContent);
  },
});

async function readTextFile(path) {
  const text = await fetch(path).then((response) => {
    return response.text();
  });
  return text;
}

function saveData(tab, type, name, clicked) {
  // find matching row in csvContent
  const firstMatch = csvContent.find((entry) => {
    return (
      entry.tab === "tab-1" &&
      entry.type === "hotspot" &&
      entry.name === "test-button"
    );
  });

  // if matching row
  if (firstMatch) {
    firstMatch.clicked++; // increment clicks
  } else {
    let newEntry = {};
    newEntry.tab = tab;
    newEntry.type = type;
    newEntry.name = name;
    newEntry.clicked = clicked;
    csvContent.push(newEntry);
  }

  let writeStream = fs.createWriteStream(`${__dirname}/full-data.csv`);

  let firstLine = fields;
  writeStream.write(firstLine.join(",") + "\n", () => {});

  console.log(csvContent);

  for (let i = 0; i < csvContent.length; i++) {
    const existingEntry = csvContent[i];
    let newRow = [];
    newRow.push(existingEntry.tab);
    newRow.push(existingEntry.type);
    newRow.push(existingEntry.name);
    newRow.push(existingEntry.clicked);
    if (i === csvContent.length - 1) {
      writeStream.write(newRow.join(","), () => {});
    } else {
      writeStream.write(newRow.join(",") + "\n", () => {});
    }
  }

  writeStream.end();

  writeStream
    .on("finish", () => {
      //   document.querySelectorAll(".row").forEach((row) => {
      //     row.parentElement.removeChild(row);
      //   });
      //   csvContent.forEach((line) => {
      //     var node = document.createElement("p");
      //     node.className = "row";
      //     node.innerHTML = `<span class='data'>${line.tab},</span> <span class='data'>${line.type},</span> <span class='data'>${line.name},</span> <span class='data'>${line.clicked}</span>`;
      //     document.querySelector(".total-data").appendChild(node);
      //   });
      //console.log(csvContent);
    })
    .on("error", (err) => {
      console.log(err);
    });

  //   let writeStream = fs.createWriteStream(`resources/app/CSVs/${date}.csv`);
  //   let firstLine = ["tab", "type", "name", "clicked"];

  //   writeStream.write(firstLine.join(",") + "\n", () => {});

  //   for (let index = 0; index < csvContent.length; index++) {
  //     const someObject = todayCsvContent[index];
  //     let newLine = [];
  //     newLine.push(someObject.tab);
  //     newLine.push(someObject.type);
  //     newLine.push(someObject.name);
  //     newLine.push(someObject.clicked);
  //     if (index === csvContent.length - 1) {
  //       writeStream.write(newLine.join(","), () => {});
  //     } else {
  //       writeStream.write(newLine.join(",") + "\n", () => {});
  //     }
  //   }

  //   writeStream.end();

  //   writeStream
  //     .on("finish", () => {
  //       // document.querySelectorAll('.row').forEach(row => {
  //       //   row.parentElement.removeChild(row)
  //       // })
  //       //   todayCsvContent.forEach((line) => {
  //       //     var node = document.createElement("p");
  //       //     node.className = "row";
  //       //     node.innerHTML = `<span class='data'>${line.tab},</span> <span class='data'>${line.type},</span> <span class='data'>${line.name},</span> <span class='data'>${line.clicked}</span>`;
  //       //     document.querySelector(".today-data").appendChild(node);
  //       //   });
  //       console.log(todayCsvContent);
  //     })
  //     .on("error", (err) => {
  //       console.log(err);
  //     });
}

export { saveData };
