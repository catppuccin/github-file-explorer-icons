import { defineContentScript } from 'wxt/sandbox';

import { observe } from 'selector-observer';

import { type ReplacementSelectorSet, matches, sites } from '@/sites';
import { flavor } from '@/storage';
import { createStylesElement } from '@/utils';
import { injectStyles, replaceIconInRow } from './lib';

export default defineContentScript({
	// Make sure `matches` URLs are updated in wxt.config.ts as well.
	matches: matches,
	runAt: 'document_start',

	main() {
		const stylesEl = createStylesElement();

		for (const site of sites) {
			if (site.domains.includes(window.location.hostname)) {
				runReplacements(site.replacements, stylesEl);
				// Assume URLs only have one matching site implementation. Can change this in the future.
				return;
			}
		}

		/* No matching domain. */
		const replacements = sites.flatMap((site) => site.replacements);
		runReplacements(replacements, stylesEl);
	},
});

function runReplacements(
	replacements: Array<ReplacementSelectorSet>,
	stylesEl: Element,
) {
	// Monitor DOM elements that match a CSS selector.
	for (const replacement of replacements) {
		observe(replacement.row, {
			async add(rowEl: HTMLElement) {
				// TODO: Remove development timeout wrapper.
				setTimeout(
					() =>
						// await
						replaceIconInRow(rowEl, replacement),
					1000,
				);
			},
		});
	}

	const rawStyles = replacements.map(({ styles }) => styles || '').join('\n');
	flavor.watch(() => injectStyles(stylesEl, rawStyles));
	injectStyles(stylesEl, rawStyles);
}
