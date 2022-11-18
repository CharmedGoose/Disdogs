import { ChatInputCommand, Command } from '@sapphire/framework';
import petSchema from '../models/petSchema';

export class PutToSleepCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, name: 'puttosleep', aliases: [], description: 'Puts Your Dog To Sleep' });
	}
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(false), {
			guildIds: [],
			idHints: ['991781591212892170', '991781592026591254']
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const pet = await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
		interaction.reply(`BANG\nBANG\nBANG\nYou Put ${pet?.name || 'Your Dog'} To Sleep`);
	}
}
