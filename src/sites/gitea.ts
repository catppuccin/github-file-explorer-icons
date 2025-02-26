import type { Site } from '.';

export const gitea: Site = {
	domains: ['gitea.com'],
	replacements: [],
	styles: /* css */ `
/* ... */
`.trim(),
};

const GITEA_SELECTORS = {
	row: [
		'#repo-files-table .repo-file-item',
		'#diff-file-tree .item-file',
		'#diff-file-tree .item-directory',
	],
	filename: ['.name a.muted', 'span.gt-ellipsis'],
	icon: ['.octicon-file-directory-fill', '.octicon-file'],
};
