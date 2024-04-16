import type { Associations } from './types';

import { customAssociations } from './storage';

import json from '@/associations.json';

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
