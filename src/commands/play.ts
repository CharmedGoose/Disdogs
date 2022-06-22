import { Command } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import type { MessageComponentInteraction } from 'discord.js';
import petSchema from '../models/petSchema';
export class PlayCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'play', aliases: [], description: 'Play With Your Dog' });
	}

	public async messageRun(message: Message) {
		const playRow = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('play_left').setLabel('Left').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_middle').setLabel('Middle').setStyle('PRIMARY'),
			new MessageButton().setCustomId('play_right').setLabel('Right').setStyle('PRIMARY')
		);
		const msg = await message.channel.send({ content: ':herb::herb::herb:\n     :dog:     \n\n     :softball:', components: [playRow] });
		let random = 2;
		const loop = setInterval(async () => {
			random = Math.round(Math.random() * 2) + 1;
			if (random === 1) {
				await msg.edit({ content: ':herb::herb::herb:\n:dog:          \n\n     :softball:', components: [playRow] });
			} else if (random === 2) {
				await msg.edit({ content: ':herb::herb::herb:\n     :dog:     \n\n     :softball:', components: [playRow] });
			} else if (random === 3) {
				await msg.edit({ content: ':herb::herb::herb:\n**           **:dog:\n\n     :softball:', components: [playRow] });
			}
		}, 1000);

		const filter = (btni: MessageComponentInteraction) => btni.user.id === message.author.id;

		const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });

		collector.on('collect', async (btn: MessageComponentInteraction) => {
			await msg.edit({ components: [] });
			clearInterval(loop);
			if (btn.customId === 'play_left' && random === 1) {
				await btn.reply('Minigame Failed');
			} else if (btn.customId === 'play_middle' && random === 2) {
				await btn.reply('Minigame Failed');
			} else if (btn.customId === 'play_right' && random === 3) {
				await btn.reply('Minigame Failed');
			} else if (btn.customId.startsWith('play_')) {
				await btn.reply('You Win!');
				await petSchema.findOneAndUpdate(
					{ ownerId: message.author.id },
					{
						$inc: {
							happiness: 15
						}
					}
				);
			}
		});
	}
}
