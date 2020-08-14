const path = require('path');

module.exports = {
	entry: './stump.ts',
	mode: "production",
	watch: true,
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'stump.js'
	}
};