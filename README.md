# Free AI Radar

Chrome extension that tracks free AI model tiers, trial limits, and providers.

## Stack

HTML, CSS, JavaScript, Chrome Extensions API (Manifest V3).

## Features

- Provider directory for OpenRouter, Google Gemini, Groq, Mistral, Pollinations, and OpenAI.
- Free offer descriptions and known usage limits, with links to provider documentation or signup.
- Refresh button to reload the bundled provider list from `data.json`.
- Local caching with `chrome.storage` and cached-data fallback if loading fails.
- Dark, responsive popup UI and links to community-maintained provider lists.

Provider offers and limits can change. Check each provider's linked page for current terms. OpenAI's free ChatGPT plan does not include free API usage.

## Install

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome and enable **Developer mode**.
3. Click **Load unpacked** and select the `free-ai-radar` folder.
4. Pin the extension and click its icon to open the provider directory.
