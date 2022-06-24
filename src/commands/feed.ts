import { Command } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import type { MessageComponentInteraction } from 'discord.js';
import petSchema from '../models/petSchema';
export class FeedCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'feed', aliases: [], description: 'Feed Your Dog' });
	}

	public async messageRun(message: Message) {
		const playRow = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('play_left').setLabel('Left').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_middle').setLabel('Middle').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_right').setLabel('Right').setStyle('PRIMARY')
		);
		const msg = await message.channel.send({ content: ':window::window::window:\n     :dog:     \n\n     :bone:', components: [playRow] });
		let random = 2;
		const loop = setInterval(async () => {
			random = Math.round(Math.random() * 2) + 1;
			if (random === 1) {
				await msg.edit({ content: ':window::window::window:\n:dog:          \n\n     :bone:', components: [playRow] });
			} else if (random === 2) {
				await msg.edit({ content: ':window::window::window:\n     :dog:     \n\n     :bone:', components: [playRow] });
			} else if (random === 3) {
				await msg.edit({ content: ':window::window::window:\n**           **:dog:\n\n     :bone:', components: [playRow] });
			}
		}, 1000);

		const filter = (btni: MessageComponentInteraction) => btni.user.id === message.author.id;

		const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });

		collector.on('collect', async (btn: MessageComponentInteraction) => {
			clearInterval(loop);
			await msg.edit({ components: [] });
			if (btn.customId === 'play_left' && random === 1) {
				await btn.reply('You Fed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: message.author.id },
					{
						$inc: {
							fullness: 15
						}
					}
				);
			} else if (btn.customId === 'play_middle' && random === 2) {
				await btn.reply('You Fed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: message.author.id },
					{
						$inc: {
							fullness: 15
						}
					}
				);
			} else if (btn.customId === 'play_right' && random === 3) {
				await btn.reply('You Fed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: message.author.id },
					{
						$inc: {
							fullness: 15
						}
					}
				);
			} else if (btn.customId.startsWith('play_')) {
				await btn.reply('Minigame Failed\nYou Missed');
			}
		});
	}
}
