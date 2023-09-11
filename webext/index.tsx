import { render } from "react-dom";
import {
  FluentProvider,
  webLightTheme,
  Button
} from "@fluentui/react-components";

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">ELiX</Button>
    </FluentProvider>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
