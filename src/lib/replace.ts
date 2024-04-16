import type { IconName } from '@/lib/types';

import { ATTRIBUTE_PREFIX, selectors } from '@/lib/constants';
import { flavor, specificFolders } from '@/lib/storage';
import { getAssociations } from './associations';
import { flavors } from '@catppuccin/palette';

import icons from '@/icons.json';

export async function setCssVariables() {
	let styles = document.querySelector('#catppuccin-icons-css-variables');
	if (!styles) {
		styles = document.createElement('style');
		styles.setAttribute('id', 'catppuccin-icons-css-variables');
		document.documentElement.appendChild(styles);
	}

	styles.textContent = `:root {
${flavors[await flavor.getValue()].colorEntries
	.map(([name, { hex }]) => `  --ctp-${name}: ${hex};`)
	.join('\n')}
}
/* Hide folder open/closed icons from new code view tree when clicked by disabling
   display of those icons when they immediately follow the replaced icon. */
.PRIVATE_TreeView-directory-icon svg {
	display: none !important;
}
svg[${ATTRIBUTE_PREFIX}-iconname$='_open']:has(~ svg.octicon-file-directory-open-fill:not([data-catppuccin-file-explorer-icons])),
svg:not([${ATTRIBUTE_PREFIX}-iconname$='_open']):has(~ svg.octicon-file-directory-fill:not([data-catppuccin-file-explorer-icons])),
svg[${ATTRIBUTE_PREFIX}]:has(+ .octicon-file) {
	display: inline-block !important;
}
`;
}

export async function replaceIconInRow(row: HTMLElement) {
	const icon = row.querySelector(selectors.icon) as HTMLElement;
	if (icon && !icon?.hasAttribute(ATTRIBUTE_PREFIX))
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
	let replacement = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'svg',
	);
	replacement.innerHTML = icons[iconName];
	replacement.setAttribute(ATTRIBUTE_PREFIX, '');
	replacement.setAttribute(`${ATTRIBUTE_PREFIX}-iconname`, iconName);
	replacement.setAttribute(`${ATTRIBUTE_PREFIX}-filename`, fileName);

	for (const attribute of icon.getAttributeNames()) {
		if (!attribute.startsWith(ATTRIBUTE_PREFIX)) {
			replacement.setAttribute(
				attribute,
				icon.getAttribute(attribute) as string,
			);
		}
	}

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
		let companion = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg',
		);
		iconName = (
			iconName.includes('_open')
				? iconName.replace('_open', '')
				: iconName + '_open'
		) as IconName;
		companion.innerHTML = icons[iconName];
		companion.setAttribute(ATTRIBUTE_PREFIX, '');
		companion.setAttribute(`${ATTRIBUTE_PREFIX}-iconname`, iconName);
		companion.setAttribute(`${ATTRIBUTE_PREFIX}-filename`, fileName);

		for (const attribute of icon.getAttributeNames()) {
			if (!attribute.startsWith(ATTRIBUTE_PREFIX)) {
				companion.setAttribute(
					attribute,
					icon.getAttribute(attribute) as string,
				);
			}
		}

		replacement.after(companion);
	}
}

async function findIconMatch(
	fileName: string,
	fileExtensions: string[],
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
