const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock pg Pool so we don't need a real database
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const { Pool } = require('pg');
const pool = new Pool();

// Build a minimal version of the app for testing
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running' });
});

app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || '']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tests
describe('Todo API', () => {

  test('GET / should return API running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Todo API is running');
  });

  test('GET /api/todos should return list of todos', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test todo', completed: false }] });
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/todos should create a new todo', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'New task', description: '', completed: false }] });
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'New task', description: '' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('New task');
  });

  test('POST /api/todos should fail if title is missing', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ description: 'no title here' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('DELETE /api/todos/:id should return 404 if todo not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).delete('/api/todos/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

});