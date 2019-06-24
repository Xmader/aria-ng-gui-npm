// @ts-check

const fs = require("fs-extra")
const path = require("path")
const crypto = require("crypto")
const fetch = require("node-fetch")
const envPaths = require("env-paths")

/** @type {string} */
// @ts-ignore
const packageVersion = require("./package.json").version

const defaultCacheRoot = envPaths("AriaNgGUI", {
    suffix: "",
}).cache

/**
 * @typedef {Object} Options
 * @property {string=} version
 * @property {string=} platform The target artifact platform. These are Node-style platform names, for example: `win32`, `darwin` or `linux`
 * @property {string=} arch The target artifact architecture. These are Node-style architecture names, for example: `ia32` or `x64`
 * @property {boolean=} force Whether to download an artifact regardless of whether it's in the cache directory.
 * @property {string=} cacheRoot The directory that caches Electron artifact downloads.
 * @property {boolean=} unsafelyDisableChecksums  When set to `true`, disables checking that the artifact download completed successfully with the correct payload.
 */

/**
 * @param {Options} options 
 * @returns {Promise<string>}
 */
const downloadArtifact = async ({
    version = packageVersion,
    platform = process.platform,
    arch = process.arch,
    force = false,
    cacheRoot = defaultCacheRoot,
    unsafelyDisableChecksums = false,
}) => {
    const fileName = `AriaNgGUI-${platform}-${arch}.zip`
    const zipPath = path.join(cacheRoot, fileName)

    if (await fs.pathExists(zipPath) && !force) {
        // file exits
        return zipPath
    }

    const baseURL = `https://github.com/Xmader/aria-ng-gui/releases/download/v${version}`
    const downloadURL = `${baseURL}/${fileName}`
    const sha256sumURL = `${baseURL}/SHASUMS256.txt`

    /** @type {Response} */
    // @ts-ignore
    const r = await fetch(downloadURL)
    const data = Buffer.from(await r.arrayBuffer())

    if (!unsafelyDisableChecksums) {
        /** @type {Response} */
        // @ts-ignore
        const r1 = await fetch(sha256sumURL)
        const sha256sum = await r1.text()
        const remoteDataSHA256 = sha256sum.match(`(\\w{64}) \\*${fileName}`)[1]

        const dataHash = crypto.createHash("sha256")
        dataHash.update(data)
        const dataSHA256 = dataHash.digest("hex")

        if (remoteDataSHA256 !== dataSHA256) {
            throw new Error("sha256 check failure")
        }
    }

    await fs.ensureDir(cacheRoot)
    await fs.writeFile(zipPath, data)

    return zipPath
}

module.exports = downloadArtifact
