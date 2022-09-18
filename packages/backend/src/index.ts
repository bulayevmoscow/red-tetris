import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { welcome } from './api/welcome';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get('/', (req: Request, res: Response) => {
  console.log(welcome);
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
