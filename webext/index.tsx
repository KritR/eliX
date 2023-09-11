import { render } from 'react-dom';
import {
  FluentProvider,
  webLightTheme,
  Button
} from '@fluentui/react-components';

function App({ selection }: { selection: string | undefined }) {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">{selection ?? 'Nothing'}</Button>
    </FluentProvider>
  );
}

async function getCurrentTab() {
  const queryOptions = {
    active: true,
    lastFocusedWindow: true
  } satisfies chrome.tabs.QueryInfo;
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const tab = await getCurrentTab();
const selection = tab?.id ? (await chrome.scripting.executeScript({
  func: () => window.getSelection()?.toString(),
  target: {
    tabId: tab.id
  }
}))[0].result : undefined;

const rootElement = document.getElementById('root');
render(<App selection={selection} />, rootElement);
