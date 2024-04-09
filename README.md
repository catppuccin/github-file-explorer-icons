<h3 align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png" width="100" alt="Logo"/><br/>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
	Catppuccin for <a href="https://github.com">GitHub File Explorer Icons</a>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/catppuccin/github-file-explorer-icons/stargazers"><img src="https://img.shields.io/github/stars/catppuccin/github-file-explorer-icons?colorA=363a4f&colorB=b7bdf8&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/github-file-explorer-icons/issues"><img src="https://img.shields.io/github/issues/catppuccin/github-file-explorer-icons?colorA=363a4f&colorB=f5a97f&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/github-file-explorer-icons/contributors"><img src="https://img.shields.io/github/contributors/catppuccin/github-file-explorer-icons?colorA=363a4f&colorB=a6da95&style=for-the-badge"></a>
</p>

<p align="center">
	<img src="assets/previews/preview.webp"/>
</p>

## Previews

<details>
<summary>🌻 Latte</summary>
<img src="assets/previews/latte.webp"/>
</details>
<details>
<summary>🪴 Frappé</summary>
<img src="assets/previews/frappe.webp"/>
</details>
<details>
<summary>🌺 Macchiato</summary>
<img src="assets/previews/macchiato.webp"/>
</details>
<details>
<summary>🌿 Mocha</summary>
<img src="assets/previews/mocha.webp"/>
</details>

## Usage

<p align="center">
  <a href="https://addons.mozilla.org/en-US/firefox/addon/catppuccin-gh-file-explorer/"><img src="https://img.shields.io/badge/Firefox_Add--ons-f5a97f?style=for-the-badge&logo=Firefox-Browser&logoColor=white"></a>
  <a href="https://chromewebstore.google.com/detail/catppuccin-for-github-fil/lnjaiaapbakfhlbjenjkhffcdpoompki"><img src="https://img.shields.io/badge/Chrome_Web_Store-b7bdf8?style=for-the-badge&logo=GoogleChrome&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/Microsoft_Edge_Add--ons-7dc4e4?style=for-the-badge&logo=Microsoft-edge&logoColor=white"></a>
</p>

### Manually

```bash
git clone --recurse-submodules https://github.com/catppuccin/github-file-explorer-icons.git && cd github-file-explorer-icons
pnpm install
```

#### Chrome

1. Run `pnpm build`.
1. Open the Extensions page by navigating to `chrome://extensions`.
1. Enable Developer Mode by flipping the toggle switch labeled **Developer mode**.
1. Click the **Load unpacked** button and select the `dist/chrome-mv3` directory from the cloned repository.

#### Firefox

1. Run `pnpm zip:firefox`.
1. Open the Add-ons page by navigating to `about:addons`.
1. Click the cog/settings icon in line with the "Manage Your Extensions" heading, and select **Debug Add-ons**.
1. Click the **Load Temporary Add-on...** button and select the `dist/catppuccin-github-icons-extension-<version>-firefox.zip` file from the cloned repository.

## Development

### Setup

```bash
git clone --recurse-submodules https://github.com/catppuccin/github-file-explorer-icons.git && cd github-file-explorer-icons
pnpm install
```

### Usage

To launch a browser instance with the extension loaded and a GitHub page already opened, run `pnpm dev` for Chrome or `pnpm dev:firefox` for Firefox. Please note that it takes a while to open since it re-copies all icons from the submodule to the public folder.

To build the extension, run either:

- `pnpm build`, where the compiled extension will be available at `dist/chrome-mv3`...
- or `pnpm zip:firefox`, where the compiled and _zipped_ extension can be found at `dist/catppuccin-github-file-explorer-icons-<version>-firefox.zip`.

## 💝 Thanks to

- [uncenter](https://github.com/uncenter)
- [Claudiohbsantos/github-material-icons-extension](https://github.com/Claudiohbsantos/github-material-icons-extension)

&nbsp;

<p align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/footers/gray0_ctp_on_line.svg?sanitize=true" />
</p>

<p align="center">
	Copyright &copy; 2021-present <a href="https://github.com/catppuccin" target="_blank">Catppuccin Org</a>
</p>

<p align="center">
	<a href="https://github.com/catppuccin/catppuccin/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8"/></a>
</p>
