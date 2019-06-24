#!/usr/bin/env node

const binary = require("./")

const proc = require("child_process")

const child = proc.spawn(binary, process.argv.slice(2), { stdio: "inherit", windowsHide: false })
child.on("close", (code) => {
    process.exit(code)
})

/**
 * @param {string} signal 
 */
const handleTerminationSignal = (signal) => {
    process.on(signal, () => {
        if (!child.killed) {
            child.kill(signal)
        }
    })
}

handleTerminationSignal("SIGINT")
handleTerminationSignal("SIGTERM")
