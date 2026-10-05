const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { MongoClient } = require('mongodb');
const { createApp } = require('./server.js');

test('accounts, inventory, ownership, concurrent reservations and persistence', async () => {
  // Always use a new, isolated database, never the application's database.
  const dbName = 'library_test_' + randomUUID().replaceAll('-', '');
  const uri = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017';
  let server;
  let base;
  const start = async () => {
    server = await createApp({ uri, dbName });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}/api`;
  };
  const stop = async () => {
    await new Promise(resolve => server.close(resolve));
    await server.databaseClosed;
  };
  const request = async (route, method='GET', body, token) => {
    const response = await fetch(base+route, {method, headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
    return {status:response.status,...await response.json()};
  };
  try {
    await start();
    assert.equal((await request('/health')).status, 'ok');
    assert.equal((await request('/reservations')).status,401);
    const details = {name:'Test Reader', studentId:'S001', email:'reader@example.edu', password:'password123'};
    const first = await request('/auth/register','POST',details);
    assert.equal(first.status,201); assert.ok(first.token); assert.equal(first.user.password,undefined);
    assert.equal((await request('/auth/register','POST',details)).status,409);
    assert.equal((await request('/auth/login','POST',{...details,password:'incorrect'})).status,401);
    assert.equal((await request('/auth/login','POST',details)).status,200);
    const second = await request('/auth/register','POST',{...details,studentId:'S002',email:'second@example.edu'});
    const third = await request('/auth/register','POST',{...details,studentId:'S003',email:'third@example.edu'});
    const pickup = {bookId:'1',pickupDate:new Date(Date.now()+86400000).toISOString().slice(0,10),pickupWindow:'4-6 PM'};
    assert.equal((await request('/reservations','POST',{...pickup,pickupDate:'2026-02-30'},first.token)).status,400);
    const reserved = await request('/reservations','POST',pickup,first.token);
    assert.equal(reserved.status,201);
    assert.equal(reserved.books.find(b=>b.id==='1').copies,2);
    assert.equal(reserved.reservation.pickupWindow,'4-6 PM');
    assert.equal((await request('/reservations','POST',pickup,first.token)).status,409);
    assert.equal((await request('/reservations/'+reserved.reservation.reservationId,'DELETE',null,second.token)).status,404);
    assert.equal((await request('/reservations', 'GET',null,second.token)).reservations.length,0);
    const race = await Promise.all([second,third].map(u=>request('/reservations','POST',{...pickup,bookId:'2'},u.token)));
    assert.deepEqual(race.map(r=>r.status).sort(),[201,409]);
    assert.equal((await request('/books?q=alchemist')).books[0].copies,0);
    const publicBooks = (await request('/books')).books;
    assert.ok(publicBooks.every(book => !('reservations' in book) && !('_id' in book)));
    const duplicateRace = await Promise.all([1,2].map(()=>request('/reservations','POST',{...pickup,bookId:'4'},first.token)));
    assert.deepEqual(duplicateRace.map(r=>r.status).sort(),[201,409]);
    const duplicateReservation = duplicateRace.find(r=>r.status===201).reservation;
    const cancelRace = await Promise.all([1,2].map(()=>request('/reservations/'+duplicateReservation.reservationId,'DELETE',null,first.token)));
    assert.deepEqual(cancelRace.map(r=>r.status).sort(),[200,404]);
    assert.equal((await request('/books?q=Psychology')).books[0].copies,2);
    assert.equal((await request('/reservations','POST',{...pickup,bookId:'3'},first.token)).status,409);
    await stop(); await start();
    const mine = await request('/reservations','GET',null,first.token);
    assert.equal(mine.reservations[0].pickupCode,reserved.reservation.pickupCode);
    const cancelled = await request('/reservations/'+reserved.reservation.reservationId,'DELETE',null,first.token);
    assert.equal(cancelled.books.find(b=>b.id==='1').copies,3);
    assert.equal(cancelled.reservations.length,0);
    assert.equal((await request('/reservations/'+reserved.reservation.reservationId,'DELETE',null,first.token)).status,404);
    await request('/auth/logout','POST',{},first.token);
    assert.equal((await request('/reservations','GET',null,first.token)).status,401);
  } finally {
    if(server?.listening) await stop();
    const cleanup = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
      await cleanup.connect();
      if (/^library_test_[a-f0-9]{32}$/.test(dbName)) await cleanup.db(dbName).dropDatabase();
    } finally { await cleanup.close(); }
  }
});