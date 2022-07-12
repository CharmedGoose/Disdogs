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
		await interaction.reply({ content: '<:tub:996415255850791034>', components: [playRow]});
		await interaction.followUp('Game: Wash\nHow To Play: Click Stop When The Bath Tub Is Full');
		let amount = 1;
		const loop = setInterval(async () => {
			amount++;
			if (amount === 2) {
				await interaction.editReply({ content: '<:tub_almost_empty:996415344501592104>' });
			} else if (amount === 3) {
				await interaction.editReply({ content: '<:tub_half:996415967057948682>' });
			} else if (amount === 4) {
				await interaction.editReply({ content: '<:tub_almost_full:996416114051530873>' });
			} else if (amount === 5) {
				await interaction.editReply({ content: '<:tub_full:996416257693851679>' });
			}
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
			if (btn.customId === 'play_stop' && amount === 5) {
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
			} else if (btn.customId === 'play_stop' || amount > 5) {
				await btn.reply('Minigame Failed\nIt Drowned');
			}
			await Range.InteractionRange(interaction);
		});
	}
}
