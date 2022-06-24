import { Command } from '@sapphire/framework';
import Canvas from 'canvas';
import petSchema from '../models/petSchema';
import { Message, MessageAttachment } from 'discord.js';

export class PutsToSleepCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'putstosleep', aliases: [], description: 'Puts Your Dog To Sleep' });
	}

	public async messageRun(message: Message) {
		const canvas = Canvas.createCanvas(750, 750);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('./assets/farm.jpg');

		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		const random = Math.round(Math.random() * 3) + 6;

		for (let step = 0; step < random; step++) {
			const sheep = await Canvas.loadImage('./assets/Sheep.png');

			context.drawImage(sheep, Math.round(Math.random() * 690), Math.round(Math.random() * 690), 150, 150);
		}

		const attachment = new MessageAttachment(canvas.toBuffer(), 'count-sheep.png');

		await message.channel.send({ files: [attachment], content: 'Count The Sheep' });

		const filter = (m: Message) => m.author.id === message.author.id;
		let collected;
		try {
			collected = await message.channel.awaitMessages({ filter, max: 1, time: 30e3, errors: ['time'] });
		} catch (e) {
			message.channel.send('Minigame Failed\nTime Ran Out');
			return;
		}
		if (Number(collected.first()?.content || '1') === random) {
			message.channel.send('Your Dog Went To Sleep');
			await petSchema.findOneAndUpdate(
				{ ownerId: message.author.id },
				{
					$inc: {
						energy: 100
					}
				}
			);
			return;
		} else {
			message.channel.send("Minigame Failed\nYour Dog Ranaway From You Because You Couldn't Count");
			await petSchema.findOneAndDelete({ ownerId: message.author.id });
			return;
		}
	}
}
