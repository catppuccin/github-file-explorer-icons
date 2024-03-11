import type { Associations } from './types';

import { associations as json } from '@/vscode-icons.json';
import { customAssociations } from './storage';

export async function getAssociations(): Promise<Associations> {
	const custom = await customAssociations.getValue();

	return {
		languageIds: json.languageIds as Associations['languageIds'],
		fileExtensions: {
			...json.fileExtensions,
			...custom.fileExtensions,
		} as Associations['languageIds'],
		fileNames: {
			...json.fileNames,
			...custom.fileNames,
		} as Associations['fileNames'],
		folderNames: {
			...json.folderNames,
			...custom.folderNames,
		} as Associations['folderNames'],
	};
}
