import type { Flavor } from '@/lib/types';

import { flavor } from '@/lib/storage';

async function init() {
	const flavorEl = document.querySelector('#flavor') as HTMLSelectElement;
	flavorEl.value = await flavor.getValue();
	flavorEl.addEventListener(
		'change',
		async ({ target }) =>
			await flavor.setValue((target as HTMLSelectElement).value as Flavor),
	);
}

init();
