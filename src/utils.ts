export function createStylesElement() {
	const id = 'catppuccin-icons-css-variables';

	let styles = document.querySelector(`#${id}`);

	if (!styles) {
		styles = document.createElement('style');
		styles.setAttribute('id', id);
		document.documentElement.appendChild(styles);
	}

	return styles;
}
