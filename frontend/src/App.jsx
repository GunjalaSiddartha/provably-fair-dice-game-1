import { useState } from "react";
import crypto from "crypto";

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);
  const [rollResult, setRollResult] = useState(null);
  const [hash, setHash] = useState("");

  const generateHash = (clientSeed, serverSeed) => {
    return crypto.createHash("sha256").update(clientSeed + serverSeed).digest("hex");
  };

  const rollDice = () => {
    if (bet <= 0 || bet > balance) {
      alert("Invalid bet amount!");
      return;
    }

    const serverSeed = crypto.randomBytes(16).toString("hex");
    const clientSeed = Date.now().toString();
    const hash = generateHash(clientSeed, serverSeed);
    const roll = Math.floor(Math.random() * 6) + 1;

    setBalance((prevBalance) => prevBalance + (roll >= 4 ? bet : -bet));
    setRollResult(roll);
    setHash(hash);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Provably Fair Dice Game</h1>
      <p className="mb-2">Balance: ${balance}</p>
      <input
        type="number"
        placeholder="Enter bet amount"
        value={bet}
        onChange={(e) => setBet(Number(e.target.value))}
        className="p-2 border-2 border-purple-500 rounded mb-2"
      />
      <button
        onClick={rollDice}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
      >
        Roll Dice
      </button>
      {rollResult !== null && <p className="mt-4">You rolled: {rollResult}</p>}
      {hash && <p className="text-xs mt-2">SHA-256 Hash: {hash}</p>}
    </div>
  );
}
