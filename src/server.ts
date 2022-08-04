import express from 'express';

const app = express();

app.get('/', (_, res) => {
  res.json({ message: "It works! " });
});

export default app;
