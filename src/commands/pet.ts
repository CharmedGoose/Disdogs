import { ChatInputCommand, Command } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import petSchema from '../models/petSchema';
import Range from '../lib/RangeStats';

const BarTypes = {
	empty: '<:Bar_Empty:988491887415533668> :disappointed:',
	almostEmpty: '<:Bar_Almost_Empty:988492584823443476> :slight_frown:',
	middle: '<:Bar_Middle:988493157333352499> :worried: ',
	almostFull: '<:Bar_Almost_Full:988493408693805057> :slight_smile:',
	full: '<:Bar_Full:988493923875979274> :smiley:'
};
const Said = [
	'Uhm - Your Friend And Comforter Gelo',
	'Nucee - Your Friend And Comforter Gelo',
	'AYO - Your Friend And Comforter Gelo',
	'Interesting - Your Friend And Comforter Gelo',
	'Very happi for u - Your Friend And Comforter Gelo',
	'O-O - Your Friend And Comforter Gelo',
	'oh my brain too smol to understand - Cresent',
	'pretty sus - Cresent',
	"that's horrible - Crescent"
];

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

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(false), {
			guildIds: [],
			idHints: ['991781601476354198', '991781602214551592']
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply();
		await Range.InteractionRange(interaction);
		const pet = await petSchema.findOne({ ownerId: interaction.user.id });
		const embed = new MessageEmbed({
			color: 'RANDOM'
		});
		if (!pet) {
			embed.title = 'ERROR';
			embed.description = 'You Have No Dog. Type `/start` To Get A Dog :dog:';
			await interaction.editReply({ embeds: [embed] });
			return;
		}
		embed.title =
			`${(await this.container.client.users.fetch(pet.ownerId)).username}'s  LVL. ${pet.level || 0} ${pet.name}` ||
			'Doge <:doge:988485797667819520>';

		embed.addField('`Happiness`', `${getBar(Math.round((pet.happiness || 0) / 25))} (${Math.round(pet.happiness || 0)}%)`, true);
		embed.addField('`Fullness`', `${getBar(Math.round((pet.fullness || 0) / 25))} (${Math.round(pet.fullness || 0)}%)`, true);
		embed.addField('`Hygiene`', `${getBar(Math.round((pet.hygiene || 0) / 25))} (${Math.round(pet.hygiene || 0)}%)`, true);
		embed.addField('`Love`', `${getBar(Math.round((pet.love || 0) / 25))} (${Math.round(pet.love || 0)}%)`, true);
		embed.addField('`Energy`', `${getBar(Math.round((pet.energy || 0) / 25))} (${Math.round(pet.energy || 0)}%)`, true);
		embed.addField(
			'`Experience`',
			`${getBar(Math.round((pet.experience || 0) / 25))} (${Math.round(pet.experience || 0)} / 100)\n`,
			true
		);
		embed.addField('`Loyalty`', `${getBar(Math.round((pet.loyalty || 0) / 25))} (${Math.round(pet.loyalty || 0)}%)`);

		embed.setFooter({ text: Said[Math.round(Math.random() * (Said.length - 1))] })

		await interaction.editReply({ embeds: [embed] });
	}
}
