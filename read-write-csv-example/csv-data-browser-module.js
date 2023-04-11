const fs = require("fs");

const today = new Date();
const date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

let csvContent = [];
let fields;
let firstLine = ["tab", "type", "name", "clicked"];

const csvPath = `${__dirname}/full-data.csv`;

/*
 * Read existing csv or create if not present
 */
if (fs.existsSync(csvPath)) {
  Papa.parse(await readCSV(csvPath), {
    header: true,
    complete: function (results) {
      results.data.forEach(
        (entry) => (entry.clicked = parseInt(entry.clicked))
      );

      csvContent = results.data;
      //fields = results.meta.fields;

      console.log(csvContent);
    },
  });
} else {
  await createCSV(csvPath);
}

async function readCSV(path) {
  const text = await fetch(path).then((response) => {
    return response.text();
  });
  return text;
}

async function createCSV(path) {
  return new Promise(function (resolve, reject) {
    let writeStream = fs.createWriteStream(path);
    writeStream.write(firstLine.join(","), () => {});
    writeStream.end();
    writeStream
      .on("finish", () => {
        console.log("main write stream finished, moving along");
        resolve(); // Resolve Promise
      })
      .on("error", (err) => {
        console.log(err);
        reject(); // Reject Promise
      });
  });
}

/*
 * Re-write csv with new row or change
 */
function saveData(tab, type, name, clicked) {
  // find matching row in csvContent
  const firstMatch = csvContent.find((entry) => {
    return (
      entry.tab === "tab-1" &&
      entry.type === "hotspot" &&
      entry.name === "test-button"
    );
  });

  // IF CLICKED OR DURATION DATA TYPE?

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

  let writeStream = fs.createWriteStream(csvPath);

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
      // finished
    })
    .on("error", (err) => {
      console.log(err);
    });
}

export { saveData };
