const { MongoClient } = require('mongodb');
const dns = require('node:dns');

const seedBooks = require('../frontend/data/catalogue.json').map(({ id, available, ...book }) => ({ ...book, _id: id }));

// Never expose the embedded reservations (including other users' IDs) in the catalogue.
function publicBook(book) {
  return { id: book._id, title: book.title, author: book.author, isbn: book.isbn,
    description: book.description, category: book.category, copies: book.copies, color: book.color, available: book.copies > 0 };
}

async function connectDatabase({ uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', dbName = process.env.MONGODB_DB || 'library_reserve' } = {}) {
  const dnsServers = process.env.MONGODB_DNS_SERVERS;
  if (dnsServers) dns.setServers(dnsServers.split(',').map(value => value.trim()).filter(Boolean));
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');
    const sessions = db.collection('sessions');
    const books = db.collection('books');
    await Promise.all([
      users.createIndex({ email: 1 }, { unique: true }),
      users.createIndex({ studentId: 1 }, { unique: true }),
      sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 }),
      books.createIndex({ 'reservations.userId': 1 }),
    ]);
    for (const book of seedBooks) {
      const { description, ...initialBook } = book;
      await books.updateOne({ _id: book._id }, {
        $set: { description },
        $setOnInsert: { ...initialBook, reservations: [] },
      }, { upsert: true });
    }
    return {
      close: () => client.close(),
      ping: () => db.command({ ping: 1 }),
      findUser: email => users.findOne({ email }),
      addUser: user => users.insertOne({ ...user, _id: user.id }),
      addSession: (token, userId, expires) => sessions.insertOne({ _id: token, userId, expires }),
      findSession: token => sessions.findOne({ _id: token, expires: { $gt: new Date() } }),
      removeSession: token => sessions.deleteOne({ _id: token }),
      catalogue: async () => (await books.find({}, { projection: { reservations: 0 } }).sort({ _id: 1 }).toArray()).map(publicBook),
      reservations: async userId => {
        const matches = await books.find({ 'reservations.userId': userId }).toArray();
        return matches.flatMap(book => book.reservations.filter(r => r.userId === userId).map(r => ({
          ...publicBook(book), reservationId: r.id, pickupDate: r.pickupDate,
          pickupWindow: r.pickupWindow, pickupCode: r.pickupCode,
        })));
      },
      reserve: async (bookId, reservation) => {
        // Inventory and its active reservations share one document. This conditional
        // update is atomic even on standalone MongoDB; no replica set is required.
        const result = await books.updateOne({ _id: bookId, copies: { $gt: 0 },
          'reservations.userId': { $ne: reservation.userId } }, {
          $inc: { copies: -1 }, $push: { reservations: reservation },
        });
        return result.modifiedCount === 1;
      },
      cancel: async (id, userId) => {
        const result = await books.updateOne({ reservations: { $elemMatch: { id, userId } } }, {
          $inc: { copies: 1 }, $pull: { reservations: { id, userId } },
        });
        return result.modifiedCount === 1;
      },
    };
  } catch (error) { await client.close(); throw error; }
}

module.exports = { connectDatabase };