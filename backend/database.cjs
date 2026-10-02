const { MongoClient } = require('mongodb');

const seedBooks = [
  { _id: '1', title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self Development', copies: 3, color: '#FFD9A0' },
  { _id: '2', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0061122415', category: 'Fiction', copies: 1, color: '#CFE7FF' },
  { _id: '3', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Computing', copies: 0, color: '#E1D7FF' },
  { _id: '4', title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '978-0857197689', category: 'Finance', copies: 2, color: '#CFF3DF' },
];

// Never expose the embedded reservations (including other users' IDs) in the catalogue.
function publicBook(book) {
  return { id: book._id, title: book.title, author: book.author, isbn: book.isbn,
    category: book.category, copies: book.copies, color: book.color, available: book.copies > 0 };
}

async function connectDatabase({ uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', dbName = process.env.MONGODB_DB || 'library_reserve' } = {}) {
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
      await books.updateOne({ _id: book._id }, { $setOnInsert: { ...book, reservations: [] } }, { upsert: true });
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
