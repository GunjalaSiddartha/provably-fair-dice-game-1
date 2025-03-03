import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let playerBalance = 1000;

const generateHash = (clientSeed, serverSeed) => {
  return crypto.createHash("sha256").update(clientSeed + serverSeed).digest("hex");
};

app.post("/roll-dice", (req, res) => {
  const { bet } = req.body;
  if (bet <= 0 || bet > playerBalance) {
    return res.status(400).json({ error: "Invalid bet amount" });
  }

  const serverSeed = crypto.randomBytes(16).toString("hex");
  const clientSeed = Date.now().toString();
  const hash = generateHash(clientSeed, serverSeed);
  const roll = Math.floor(Math.random() * 6) + 1;

  if (roll >= 4) {
    playerBalance += bet;
  } else {
    playerBalance -= bet;
  }

  res.json({ roll, newBalance: playerBalance, hash, seed: clientSeed });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));


app.get('/', (req, res) => {
  res.send('Backend is running');
});
