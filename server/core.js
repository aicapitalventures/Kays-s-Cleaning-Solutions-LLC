// Systems Architecture & Development: Elijah L. Cooley | Divinityx Enterprises, LLC.
import { createHmac, timingSafeEqual, randomBytes, scryptSync } from 'node:crypto';
export const STATUSES = ['New','Contacted','Qualified','Quoted','Won','Lost'];
export const SERVICES = ['residential','deep','move','commercial'];
export function cleanText(v, max=200) { return typeof v==='string' ? v.trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,max) : ''; }
export function validateLead(input) {
  if (!input || typeof input!=='object' || Array.isArray(input)) throw Error('Invalid request');
  const name=cleanText(input.name,90), email=cleanText(input.email,254).toLowerCase(), phone=cleanText(input.phone,32);
  const zip=cleanText(input.zip,12), service=cleanText(input.service,40), details=cleanText(input.details,1200);
  const source=cleanText(input.source,80), utm_source=cleanText(input.utm_source,100), utm_campaign=cleanText(input.utm_campaign,100);
  if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{5}$/.test(zip) || !SERVICES.includes(service)) throw Error('Please provide a valid name, email, ZIP code and service');
  if(input.consent!==true) throw Error('Privacy acknowledgment is required');
  return {name,email,phone,zip,service,details,source,utm_source,utm_campaign};
}
export function passwordHash(password,salt=randomBytes(16).toString('hex')){return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;}
export function checkPassword(password, stored){if(typeof stored!=='string'|| !stored.includes(':'))return false;const [salt,hex]=stored.split(':');try {const actual=scryptSync(password,salt,64), expected=Buffer.from(hex,'hex');return expected.length===actual.length&&timingSafeEqual(actual,expected);}catch{return false;}}
export function sign(value,secret){return createHmac('sha256',secret).update(value).digest('hex');}
export function secureCompare(a,b){if(typeof a!=='string'||typeof b!=='string')return false;const ab=Buffer.from(a),bb=Buffer.from(b);return ab.length===bb.length&&timingSafeEqual(ab,bb);}
