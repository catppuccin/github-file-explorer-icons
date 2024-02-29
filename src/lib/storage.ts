import type { Flavor } from './types';

export const flavor = storage.defineItem<Flavor>('local:flavor', {
	defaultValue: 'mocha',
});
