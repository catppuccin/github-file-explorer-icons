import { defineConfig } from 'wxt';

import { hfs } from '@humanfs/node';
import { join } from 'path';
import { optimize } from 'svgo';

import jiti from 'jiti';

export default defineConfig({
	srcDir: 'src',
	entrypointsDir: 'entries',
	outDir: 'dist',
	manifest: {
		name: 'Catppuccin for GitHub File Explorer Icons',
		// See https://github.com/fregante/webext-dynamic-content-scripts/blob/main/how-to-add-github-enterprise-support-to-web-extensions.md.
		permissions: ['storage', 'scripting', 'contextMenus', 'activeTab'],
		optional_host_permissions: ['*://*/*'],
		// content_scripts: [
		// 	{
		// 		matches: [
		// 			'*://codeberg.org/*',
		// 			'*://github.com/*',
		// 			'*://gitlab.com/*',
		// 		],
		// 		run_at: 'document_start',
		// 		js: ['content-scripts/content.js'],
		// 	},
		// ],
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
						return optimize(
							text.replaceAll('--vscode-ctp', '--ctp'),
							{
								js2svg: { useShortTags: false },
							},
						)
							.data.replace(
								'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">',
								'',
							)
							.replace('</svg>', '');
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
