import { defineContentScript } from 'wxt/sandbox';
import './styles.css';

import { observe } from 'selector-observer';
import { selectors } from '../../lib/constants';
import {
	replaceElementWithIcon,
	replaceIconInRow,
} from '../../lib/replace-icon';

export default defineContentScript({
	matches: ['*://github.com/*'],
	runAt: 'document_start',
	main() {
		// Replacing all icons synchronously prevents visual "blinks" but can
		// cause missing icons/rendering delay in very large folders.
		// Replacing asynchronously instead fixes problems in large folders, but introduces "blinks".
		// Here we compromise, rushing the first n replacements to prevent blinks that will likely be "above the fold"
		// and delaying the replacement of subsequent rows.
		let executions = 0;
		let timerID;
		const rushFirst = (rushBatch: number, callback: () => void) => {
			if (executions <= rushBatch) {
				callback(); // Immediately run to prevent visual "blink".
				setTimeout(callback, 20); // Run again later to catch any icons that are missed in large repositories.
				executions += 1;
			} else {
				setTimeout(callback, 0); // Run without blocking to prevent delayed rendering of large folders too much.
				clearTimeout(timerID);
				timerID = setTimeout(() => {
					executions = 0;
				}, 1000); // Reset execution tracker.
			}
		};

		// Monitor DOM elements that match a CSS selector.
		observe(selectors.row, {
			add(row) {
				const callback = () => replaceIconInRow(row);
				rushFirst(90, callback);
			},
		});

		for (const icon of document.querySelectorAll(
			'img[data-catppuccin-extension-iconname]',
		) as NodeListOf<HTMLElement>) {
			const iconName = icon.getAttribute('data-catppuccin-extension-iconname');
			const fileName = icon.getAttribute('data-catppuccin-extension-filename');
			if (iconName && fileName)
				replaceElementWithIcon(icon, iconName, fileName);
		}
	},
});
