import './styles.css';

import type { Associations, Flavor, IconName } from '@/lib/types';

import { customAssociations, flavor } from '@/lib/storage';
import { icons } from '@/lib/constants';

async function init() {
	const flavorEl = document.querySelector('#flavor') as HTMLSelectElement;

	flavorEl.value = await flavor.getValue();
	document.documentElement.setAttribute('theme', flavorEl.value);

	flavorEl.addEventListener('change', async ({ target }) => {
		const value = (target as HTMLSelectElement).value as Flavor;
		await flavor.setValue(value);
		document.documentElement.setAttribute('theme', value);
	});

	const associations = await customAssociations.getValue();

	for (const [key, el] of Object.entries({
		fileExtensions: document.querySelector(
			'ul#associations-file-extensions',
		),
		fileNames: document.querySelector('ul#associations-file-names'),
		folderNames: document.querySelector('ul#associations-folder-names'),
	} as Record<keyof Associations, HTMLUListElement>) as [
		keyof Associations,
		HTMLUListElement,
	][]) {
		for (const [association, icon] of Object.entries(associations[key])) {
			const li = document.createElement('li');
			const inputA = document.createElement('input');
			const inputB = document.createElement('input');
			const del = document.createElement('button');

			del.className = 'delete';
			del.innerHTML = icons['x'];

			inputA.value = association;
			inputA.setAttribute('required', 'true');

			inputB.value = icon;
			inputB.setAttribute('required', 'true');

			li.appendChild(inputA);
			li.appendChild(inputB);
			li.appendChild(del);
			el.appendChild(li);

			del.addEventListener('click', async () => {
				if (inputA.checkValidity()) {
					delete associations[key][association];
					await customAssociations.setValue(associations);
					li.remove();
				}
			});
			inputA.addEventListener('change', async () => {
				if (inputA.checkValidity()) {
					delete associations[key][association];
					associations[key][inputA.value] = icon;
					await customAssociations.setValue(associations);
				}
			});
			inputB.addEventListener('change', async () => {
				if (inputB.checkValidity()) {
					associations[key][association] = inputB.value as IconName;
					await customAssociations.setValue(associations);
				}
			});
		}

		function addEmpty() {
			const li = document.createElement('li');
			const inputA = document.createElement('input');
			const inputB = document.createElement('input');
			const del = document.createElement('button');

			del.className = 'delete';
			del.innerHTML = icons['x'];

			inputA.setAttribute('required', 'true');
			inputB.setAttribute('required', 'true');

			li.appendChild(inputA);
			li.appendChild(inputB);
			li.appendChild(del);
			el.appendChild(li);

			del.addEventListener('click', async () => {
				if (inputA.checkValidity()) {
					delete associations[key][inputA.value];
					await customAssociations.setValue(associations);
					li.remove();
				}
			});

			let addedEmpty = false;

			inputA.addEventListener('change', async () => {
				if (inputA.checkValidity()) {
					delete associations[key][inputA.value];
					associations[key][inputA.value] = inputB.value as IconName;
					await customAssociations.setValue(associations);
				}
				if (
					!addedEmpty &&
					inputA.checkValidity() &&
					inputB.checkValidity()
				) {
					addEmpty();
					addedEmpty = true;
				}
			});
			inputB.addEventListener('change', async () => {
				if (inputB.checkValidity()) {
					associations[key][inputA.value] = inputB.value as IconName;
					await customAssociations.setValue(associations);
				}
				if (
					!addedEmpty &&
					inputA.checkValidity() &&
					inputB.checkValidity()
				) {
					addEmpty();
					addedEmpty = true;
				}
			});
		}

		addEmpty();
	}
}

init();
