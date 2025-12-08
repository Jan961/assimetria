import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const port = Number(process.env.PORT ?? 3000);
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<{ now: string }>('SELECT NOW() as now');
    res.json({
      status: 'ok',
      dbTime: result.rows[0].now
    });
  } catch (error) {
    console.error('DB health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed'
    });
  }
});

app.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from Node backend (TS)' });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});
