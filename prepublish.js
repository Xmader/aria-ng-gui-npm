// @ts-check

const fetch = require("node-fetch")
const fs = require("fs-extra")

const remotePackageJsonURL = "https://github.com/Xmader/aria-ng-gui/raw/master/app/package.json";
const readmeURL = "https://github.com/Xmader/aria-ng-gui/raw/master/README.md";

const updateVersionNumber = async () => {
    /** @type {Response} */
    // @ts-ignore
    const r = await fetch(remotePackageJsonURL)
    const remoteJson = await r.json()

    const remoteVersion = remoteJson.version

    const localJson = await fs.readJSON("./package.json")
    localJson.version = remoteVersion

    await fs.writeJSON("./package.json", localJson, { spaces: 2 })
}

const getReadme = async () => {
    /** @type {Response} */
    // @ts-ignore
    const r = await fetch(readmeURL)
    const readme = await r.text()
    await fs.writeFile("README.md", readme)
}

updateVersionNumber()
getReadme()
