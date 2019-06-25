// @ts-check

const fs = require("fs-extra")
const envPaths = require("env-paths")

const defaultCacheRoot = envPaths("AriaNgGUI", {
    suffix: "",
}).cache

const clean = (cacheRoot = defaultCacheRoot) => {
    return fs.remove(cacheRoot)
}

clean()
