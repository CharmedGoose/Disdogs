module.exports = {
	apps: [
		{
			name: 'Disdogs',
			script: './dist/index.js',
			watch: '.',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
