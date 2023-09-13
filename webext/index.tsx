import { render } from 'react-dom';
import History from './pages/history';
import {
  FluentProvider,
  webLightTheme,
  Body1,
  Title1,
  makeStyles,
  tokens,
  shorthands
} from '@fluentui/react-components';
import Explanation from './explanation';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
  },
  title: {
    color: tokens.colorPaletteCranberryForeground2,
    marginBottom: tokens.spacingVerticalM,
  }
});

function App({ selection, url }: { selection: string | undefined, url: string | undefined }) {
  const classes = useStyles();

  return (
    <FluentProvider theme={webLightTheme} className={classes.root}>
      <Title1 className={classes.title}>EliX</Title1>
      {
        selection
          ? <Explanation selection={selection} url={url} />
          : <History />
      }
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
