export type Flavor = 'latte' | 'frappe' | 'macchiato' | 'mocha';

export const flavor = storage.defineItem<Flavor>('local:flavor', {
	defaultValue: 'mocha',
});
