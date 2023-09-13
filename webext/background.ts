// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'explain',
    title: 'ELIX Explanation',
    type: 'normal',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  if (item.selectionText && tab) {
    await chrome.action.openPopup();
  }
});
