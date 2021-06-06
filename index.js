const notifier = require("node-notifier");
const fetch = require("node-fetch");
const fs = require("fs");
const { exec } = require("child_process");
const today = (new Date(Date.now()).toLocaleString().split(',')[0]).replaceAll("/", "-");
notifier.notify(today);

const curlBody = `curl -X GET "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=397&date=${today}" -H "accept: application/json"`;

function check() {
  return getCurlyData()
    .then((res) => {
      console.log(
        `Run at ${new Date().toLocaleTimeString()}. Number of centers ${
          res.centers.length
        }`
      );

      res.centers.forEach((center) => {
        center.sessions.forEach((session) => {
          if (session.min_age_limit === 18 && session.available_capacity > 0) {
            const message = `Availalble at ${center.name}`;
            console.log(message);
            notifier.notify({ title: "Available", message });
          }
        });
      });
    })
    .catch((err) => {
      notifier.notify({
        title: "Error",
        message: JSON.stringify(err, undefined, 2),
      });
    });
}

function getCurlyData() {
  return new Promise((resolve) => {
    exec(`${curlBody} -o output.txt`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      const data = JSON.parse(fs.readFileSync("output.txt"));
      resolve(data);
    });
  });
}

setInterval(check, 44000);
