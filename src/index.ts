import 'dotenv/config';

import { SapphireClient } from '@sapphire/framework';

import mongoose from 'mongoose';
import logger from './logger';

const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: process.env.PREFIX,
	presence: { activities: [{ name: 'With Dogs', type: 'PLAYING' }], afk: false, status: 'online' },
	typing: true
});

mongoose
	.connect(process.env.MONGO_SRV || '')
	.then(() => {
		logger.info('Connected To MongoDB');
	})
	.catch((err) => {
		logger.error(`Error connecting to MongoDB: ${err}`);
		process.exit(1);
	});

void client.login(process.env.TOKEN);
