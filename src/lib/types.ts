import icons from '@/icons.json';

export type Flavor = 'latte' | 'frappe' | 'macchiato' | 'mocha';

export type IconName = keyof typeof icons;

export type Associations = {
	languageIds: Record<string, IconName>;
	fileExtensions: Record<string, IconName>;
	fileNames: Record<string, IconName>;
	folderNames: Record<string, IconName>;
};
