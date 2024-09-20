const GITHUB_SELECTORS = {
	row: [
		'.js-navigation-container[role=grid] > .js-navigation-item',
		'file-tree .ActionList-content',
		'a.tree-browser-result',
		'.PRIVATE_TreeView-item-content',
		'.react-directory-filename-column',
		'[aria-label="Parent directory"]',
	],
	filename: [
		'div[role="rowheader"] > span',
		'.ActionList-item-label',
		'a.tree-browser-result > marked-text',
		'.PRIVATE_TreeView-item-content > .PRIVATE_TreeView-item-content-text',
		'.react-directory-filename-column .react-directory-filename-cell a',
		'[aria-label="Parent directory"] div',
	],
	icon: [
		'.octicon-file',
		'.octicon-file-directory-fill',
		'.octicon-file-directory-open-fill',
		'.octicon-file-submodule',
		'.react-directory-filename-column > svg',
		'[aria-label="Parent directory"] svg',
		'.PRIVATE_TreeView-item-visual > svg',
	],
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

const FORGEJO_SELECTORS = {
	row: [
		'#repo-files-table .entry',
		'#diff-file-tree .item-file',
		'#diff-file-tree .item-directory',
	],
	filename: ['.name a.muted', 'span.gt-ellipsis'],
	icon: ['.octicon-file-directory-fill', '.octicon-file'],
};

function mergeSelectors(key: keyof typeof GITHUB_SELECTORS): string {
	return [
		...GITHUB_SELECTORS[key],
		...GITLAB_SELECTORS[key],
		...FORGEJO_SELECTORS[key],
	].join(',');
}

export const SELECTORS = {
	row: mergeSelectors('row'),
	filename: mergeSelectors('filename'),
	icon: mergeSelectors('icon'),
};

export const icons = {
	x: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>',
};

export const ATTRIBUTE_PREFIX = 'data-catppuccin-file-explorer-icons';

export const MATCHES = [
	'*://github.com/*',
	'*://gitlab.com/*',
	'*://codeberg.org/*',
];
