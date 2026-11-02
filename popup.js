const DATA_URL = chrome.runtime.getURL("data.json");
const CACHE_KEY = "providers";

const grid = document.querySelector("#provider-grid");
const status = document.querySelector("#status");
const refreshButton = document.querySelector("#refresh-button");

function isProvider(value) {
  return value !== null
    && typeof value === "object"
    && typeof value.name === "string"
    && typeof value.description === "string"
    && typeof value.limits === "string"
    && typeof value.url === "string"
    && typeof value.category === "string"
    && isSafeUrl(value.url);
}

function isSafeUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validateProviders(value) {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isProvider)) {
    throw new Error("Файл каталога имеет неверный формат.");
  }
  return value;
}

function createCard(provider) {
  const card = document.createElement("article");
  card.className = "provider-card";

  const heading = document.createElement("div");
  heading.className = "card-heading";

  const name = document.createElement("h2");
  name.textContent = provider.name;

  const category = document.createElement("span");
  category.className = "category";
  category.textContent = provider.category;

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = provider.description;

  const limits = document.createElement("p");
  limits.className = "limits";
  limits.textContent = provider.limits;

  const link = document.createElement("a");
  link.className = "visit-link";
  link.href = provider.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Перейти ↗";
  link.setAttribute("aria-label", `Перейти: ${provider.name}`);

  heading.append(name, category);
  card.append(heading, description, limits, link);
  return card;
}

function renderProviders(providers) {
  grid.replaceChildren(...providers.map(createCard));
}

function setStatus(message, state = "info") {
  status.textContent = message;
  status.dataset.state = state;
}

async function loadProviders() {
  refreshButton.disabled = true;
  setStatus("Загружаем каталог…");

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Не удалось загрузить каталог (HTTP ${response.status}).`);
    }

    const providers = validateProviders(await response.json());
    renderProviders(providers);

    try {
      await chrome.storage.local.set({ [CACHE_KEY]: providers });
      setStatus(`Каталог обновлён · ${providers.length} провайдеров`);
    } catch (error) {
      setStatus(`Каталог обновлён, но кэш не сохранён: ${error.message}`, "warning");
    }
  } catch (error) {
    try {
      const cached = await chrome.storage.local.get(CACHE_KEY);
      const providers = validateProviders(cached[CACHE_KEY]);
      renderProviders(providers);
      setStatus(`Не удалось обновить каталог. Показаны сохранённые данные. ${error.message}`, "warning");
    } catch (cacheError) {
      grid.replaceChildren();
      setStatus(`Не удалось загрузить каталог: ${error.message} ${cacheError.message}`, "error");
    }
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", loadProviders);
loadProviders();
