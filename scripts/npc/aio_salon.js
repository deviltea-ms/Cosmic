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
const SalonInformationProvider = Java.type("server.SalonInformationProvider");
let status;
let flow = null;
let list = null;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.sendOk("Thank you for visiting the Salon. See you next time!");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            sendMainMenu();
        }
        else if (status == 1) {
            flow = selection;
            if (flow == 0) { // Hair
                list = [...SalonInformationProvider.getInstance().getHairTypes(cm.getPlayer().getHair())]
                    .sort((a, b) => a - b);
                cm.sendStyle("Choose your desired hairstyle.", list);
            }
            else if (flow == 1) { // Hair Color
                list = [...SalonInformationProvider.getInstance().getHairColors(cm.getPlayer().getHair())]
                    .sort((a, b) => a - b);
                cm.sendStyle("Choose your desired hair color.", list);
            }
            else if (flow == 2) { // Skin Tone
                list = [0, 1, 2, 3, 4, 5, 9, 10, 11];
                cm.sendStyle("Choose your desired skin tone.", list);
            }
            else if (flow == 3) { // Face
                list = [...SalonInformationProvider.getInstance().getFaceTypes(cm.getPlayer().getFace())]
                    .sort((a, b) => a - b);
                cm.sendStyle("Choose your desired face style.", list);
            }
            else if (flow == 4) { // Face Color
                list = [...SalonInformationProvider.getInstance().getFaceColors(cm.getPlayer().getFace())]
                    .sort((a, b) => a - b);
                cm.sendStyle("Choose your desired eyes color.", list);
            }
            else {
                cm.sendOk("An error has occurred. Please try again later.");
                cm.dispose();
            }
        }
        else if (status == 2) {
            if (flow == 0) { // Hair
                cm.setHair(list[selection]);
                cm.sendOk("Enjoy your new hairstyle!");
                cm.dispose();
            }
            else if (flow == 1) { // Hair Color
                cm.setHair(list[selection]);
                cm.sendOk("Enjoy your new hair color!");
                cm.dispose();
            }
            else if (flow == 2) { // Skin Tone
                cm.setSkin(list[selection]);
                cm.sendOk("Enjoy your new skin tone!");
                cm.dispose();
            }
            else if (flow == 3) { // Face
                cm.setFace(list[selection]);
                cm.sendOk("Enjoy your new face style!");
                cm.dispose();
            }
            else if (flow == 4) { // Face Color
                cm.setFace(list[selection]);
                cm.sendOk("Enjoy your new eyes color!");
                cm.dispose();
            }
            else {
                cm.sendOk("An error has occurred. Please try again later.");
                cm.dispose();
            }
        }
        else {
            cm.sendOk("An error has occurred. Please try again later.");
            cm.dispose();
        }
    }
}

function sendMainMenu() {
    let menu = "Welcome to the Salon! What would you like to do today?\r\n#b";
    menu += "#L0#Change my Hair#l\r\n";
    menu += "#L1#Change my Hair Color#l\r\n";
    menu += "#L2#Change my Skin Tone#l\r\n";
    menu += "#L3#Change my Face#l\r\n";
    menu += "#L4#Change my Face Color#l\r\n";
    cm.sendSimple(menu);
}
