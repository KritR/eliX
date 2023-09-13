import * as React from "react";
import { useEffect, useState } from 'react';
import { Button, Title2, makeStyles } from "@fluentui/react-components";
import { Card, CardFooter, Caption1, CardPreview, Body1, Link } from "@fluentui/react-components";
import { Link24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  page: {
    width: '260px', 
    minHeight: '400px',
  },
  title: {
    color: "#53164D"
  },
  card: {
    marginTop: "20px",
    marginBottom: "20px"
  },
  footer: {
    color: '#765C5C',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

function truncateText(str: string, chars: number)
{
  if (str.length > (chars - 3))
  {
    return str.substring(0, (chars - 3)) + "...";
  }
  else
  {
    return str;
  }
}

function HistoryList(_) {
  const styles = useStyles();

  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const fetchStoredData = async () => {
      const store = await chrome.storage.local.get();
      if ('history' in store)
      {
        setHistory(JSON.parse(store['history']));
      }
    }

    fetchStoredData().catch(err => console.log(err));
  })

  return (
    <div>
      {history.reverse().map((item) => {
        return (
          <Card key={item.timestamp} className={styles.card}>
            <Body1>{truncateText(item.selection, 150)}</Body1>
            <CardFooter className={styles.footer}>
              <Caption1>{new Date(item.timestamp).toDateString()}</Caption1>
              
              <Link appearance="subtle" inline={true} onClick={() => { 
                chrome.tabs.create({ url: item.url});
              }} href={item.url}>{truncateText(item.url, 20)}</Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default function History() {
  const styles = useStyles();

  return (
    <div className={styles.page} style={{padding: '15px'}}>
      <Title2 className={styles.title}>Previous Explanations</Title2>
      <HistoryList />
    </div>
  );
}
