// @ts-check

const fs = require("fs")
const path = require("path")

const pathFile = path.join(__dirname, "path.txt")

const getPath = () => {
    if (fs.existsSync(pathFile)) {
        const executablePath = fs.readFileSync(pathFile, "utf-8")
        return path.join(__dirname, "dist", executablePath)
    } else {
        throw new Error("AriaNgGUI failed to install correctly, please delete node_modules/aria-ng-gui and try installing again")
    }
}

module.exports = getPath()
