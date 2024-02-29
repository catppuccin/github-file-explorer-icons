import type { PublicPath } from 'wxt/browser';

export type Flavor = 'latte' | 'frappe' | 'macchiato' | 'mocha';

type RemoveIconPrefixAndSuffix<T extends string> =
	T extends `/${Flavor}/${infer Rest}.svg` ? Rest : never;
export type IconName = RemoveIconPrefixAndSuffix<PublicPath>;
