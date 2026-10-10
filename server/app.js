// Kay's Cleaning Solutions Sprint 01 — Systems Architecture & Development: Elijah L. Cooley | Divinityx Enterprises, LLC.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {validateLead, passwordHash, checkPassword, sign, secureCompare, STATUSES} from './core.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const PORT=Number(process.env.PORT||3000), SESSION_SECRET=process.env.SESSION_SECRET||'';
const OWNER_PASSWORD=process.env.OWNER_PASSWORD||'', INTAKE_ENABLED=process.env.INTAKE_ENABLED==='true';
const PROD=process.env.NODE_ENV==='production';
if(SESSION_SECRET.length<32||OWNER_PASSWORD.length<12){console.error('Set SESSION_SECRET (32+ characters) and OWNER_PASSWORD (12+ characters)');process.exit(1);}
if(PROD&&(!process.env.PUBLIC_ORIGIN||!process.env.PUBLIC_ORIGIN.startsWith('https://'))){console.error('HTTPS PUBLIC_ORIGIN required in production');process.exit(1);}
if(PROD&&INTAKE_ENABLED&&process.env.KCS_RELEASE_APPROVED!=='true'){console.error('Production intake requires explicit KCS_RELEASE_APPROVED=true after launch review');process.exit(1);}
const DB_FILE=process.env.DATABASE_PATH||path.join(root,'kcs.sqlite');
fs.mkdirSync(path.dirname(path.resolve(DB_FILE)),{recursive:true});
const db=new DatabaseSync(DB_FILE);db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=3000;');
db.exec(`CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, zip TEXT NOT NULL, service TEXT NOT NULL, details TEXT, source TEXT, utm_source TEXT, utm_campaign TEXT, status TEXT NOT NULL DEFAULT 'New', note TEXT NOT NULL DEFAULT '', consent_at TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (id_hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS notification_outbox (id TEXT PRIMARY KEY, lead_id TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);`);
const attempts=new Map();
const now=()=>new Date().toISOString();
const reply=(res,status,obj,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});res.end(JSON.stringify(obj));};
const cookie=(req,name)=>{const c=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='));return c?.slice(name.length+1)||'';};
function auth(req){const token=cookie(req,'kcs_session');if(!/^[a-f0-9]{64}$/.test(token))return null;const key=sign(token,SESSION_SECRET);const row=db.prepare('SELECT * FROM sessions WHERE id_hash=? AND expires_at>?').get(key,Date.now());return row||null;}
function sameOrigin(req){const origin=req.headers.origin;const expected=process.env.PUBLIC_ORIGIN || `http://${req.headers.host}`;return origin===expected;}
function rateLimit(req,scope,limit,interval){const ip=req.socket.remoteAddress||'unknown';const key=scope+':'+ip;const t=Date.now();const current=attempts.get(key)||[];const kept=current.filter(ts=>ts>t-interval);kept.push(t);attempts.set(key,kept);if(attempts.size>10000){for(const [k,v] of attempts)if(v.every(ts=>ts<t-interval))attempts.delete(k);}return kept.length<=limit;}
async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>12000)throw Error('Request too large');}return JSON.parse(text||'{}');}
async function notifyPending(){if(!process.env.RESEND_API_KEY||!process.env.NOTIFICATION_TO||!process.env.NOTIFICATION_FROM)return;
 const entries=db.prepare("SELECT * FROM notification_outbox WHERE state='pending' AND attempts<3 LIMIT 5").all();
 for(const entry of entries){const lead=db.prepare('SELECT id, service, created_at FROM leads WHERE id=?').get(entry.lead_id);if(!lead)continue;
 try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':entry.id},body:JSON.stringify({from:process.env.NOTIFICATION_FROM,to:[process.env.NOTIFICATION_TO],subject:'New KCS inquiry — owner review',text:`A new ${lead.service} inquiry was received at ${lead.created_at}. Sign in to the owner dashboard to review. Reference ${lead.id}.`}),signal:AbortSignal.timeout(6000)});
 if(!r.ok)throw Error('Email provider status '+r.status);
 db.prepare("UPDATE notification_outbox SET state='sent',attempts=attempts+1,updated_at=? WHERE id=?").run(now(),entry.id);
 }catch(e){db.prepare('UPDATE notification_outbox SET attempts=attempts+1,last_error=?,updated_at=? WHERE id=?').run(String(e.message).slice(0,180),now(),entry.id);}
 }}
