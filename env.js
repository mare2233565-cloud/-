/* قارئ بسيط لملف .env بدون أي مكتبة إضافية.
   المتغيرات الموجودة في الاستضافة (Environment Variables) لها الأولوية دائماً. */
const fs = require("fs");
const path = require("path");

function load() {
  const file = path.join(__dirname, ".env");
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.charAt(0) === "#") continue;
    if (line.indexOf("export ") === 0) line = line.slice(7).trim();
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!key) continue;
    let val = line.slice(eq + 1).trim();
    if (
      (val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') ||
      (val.charAt(0) === "'" && val.charAt(val.length - 1) === "'")
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

module.exports = { load };
