import type { ReplacementSelectorSet, Site } from '.';

const mainRepositoryImplementation: ReplacementSelectorSet = {
	row: '#file-tree > div, .tree > div',
	filename: 'a',
	icon: 'svg',
	isDirectory: (_rowEl, _fileNameEl, iconEl) =>
		iconEl.classList.contains('fill-current'),
	isSubmodule: (_rowEl, _fileNameEl, _iconEl) => false, // TODO: Implement isSubmodule.
	isCollapsable: (_rowEl, _fileNameEl, _iconEl) => false,
};

export const tangled: Site = {
	domains: ['tangled.sh'],
	replacements: [mainRepositoryImplementation],
};
