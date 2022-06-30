import { ChatInputCommand, Command } from '@sapphire/framework';
import { MessageActionRow, MessageButton } from 'discord.js';
import type { MessageComponentInteraction } from 'discord.js';
import petSchema from '../models/petSchema';
import Range from '../lib/RangeStats';
export class WashCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'wash', aliases: [], description: 'Wash Your Dog' });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(false), {
			guildIds: ['984461250673143889', '973906266277683210'],
			idHints: ['991781596116041799', '991781596791308465']
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const playRow = new MessageActionRow().addComponents(new MessageButton().setCustomId('play_stop').setLabel('Stop').setStyle('PRIMARY'));
		const msg = await interaction.reply({ content: '<:Bar_Full:988493923875979274>', components: [playRow], fetchReply: true });
		let amount = 1;
		const loop = setInterval(async () => {
			amount++;
			await interaction.editReply({ content: `${msg.content}\n<:Bar_Full:988493923875979274>` });
		}, 750);

		const filter = (btni: MessageComponentInteraction) => btni.user.id === interaction.user.id;

		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1 });

		
		if (!collector) {
			interaction.followUp('ERR\nNot A Channel');
			return;
		}

		collector.on('collect', async (btn: MessageComponentInteraction) => {
			clearInterval(loop);
			await interaction.editReply({ components: [] });
			if (btn.customId === 'play_stop' && amount === 4) {
				await btn.reply('You Washed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: interaction.user.id },
					{
						$inc: {
							hygiene: 15,
							loyalty: 2
						}
					}
				);
			} else if (btn.customId === 'play_stop') {
				await btn.reply('Minigame Failed\nIt Drowned');
			}
			await Range.InteractionRange(interaction);
		});
	}
}
