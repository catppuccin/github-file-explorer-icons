import type { IconName } from '@/types';

import { getAssociations } from '@/associations';
import { ATTRIBUTE_PREFIX, SELECTORS } from '@/constants';
import { flavor, monochrome, specificFolders } from '@/storage';
import { createStylesElement } from '@/utils';

import { flavors } from '@catppuccin/palette';

import icons from '@/icons.json';

export async function injectStyles() {
	const styles = createStylesElement();

	styles.textContent = /* css */ `
:root {
  ${flavors[await flavor.getValue()].colorEntries
		.map(([name, { hex }]) => `--ctp-${name}: ${hex};`)
		.join('\n  ')}
}

.PRIVATE_TreeView-directory-icon svg {
	display: none !important;
}

svg[${ATTRIBUTE_PREFIX}-iconname$='_open']:has(~ svg.octicon-file-directory-open-fill:not([data-catppuccin-file-explorer-icons])),
svg:not([${ATTRIBUTE_PREFIX}-iconname$='_open']):has(~ svg.octicon-file-directory-fill:not([data-catppuccin-file-explorer-icons])),
svg[${ATTRIBUTE_PREFIX}]:has(+ .octicon-file) {
	display: inline-block !important;
}
`.trim();
}

async function createIconElement(
	iconName: IconName,
	fileName: string,
	originalIcon: HTMLElement,
): Promise<SVGSVGElement> {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	if (await monochrome.getValue()) {
		svg.innerHTML = icons[iconName].replaceAll(
			/var\(--ctp-\w+\)/g,
			'var(--ctp-text)',
		);
	} else {
		svg.innerHTML = icons[iconName];
	}
	svg.setAttribute(ATTRIBUTE_PREFIX, '');
	svg.setAttribute(`${ATTRIBUTE_PREFIX}-iconname`, iconName);
	svg.setAttribute(`${ATTRIBUTE_PREFIX}-filename`, fileName);

	for (const attribute of originalIcon.getAttributeNames()) {
		if (!attribute.startsWith(ATTRIBUTE_PREFIX)) {
			svg.setAttribute(
				attribute,
				originalIcon.getAttribute(attribute) as string,
			);
		}
	}

	return svg;
}

export async function replaceIconInRow(row: HTMLElement) {
	const icon = row.querySelector(SELECTORS.icon) as HTMLElement;
	if (icon && !icon?.hasAttribute(ATTRIBUTE_PREFIX))
		await replaceIcon(icon, row);
}

export async function replaceIcon(icon: HTMLElement, row: HTMLElement) {
	const fileNameEl = row.querySelector(SELECTORS.filename) as HTMLElement;
	if (!fileNameEl) return;
	const fileName = fileNameEl.textContent
		?.split('/')
		.at(0)
		.trim()
		/* Remove [Unicode LEFT-TO-RIGHT MARK](https://en.wikipedia.org/wiki/Left-to-right_mark) used on GitLab's merge request diff file tree. */
		.replace(/\u200E/g, '');

	const isDir =
		icon.getAttribute('aria-label') === 'Directory' ||
		icon.getAttribute('class')?.includes('octicon-file-directory-') ||
		icon.classList.contains('icon-directory') ||
		icon.classList.contains('folder-icon');
	const isSubmodule =
		icon.classList.contains('octicon-file-submodule') ||
		fileNameEl.getAttribute('aria-label')?.includes('(Submodule)');
	const isOpen =
		isDir && icon.classList.contains('octicon-file-directory-open-fill');

	const fileExtensions: Array<string> = [];
	// Avoid doing an explosive combination of extensions for very long filenames
	// (most file systems do not allow files > 255 length) with lots of `.` characters
	// https://github.com/microsoft/vscode/issues/116199
	if (fileName.length <= 255) {
		for (let i = 0; i < fileName.length; i += 1) {
			if (fileName[i] === '.')
				fileExtensions.push(fileName.toLowerCase().slice(i + 1));
		}
	}

	const iconName = await findIconMatch(
		fileName,
		fileExtensions,
		isDir,
		isSubmodule,
	);

	await replaceElementWithIcon(
		icon,
		isOpen ? (`${iconName}_open` as IconName) : iconName,
		fileName,
	);
}

export async function replaceElementWithIcon(
	icon: HTMLElement,
	iconName: IconName,
	fileName: string,
) {
	const replacement = await createIconElement(iconName, fileName, icon);

	const prevEl = icon.previousElementSibling;
	if (prevEl?.hasAttribute(ATTRIBUTE_PREFIX)) {
		replacement.replaceWith(prevEl);
	}
	// If the icon to replace is an icon from this extension, replace it with the new icon.
	else if (icon.hasAttribute(ATTRIBUTE_PREFIX)) {
		icon.replaceWith(replacement);
	}
	// If neither of the above, prepend the new icon in front of the original icon.
	// If we remove the icon, GitHub code view crashes when you navigate through the
	// tree view. Instead, we just hide it via `style` attribute (not CSS class).
	else {
		icon.style.display = 'none';
		icon.before(replacement);
	}

	if (
		icon.parentElement.classList.contains('PRIVATE_TreeView-directory-icon')
	) {
		const companion = await createIconElement(
			(iconName.includes('_open')
				? iconName.replace('_open', '')
				: `${iconName}_open`) as IconName,
			fileName,
			icon,
		);

		replacement.after(companion);
	}
}

async function findIconMatch(
	fileName: string,
	fileExtensions: Array<string>,
	isDir: boolean,
	isSubmodule: boolean,
): Promise<IconName> {
	// Special parent directory folder icon.
	if (fileName === '..') return '_folder';

	const associations = await getAssociations();
	const useSpecificFolders = await specificFolders.getValue();

	if (useSpecificFolders && isSubmodule) return 'folder_git';

	if (isDir) {
		if (useSpecificFolders) {
			if (fileName in associations.folderNames)
				return associations.folderNames[fileName];
			if (fileName.toLowerCase() in associations.folderNames)
				return associations.folderNames[fileName.toLowerCase()];
		}

		return '_folder';
	}

	if (fileName in associations.fileNames)
		return associations.fileNames[fileName];
	if (fileName.toLowerCase() in associations.fileNames)
		return associations.fileNames[fileName.toLowerCase()];

	for (const ext of fileExtensions) {
		if (ext in associations.fileExtensions)
			return associations.fileExtensions[ext];
		if (ext in associations.languageIds)
			return associations.languageIds[ext];
	}

	return '_file';
}
