import * as React from "react";
import { Button, Title2, makeStyles } from "@fluentui/react-components";
import { Card, CardFooter, Caption2, CardPreview, Body1 } from "@fluentui/react-components";

const useStyles = makeStyles({
  title: {
    color: "#53164D"
  },
  card: {
    marginTop: "20px"
  }
})

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
            <Body1>{item.content}</Body1>
            <CardFooter>
              <Caption2>{item.url}</Caption2>
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
    <div style={{width: '260px', height: '400px', padding: '15px', borderRadius: "4px"}}>
      <Title2 className={styles.title}>Previous Explanations</Title2>
      <HistoryList />
    </div>
  );
}
