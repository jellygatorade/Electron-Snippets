const fs = require("fs");
const Papa = require("papaparse"); // for parsing csv

// const today = new Date();
// const date =
//   today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

/**
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
const csvFirstLine = [
  "tab",
  "type",
  "name",
  "metric_type",
  "clicks",
  "avg_duration",
];
let csvContent = [];
let writeTimeout = null;

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
        console.log(row.clicks);
        if (row.metric_type === "clicks") {
          row.clicks = parseInt(row.clicks); // convert from string to int to increment
        }
        csvContent.push(row);
      })
      .on("end", () => {
        //console.log(csvContent);
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
    writeStream.write(csvFirstLine.join(","), () => {});
    writeStream.end();
    writeStream
      .on("finish", () => {
        //console.log("write stream finished, moving along");
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
 * @param {string} data.metric_type
 * @param {number} data.clicks
 * @param {number} data.avg_duration
 */
function saveData(data) {
  const { tab, type, name, metric_type, clicks, avg_duration } = data; // object destructuring

  // find matching row in csvContent
  const firstMatch = csvContent.find((entry) => {
    return (
      entry.tab === tab &&
      entry.type === type &&
      entry.name === name &&
      entry.metric_type === metric_type
    );
  });

  // process per metric_type
  switch (metric_type) {
    case "clicks":
      // if matching row
      if (firstMatch) {
        firstMatch.clicks++; // increment clicks
      } else {
        let newEntry = {
          tab: tab,
          type: type,
          name: name,
          metric_type: metric_type,
          clicks: clicks,
          avg_duration: "",
        };
        console.log(newEntry);
        csvContent.push(newEntry); // make new row
      }
      break;

    case "avg_duration":
      console.log("process avg_duration");
      // if matching row
      if (firstMatch) {
        firstMatch.avg_duration = avg_duration; // replace avg_duration
      } else {
        let newEntry = {
          tab: tab,
          type: type,
          name: name,
          metric_type: metric_type,
          clicks: "",
          avg_duration: avg_duration,
        };
        csvContent.push(newEntry); // make new row
      }
      break;
  }

  // wait to collect any other immediate actions before writing to csv
  clearTimeout(writeTimeout);
  writeTimeout = setTimeout(writeFile, 1000);
}

function writeFile() {
  let writeStream = fs.createWriteStream(csvPath);

  writeStream.write(csvFirstLine.join(",") + "\n", () => {});

  //console.log(csvContent);

  csvContent.forEach((row, i) => {
    let newRow = [];
    newRow.push(
      row.tab,
      row.type,
      row.name,
      row.metric_type,
      row.clicks,
      row.avg_duration
    );

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
