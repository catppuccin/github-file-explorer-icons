# Contributing

## Recommendations

- Before starting to work on a pull request, make sure a related issue exists or create one to discuss with the maintainers about the feature(s) you want for the project.
- We use [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)'s rules for creating explicit and meaningful commit messages.
- If it's your first time contributing to a project then you should look to the popular [first-contributions](https://github.com/firstcontributions/first-contributions) repository on GitHub. This will give you hands-on experience with the features of GitHub required to make a contribution. As always, feel free to join our [Discord](https://discord.com/servers/catppuccin-907385605422448742) to ask any questions and clarify your understanding, we are more than happy to help!

## Development

### Directory Structure

The repository is structured so different components live as independently as possible.

| Folder | Description |
|---|---|
| `assets/` | Previews of the extension in each flavor. |
| `vscode-icons/` | A submodule of https://github.com/catppuccin/vscode-icons, providing the SVG files that are bundled into the extension output. |
| `src/associations.ts` | Logic for merging the compiled associations list with user provided associations. |
| `src/constants.ts` | Values repeated throughout the extension; selectors, icons, etc. |
| `src/storage.ts` | Logic for dealing with the extension options and storing them. |
| `src/public` | Icons for the extension. See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/icons. |
| `src/entries` | Entry points for the extension. See https://wxt.dev/get-started/entrypoints.html. |
| `src/entries/background` | An entrypoint that sets up the custom domains feature. See https://github.com/fregante/webext-permission-toggle. |
| `src/entries/content` | The primary entrypoint containing the core functionality of the extension (injecting the icons into the file explorer). |
| `src/entries/popup` | An entrypoint for the extension options popup. |

### Setup

Make sure to clone the repository with `--recurse-submodules` to create the `vscode-icons/` submodule. This repository uses the [pnpm](https://pnpm.io/) package manager.

```bash
git clone --recurse-submodules https://github.com/catppuccin/github-file-explorer-icons.git
cd github-file-explorer-icons
pnpm install
```

### Scripts

We provide a set of npm scripts to make development and contribution easier:

| Script | Description |
|---|---|
| `check` | Run the [Biome](https://biomejs.dev/) formatter and linter. Add `--write` to apply fixes automatically (`pnpm check --write`). |
| `dev` | Launch a Chrome instance with the extension installed and hot reloading enabled. Use `dev:firefox` for a Firefox instance. |
| `build` | Build the Chrome extension to `dist/`. Use `build:firefox` to build the Firefox version. |
| `zip` | Build and zip the Chrome extension. Use `zip:firefox` to build and zip the Firefox version. |

## Releasing & Publishing

This repository uses [Release Please](https://github.com/googleapis/release-please) to scan commit messages and create release pull requests when needed. Once a release pull request is merged, Release Please will create a GitHub release with a auto-generated changelog, and [the publishing step](https://github.com/catppuccin/github-file-explorer-icons/blob/main/.github/workflows/release-please.yml#L22-L70) of the workflow is ran to publish the extension to the extension stores.

### API credentials

The [`pnpm wxt submit init` command](https://wxt.dev/get-started/publishing.html#automation) will walk you through each of the tokens that need to be added in order to submit the extension to all stores. This command will add the tokens to a `.env` file, though new tokens should be add/updated in the repository secrets instead as the automated workflow is preferred to manual publishing.

🎉 Happy contributing! 🎉
