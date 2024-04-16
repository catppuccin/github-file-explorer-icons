export const selectors = {
	row: `.js-navigation-container[role=grid] > .js-navigation-item,
    file-tree .ActionList-content,
    a.tree-browser-result,
    .PRIVATE_TreeView-item-content,
    .react-directory-filename-column,
    [aria-label="Parent directory"]`,
	filename: `div[role="rowheader"] > span,
    .ActionList-item-label,
    a.tree-browser-result > marked-text,
    .PRIVATE_TreeView-item-content > .PRIVATE_TreeView-item-content-text,
    .react-directory-filename-column h3,
    [aria-label="Parent directory"] div`,
	icon: `.octicon-file,
    .octicon-file-directory-fill,
    .octicon-file-directory-open-fill,
    .octicon-file-submodule,
    .react-directory-filename-column > svg,
    [aria-label="Parent directory"] svg`,
};

export const icons = {
	x: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>',
};

export const ATTRIBUTE_PREFIX = 'data-catppuccin-file-explorer-icons';
