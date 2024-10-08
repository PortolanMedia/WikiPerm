# WikiPerm
## v1.0.0

WikiPerm is a simple userscript to automatically redirect selected Wikimedia pages to the most recent permanent link- aka "current revision" or "OldID".

## Installation

Install from URL using [this link](https://raw.githubusercontent.com/PortolanMedia/WikiPerm/main/WikiPerm.js) or copy and pase the script directly into [Violentmonkey](https://violentmonkey.github.io/) or your userscript manager of choice. Can also upload WikiPerm.js directly into Tampermonkey.

## Features

1. Automatically redirects [selected](##-wikimedia-pages) Wikimedia pages to the most recent permanent link. Includes mobile links as well.
2. Revert button will direct your browser to the original page (without ```&oldid=```).
3. Back button returns browser to the last unique page. 
4. Excludes main pages and certain internal/special URLs.

## Wikimedia Pages
**Supported**
- Wikipedia.org | **Supported**
- Wiktionary.org | **Supported**
- Wikibooks.org | **Supported**
- Wikivoyage.org | **Supported**
- Wikimedia.org | **Supported**

Not supported:
- Wikisource | *Not yet supported*
- Wikispecies | *Not yet supported*
- Wikinews | *Not yet supported*
- Wikiversity | *Not yet supported*
- Wikidata | *Not yet supported*
- Wikifunctions | *Not yet supported*

## Notes

Developed for [Violentmonkey](https://violentmonkey.github.io/) and works in Tampermonkey as well. Tested in Firefox and Chrome. 

This is my first script built from scratch (shoutout to ChatGPT and Copilot for their assistance) and I have next to no idea what I'm doing. Friendly input is more than welcome.
You can contact me [here](mailto:portolanmedia+wikiperm@gmail.com).

## License

[MIT](https://choosealicense.com/licenses/mit/)
