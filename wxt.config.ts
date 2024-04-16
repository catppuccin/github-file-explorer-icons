import { defineConfig } from 'wxt';

import { hfs } from '@humanfs/node';
import { join } from 'path';

import jiti from 'jiti';

export default defineConfig({
	srcDir: 'src',
	entrypointsDir: 'entries',
	outDir: 'dist',
	manifest: {
		name: 'Catppuccin for GitHub File Explorer Icons',
		permissions: ['storage'],
		homepage_url:
			'https://github.com/catppuccin/github-file-explorer-icons',
	},
	hooks: {
		'build:before': async () => {
			const ICON_DIR = join(
				__dirname,
				'./vscode-icons/icons/css-variables/',
			);
			const icons = {};

			for await (const entry of hfs.list(ICON_DIR)) {
				icons[entry.name.replace('.svg', '')] = await hfs
					.text(join(ICON_DIR, entry.name))
					.then((text) => {
						const lines = text.split('\n');
						return lines
							.slice(1, lines.length - 2)
							.join('\n')
							.trim()
							.replaceAll('--vscode-ctp', '--ctp')
							.replaceAll('/>', '></path>');
					});
			}

			await hfs.write(
				join(__dirname, './src/icons.json'),
				JSON.stringify(icons),
			);

			await hfs.write(
				join(__dirname, './src/associations.json'),
				JSON.stringify(
					jiti(__dirname)('./vscode-icons/src/defaults/index.ts')
						.defaultConfig.associations,
				),
			);
		},
	},
});
