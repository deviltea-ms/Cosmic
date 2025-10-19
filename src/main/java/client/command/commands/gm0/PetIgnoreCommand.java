package client.command.commands.gm0;

import client.Client;
import client.command.Command;
import constants.id.NpcId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import scripting.AbstractScriptManager;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptException;

public class PetIgnoreCommand extends Command {
    {
        setDescription("Manage pet ignore.");
    }

    @Override
    public void execute(Client client, String[] params) {
        client.getAbstractPlayerInteraction().openNpc(NpcId.MAPLE_ADMINISTRATOR, "managePetIgnore");
    }
}
