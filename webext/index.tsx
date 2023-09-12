import { render } from 'react-dom';
import {
  FluentProvider,
  webLightTheme,
  Title1,
  Card,
  Body1,
  Divider,
  Skeleton,
  SkeletonItem,
  makeStyles,
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';

const useStyles = makeStyles({
  root: {
    color: webLightTheme.colorPaletteCranberryForeground2,
    marginBottom: webLightTheme.spacingVerticalM,
  }
});

function App({ selection, url }: { selection: string | undefined, url: string | undefined }) {
  const classes = useStyles();

  const [explanation, setExplanation] = useState();
  useEffect(() => {
    const abortController = new AbortController();
    setExplanation(undefined);
    window.fetch('https://elixbackend.fly.dev/explain', {
      method: 'POST',
      body: JSON.stringify({
        selection,
        url,
      }),
      signal: abortController.signal,
    }).then((response) => response.json()).then((json) => {
      setExplanation(json.explanation);
    });
    return () => {
      abortController.abort();
    };
  }, [selection]);

  return (
    <FluentProvider theme={webLightTheme}>
      <Title1 className={classes.root}>EliX</Title1>
      <Card>
        <Body1>
          {selection ?? 'Nothing'}
        </Body1>
        <Divider />
        <Body1>
          {explanation
            ? explanation
            : <Skeleton>
              <SkeletonItem />
              <SkeletonItem />
            </Skeleton>}
        </Body1>
      </Card>
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

async function getSelection(tab: chrome.tabs.Tab | undefined) {
  if (tab?.id === undefined) {
    return undefined;
  }

  const [{ result }] = await chrome.scripting.executeScript({
    func: () => {
      const selection = window.getSelection();
      if (selection?.type === 'Range') {
        return selection.toString();
      }
      return undefined;
    },
    target: {
      tabId: tab.id,
    }
  });

  return result;
}

const selection = await getSelection(tab);

const rootElement = document.getElementById('root');
render(<App selection={selection} url={tab.url} />, rootElement);
