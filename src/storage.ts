import type { Associations, Flavor } from './types';

export const flavor = storage.defineItem<Flavor>('local:flavor', {
	fallback: 'mocha',
});

export const customAssociations = storage.defineItem<Associations>(
	'local:associations',
	{
		fallback: {
			languageIds: {},
			fileExtensions: {},
			fileNames: {},
			folderNames: {},
		},
	},
);

export const specificFolders = storage.defineItem<boolean>(
	'local:specificFolders',
	{ fallback: true },
);

export const monochrome = storage.defineItem<boolean>('local:monochrome', {
	fallback: false,
});
