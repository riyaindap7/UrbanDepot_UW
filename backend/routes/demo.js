const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();

router.get("/run-demo", (req, res) => {
  const py = spawn("python", ["-u", "./scripts/demo.py"]);

  let logs = "";
  let entryTime = null;
  let exitTime = null;

  py.stdout.on("data", (data) => {
    const line = data.toString();
    console.log(`stdout: ${line}`);
    logs += line;

    // 🔎 detect entry/exit times directly from script output
    if (line.includes("Car Entered")) {
      entryTime = new Date().toLocaleString();
    }
    if (line.includes("Car Left")) {
      exitTime = new Date().toLocaleString();
    }
  });

  py.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    logs += data.toString();
  });

  py.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.json({
      logs,
      entryTime,
      exitTime,
    });
  });
});

module.exports = router;
