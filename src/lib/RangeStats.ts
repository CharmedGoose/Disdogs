import { Message, MessageEmbed } from 'discord.js';
import type { Command } from '@sapphire/framework';
import petSchema from '../models/petSchema';

async function Range(message: Message) {
	const pet = await petSchema.findOne({ ownerId: message.author.id });
	if (!pet) return;

	if ((pet.fullness || 0) <= 0) {
		await petSchema.findOneAndDelete({ ownerId: message.author.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${message.author.id}> Your ${pet.name} Died Because You Didn't Feed It`,
			color: 'RED'
		});
		await message.channel.send({ embeds: [embed] });
	}
	if ((pet.energy || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: message.author.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${message.author.id}> Your ${pet.name} Died Because It Didn't Get Sleep`,
			color: 'RED'
		});
		await message.channel.send({ embeds: [embed] });
	}
	if ((pet.hygiene || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: message.author.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${message.author.id}> ${pet.name} Was Taken Away By The Animal Shelter Because You Didn't Wash It`,
			color: 'RED'
		});
		await message.channel.send({ embeds: [embed] });
	}
	if ((pet.happiness || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: message.author.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${message.author.id}> Your ${pet.name} Died Because Of Depression`,
			color: 'RED'
		});
		await message.channel.send({ embeds: [embed] });
	}
	if ((pet.love || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: message.author.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${message.author.id}> Your ${pet.name} Ranaway Because You Didn't Love It`,
			color: 'RED'
		});
		await message.channel.send({ embeds: [embed] });
	}
	if ((pet.fullness || 0) > 100) {
		pet.fullness = 100;
		await pet.save();
	}
	if ((pet.energy || 0) > 100) {
		pet.energy = 100;
		await pet.save();
	}
	if ((pet.hygiene || 0) > 100) {
		pet.hygiene = 100;
		await pet.save();
	}
	if ((pet.happiness || 0) > 100) {
		pet.happiness = 100;
		await pet.save();
	}
	if ((pet.love || 0) > 100) {
		pet.love = 100;
		await pet.save();
	}
}

async function InteractionRange(interaction: Command.ChatInputInteraction) {
	const pet = await petSchema.findOne({ ownerId: interaction.user.id });
	if (!pet) return;

	if ((pet.fullness || 0) <= 0) {
		await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${interaction.user.id}> Your ${pet.name} Died Because You Didn't Feed It`,
			color: 'RED'
		});
		await interaction.channel?.send({ embeds: [embed] });
	}
	if ((pet.energy || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${interaction.user.id}> Your ${pet.name} Died Because It Didn't Get Sleep`,
			color: 'RED'
		});
		await interaction.channel?.send({ embeds: [embed] });
	}
	if ((pet.hygiene || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${interaction.user.id}> ${pet.name} Was Taken Away By The Animal Shelter Because You Didn't Wash It`,
			color: 'RED'
		});
		await interaction.channel?.send({ embeds: [embed] });
	}
	if ((pet.happiness || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${interaction.user.id}> Your ${pet.name} Died Because Of Depression`,
			color: 'RED'
		});
		await interaction.channel?.send({ embeds: [embed] });
	}
	if ((pet.loyalty || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${interaction.user.id}> Your ${pet.name} Ranaway Because It Wasn't Loyal To You`,
			color: 'RED'
		});
		await interaction.channel?.send({ embeds: [embed] });
	}
	if ((pet.love || 0) < 0) {
		await petSchema.findOneAndDelete({ ownerId: interaction.user.id });
		const embed = new MessageEmbed({
			title: `Bad News`,
			description: `<@${interaction.user.id}> Your ${pet.name} Ranaway Because You Didn't Love It`,
			color: 'RED'
		});
		await interaction.channel?.send({ embeds: [embed] });
	}
	if ((pet.fullness || 0) > 100) {
		pet.fullness = 100;
		await pet.save();
	}
	if ((pet.energy || 0) > 100) {
		pet.energy = 100;
		await pet.save();
	}
	if ((pet.hygiene || 0) > 100) {
		pet.hygiene = 100;
		await pet.save();
	}
	if ((pet.happiness || 0) > 100) {
		pet.happiness = 100;
		await pet.save();
	}
	if ((pet.love || 0) > 100) {
		pet.love = 100;
		await pet.save();
	}
}

export default { Range, InteractionRange };
