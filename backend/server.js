import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Dynamic port for Render

// ✅ Allow frontend to access backend
app.use(cors({ origin: '*' }));  
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

  playerBalance += roll >= 4 ? bet : -bet;

  res.json({ roll, newBalance: playerBalance, hash, seed: clientSeed });
});

// ✅ Test route to check backend is working
app.get('/test', (req, res) => {
  res.send('Backend is working on Render!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
