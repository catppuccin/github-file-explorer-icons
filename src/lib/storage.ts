import type { Associations, Flavor } from './types';

export const flavor = storage.defineItem<Flavor>('local:flavor', {
	defaultValue: 'mocha',
});

export const customAssociations = storage.defineItem<Associations>(
	'local:associations',
	{
		defaultValue: {
			languageIds: {},
			fileExtensions: {},
			fileNames: {},
			folderNames: {},
		},
	},
);
