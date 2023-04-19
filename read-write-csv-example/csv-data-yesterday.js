/**
 * Read and POST yesterday's csv data
 *
 * Build postReqBody object in format of
 *
 *        const postReqBody = [
 *            {
 *              date: "YYYY-MM-DD",
 *              action: "Action",
 *              ncma_digital_label_id: #,
 *              ncma_digital_label_title: "Title",
 *              ncma_artwork_id: null,
 *              ncma_artwork_title: "",
 *              ncma_artwork_artist: "",
 *              metric_type: "clicks",
 *              clicks: #,
 *              avg_duration: #.#,
 *            },
 *            {...etc},
 *        ];
 *
 * Send POST request at random time within the next hour
 *        If successful - rename file as YYYY-MM-DD-posted-success.csv
 *        If unsuccessful - rename file as YYYY-MM-DD-posted-error.csv
 *
 * ---> double check what conditions define success from the API standpoint
 *
 * Script will only send POST request if it hasn't been sent before
 *        (Filename must be unchanged YYYY-MM-DD.csv)
 */

const fs = require("fs");
const Papa = require("papaparse"); // for parsing csv

/**
 * Using npm package node-fetch because
 * Fetch API is not currently supported in Node.js native
 * But as of February 2022 Node.js is working on including it
 *
 * See this remarks about importing node-fetch into a CommonJS module
 * in "Loading and configuring the module"
 * https://www.npmjs.com/package/node-fetch
 */
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * Setup
 */
const NOW = new Date(); // unix time now
NOW.setDate(NOW.getDate() - 1); // yesterday
const YESTERDAY = NOW;
const YESTERDAYDATE =
  YESTERDAY.getFullYear() +
  "-" +
  (YESTERDAY.getMonth() + 1) +
  "-" +
  YESTERDAY.getDate(); // yesterday as string "YYYY-MM-DD"

const csvPath = `${__dirname}/${YESTERDAYDATE}.csv`;
const logPath = `${__dirname}/api-log.txt`;

const csvContent = [];

/**
 * Read yesterday's csv
 */
async function processAndPostYesterdayCSV() {
  if (fs.existsSync(csvPath)) {
    await readCSV(csvPath);
  }
}

processAndPostYesterdayCSV();

async function readCSV(path) {
  return new Promise(function (resolve, reject) {
    let readStream = fs.createReadStream(path);
    readStream
      .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, { header: true }))
      .on("data", (row) => {
        // convert numeric data from strings
        if (row.ncma_digital_label_id) {
          row.ncma_digital_label_id = parseInt(row.ncma_digital_label_id);
        }

        if (row.ncma_artwork_id) {
          row.ncma_artwork_id = parseInt(row.ncma_artwork_id);
        }

        if (row.metric_type === "clicks") {
          row.clicks = parseInt(row.clicks);
        } else if (row.metric_type === "avg_duration") {
          row.avg_duration = parseFloat(row.avg_duration);
        }

        delete row.avg_count; // avg_count is used for analytics-timer weighted average and no longer needed

        csvContent.push(row);
      })
      .on("end", () => {
        resolve();

        // trigger post request at random time within the hour
        // const randomMinutes = getRandomInt(60);
        // const randomDelay = 1000 * 60 * randomMinutes;
        // setTimeout(sendPostReq, randomDelay, csvContent);
        setTimeout(sendPostReq, 50, csvContent);
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      });
  });
}

const creds = {};

// Need API url and credentials
async function sendPostReq(body) {
  const settings = {
    method: "POST",
    mode: "cors",
    withCredentials: true,
    credentials: "include",

    headers: {
      Authorization:
        "Basic " + btoa(creds.user + ":" + creds.pass) /* credentials */,
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(creds.url, settings); /* API URL */
    const responseData = await response.json(); // await promise
    // console.log(responseData); // promise status
    // console.log(response.status, response.statusText);

    if (response.status === 200) {
      renameCSV("success");
      writeLog(`${response.status} - ${response.statusText}`);
    } else {
      renameCSV("error");
      writeLog(
        `${response.status} - ${response.statusText} - ${responseData.code} - ${responseData.message}`
      );
    }
  } catch (error) {
    writeLog(`caught error - ${error}`);
  }
}

function renameCSV(append) {
  const oldPath = csvPath;
  let newPath;

  switch (append) {
    case "success":
      newPath = oldPath.substring(0, oldPath.length - 4) + "-post-success.csv";
      break;
    case "error":
      newPath = oldPath.substring(0, oldPath.length - 4) + "-post-error.csv";
      break;
    default:
      return;
  }

  fs.rename(oldPath, newPath, function (err) {
    if (err) console.log("ERROR: " + err);
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function writeLog(log) {
  let writeStream = fs.createWriteStream(logPath, { flags: "a" }); // "a" flag for append

  let dateTime = new Date();
  dateTime = dateTime.toUTCString();

  writeStream.write(`${dateTime} - ${YESTERDAYDATE}.csv - ${log} \n`);

  writeStream.end();

  writeStream
    .on("finish", () => {
      // finished
    })
    .on("error", (err) => {
      console.log(err);
    });
}
