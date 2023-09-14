import {
  Body1,
  Button,
  Card,
  Divider,
  Skeleton,
  SkeletonItem,
  Title1,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';

const useStyles = makeStyles({
  page: {
    width: '260px', 
    minHeight: '400px',
  },
  title: {
    color: tokens.colorPaletteCranberryForeground2,
    marginBottom: tokens.spacingVerticalM,
  },
  row: {
    marginTop: tokens.spacingVerticalL,
    '> *:not(:last-child)': {
      marginRight: tokens.spacingHorizontalM,
    },
    // Combined, these two properties:
    // * Prevent the div from wrapping to the next line
    // * Allow the div to scroll horizontally
    // Giving a nice inline scroll experience.
    whiteSpace: 'nowrap',
    overflowX: 'auto',
  },
  easierHarder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  skeletonRowOne: {
    display: 'grid',
    alignItems: 'center',
    paddingBottom: tokens.spacingVerticalM,
    position: 'relative',
    ...shorthands.gap(tokens.spacingHorizontalM),
    gridTemplateColumns: "70fr 30fr",
  },
  skeletonRowTwo: {
    display: 'grid',
    alignItems: 'center',
    paddingBottom: tokens.spacingVerticalM,
    position: 'relative',
    ...shorthands.gap(tokens.spacingHorizontalM),
    gridTemplateColumns: "25fr 25fr 50fr",
  }
});

export default function Explanation({ selection, url }: { selection: string, url: string | undefined }) {
  const classes = useStyles();

  const [suggestedPerspectives, setPerspectives] = useState([]);
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  const [explanation, setExplanationContent] = useState();

  const newExplanation = async (explanation: string, viewpoints: string[], queries: string[]) => {
    setExplanationContent(explanation);
    setSuggestedQueries(queries || []);
    setPerspectives(viewpoints || []);

    let storage = await chrome.storage.local.get();

    let prevHistory = [];
    if ('history' in storage)
    {
      prevHistory = JSON.parse(storage['history']);
    }

    prevHistory.push({selection: selection, explanation: explanation, url: url, timestamp: Date.now()});

    await chrome.storage.local.set({'history': JSON.stringify(prevHistory)})
    
    console.log("Updated explanation list");

  };

  useEffect(() => {
    const abortController = new AbortController();
    setExplanationContent(undefined);
    window.fetch('https://elixbackend.fly.dev/explain', {
      method: 'POST',
      body: JSON.stringify({
        selection: selection,
        url: url,
      }),
      headers: {
        "Content-Type": "application/json"
      },
      signal: abortController.signal,
    }).then((response) => response.json()).then((json) => {
      console.log(json);
      newExplanation(json.explanation, json.suggested_viewpoints, json.suggested_queries);
    });
    return () => {
      abortController.abort();
    };
  }, [selection]);

  return (
    <div className={classes.page} style={{padding: '15px'}}>
      <Title1 className={classes.title}>EliX</Title1>
      <Card>
        <Body1>
          {selection}
        </Body1>
        <Divider />
        <Body1>
          {explanation
            ? explanation
            : <Skeleton>
              <div className={classes.skeletonRowOne}>
                <SkeletonItem />
                <SkeletonItem />
              </div>
              <div className={classes.skeletonRowTwo}>
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
              </div>
            </Skeleton>}
        </Body1>
      </Card>
      <div className={classes.row}>
        { suggestedQueries.map((q) => {
          return <Button size="small">{q}</Button>
        })}
      </div>
      <div className={classes.row}>
        { suggestedPerspectives.map((q) => {
          return <Button size="small">{q}</Button>
        })}
      </div>
      <div className={mergeClasses(classes.row, classes.easierHarder)}>
        <Button>Easier</Button>
        <Button>Harder</Button>
      </div>
    </div>
  );
}
