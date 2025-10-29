/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* NPC Base
	Map Name (Map ID)
	Extra NPC info.
 */

let status = -1;
let inventoryType = null;

const InventoryType = Java.type("client.inventory.InventoryType");
const ShopFactory = Java.type("server.ShopFactory");

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
            cm.sendSimple("Welcome to the Inventory Cleaner!\r\n#rThe items after the first free slot will be sold to the shop automatically.#k \r\n\r\nWhich inventory would you like to clean?\r\n#b#L1#Equip#l\r\n#L2#Use#l\r\n#L3#Setup#l\r\n#L4#Etc#l");
        }
        else if (status == 1) {
            inventoryType = InventoryType.getByType(selection);
            const inventory = cm.getPlayer().getInventory(inventoryType);
            inventory.lockInventory();
            const startSlot = inventory.getNextFreeSlot();
            const endSlot = inventory.getSlotLimit();
            const shop = ShopFactory.getInstance().getShop(11000);
            for (let i = startSlot; i <= endSlot; i++) {
                const item = inventory.getItem(i);
                if (item != null) {
                    shop.sell(cm.getClient(), inventoryType, i, item.getQuantity());
                }
            }
            inventory.unlockInventory();
            cm.sendOk("Your " + inventoryType.name().toLowerCase() + " inventory has been cleaned!");
            cm.dispose();
        }
        else {
            cm.dispose();
        }
    }
}