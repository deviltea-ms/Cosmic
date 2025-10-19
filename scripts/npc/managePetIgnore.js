let status;
let actionType;
let lastSearch = "";

const MESOS_ID = 2147483647;

const ItemInformationProvider = Java.type('server.ItemInformationProvider');

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            actionType = null;
            const pet = cm.getPlayer().getPet(0);
            if (pet == null) {
                cm.sendOk("You need to have a pet summoned to manage its ignore list.");
                cm.dispose();
                return;
            }
            cm.sendSimple(
                `Manage your pet ignore list (#b${pet.getName()}#k):\r\n` +
                "#b#L2#View / Remove#l\r\n" +
                "#b#L1#Add#l\r\n"
            );
        }
        else if (status == 1) {
            if (selection == 1 || actionType === "add") {
                actionType = "add";
                lastSearch = "";
                cm.sendGetText("Enter the item name to search:", lastSearch);
            }
            else if (selection == 2 || actionType === "remove") {
                actionType = "remove";
                const ignoredItems = getIgnoredItems(cm);
                if (ignoredItems.length === 0) {
                    cm.sendPrev("Your pet ignore list is currently empty.");
                }
                else {
                    const menu = ignoredItems.map(id => id === MESOS_ID 
                        ? `#b#L${MESOS_ID}#Mesos#l` 
                        : `#b#L${id}##z${id}##l`).join('\r\n');
                    cm.sendSimple("Select an item to remove from your pet ignore list:\r\n" + menu);
                }
            }
            else {
                cm.dispose();
            }
        }
        else if (status == 2) {
            if (actionType === "add") {
                const ItemInformationProvider = Java.type('server.ItemInformationProvider');
                const input = cm.getText();
                lastSearch = input || lastSearch;
                const added = new Set(getIgnoredItems(cm));
                const list = ItemInformationProvider.getInstance().getDroppableItems(lastSearch)
                    .map(el => el.getLeft())
                    .filter(id => added.has(id) === false)
                    .slice(0, 100);
                if (list.length === 0) {
                    cm.sendPrev("No items found matching your search.");
                }
                else {
                    const menu = list.map((id) => `#b#L${id}##z${id}##l`).join('\r\n');
                    cm.sendSimple(`Search results for #b"${lastSearch}"#k:\r\n#r#L1#Main Menu#l#k\r\n\r\n${menu}`);
                }
            }
            else if (actionType === "remove" && selection !== -1) {
                status = 0;
                removeIgnoredItem(cm, selection);
                const itemText = selection === MESOS_ID ? 'Mesos' : `#z${selection}#`;
                cm.sendNext(`#b"${itemText}"#k has been removed from your pet ignore list.`);
            }
            else {
                cm.dispose();
            }
        }
        else if (status == 3) {
            if (actionType === "add" && selection !== -1) {
                // if (selection === 0) {
                //     status = 0;
                //     cm.sendOk("Restart searching for items to add to your pet ignore list.");
                // }
                if (selection === 1) {
                    status = -1;
                    cm.sendOk("Go back to main menu.");
                }
                else {
                    status = 1;
                    addIgnoredItem(cm, selection);
                    cm.sendOk(`#b"#z${selection}##k" has been added to your pet ignore list.`);

                }
            }
            else {
                cm.dispose();
            }
        }
        else {
            cm.dispose();
        }
    }
}

function getIgnoredItems(cm) {
    const player = cm.getPlayer();
    const leadPet = player.getPet(0);
    const set = leadPet
        ? player.getExcluded().get(leadPet.getPetId()) || []
        : []

    return [...set];
}

function removeIgnoredItem(cm, itemId) {
    const player = cm.getPlayer();
    const leadPet = player.getPet(0);
    if (leadPet == null)
        return false;

    player.removeExcluded(leadPet.getPetId(), itemId);
    player.commitExcludedItems();
    return true;
}

function addIgnoredItem(cm, itemId) {
    const player = cm.getPlayer();
    const leadPet = player.getPet(0);
    if (leadPet == null)
        return false;

    player.addExcluded(leadPet.getPetId(), itemId);
    player.commitExcludedItems();
    return true;
}