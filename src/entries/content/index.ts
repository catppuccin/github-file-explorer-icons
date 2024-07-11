import { defineContentScript } from 'wxt/sandbox';

import { observe } from 'selector-observer';

import { SELECTORS } from '@/constants';
import { flavor } from '@/storage';
import { injectStyles, replaceIconInRow } from './lib';

export default defineContentScript({
	// Make sure this value is updated in wxt.config.ts as well.
	matches: ['*://github.com/*', '*://gitlab.com/*', '*://codeberg.org/*'],
	runAt: 'document_start',

	main() {
		// Monitor DOM elements that match a CSS selector.
		observe(SELECTORS.row, {
			async add(row) {
				await replaceIconInRow(row as HTMLElement);
			},
		});

		flavor.watch(injectStyles);
		injectStyles();
	},
});
