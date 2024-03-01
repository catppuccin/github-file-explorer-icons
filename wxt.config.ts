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
		web_accessible_resources: [
			{
				resources: ['*.svg'],
				matches: ['*://github.com/*'],
			},
		],
	},
	hooks: {
		'build:before': async () => {
			const PUBLIC_DIR = join(__dirname, './src/public/');
			if (await hfs.isDirectory(PUBLIC_DIR)) {
				await hfs.deleteAll(PUBLIC_DIR);
				await hfs.createDirectory(PUBLIC_DIR);
			}

			// Copy icons:
			await hfs.copyAll(
				join(__dirname, './vscode-icons/icons/'),
				PUBLIC_DIR,
			);
			await hfs.deleteAll(join(PUBLIC_DIR, 'css-variables'));

			// Write assocations/config file:
			await hfs.write(
				join(__dirname, './src/vscode-icons.json'),
				JSON.stringify(
					jiti(__dirname)('./vscode-icons/src/defaults/index.ts')
						.defaultConfig,
				),
			);

			await hfs.copyAll(
				join(__dirname, './assets/icons'),
				join(PUBLIC_DIR),
			);
		},
	},
});
