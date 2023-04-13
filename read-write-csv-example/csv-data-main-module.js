const fs = require("fs");
const Papa = require("papaparse"); // for parsing csv

const TODAY = new Date();
const DATE =
  TODAY.getFullYear() + "-" + (TODAY.getMonth() + 1) + "-" + TODAY.getDate();

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
  "date",
  "action",
  "ncma_digital_label_id",
  "ncma_digital_label_title",
  "ncma_artwork_id",
  "ncma_artwork_title",
  "ncma_artwork_artist",
  "metric_type",
  "clicks",
  "avg_duration",
];
let csvContent = [];
let writeTimeout = null;

const csvPath = `${__dirname}/${DATE}.csv`;

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
        if (row.ncma_digital_label_id) {
          row.ncma_digital_label_id = parseInt(row.ncma_digital_label_id); // convert from string to int
        }

        if (row.ncma_artwork_id) {
          row.ncma_artwork_id = parseInt(row.ncma_artwork_id); // convert from string to int
        }

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
 * Re-write csv with new row or change to existing row
 *
 * @param {object} data - row to save
 * (date computed outside of function)
 * @param {string} data.action
 * @param {number} data.ncma_digital_label_id
 * @param {string} data.ncma_digital_label_title
 * @param {number} data.ncma_artwork_id
 * @param {string} data.ncma_artwork_title
 * @param {string} data.ncma_artwork_artist
 * @param {string} data.metric_type
 * @param {number} data.clicks
 * @param {number} data.avg_duration
 */
function saveData(data) {
  const {
    // (DATE computed outside of function)
    action,
    ncma_digital_label_id,
    ncma_digital_label_title,
    ncma_artwork_id,
    ncma_artwork_title,
    ncma_artwork_artist,
    metric_type,
    // (clicks always 1 or prior value)
    avg_duration,
  } = data; // object destructuring

  //console.log(data);

  // find matching row in csvContent
  // do not check clicks or avg_duration as those will vary
  const firstMatch = csvContent.find((entry) => {
    return (
      entry.date === DATE &&
      entry.action === action &&
      entry.ncma_digital_label_id === ncma_digital_label_id &&
      entry.ncma_digital_label_title === ncma_digital_label_title &&
      entry.ncma_artwork_id === ncma_artwork_id &&
      entry.ncma_artwork_title === ncma_artwork_title &&
      entry.ncma_artwork_artist === ncma_artwork_artist &&
      entry.metric_type === metric_type
    );
  });

  // process per metric_type
  // "clicks" or "avg_duration"
  switch (metric_type) {
    case "clicks":
      // if existing matching row
      if (firstMatch) {
        firstMatch.clicks++; // increment clicks
      } else {
        let newEntry = {
          date: DATE,
          action: action,
          ncma_digital_label_id: ncma_digital_label_id,
          ncma_digital_label_title: ncma_digital_label_title,
          ncma_artwork_id: ncma_artwork_id,
          ncma_artwork_title: ncma_artwork_title,
          ncma_artwork_artist: ncma_artwork_artist,
          metric_type: metric_type,
          clicks: 1,
          avg_duration: "",
        };
        csvContent.push(newEntry); // make new row
      }
      break;

    case "avg_duration":
      // if existing matching row
      if (firstMatch) {
        firstMatch.avg_duration = avg_duration; // replace avg_duration
        // planning for computing weighted average with prior data?
        // firstMatch.avg_duration = (firstMatch.avg_duration * firstMatch.count + avg_duration * timer.__history.length) / (firstMatch.count + timer.__history.length);
      } else {
        let newEntry = {
          date: DATE,
          action: action,
          ncma_digital_label_id: ncma_digital_label_id,
          ncma_digital_label_title: ncma_digital_label_title,
          ncma_artwork_id: ncma_artwork_id,
          ncma_artwork_title: ncma_artwork_title,
          ncma_artwork_artist: ncma_artwork_artist,
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
    if (typeof row.avg_duration === "number") {
      row.avg_duration = row.avg_duration.toFixed(2); // convert to string with 2 decimal places before printing out csv
    }

    let newRow = [];
    newRow.push(
      row.date,
      row.action,
      row.ncma_digital_label_id,
      row.ncma_digital_label_title,
      row.ncma_artwork_id,
      row.ncma_artwork_title,
      row.ncma_artwork_artist,
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
