import { ChatInputCommand, Command } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { MessageComponentInteraction } from 'discord.js';
import petSchema from '../models/petSchema';
export class StartCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'start',
			aliases: [],
			description: 'Get A Dog 🐶'
		});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(false), {
			guildIds: [],
			idHints: ['991755647370674268']
		});
	}
	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const embed = new MessageEmbed({
			title: 'Welcome To Disdogs :dog:',
			description: 'Would You Like To Give Your Dog A Name?',
			color: 'RANDOM'
		});
		const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('yes').setLabel('Yes').setStyle('SUCCESS'),
			new MessageButton().setCustomId('no').setLabel('No').setStyle('DANGER')
		);
		await interaction.reply({ embeds: [embed], components: [row] });

		const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;

		const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 15000 });

		if (!collector) {
			interaction.followUp('ERR\nNot A Channel')
			return;
		}
		collector.on('collect', async (i: MessageComponentInteraction) => {
			if (i.customId === 'no') {
				await i.deferUpdate();
				embed.title = 'Disdogs';
				embed.description = 'Creating Account ...';
				await i.editReply({ components: [], embeds: [embed] });
				const pet = await petSchema
					.create({
						ownerId: interaction.user.id,
						name: 'Doge <:doge:988485797667819520>'
					})
					.catch(async (err: Error) => {
						embed.title = 'ERROR';
						embed.description = err.message;
						await i.editReply({ components: [], embeds: [embed] });
					});
				if (!pet) return;
				await pet.save().catch(async (err: Error) => {
					embed.title = 'ERROR';
					embed.description = err.message;
					await i.editReply({ components: [], embeds: [embed] });
				});
				embed.title = 'Disdogs';
				embed.description = 'Done!';
				await i.editReply({ components: [], embeds: [embed] });
				embed.title = 'Disdogs';
				embed.description = 'To See Your New Dog :dog:, Type: `/pet`';
				await i.editReply({ components: [], embeds: [embed] });
			} else if (i.customId === 'yes') {
				await i.deferUpdate();
				let collected;
				embed.title = 'Disdogs';
				embed.description = "Type The Dog's :dog: Name";
				await i.editReply({ components: [], embeds: [embed] });
				const filter = (m: Message) => m.author.id === interaction.user.id;
				try {
					collected = await interaction.channel?.awaitMessages({ filter, max: 1, time: 30e3, errors: ['time'] });
				} catch (e) {
					embed.title = 'ERROR';
					embed.description = 'No Name Given';
					await i.editReply({ components: [], embeds: [embed] });
					return;
				}
				embed.title = 'Disdogs';
				embed.description = 'Creating Account ...';
				await i.editReply({ components: [], embeds: [embed] });
				const pet = await petSchema
					.create({
						ownerId: interaction.user.id,
						name: collected?.first()?.content || 'Doge <:doge:988485797667819520>'
					})
					.catch(async (err: Error) => {
						embed.title = 'ERROR';
						embed.description = err.message;
						await i.editReply({ components: [], embeds: [embed] });
					});
				if (!pet) return;
				await pet.save().catch(async (err: Error) => {
					embed.title = 'ERROR';
					embed.description = err.message;
					await i.editReply({ components: [], embeds: [embed] });
				});
				embed.title = 'Disdogs';
				embed.description = 'Done!';
				await i.editReply({ components: [], embeds: [embed] });
				embed.title = 'Disdogs';
				embed.description = 'To See Your New Dog :dog:, Type: `/pet`';
				await i.editReply({ components: [], embeds: [embed] });
			}
		});
	}
}
