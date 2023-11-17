/**
 * Lists all servers in terminal, their depth and a connection string that can be used in terminal.
 * Helps to save time digging around.
 * @param {NS} ns Netscript
 */
export async function main(ns) {
    ns.disableLog("ALL");
    await getServerDepth(ns);
}

async function getServerDepth(ns, server = "home", chain = [], complete = ["home"]) {

    // chain used to create a list of servers, from home to source server
    if (server != "home") {
        chain.push(server);
        ns.tprint(server + " : " + chain.length);
        ns.tprint("home;" + chain.map(s => "connect " + s + ";").join(""));
        ns.tprint("");
    }

    // recursive scan on all directly connected servers
    let servers = ns.scan(server);
    for(let sv of servers) {
        if (complete.includes(sv)) continue;
        complete.push(sv);
        await getServerDepth(ns, sv, chain, complete);
    }

    // remove this chain item to persist correct path to source server
    chain.pop(server);
}
