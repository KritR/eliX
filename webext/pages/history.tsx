import * as React from "react";
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

  const listItems = [
    {
      id: 1,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      url: "https://google.com",
      date: "August 2020",
    },
    {
      id: 2,
      content: "Lorem ipsome dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      url: "https://google.com",
      date: "August 2020",
    },
    {
      id: 3,
      content: "Hello there my pricy",
      url: "https://google.com",
      date: "June 2020",
    },
  ];

  return (
    <div>
      {listItems.map((item) => {
        return (
          <Card key={item.id} className={styles.card}>
            <Body1>{truncateText(item.content, 150)}</Body1>
            <CardFooter className={styles.footer}>
              <Caption1>{item.date}</Caption1>
              
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
