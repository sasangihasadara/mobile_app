const http = require('node:http');
const { connectDatabase } = require('./database.cjs');
const { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } = require('node:crypto');

const digest = value => createHash('sha256').update(value).digest('hex');
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
async function createApp(options = {}) {
  const db = await connectDatabase(options);
  const catalogue = () => db.catalogue();
  const reservations = userId => db.reservations(userId);
  const session = async user => {
    const token = randomBytes(32).toString('hex');
    await db.addSession(digest(token), user.id, new Date(Date.now()+7*86400000));
    return {token,user:{id:user.id,name:user.name,email:user.email,studentId:user.studentId}};
  };
  const attempts = new Map();
  const server = http.createServer(async (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:8081');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, OPTIONS');
    res.setHeader('Cache-Control','no-store');
    const send = (status,data) => {res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};
    if(req.method==='OPTIONS') {res.writeHead(204);res.end();return;}
    try {
      const url = new URL(req.url,'http://localhost');
      const route = url.pathname;
      let body = {};
      if(req.method==='POST') {
        let raw='';
        for await (const chunk of req) {raw+=chunk; if(Buffer.byteLength(raw)>16384) fail(413,'Request too large.');}
        try {body=JSON.parse(raw || '{}');} catch {fail(400,'Invalid JSON.');}
        if(!body || typeof body!=='object' || Array.isArray(body)) fail(400,'Invalid request.');
      }
      if(req.method==='GET' && route==='/api/health') { await db.ping(); return send(200,{status:'ok'}); }
      if(req.method==='GET' && route==='/api/books') {
        const q=(url.searchParams.get('q')||'').toLowerCase();
        return send(200,{books:(await catalogue()).filter(b=>`${b.title} ${b.author} ${b.isbn} ${b.category}`.toLowerCase().includes(q))});
      }
      if(req.method==='POST' && ['/api/auth/register','/api/auth/login'].includes(route)) {
        const now=Date.now();
        for(const [key,value] of attempts) if(value.until<now) attempts.delete(key);
        const key=req.socket.remoteAddress;
        const entry=attempts.get(key)||{count:0,until:now+60000};
        attempts.set(key,entry); if(++entry.count>20) fail(429,'Too many attempts. Try again in a minute.');
        const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || typeof body.password!=='string' || body.password.length<8 || body.password.length>128) fail(400,'Enter a valid email and a password of 8–128 characters.');
        if(route.endsWith('/register')) {
          if(typeof body.name!=='string'||!body.name.trim()||body.name.length>120||typeof body.studentId!=='string'||!body.studentId.trim()||body.studentId.length>80) fail(400,'Name and student ID are required.');
          const salt=randomBytes(16).toString('hex');
          const user={id:randomUUID(),name:body.name.trim(),studentId:body.studentId.trim(),email};
          try { await db.addUser({...user,salt,password:scryptSync(body.password,salt,64).toString('hex')}); }
          catch(error) { if(error.code===11000) fail(409,'Email or student ID already registered.'); throw error; }
          return send(201,await session(user));
        }
        const user=await db.findUser(email);
        const hash=scryptSync(body.password,user?.salt||'invalid-account',64);
        if(!user||!timingSafeEqual(hash,Buffer.from(user.password,'hex'))) fail(401,'Email or password is incorrect.');
        return send(200,await session(user));
      }
      const token=(req.headers.authorization||'').replace(/^Bearer /,'');
      const auth=await db.findSession(digest(token));
      if(!auth) fail(401,'Please sign in to continue.');
      if(req.method==='POST' && route==='/api/auth/logout') {await db.removeSession(digest(token));return send(200,{ok:true});}
      if(req.method==='GET' && route==='/api/reservations') return send(200,{reservations:await reservations(auth.userId)});
      if(req.method==='POST' && route==='/api/reservations') {
        if(typeof body.bookId!=='string'||typeof body.pickupDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(body.pickupDate||'')||!['9-11 AM','12-2 PM','4-6 PM'].includes(body.pickupWindow)) fail(400,'Choose a valid pickup date and window.');
        const date=new Date(body.pickupDate+'T00:00:00Z');
        const today=new Date().toISOString().slice(0,10);
        if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==body.pickupDate||body.pickupDate<today||date.getTime()>Date.now()+8*86400000) fail(400,'Pickup must be within the next seven days.');
        const reservation = {id:randomUUID(),userId:auth.userId,pickupDate:body.pickupDate,
          pickupWindow:body.pickupWindow,pickupCode:'LB-'+randomBytes(5).toString('hex').toUpperCase()};
        if(!await db.reserve(body.bookId,reservation)) fail(409,'This book is unavailable or you already reserved it.');
        const mine = await reservations(auth.userId);
        return send(201,{reservation:mine.find(r=>r.reservationId===reservation.id),books:await catalogue(),reservations:mine});
      }
      if(req.method==='DELETE' && route.startsWith('/api/reservations/')) {
        if(!await db.cancel(route.split('/').pop(),auth.userId)) fail(404,'Reservation not found.');
        return send(200,{books:await catalogue(),reservations:await reservations(auth.userId)});
      }
      fail(404,'Endpoint not found.');
    } catch(error) {if(!error.status) console.error(error);send(error.status||500,{message:error.status?error.message:'Server error. Please try again.'});}
  });
  server.closeDatabase = () => db.close();
  server.on('close',()=> { server.databaseClosed = db.close(); });
  return server;
}
if(require.main===module) {
  createApp().then(server => {
    server.on('error', async () => { console.error('Cannot start API listener. Check PORT.'); await server.closeDatabase(); process.exitCode=1; });
    server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Library API connected to MongoDB; running on port '+(process.env.PORT||3000)));
    for(const signal of ['SIGINT','SIGTERM']) process.once(signal,()=>server.close());
  }).catch(() => { console.error('Cannot connect to MongoDB. Check backend/.env, database access and whether MongoDB is running.'); process.exitCode=1; });
}
module.exports={createApp};
