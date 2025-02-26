import type { Site } from '.';

export const gitlab: Site = {
	domains: ['gitlab.com'],
	replacements: [],
	styles: /* css */ `
/* ... */
`.trim(),
};

const GITLAB_SELECTORS = {
	row: [
		'.tree-table .tree-item',
		'.file-header-content',
		'.diff-tree-list .file-row',
	],
	filename: [
		'.tree-item-file-name .tree-item-link span:last-of-type',
		'.file-title-name',
		'span.gl-truncate-component',
	],
	icon: [
		'.folder-icon',
		'.file-icon',
		'span svg:has(use[href^="/assets/file_icons/"])',
	],
};
