// Systems Architecture & Development: Elijah L. Cooley | Divinityx Enterprises, LLC.
import test from 'node:test';import assert from 'node:assert/strict';import {validateLead,passwordHash,checkPassword,sign,secureCompare} from '../server/core.js';
const valid={name:'Test Customer',email:'TEST@example.com',zip:'47708',service:'residential',consent:true};
test('validates accepted service inquiry',()=>{const x=validateLead(valid);assert.equal(x.email,'test@example.com');assert.equal(x.service,'residential');});
test('rejects missing consent',()=>assert.throws(()=>validateLead({...valid,consent:false}),/Privacy/));
test('rejects invalid zipcode',()=>assert.throws(()=>validateLead({...valid,zip:'abc'}),/valid name/));
test('rejects unapproved service',()=>assert.throws(()=>validateLead({...valid,service:'hazmat'}),/valid name/));
test('sanitizes control characters and bounds details',()=>assert.equal(validateLead({...valid,details:'A\u0000'.repeat(900)}).details.length,1200));
test('password hashing verifies correct secret, rejects wrong',()=>{const h=passwordHash('correct-secret');assert.equal(checkPassword('correct-secret',h),true);assert.equal(checkPassword('wrong',h),false);});
test('signatures are deterministic and compared without timing-leaky string equality',()=>{assert.equal(sign('abc','secret'),sign('abc','secret'));assert.equal(secureCompare('abc','abc'),true);assert.equal(secureCompare('abc','abcd'),false);});