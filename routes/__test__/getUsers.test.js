import { it, expect, describe } from 'vitest';

const supertest = require("supertest");
const express = require('express');
// const routes = require("../userRoutes");
const appn = require("../../app")

const app = express();
const request = supertest(appn);
// app.use(routes);

it('get all users', async () => {
    const response = await request.get('/api/users').expect('Content-Type', /json/);
    const a = 2;
    console.log(response.body);
  
    expect(response.body.name).toBeDefined();
  });

