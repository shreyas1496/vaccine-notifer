const notifier = require("node-notifier");
const fetch = require("node-fetch");
const fs = require("fs");
const { exec } = require("child_process");
// String
notifier.notify("Message");

const curlBody = ``;

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

setInterval(check, 60000);
