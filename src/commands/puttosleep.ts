import { Command } from '@sapphire/framework';
import petSchema from '../models/petSchema';
import type { Message } from 'discord.js';

export class PutToSleepCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'puttosleep', aliases: [], description: 'Puts Your Dog To Sleep' });
	}

    public async messageRun(message: Message) {
    const pet = await petSchema.findOneAndDelete({ ownerId: message.author.id });
	message.channel.send(`BANG\nBANG\nBANG\nYou Put Your ${pet?.name || "Dog"} To Sleep`)
	}
}
