import { ChatInputCommand, Command } from '@sapphire/framework';
import { MessageActionRow, MessageButton } from 'discord.js';
import type { MessageComponentInteraction } from 'discord.js';
import petSchema from '../models/petSchema';
import Range from '../lib/RangeStats';
export class FeedCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'feed', aliases: [], description: 'Feed Your Dog' });
	}
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(false), {
			guildIds: ['984461250673143889', '973906266277683210'],
			idHints: ['991781598682955846', '991781599731535993']
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const playRow = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('play_left').setLabel('Left').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_middle').setLabel('Middle').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_right').setLabel('Right').setStyle('PRIMARY')
		);
		await interaction.reply({ content: ':window::window::window:\n     :dog:     \n\n     :bone:', components: [playRow] });
		await interaction.followUp('Game: Feed\nHow To Play: Click The Button BELOW The Dog');
		let random = 2;
		const loop = setInterval(async () => {
			random = Math.round(Math.random() * 2) + 1;
			if (random === 1) {
				await interaction.editReply({ content: ':window::window::window:\n:dog:          \n\n     :bone:', components: [playRow] });
			} else if (random === 2) {
				await interaction.editReply({ content: ':window::window::window:\n     :dog:     \n\n     :bone:', components: [playRow] });
			} else if (random === 3) {
				await interaction.editReply({ content: ':window::window::window:\n**           **:dog:\n\n     :bone:', components: [playRow] });
			}
		}, 1000);

		const filter = (btni: MessageComponentInteraction) => btni.user.id === interaction.user.id;

		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1 });

		if (!collector) {
			interaction.followUp('ERR\nNot A Channel');
			return;
		}

		collector.on('collect', async (btn: MessageComponentInteraction) => {
			clearInterval(loop);
			await interaction.editReply({ components: [] });
			if (btn.customId === 'play_left' && random === 1) {
				await btn.editReply('You Fed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: interaction.user.id },
					{
						$inc: {
							fullness: 15
						}
					}
				);
			} else if (btn.customId === 'play_middle' && random === 2) {
				await btn.editReply('You Fed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: interaction.user.id },
					{
						$inc: {
							fullness: 15
						}
					}
				);
			} else if (btn.customId === 'play_right' && random === 3) {
				await btn.editReply('You Fed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: interaction.user.id },
					{
						$inc: {
							fullness: 15
						}
					}
				);
			} else if (btn.customId.startsWith('play_')) {
				await btn.editReply('Minigame Failed\nYou Missed');
			}
			await Range.InteractionRange(interaction);
		});
	}
}
