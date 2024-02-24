import { defineConfig } from 'wxt';

import { hfs } from '@humanfs/node';
import { join } from 'path';

import jiti from 'jiti';

export default defineConfig({
	srcDir: 'src',
	entrypointsDir: 'entries',
	outDir: 'dist',
	manifest: {
		name: 'Catppuccin for GitHub File Explorer',
		permissions: ['storage'],
		homepage_url: 'https://github.com/catppuccin/github-icons',
		web_accessible_resources: [
			{
				resources: ['*.svg'],
				matches: ['*://github.com/*'],
			},
		],
	},
	hooks: {
		'build:before': async () => {
			// Copy icons:
			const SRC = join(__dirname, './vscode-icons/icons/');
			const DEST = join(__dirname, './src/public/');
      await hfs.deleteAll(DEST);
			await hfs.copyAll(SRC, DEST);
			await hfs.deleteAll(join(DEST, 'css-variables'));

			// Write assocations/config file:
			await hfs.write(
				join(__dirname, './src/vscode-icons.json'),
				JSON.stringify(
					jiti(__dirname)('./vscode-icons/src/defaults/index.ts')
						.defaultConfig,
				),
			);
		},
	},
});
