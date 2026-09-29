import {env} from 'cloudflare:workers';
const COOKIE_SESSION='mtso_google_session';
type Config={GOOGLE_SESSION_SECRET?:string};
type Session={email?:string;name?:string;exp?:number};
const out=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const config=()=>env as unknown as Config;
const cookie=(request:Request,name:string)=>request.headers.get('Cookie')?.split(';').map(part=>part.trim()).find(part=>part.startsWith(name+'='))?.slice(name.length+1)||'';
const decode=(value:string)=>new TextDecoder().decode(Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),letter=>letter.charCodeAt(0)));
async function sign(value:string,secret:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value))))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function userFor(request:Request):Promise<Session|null>{try{const secret=config().GOOGLE_SESSION_SECRET;const[payload,signature]=cookie(request,COOKIE_SESSION).split('.');if(!secret||!payload||!signature||signature!==await sign(payload,secret))return null;const user=JSON.parse(decode(payload)) as Session;return user.email&&user.exp&&user.exp>Date.now()?user:null}catch{return null}}
export async function GET(){const result=await env.DB.prepare('SELECT id,display_name,message,created_at FROM chat_messages ORDER BY created_at DESC LIMIT 50').all();return out(result.results.reverse())}
export async function POST(request:Request){const user=await userFor(request);if(!user)return out({error:'Mesaj yazmak için Google ile giriş yapın.'},401);const body=await request.json() as {message?:string},message=(body.message||'').trim().slice(0,500);if(!message)return out({error:'Mesaj gereklidir.'},400);const displayName=(user.name||user.email||'Google kullanıcısı').trim().slice(0,80);await env.DB.prepare('INSERT INTO chat_messages(id,display_name,message,created_at) VALUES(?,?,?,?)').bind(crypto.randomUUID(),displayName,message,new Date().toISOString()).run();return out({saved:true},201)}
