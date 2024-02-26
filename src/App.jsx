import { useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";

function App() {
  const [gameState, setGameState] = useState("start");
  const [level, setLevel] = useState(null);

  switch (gameState) {
    case "start":
      return (
        <StartScreen
          start={(levels) => {
            setGameState("play");
            setLevel(levels);
          }}
        />
      );
    case "play":
      return <PlayScreen level={level} end={() => setGameState("start")} />;
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
