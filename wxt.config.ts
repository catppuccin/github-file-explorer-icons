import { defineConfig } from 'wxt';

import { join } from 'node:path';
import { hfs } from '@humanfs/node';
import { optimize } from 'svgo';

import jiti from 'jiti';

import { MATCHES } from './src/constants';

export default defineConfig({
	srcDir: 'src',
	entrypointsDir: 'entries',
	outDir: 'dist',
	// https://wxt.dev/guide/key-concepts/manifest.html
	manifest: ({ manifestVersion }) => {
		const defaults = {
			name: 'Catppuccin for GitHub File Explorer Icons',
			permissions: ['storage', 'contextMenus', 'activeTab'],
		};

		const mv3 = {
			permissions: [...defaults.permissions, 'scripting'],
			optional_host_permissions: ['*://*/*'],
		};

		const mv2 = {
			optional_permissions: ['*://*/*'],
		};

		return { ...defaults, ...(manifestVersion === 3 ? mv3 : mv2) };
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
		'build:manifestGenerated': (wxt, manifest) => {
			if (wxt.config.command === 'serve') {
				// During development, content script is not listed in manifest, causing
				// "webext-dynamic-content-scripts" to throw an error. So we need to
				// add it manually.
				manifest.content_scripts ??= [];
				manifest.content_scripts.push({
					// Make sure `matches` URLs are updated in src/entries/content/index.ts as well.
					matches: MATCHES,
					run_at: 'document_start',
					js: ['content-scripts/content.js'],
				});
			}
		},
	},
	modules: ['@wxt-dev/auto-icons'],
	runner: {
		startUrls: [
			'https://github.com/catppuccin/catppuccin',
			'https://gitlab.com/gitlab-org/gitlab',
			'https://codeberg.org/forgejo/forgejo',
			'https://gitea.catppuccin.com/catppuccin/catppuccin',
		],
	},
});
