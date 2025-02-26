import { defineContentScript } from 'wxt/sandbox';

import { observe } from 'selector-observer';

import { flavor } from '@/storage';
import { matches, sites } from '@/sites';
import { createStylesElement } from '@/utils';
import { injectStyles, replaceIconInRow } from './lib';

export default defineContentScript({
	// Make sure `matches` URLs are updated in wxt.config.ts as well.
	matches: matches,
	runAt: 'document_start',

	main() {
		const domain = window.location.hostname;
		for (const site of sites) {
			if (site.domains.includes(domain)) {
				// Monitor DOM elements that match a CSS selector.
				for (const replacement of site.replacements) {
					observe(replacement.row, {
						async add(rowEl: HTMLElement) {
							console.log('adding', replacement.row);
							await replaceIconInRow(rowEl, replacement);
						},
					});
				}

				const stylesEl = createStylesElement();
				const styles =
					(site.styles || '') +
					site.replacements
						.map(({ styles }) => styles || '')
						.join('\n');
				flavor.watch(() => injectStyles(stylesEl, styles));
				injectStyles(stylesEl, styles);

				// Assume URLs only have one matching site implementation. Can change this in the future.
				break;
			}
		}
	},
});
