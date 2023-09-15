// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'explain',
    title: 'Explain with Insight',
    type: 'normal',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  if (item.selectionText && tab) {
    // @ts-expect-error - @types/chrome does not contain `open` yet.
    await chrome.sidePanel.open({
      // We are tab-scoped, not global.
      tabId: tab.id,
    });
  }
});
