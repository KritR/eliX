import {
  Body1,
  Button,
  Card,
  Divider,
  Skeleton,
  SkeletonItem,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';

const useStyles = makeStyles({
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
    <>
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
        <Button>Search query 1</Button>
        <Button>Search query 2</Button>
        <Button>Search query 3</Button>
      </div>
      <div className={classes.row}>
        <Button>Perspective 1</Button>
        <Button>Perspective 2</Button>
        <Button>Perspective 3</Button>
      </div>
      <div className={mergeClasses(classes.row, classes.easierHarder)}>
        <Button>Easier</Button>
        <Button>Harder</Button>
      </div>
    </>
  );
}
