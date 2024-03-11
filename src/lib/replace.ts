import type { PublicPath } from 'wxt/browser';
import type { IconName } from '@/lib/types';

import { selectors } from '@/lib/constants';
import { flavor, specificFolders } from '@/lib/storage';
import { getAssociations } from './associations';

export async function replaceIconInRow(row: HTMLElement) {
	const icon = row.querySelector(selectors.icon) as HTMLElement;
	if (icon && !icon?.hasAttribute('data-catppuccin-extension'))
		await replaceIcon(icon, row);
}

export async function replaceIcon(icon: HTMLElement, row: HTMLElement) {
	const fileNameEl = row.querySelector(selectors.filename) as HTMLElement;
	if (!fileNameEl) return;
	const fileName = fileNameEl.textContent?.split('/')[0].trim();

	const isDir =
		icon.getAttribute('aria-label') === 'Directory' ||
		icon.getAttribute('class')?.includes('octicon-file-directory-') ||
		icon.classList.contains('icon-directory');
	const isSubmodule =
		icon.classList.contains('octicon-file-submodule') ||
		fileNameEl
			.querySelector('a')
			?.getAttribute('aria-label')
			.includes('(Submodule)');
	const isOpen =
		isDir && icon.classList.contains('octicon-file-directory-open-fill');

	const fileExtensions: string[] = [];
	// Avoid doing an explosive combination of extensions for very long filenames
	// (most file systems do not allow files > 255 length) with lots of `.` characters
	// https://github.com/microsoft/vscode/issues/116199
	if (fileName.length <= 255) {
		for (let i = 0; i < fileName.length; i += 1) {
			if (fileName[i] === '.') fileExtensions.push(fileName.slice(i + 1));
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
		isOpen ? ((iconName + '_open') as IconName) : iconName,
		fileName,
	);
}

export async function replaceElementWithIcon(
	icon: HTMLElement,
	iconName: IconName,
	fileName: string,
) {
	const replacement = document.createElement('img');
	replacement.setAttribute('data-catppuccin-extension', 'icon');
	replacement.setAttribute('data-catppuccin-extension-iconname', iconName);
	replacement.setAttribute('data-catppuccin-extension-filename', fileName);
	replacement.src = browser.runtime.getURL(
		`${await flavor.getValue()}/${iconName}.svg` as PublicPath,
	);

	icon.getAttributeNames().forEach(
		(attr) =>
			attr !== 'src' &&
			!/^data-catppuccin-extension/.test(attr) &&
			replacement.setAttribute(attr, icon.getAttribute(attr) as string),
	);

	const prevEl = icon.previousElementSibling;
	if (prevEl?.getAttribute('data-catppuccin-extension') === 'icon') {
		replacement.replaceWith(prevEl);
	}
	// If the icon to replace is an icon from this extension, replace it with the new icon.
	else if (icon.getAttribute('data-catppuccin-extension') === 'icon') {
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
		const button =
			icon.parentElement.parentElement.parentElement
				.previousElementSibling;
		const row = button.parentElement;
		button.addEventListener('click', () => {
			if (replacement.src.includes('_open')) {
				replacement.setAttribute('data-do-not-touch', 'true');
				replacement.src = replacement.src.replace('_open', '');
			} else {
				replacement.src = replacement.src.replace('.svg', '_open.svg');
			}
		});
		row.addEventListener('click', () => {
			if (
				!replacement.src.includes('_open') &&
				replacement.getAttribute('data-do-not-touch') !== 'true'
			) {
				replacement.src = replacement.src.replace('.svg', '_open.svg');
			}
		});
	}
}

async function findIconMatch(
	fileName: string,
	fileExtensions: string[],
	isDir: boolean,
	isSubmodule: boolean,
): Promise<IconName> {
	// Special parent directory folder icon:
	if (fileName === '..') return '_folder';

	if (isSubmodule) return 'folder_git';

	const associations = await getAssociations();

	if (isDir) {
		if (await specificFolders.getValue()) {
			if (fileName in associations.folderNames)
				return associations.folderNames[fileName];
			if (fileName.toLowerCase() in associations.folderNames)
				return associations.folderNames[fileName.toLowerCase()];
		}

		return '_folder';
	} else {
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
}

export function replaceAllIcons() {
	for (const icon of document.querySelectorAll(
		'img[data-catppuccin-extension-iconname]',
	) as NodeListOf<HTMLElement>) {
		const iconName = icon.getAttribute(
			'data-catppuccin-extension-iconname',
		) as IconName;
		const fileName = icon.getAttribute(
			'data-catppuccin-extension-filename',
		);
		if (iconName && fileName)
			replaceElementWithIcon(icon, iconName, fileName);
	}
}
