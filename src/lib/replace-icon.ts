import type { PublicPath } from 'wxt/browser';
import { browser } from 'wxt/browser';

import { selectors } from './constants';
import { associations } from '../vscode-icons.json';

export function replaceIconInRow(row: Element): void {
	// Get file/folder name.
	const fileName = (
		row.querySelector(selectors.filename) as HTMLElement
	).innerText
		?.split('/')[0]
		.trim();
	if (!fileName) return;

	const icon = row.querySelector(selectors.icon) as HTMLElement;
	if (!icon?.hasAttribute('data-catppuccin-extension'))
		replaceIcon(icon, fileName);
}

function replaceIcon(icon: HTMLElement, fileName: string): void {
	const isDir =
		icon.getAttribute('aria-label') === 'Directory' ||
		icon.classList.contains('octicon-file-directory-fill') ||
		icon.classList.contains('octicon-file-directory-open-fill') ||
		icon.classList.contains('icon-directory');
	const isSubmodule = icon.getAttribute('aria-label') === 'Submodule';

	const fileExtensions: string[] = [];
	// Avoid doing an explosive combination of extensions for very long filenames
	// (most file systems do not allow files > 255 length) with lots of `.` characters
	// https://github.com/microsoft/vscode/issues/116199
	if (fileName.length <= 255) {
		for (let i = 0; i < fileName.length; i += 1) {
			if (fileName[i] === '.') fileExtensions.push(fileName.slice(i + 1));
		}
	}

	const iconName = lookForMatch(fileName, fileExtensions, isDir, isSubmodule);

	replaceElementWithIcon(icon, iconName, fileName);
}

export function replaceElementWithIcon(
	icon: HTMLElement,
	iconName: string,
	fileName: string,
) {
	const svgFileName = `frappe/${iconName}.svg`;
	if (!svgFileName) return;

	const newSVG = document.createElement('img');
	newSVG.setAttribute('data-catppuccin-extension', 'icon');
	newSVG.setAttribute('data-catppuccin-extension-iconname', iconName);
	newSVG.setAttribute('data-catppuccin-extension-filename', fileName);
	newSVG.src = browser.runtime.getURL(svgFileName as PublicPath);

	icon
		.getAttributeNames()
		.forEach(
			(attr) =>
				attr !== 'src' &&
				!/^data-catppuccin-extension/.test(attr) &&
				newSVG.setAttribute(attr, icon.getAttribute(attr) as string),
		);

	const prevEl = icon.previousElementSibling;
	if (prevEl?.getAttribute('data-catppuccin-extension') === 'icon') {
		newSVG.replaceWith(prevEl);
	}
	// If the icon to replace is an icon from this extension, replace it with the new icon.
	else if (icon.getAttribute('data-catppuccin-extension') === 'icon') {
		icon.replaceWith(newSVG);
	}
	// If neither of the above, prepend the new icon in front of the original icon.
	// If we remove the icon, GitHub code view crashes when you navigate through the
	// tree view. Instead, we just hide it via `style` attribute (not CSS class).
	else {
		icon.style.display = 'none';
		icon.before(newSVG);
	}
}

function lookForMatch(
	fileName: string,
	fileExtensions: string[],
	isDir: boolean,
	isSubmodule: boolean,
): string {
	if (isSubmodule) return 'folder_git';

	if (!isDir) {
		if (fileName in associations.fileNames)
			return associations.fileNames[fileName];
		if (fileName.toLowerCase() in associations.fileNames)
			return associations.fileNames[fileName.toLowerCase()];

		for (const ext of fileExtensions) {
			if (ext in associations.fileExtensions)
				return associations.fileExtensions[ext];
			if (ext in associations.languageIds) return associations.languageIds[ext];
		}

		return '_file';
	} else {
		if (fileName in associations.folderNames)
			return associations.folderNames[fileName];
		if (fileName.toLowerCase() in associations.folderNames)
			return associations.folderNames[fileName.toLowerCase()];

		return '_folder';
	}
}
