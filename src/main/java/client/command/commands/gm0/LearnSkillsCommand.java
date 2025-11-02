package client.command.commands.gm0;

import client.Character;
import client.Client;
import client.Job;
import client.Skill;
import client.SkillFactory;
import client.command.Command;
import tools.PacketCreator;

import java.util.List;
import java.util.Map;

public class LearnSkillsCommand extends Command {
    {
        setDescription("Learn all skills of current job.");
    }

    @Override
    public void execute(Client client, String[] params) {
        Character chr = client.getPlayer();
        Job job = chr.getJob();
        List<Job> list = Job.getAdvancedJobs(job);
        for (Job j : list) {
            Map<Integer, Skill> skills = SkillFactory.getSkillsByJob(j);
            for (Skill skill : skills.values()) {
                int maxLevel = skill.getMaxLevel();
                byte currentLevel = chr.getSkillLevel(skill);
                chr.changeSkillLevel(skill, currentLevel, maxLevel, -1);
            }
        }
        chr.sendPacket(PacketCreator.earnTitleMessage("Learned all available skills!") );
    }
}
