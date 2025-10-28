const express = require("express");
const { spawn } = require("child_process");
const os = require("os");

const router = express.Router();

router.get("/run-demo", (req, res) => {
  // Try different Python commands based on the platform
  const pythonCommand = os.platform() === "win32" ? "python" : "python3";
  
  console.log(`Attempting to run Python demo with command: ${pythonCommand}`);
  
  const py = spawn(pythonCommand, ["-u", "./scripts/demo.py"]);

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

  py.on("error", (error) => {
    console.error(`Failed to start Python process: ${error.message}`);
    
    // Return a mock response when Python is not available
    res.json({
      error: "Python demo not available in this environment",
      logs: `Demo simulation: Python environment not available.\nMock car entry at: ${new Date().toLocaleString()}\nMock car exit at: ${new Date(Date.now() + 30000).toLocaleString()}`,
      entryTime: new Date().toLocaleString(),
      exitTime: new Date(Date.now() + 30000).toLocaleString(),
      isMockData: true
    });
  });

  py.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.json({
      logs,
      entryTime,
      exitTime,
      isMockData: false
    });
  });
});

module.exports = router;
