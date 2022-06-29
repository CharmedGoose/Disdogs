import { ChatInputCommand, Command } from '@sapphire/framework';
import Canvas from 'canvas';
import petSchema from '../models/petSchema';
import { Message, MessageAttachment } from 'discord.js';
import Range from '../lib/RangeStats';

export class PutsToSleepCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'putstosleep', aliases: [], description: 'Puts Your Dog To Sleep' });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(false), {
			guildIds: ['984461250673143889', '973906266277683210'],
			idHints: ['991781593427476591', '991781594492842094']
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply();
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

		await interaction.editReply({ files: [attachment], content: 'Count The Sheep' });

		const filter = (m: Message) => m.author.id === interaction.user.id;
		let collected;
		try {
			collected = await interaction.channel?.awaitMessages({ filter, max: 1, time: 30e3, errors: ['time'] });
		} catch (e) {
			interaction.followUp('Minigame Failed\nTime Ran Out');
			return;
		}

		if (!collected) {
			interaction.followUp('Minigame Failed\nTime Ran Out');
			return;
		}

		if (Number(collected.first()?.content || '1') === random) {
			interaction.followUp('Your Dog Went To Sleep');
			await petSchema.findOneAndUpdate(
				{ ownerId: interaction.user.id },
				{
					$inc: {
						energy: 100
					}
				}
			);
			return;
		} else {
			interaction.followUp("Minigame Failed\nYour Dog Ranaway From You Because You Couldn't Count");
			await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
			return;
		}
		await Range.InteractionRange(interaction);
	}
}
