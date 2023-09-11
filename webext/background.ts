// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'explain',
    title: "ELIX Explanation",
    type: 'normal',
    contexts: ['selection']
  });
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const id = item.menuItemId;
  const url = new URL(`https://google.com/search`);
  url.searchParams.set('q', item.selectionText);
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

