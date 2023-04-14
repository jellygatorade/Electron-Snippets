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

const csvPath = `${__dirname}/${YESTERDAYDATE}.csv`;

/*
 * Read yesterday's csv
 */
async function readPrevCSV() {
  if (fs.existsSync(csvPath)) {
    await readCSV(csvPath);
  }
}
