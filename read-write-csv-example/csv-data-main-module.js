const fs = require("fs");
const Papa = require("papaparse"); // for parsing csv

const today = new Date();
const date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

let csvContent = [];
let firstLine = ["tab", "type", "name", "clicked"];

const csvPath = `${__dirname}/full-data.csv`;

initCSV();

/*
 * Read existing csv or create if not present
 */
async function initCSV() {
  if (fs.existsSync(csvPath)) {
    await readCSV(csvPath);
  } else {
    await createCSV(csvPath);
  }
}

async function readCSV(path) {
  return new Promise(function (resolve, reject) {
    let readStream = fs.createReadStream(path);
    readStream
      .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, { header: true }))
      .on("data", (row) => {
        row.clicked = parseInt(row.clicked);
        csvContent.push(row);
      })
      .on("end", () => {
        console.log(csvContent);
        resolve();
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      });
  });
}

async function createCSV(path) {
  return new Promise(function (resolve, reject) {
    let writeStream = fs.createWriteStream(path);
    writeStream.write(firstLine.join(","), () => {});
    writeStream.end();
    writeStream
      .on("finish", () => {
        console.log("main write stream finished, moving along");
        resolve();
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      });
  });
}

/**
 * Re-write csv with new row or change
 *
 * @param {object} data - row to save
 * @param {string} data.tab
 * @param {string} data.type
 * @param {string} data.name
 * @param {number} data.clicked
 */
function saveData(data) {
  const { tab, type, name, clicked } = data; // object destructuring

  // find matching row in csvContent
  const firstMatch = csvContent.find((entry) => {
    return entry.tab === tab && entry.type === type && entry.name === name;
  });

  // IF CLICKED OR DURATION DATA TYPE?

  // if matching row
  if (firstMatch) {
    firstMatch.clicked++; // increment clicks
  } else {
    let newEntry = {
      tab: tab,
      type: type,
      name: name,
      clicked: clicked,
    };
    csvContent.push(newEntry);
  }

  let writeStream = fs.createWriteStream(csvPath);

  writeStream.write(firstLine.join(",") + "\n", () => {});

  //console.log(csvContent);

  csvContent.forEach((row, i) => {
    let newRow = [];
    newRow.push(row.tab, row.type, row.name, row.clicked);

    if (i === csvContent.length - 1) {
      writeStream.write(newRow.join(","), () => {});
    } else {
      writeStream.write(newRow.join(",") + "\n", () => {});
    }
  });

  writeStream.end();

  writeStream
    .on("finish", () => {
      // finished
    })
    .on("error", (err) => {
      console.log(err);
    });
}

module.exports = saveData;
