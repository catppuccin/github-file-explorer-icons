import './styles.css';

import type { Flavor } from '@/lib/types';

import { flavor } from '@/lib/storage';

async function init() {
	const flavorEl = document.querySelector('#flavor') as HTMLSelectElement;

	flavorEl.value = await flavor.getValue();
	document.documentElement.setAttribute('theme', flavorEl.value);

	flavorEl.addEventListener('change', async ({ target }) => {
		const value = (target as HTMLSelectElement).value as Flavor;
		await flavor.setValue(value);
		document.documentElement.setAttribute('theme', value);
	});
}

init();
