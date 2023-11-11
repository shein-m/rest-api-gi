// відповідь повина мати статус-код 200
// у відповіді повинен повертатися токен
// у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

const request = require('supertest');
const BASE_URL = 'http://localhost:3000';

describe('test signIn controller', () => {
  test('respons must be status 200', async () => {
    const res = await request(BASE_URL).post('/api/users/login').send({
      email: 'test@gmail.com',
      password: '111111',
    });

    expect(res.status).toBe(200);
  });

  test('response data have fields as email and subscription', async () => {
    const res = await request(BASE_URL).post('/api/users/login').send({
      email: 'test@gmail.com',
      password: '111111',
    });

    expect(res.body).toEqual(
      expect.objectContaining({
        user: {
          email: 'test@gmail.com',
          subscription: 'starter',
        },
      })
    );
  });

  test('response data have token field', async () => {
    const res = await request(BASE_URL).post('/api/users/login').send({
      email: 'test@gmail.com',
      password: '111111',
    });

    expect(res.body.token).toBeDefined();
  });
});