function file(res,filename,type){try{const b=fs.readFileSync(path.join(root,'public',filename));res.writeHead(200,{'Content-Type':type,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",'Referrer-Policy':'strict-origin-when-cross-origin'});res.end(b);}catch{reply(res,404,{error:'Not found'});}}
const server=http.createServer(async(req,res)=>{const u=new URL(req.url,'http://localhost');const pathname=u.pathname;
try {
 if(req.method==='GET' && pathname==='/')return file(res,'index.html','text/html; charset=utf-8');
 if(req.method==='GET' && pathname==='/owner')return file(res,'owner.html','text/html; charset=utf-8');
 if(req.method==='GET' && pathname==='/app.js')return file(res,'app.js','text/javascript; charset=utf-8');
 if(req.method==='GET' && pathname==='/style.css')return file(res,'style.css','text/css; charset=utf-8');
 if(req.method==='GET' && pathname==='/api/health')return reply(res,200,{ok:true,intakeEnabled:INTAKE_ENABLED,notificationsConfigured:!!(process.env.RESEND_API_KEY&&process.env.NOTIFICATION_TO&&process.env.NOTIFICATION_FROM)});
 if(req.method==='POST' && pathname==='/api/login'){
 if(!sameOrigin(req))return reply(res,403,{error:'Origin rejected'});
 if(!rateLimit(req,'login',5,15*60000))return reply(res,429,{error:'Too many attempts'});
 const data=await body(req);
 // Hash comparison avoids plain-text password comparison; supplied secret is provisioned via environment.
 const valid=checkPassword(String(data.password||''),passwordHash(OWNER_PASSWORD,'kcs-owner-static-salt'));
 if(!valid)return reply(res,401,{error:'Invalid credentials'});
 const token=randomBytes(32).toString('hex'),csrf=randomBytes(24).toString('hex');db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(sign(token,SESSION_SECRET),csrf,Date.now()+8*3600000);
 return reply(res,200,{ok:true,csrf},{'Set-Cookie':`kcs_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${PROD?'; Secure':''}`});
 }
 if(req.method==='GET'&&pathname==='/api/session'){const session=auth(req);return session?reply(res,200,{authenticated:true,csrf:session.csrf}):reply(res,401,{authenticated:false});}
 if(req.method==='POST'&&pathname==='/api/inquiries'){
 if(!INTAKE_ENABLED)return reply(res,503,{error:'Customer intake is not activated'});
 if(!sameOrigin(req))return reply(res,403,{error:'Origin rejected'});
 if(!rateLimit(req,'lead',4,3600000))return reply(res,429,{error:'Please try again later'});
 const input=await body(req);if(input.website)return reply(res,200,{received:true});
 const lead=validateLead(input),id=randomBytes(16).toString('hex'),time=now();
 db.prepare('INSERT INTO leads (id,name,email,phone,zip,service,details,source,utm_source,utm_campaign,consent_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,lead.name,lead.email,lead.phone,lead.zip,lead.service,lead.details,lead.source,lead.utm_source,lead.utm_campaign,time,time,time);
 db.prepare('INSERT INTO notification_outbox (id,lead_id,created_at,updated_at) VALUES (?,?,?,?)').run(randomBytes(16).toString('hex'),id,time,time);
 void notifyPending();return reply(res,201,{received:true,reference:id});
 }
 if(pathname.startsWith('/api/owner/')||pathname==='/api/logout'){
 const session=auth(req);if(!session)return reply(res,401,{error:'Sign in required'});
 if(req.method!=='GET'&&(!sameOrigin(req)||!secureCompare(String(req.headers['x-csrf-token']||''),session.csrf)))return reply(res,403,{error:'Invalid request token'});
 if(req.method==='GET'&&pathname==='/api/owner/leads')return reply(res,200,{leads:db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 250').all()});
 if(req.method==='GET'&&pathname==='/api/owner/notifications')return reply(res,200,{notifications:db.prepare('SELECT id,lead_id,state,attempts,last_error,created_at FROM notification_outbox ORDER BY created_at DESC LIMIT 100').all()});
 if(req.method==='PATCH'&&pathname.startsWith('/api/owner/leads/')){
 const id=pathname.split('/').at(-1),change=await body(req),status=String(change.status||''),note=String(change.note||'').trim();
 if(!STATUSES.includes(status)||note.length>1200)return reply(res,400,{error:'Invalid status or note'});
 const result=db.prepare('UPDATE leads SET status=?,note=?,updated_at=? WHERE id=?').run(status,note,now(),id);
 return result.changes?reply(res,200,{updated:true}):reply(res,404,{error:'Lead not found'});
 }
 if(req.method==='POST'&&pathname==='/api/owner/retry-notifications'){await notifyPending();return reply(res,200,{ok:true});}
 if(req.method==='POST'&&pathname==='/api/logout'){db.prepare('DELETE FROM sessions WHERE id_hash=?').run(sign(cookie(req,'kcs_session'),SESSION_SECRET));return reply(res,200,{ok:true},{'Set-Cookie':`kcs_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${PROD?'; Secure':''}`});}
 }
 return reply(res,404,{error:'Not found'});
}catch(e){if(e instanceof SyntaxError)return reply(res,400,{error:'Invalid JSON'});if(/Invalid request|Please provide|Privacy acknowledgment|Request too large/.test(e.message))return reply(res,400,{error:e.message});console.error('Request failed:',e.message);return reply(res,500,{error:'Request could not be completed'});}
});
server.listen(PORT,()=>console.log(`KCS Sprint 01 on port ${PORT}; intake ${INTAKE_ENABLED?'ENABLED':'DISABLED'}`));