import type { ReplacementSelectorSet, Site } from './index.js';

const mainRepositoryImplementation: ReplacementSelectorSet = {
	row: 'table[data-qa="repository-directory"] tr',
	filename: 'td:first-of-type',
	icon: 'svg',
	isDirectory: (_rowEl, _fileNameEl, iconEl) =>
		iconEl.parentElement.getAttribute('aria-label') === 'Directory,',
	isSubmodule: (_rowEl, _fileNameEl, iconEl) =>
		iconEl.classList.contains('octicon-file-submodule'),
	isCollapsable: (_rowEl, _fileNameEl, _iconEl) => false,
};

const fileContentsHeaderImplementation: ReplacementSelectorSet = {
	row: '[data-qa="bk-file__header"]',
	filename: 'span:has(+ div [aria-label="Copy File Path"])',
	icon: 'div:first-of-type svg',
	isDirectory: (_rowEl, _fileNameEl, _iconEl) => false,
	isSubmodule: (_rowEl, _fileNameEl, _iconEl) => false,
	isCollapsable: (_rowEl, _fileNameEl, _iconEl) => false,
};

const directoryContentsHeaderImplementation: ReplacementSelectorSet = {
	row: 'div:has(+ [data-qa="repository-directory"]), div:has(+ .rah-static [data-qa="repository-directory"])',
	filename:
		'div:has(span[aria-label="Directory,"] svg) + span > span:last-of-type',
	icon: 'span[aria-label="Directory,"] svg',
	isDirectory: (_rowEl, _fileNameEl, _iconEl) => true,
	isSubmodule: (_rowEl, _fileNameEl, _iconEl) => false,
	isCollapsable: (_rowEl, _fileNameEl, _iconEl) => false,
};

export const bitbucket: Site = {
	domains: ['bitbucket.org'],
	replacements: [
		mainRepositoryImplementation,
		fileContentsHeaderImplementation,
		directoryContentsHeaderImplementation,
	],
};
