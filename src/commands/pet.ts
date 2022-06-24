import { Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import petSchema from '../models/petSchema';
import Range from '../lib/RangeStats';

const BarTypes = {
	empty: '<:Bar_Empty:988491887415533668>',
	almostEmpty: '<:Bar_Almost_Empty:988492584823443476>',
	middle: '<:Bar_Middle:988493157333352499>',
	almostFull: '<:Bar_Almost_Full:988493408693805057>',
	full: '<:Bar_Full:988493923875979274>'
};

function getBar(percent: number): string {
	return percent === 0
		? BarTypes.empty
		: percent === 1
		? BarTypes.almostEmpty
		: percent === 2
		? BarTypes.middle
		: percent === 3
		? BarTypes.almostFull
		: percent === 4
		? BarTypes.full
		: 'ERROR';
}
export class StartCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'pet', aliases: [], description: 'Shows Your Dog' });
	}

	public async messageRun(message: Message) {
		const pet = await petSchema.findOne({ ownerId: message.author.id });
		const embed = new MessageEmbed({
			color: 'RANDOM'
		});
		if (!pet) {
			embed.title = 'ERROR';
			embed.description = 'You Have No Dog. Type `d!start` To Get A Dog :dog:';
			await message.reply({ embeds: [embed] });
			return;
		}
		await Range(message);
		embed.title = `${(await this.container.client.users.fetch(pet.ownerId)).username}'s ${pet.name}` || 'Doge <:doge:988485797667819520>';

		embed.addField('Happiness', `${getBar(Math.round((pet.happiness || 0) / 25))} (${Math.round(pet.happiness || 0)}%)`, true);
		embed.addField('Fullness', `${getBar(Math.round((pet.fullness || 0) / 25))} (${Math.round(pet.fullness || 0)}%)`, true);
		embed.addField('Hygiene', `${getBar(Math.round((pet.hygiene || 0) / 25))} (${Math.round(pet.hygiene || 0)}%)`, true);
		embed.addField('Love', `${getBar(Math.round((pet.love || 0) / 25))} (${Math.round(pet.love || 0)}%)`, true);
		embed.addField('Energy', `${getBar(Math.round((pet.energy || 0) / 25))} (${Math.round(pet.energy || 0)}%)`, true);
		embed.addField(
			'Experience',
			`${getBar(Math.round((pet.experience || 0) / 25))} (${Math.round(pet.experience || 0)} / 100)\n\`Level ${pet.level || 0}\``,
			true
		);
		embed.setFooter({
			text: (await this.container.client.users.fetch(pet.ownerId)).tag,
			iconURL: (await this.container.client.users.fetch(pet.ownerId)).avatarURL() || undefined
		});

		await message.channel.send({ embeds: [embed] });
	}
}
