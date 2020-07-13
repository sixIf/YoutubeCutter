import fs from "fs";
import path from "path";
import { app } from "electron";
function createDownloadPath(): string {
  if (!fs.existsSync(path.join(app.getPath("documents"), "Test", 'elo', 'kitty', 'ay'))) {
    let pathCreated = fs.mkdirSync(path.join(app.getPath("documents"), "Test", 'elo', 'kitty', 'ay'), { recursive: true });
    console.log(pathCreated)
  }
  return path.join(app.getPath("documents"))
}

export { createDownloadPath };