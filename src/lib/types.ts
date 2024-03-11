import type { PublicPath } from 'wxt/browser';

export type Flavor = 'latte' | 'frappe' | 'macchiato' | 'mocha';

type RemoveIconPrefixAndSuffix<T extends string> =
	T extends `/${Flavor}/${infer Rest}.svg` ? Rest : never;
export type IconName = RemoveIconPrefixAndSuffix<PublicPath>;

export type Associations = {
	languageIds: Record<string, IconName>;
	fileExtensions: Record<string, IconName>;
	fileNames: Record<string, IconName>;
	folderNames: Record<string, IconName>;
};
