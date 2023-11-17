/**
 * Sets preferred aliases in one go.
 * Add/Update to your liking.
 * @param {NS} ns Netscript
 */
export async function main(ns) {
  
    ns.disableLog("ALL");

    // scan-analyze -> sa
    sendCommandToTerminal(ns, "alias -g sa5='scan-analyze 5'");
    sendCommandToTerminal(ns, "alias -g sa1='scan-analyze'");
    sendCommandToTerminal(ns, "alias -g sa='scan-analyze 10'");

    // home + clear
    sendCommandToTerminal(ns, "alias -g ho='home;clear;'");

    // reset everything -> requires a kill all script
    sendCommandToTerminal(ns, "alias -g res='home;killall;run KillAll.js;'");

    // same as above but adds in a deploy call that I use to do my initial run.
    // deploy -> run breaches, run attacks, run any jobs, etc.
    sendCommandToTerminal(ns, "alias -g resd='home;killall;run KillAll.js;run Deploy.js'");

    // connect to the darkweb from anywhere
    sendCommandToTerminal(ns, "alias -g dar='home;connect darkweb'");
}

// terminal run command function
function sendCommandToTerminal(ns, command) {
    const input = globalThis["document"].getElementById("terminal-input");
    input.value = command;

    const handler = Object.keys(input)[1];
    input[handler].onChange({target: input});
    input[handler].onKeyDown({key: "Enter", preventDefault: () => null});
}
