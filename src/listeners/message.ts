import { Listener } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import petSchema from '../models/petSchema';
export class ReadyListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, once: false, event: 'messageCreate' });
	}

	public async run(message: Message) {
		const random = Math.floor(Math.random() * 7) + 1;
		let pet = await petSchema.findOneAndUpdate(
			{ ownerId: message.author.id },
			{
				$inc: {
					experience: random,
					love: Math.floor(Math.random() * 2),
					fullness: -Math.round(Math.random()),
					hygiene: -Math.round(Math.random()),
					energy: -Math.floor(Math.random() * 3),
					happiness: -1
				}
			}
		);
		if (!pet) return;

		if ((pet.experience || 0) >= 100) {
			pet = await petSchema.findOneAndUpdate(
				{ ownerId: message.author.id },
				{
					$inc: {
						level: 1,
						experience: -100,
						love: Math.floor(Math.random() * 10) + 1,
						fullness: -Math.floor(Math.random() * 3),
						hygiene: -Math.floor(Math.random() * 5),
						energy: -Math.floor(Math.random() * 7)
					}
				}
			);

			if (!pet) return;
			const embed = new MessageEmbed({
				title: `Congratulations ${message.author.username}!`,
				description: `Your ${pet.name} Is Now Level ${(pet.level || 0) + 1}!`,
				color: 'RANDOM'
			});
			await message.channel.send({ embeds: [embed] });
		}
		if ((pet.fullness || 0) <= 0) {
			pet.fullness = 0;
			pet.level = (pet.level || 0) / 2;
			pet.love = (pet.love || 0) - 50;
			await pet.save();
		}
		if ((pet.energy || 0) < 0) {
			pet.energy = 0;
			await pet.save();
		}
		if ((pet.hygiene || 0) < 0) {
			pet.hygiene = 0;
			await pet.save();
		}
		if ((pet.happiness || 0) < 0) {
			pet.happiness = 0;
			await pet.save();
		}
		if ((pet.love || 0) < 0) {
			pet.love = 0;
			await pet.save();
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
}
