/** 
 * Attempts to backdoor all servers with root access, via terminal commands.
 * NOTE: Must be viewing terminal and left to run without interruption.
 * @param {NS} ns Netscript
 * @flag {number} --timeout time, in seconds, between checks for "Backdoor on '[server]' successful!"; Default 1
 * @flag {number} --maxwait time elapsed, in seconds, before an error is thrown while waiting for "Backdoor on '[server]' successful!"; Default 360 (6 min)
*/
export async function main(ns) {

    ns.disableLog("ALL");
    ns.tail();
    const flags = ns.flags([
        ["timeout", 1], // wait time in seconds between backdoor complete checks
        ["maxwait", 360] // max wait in seconds; default 360 (6 minutes))
    ]);

    // adding purchased servers to the completed list, to avoid unecessary backdoor
    let completed = ns.getPurchasedServers();
    completed.push("home");

    await backdoorServers(ns, flags, completed);

    ns.tprint("Brute Backdoor Complete!");
}

async function backdoorServers(ns, flags, completed = ["home"], server = "home", chain = []) {

    // excluding the home server, add the current server to the chain and run the command
    if (server != "home") {
        chain.push(server);
        await backdoorServer(ns, flags, server, chain);
    }

    let servers = ns.scan(server);

    // recursively re-run backdoorServers for all directly connected servers, aside from those that are complete
    for(let sv of servers) {
        if (completed.includes(sv)) continue;
        completed.push(sv);
        await backdoorServers(ns, flags, completed, sv, chain);
    }

    // reduce the chain when returned to ensure the chain grows/shrinks to match
    chain.pop(server);
}

async function backdoorServer(ns, flags, server, chain) {

    // ignore servers witout root access
    if (server == "home" || !ns.hasRootAccess(server)) return;

    sendCommandToTerminal(ns, "home;" + chain.map(s => "connect " + s + ";").join("") + "backdoor;");

    // monitor terminal for correct backdoor success result, then continue
    // this also throws an error if max time elapsed is reached
    await ns.sleep(500); // used to wait for cmd input rendering
    await waitForBackdoorCompleteMessage(ns, flags, server);
}

async function waitForBackdoorCompleteMessage(ns, flags, server) {
    let time = new Date();
    while(true) {

        throwIfMaxTimeReached(flags, time, server); // safety catch. Should not occur.

        // this is hacky at best. TODO: write to function and improve lookup.
        // target direct text instead of inner html content.
        // maybe throw compatibility if this stops working due to "BitBurner Game" changing HTML markup in the future
        let terminalList = globalThis["document"].getElementById("terminal").querySelectorAll("li");
        let lastItem = [].slice.call(terminalList).pop();
        if (lastItem && ("" + lastItem.innerHTML).includes("Backdoor on '" + server + "' successful!")) return;
        
        await ns.sleep(flags.timeout * 1000);
    }
}

function sendCommandToTerminal(ns, command) {
    const input = globalThis["document"].getElementById("terminal-input");
    input.value = command;

    const handler = Object.keys(input)[1];
    input[handler].onChange({target: input});
    input[handler].onKeyDown({key: "Enter", preventDefault: () => null});
}

function throwIfMaxTimeReached(flags, time, server) {
    if(Math.round((new Date() - time) / 1000) >= flags.maxwait) throw Error("Unable to detect completed backdoor for " + server);
}
