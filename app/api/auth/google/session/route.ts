import {env} from 'cloudflare:workers';
const COOKIE_SESSION='mtso_google_session';
const config=()=>env as unknown as {GOOGLE_SESSION_SECRET?:string};
const cookie=(request:Request,name:string)=>request.headers.get('Cookie')?.split(';').map(part=>part.trim()).find(part=>part.startsWith(name+'='))?.slice(name.length+1)||'';
const decode=(value:string)=>new TextDecoder().decode(Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),letter=>letter.charCodeAt(0)));
async function sign(value:string,secret:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value))))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
export async function GET(request:Request){try{const secret=config().GOOGLE_SESSION_SECRET;const [payload,signature]=cookie(request,COOKIE_SESSION).split('.');if(!secret||!payload||!signature||signature!==await sign(payload,secret))throw Error();const user=JSON.parse(decode(payload)) as {email?:string;name?:string;exp?:number};if(!user.email||!user.exp||user.exp<Date.now())throw Error();return Response.json({authenticated:true,email:user.email,name:user.name||user.email})}catch{return Response.json({authenticated:false})}}
