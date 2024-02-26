import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center w-[350px] py-5 bg-pink-50 rounded-xl flex-col">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">Memory</h1>
        <p className="text-lg text-pink-500 mb-3">
          Flip over tiles looking for pairs
        </p>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => start(1)}
            className="w-48 bg-gray-400 text-white py-2 px-10 rounded-full bg-gradient-to-b from-pink-400 to-pink-600 shadow-lg active:bg-pink-600"
          >
            Level 1
          </button>
          <button
            onClick={() => start(2)}
            className="w-48 bg-gray-400 text-white py-2 px-10 rounded-full bg-gradient-to-b from-pink-400 to-pink-600 shadow-lg active:bg-pink-600"
          >
            Level 2
          </button>
          <button
            onClick={() => start(3)}
            className="w-48 bg-gray-400 text-white py-2 px-10 rounded-full bg-gradient-to-b from-pink-400 to-pink-600 shadow-lg active:bg-pink-600"
          >
            Level 3
          </button>
        </div>

        <button
          onClick={() => start(Math.floor(Math.random() * 3) + 1)}
          className="w-32 bg-gray-400 text-white py-2  rounded-full bg-gradient-to-b from-pink-400 to-pink-600 shadow-lg active:bg-pink-600 mt-3"
        >
          Play Random
        </button>
      </div>
    </div>
  );
}

export function PlayScreen({ level, end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  const calcGrid = (level) => {
    switch (level) {
      case 1:
        return [2, 2, 2];
      case 2:
        return [8, 4, 4];
      case 3:
        return [10, 4, 5];

      default:
        break;
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col gap-5 items-center justify-center">
        <h1 className="text-3xl text-indigo-500 font-bold">Level {level}</h1>
        <div className="flex gap-3 items-center">
          <div className="text-indigo-500 font-semibold text-lg">Tries</div>
          <div className="text-indigo-500 bg-indigo-200 rounded-md px-3">
            {tryCount}
          </div>
        </div>

        <div
          className="grid bg-indigo-50 rounded-xl p-3 gap-3 size-[350px]"
          style={{
            gridTemplateColumns: `repeat(${calcGrid(level)[1]}, minmax(0,1fr))`,
            gridTemplateRows: `repeat(${calcGrid(level)[2]}, minmax(0,1fr))`,
          }}
        >
          {getTiles(calcGrid(level)[0] * 2).map((tile, i) => (
            <Tile key={i} flip={() => flip(i)} {...tile} />
          ))}
        </div>
      </div>
      {tryCount}
    </>
  );
}
