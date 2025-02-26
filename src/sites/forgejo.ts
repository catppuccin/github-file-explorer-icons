import type { Site } from '.';

export const forgejo: Site = {
	domains: ['codeberg.org'],
	replacements: [],
	styles: /* css */ `
/* ... */
`.trim(),
};

const FORGEJO_SELECTORS = {
	row: [
		'#repo-files-table .entry',
		'#diff-file-tree .item-file',
		'#diff-file-tree .item-directory',
	],
	filename: ['.name a.muted', 'span.gt-ellipsis'],
	icon: ['.octicon-file-directory-fill', '.octicon-file'],
};
