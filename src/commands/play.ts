import { ChatInputCommand, Command } from '@sapphire/framework';
import { MessageActionRow, MessageButton } from 'discord.js';
import type { MessageComponentInteraction } from 'discord.js';
import petSchema from '../models/petSchema';
import Range from '../lib/RangeStats';
export class PlayCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'play', aliases: [], description: 'Play With Your Dog' });
	}
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(false), {
			guildIds: [],
			idHints: ['991781678085320755', '991781678848679978']
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const playRow = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('play_left').setLabel('Left').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_middle').setLabel('Middle').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_right').setLabel('Right').setStyle('PRIMARY')
		);
		await interaction.reply({ content: ':herb::herb::herb:\n     :dog:     \n\n     :softball:', components: [playRow] });
		await interaction.followUp('Game: Play\nHow To Play: Click A Button Thats NOT Below The Dog');
		let random = 2;
		const loop = setInterval(async () => {
			random = Math.round(Math.random() * 2) + 1;
			if (random === 1) {
				await interaction.editReply({ content: ':herb::herb::herb:\n:dog:          \n\n     :softball:', components: [playRow] });
			} else if (random === 2) {
				await interaction.editReply({ content: ':herb::herb::herb:\n     :dog:     \n\n     :softball:', components: [playRow] });
			} else if (random === 3) {
				await interaction.editReply({ content: ':herb::herb::herb:\n**           **:dog:\n\n     :softball:', components: [playRow] });
			}
		}, 1000);

		const filter = (btni: MessageComponentInteraction) => btni.user.id === interaction.user.id;

		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1 });

		if (!collector) {
			interaction.followUp('ERR\nNot A Channel');
			return;
		}

		collector.on('collect', async (btn: MessageComponentInteraction) => {
			await interaction.editReply({ components: [] });
			clearInterval(loop);
			if (btn.customId === 'play_left' && random === 1) {
				await btn.reply('Minigame Failed\nYou Missed');
			} else if (btn.customId === 'play_middle' && random === 2) {
				await btn.reply('Minigame Failed\nYou Missed');
			} else if (btn.customId === 'play_right' && random === 3) {
				await btn.reply('Minigame Failed\nYou Missed');
			} else if (btn.customId.startsWith('play_')) {
				await btn.reply('You Played With Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: interaction.user.id },
					{
						$inc: {
							happiness: 15,
							loyalty: 2
						}
					}
				);
			}
			await Range.InteractionRange(interaction);
		});
	}
}
