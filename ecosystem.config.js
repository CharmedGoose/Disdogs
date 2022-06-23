module.exports = {
	apps: [
		{
			name: 'Disdogs',
			script: './src/index.ts',
			watch: '.',
			instances: 'max',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
