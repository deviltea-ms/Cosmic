/*
    This file is part of the HeavenMS MapleStory Server, commands OdinMS-based
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

/*
   @Author: Arthur L - Refactored command content into modules
*/
package client.command.commands.gm0;

import client.Character;
import client.Client;
import client.command.Command;
import client.inventory.Pet;
import client.inventory.manipulator.InventoryManipulator;
import config.YamlConfig;
import constants.inventory.ItemConstants;
import server.ItemInformationProvider;

import static java.util.concurrent.TimeUnit.DAYS;

public class DropMesosCommand extends Command {
    {
        setDescription("Drop mesos.");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();

        try {
            int amount = Integer.parseInt(params[0]);
            if (amount > 50000 || amount < 1) {
                player.yellowMessage("Amount must be between 1 and 50,000.");
                return;
            }

            int quantity = params.length == 2 ? Integer.parseInt(params[1]) : 1;
            if (quantity > 20 || quantity < 1) {
                player.yellowMessage("Quantity must be between 1 and 20.");
                return;
            }

            int total = amount * quantity;
            if (total > player.getMeso()) {
                player.yellowMessage("You do not have enough mesos.");
                return;
            }

            player.gainMeso(-total, true);
            for (int i = 0; i < quantity; i++) {
                player.getMap().spawnMesoDrop(amount, player.getPosition(), player, player, true, (byte) 2, (short) 0);
            }
        } catch (NumberFormatException e) {
            player.yellowMessage("Syntax: !dmeso <amount> <quantity>");
            return;
        }
    }
}
