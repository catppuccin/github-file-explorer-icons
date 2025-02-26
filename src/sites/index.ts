import { forgejo } from './forgejo';
import { gitea } from './gitea';
import { github } from './github';
import { gitlab } from './gitlab';

export type FnWithContext<T> = (
	rowEl: HTMLElement,
	fileNameEl: HTMLElement,
	iconEl: HTMLElement,
) => T;

export type ReplacementSelectorSet = {
	row: string;
	filename: string;
	icon: string;
	isDirectory: FnWithContext<boolean>;
	isSubmodule: FnWithContext<boolean>;
	isCollapsable: FnWithContext<boolean>;
	styles?: string;
};

export type Site = {
	domains: Array<string>;
	replacements: Array<ReplacementSelectorSet>;
};

// import type { Site } from '.';
//
// export const mySite: SupportedSite = {
// 	urls: ['*://mysite.com/*'],
// 	replacements: [someImplementationFoo, someImplementationBar],
// 	styles: /* css */ `
// /* ... */
// `.trim(),
// };

export const sites: Array<Site> = [github, gitlab, gitea, forgejo];
export const matches: Array<string> = sites
	.flatMap((site) => site.domains)
	.map((domain) => `*://${domain}/*`);
