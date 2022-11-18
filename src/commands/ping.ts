import { ChatInputCommand, Command } from '@sapphire/framework';
import { isMessageInstance } from '@sapphire/discord.js-utilities';

export class PingCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: 'ping',
			aliases: ['pong'],
			description: 'Ping'
		});
	}
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description).setDMPermission(true), {
			guildIds: [],
			idHints: ['991756077962121306', '991755645646807171']
		});
	}
	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const msg = await interaction.reply({ content: `Pong`, fetchReply: true });
		if (isMessageInstance(msg)) {
			const diff = msg.createdTimestamp - interaction.createdTimestamp;
			const ping = Math.round(this.container.client.ws.ping);
			return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
		}
		return interaction.editReply('Failed to retrieve ping :(');
	}
}
