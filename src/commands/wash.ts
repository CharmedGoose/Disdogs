import { Command } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import type { MessageComponentInteraction } from 'discord.js';
import petSchema from '../models/petSchema';
import Range from '../lib/RangeStats';
export class WashCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'wash', aliases: [], description: 'Wash Your Dog' });
	}

	public async messageRun(message: Message) {
		const playRow = new MessageActionRow().addComponents(new MessageButton().setCustomId('play_stop').setLabel('Stop').setStyle('PRIMARY'));
		const msg = await message.channel.send({ content: '<:Bar_Full:988493923875979274>', components: [playRow] });
		let amount = 1;
		const loop = setInterval(async () => {
			amount++;
			await msg.edit({ content: `${msg.content}\n <:Bar_Full:988493923875979274>` });
		}, 750);

		const filter = (btni: MessageComponentInteraction) => btni.user.id === message.author.id;

		const collector = message.channel.createMessageComponentCollector({ filter, max: 1 });

		collector.on('collect', async (btn: MessageComponentInteraction) => {
			clearInterval(loop);
			await msg.edit({ components: [] });
			if (btn.customId === 'play_stop' && amount === 4) {
				await btn.reply('You Washed Your Dog');
				await petSchema.findOneAndUpdate(
					{ ownerId: message.author.id },
					{
						$inc: {
							hygiene: 15
						}
					}
				);
			} else if (btn.customId === 'play_stop') {
				await btn.reply('Minigame Failed\nIt Drowned');
			}
			await Range(message);
		});
	}
}
