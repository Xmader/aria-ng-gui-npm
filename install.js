#!/usr/bin/env node
// @ts-check

/** @type {string} */
// @ts-ignore
const version = require("./package.json").version

const fs = require("fs-extra")
const os = require("os")
const path = require("path")
const extract = require("extract-zip")
const downloadArtifact = require("./download.js")

const getPlatformPath = () => {
    const platform = process.env.npm_config_platform || os.platform()

    switch (platform) {
        case "darwin":
            return "AriaNgGUI.app/Contents/MacOS/AriaNgGUI"
        case "freebsd":
        case "linux":
            return "AriaNgGUI"
        case "win32":
            return "AriaNgGUI.exe"
        default:
            throw new Error("AriaNgGUI builds are not available on platform: " + platform)
    }
}

const getInstalledVersion = () => {
    try {
        const platform = process.env.npm_config_platform || os.platform()
        let packageJsonPath

        switch (platform) {
            case "darwin":
                packageJsonPath = "AriaNgGUI.app/Contents/Resources/app/package.json"
                break
            case "freebsd":
            case "linux":
            case "win32":
                packageJsonPath = "resources/app/package.json"
                break
            default:
                throw new Error("AriaNgGUI builds are not available on platform: " + platform)
        }

        const p = path.join(__dirname, "dist", packageJsonPath)
        const json = fs.readJSONSync(p)
        return json.version
    } catch (_) {
        return
    }
}

const platformPath = getPlatformPath()
const installedVersion = getInstalledVersion()
const binaryPath = path.join(__dirname, "dist", platformPath)

if (installedVersion === version && fs.existsSync(binaryPath)) {
    process.exit(0)
}

/**
 * @param {Error} err 
 */
const onerror = (err) => {
    throw err
}

/**
 * unzips and makes path.txt point at the correct executable
 * @param {string} zipPath 
 */
const extractFile = (zipPath) => {
    const dir = path.join(__dirname, "dist")

    extract(zipPath, { dir }, (err) => {
        if (err) {
            return onerror(err)
        }

        fs.writeFile(path.join(__dirname, "path.txt"), platformPath, (err) => {
            if (err) {
                return onerror(err)
            }
        })
    })
}

downloadArtifact({
    version,
    platform: process.env.npm_config_platform || process.platform,
    arch: process.env.npm_config_arch || process.arch,
})
    .then((zipPath) => {
        extractFile(zipPath)
    })
    .catch((err) => {
        onerror(err)
    })
