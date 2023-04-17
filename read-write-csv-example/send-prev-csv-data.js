// Read CSV
//
// Build postReqBody object in format of
//
// const postReqBody = [
//     {
//       date: formattedDate,
//       action: "Attract",
//       ncma_digital_label_id: 11,
//       ncma_digital_label_title: "Judaic J11",
//       ncma_artwork_id: null,
//       ncma_artwork_title: "",
//       ncma_artwork_artist: "",
//       metric_type: "clicks",
//       clicks: "36",
//       avg_duration: "",
//     },
//     {}
// ];
//
// Send Post request
// if successful ???
// if unsuccessful ???
// double check what conditions define success from the API standpoint

const fs = require("fs");
const Papa = require("papaparse"); // for parsing csv

const NOW = new Date();
NOW.setDate(NOW.getDate() - 1); // Yesterday
const YESTERDAY = NOW;
const YESTERDAYDATE =
  YESTERDAY.getFullYear() +
  "-" +
  (YESTERDAY.getMonth() + 1) +
  "-" +
  YESTERDAY.getDate();
console.log(YESTERDAYDATE);

const csvPath = `${__dirname}/${YESTERDAYDATE}.csv`;
const csvContent = [];

/**
 * Read yesterday's csv
 */
async function readPrevCSV() {
  if (fs.existsSync(csvPath)) {
    await readCSV(csvPath);
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
        } else if (row.metric_type === "avg_duration") {
          row.avg_duration = parseFloat(row.avg_duration);
          row.avg_count = parseInt(row.avg_count);
        }

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

readPrevCSV();
