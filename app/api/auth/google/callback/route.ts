import {env} from 'cloudflare:workers';

const COOKIE_STATE='mtso_google_state';
const COOKIE_SESSION='mtso_google_session';
const redirectUri='https://mtso.mtsosecim.workers.dev/api/auth/google/callback';
type Config={GOOGLE_CLIENT_ID?:string;GOOGLE_CLIENT_SECRET?:string;GOOGLE_SESSION_SECRET?:string};
const config=()=>env as unknown as Config;
const encode=(value:string)=>btoa(String.fromCharCode(...new TextEncoder().encode(value))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const cookie=(request:Request,name:string)=>request.headers.get('Cookie')?.split(';').map(part=>part.trim()).find(part=>part.startsWith(name+'='))?.slice(name.length+1)||'';
async function sign(value:string,secret:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value))))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function redirect(path='/',cookies:string[]=[]){const headers=new Headers({Location:path});cookies.forEach(value=>headers.append('Set-Cookie',value));return new Response(null,{status:302,headers})}
export async function GET(request:Request){
  const settings=config();const url=new URL(request.url);const code=url.searchParams.get('code');
  if(url.searchParams.get('error')||!code||url.searchParams.get('state')!==cookie(request,COOKIE_STATE))return redirect('/?google=cancelled',[`${COOKIE_STATE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`]);
  if(!settings.GOOGLE_CLIENT_ID||!settings.GOOGLE_CLIENT_SECRET||!settings.GOOGLE_SESSION_SECRET)return new Response('Google ile giriÅŸ yapÄ±landÄ±rmasÄ± eksik.',{status:503});
  try{
    const token=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:settings.GOOGLE_CLIENT_ID,client_secret:settings.GOOGLE_CLIENT_SECRET,redirect_uri:redirectUri,grant_type:'authorization_code'})});
    if(!token.ok)throw Error('token');const access=(await token.json() as {access_token?:string}).access_token;if(!access)throw Error('access');
    const profile=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:`Bearer ${access}`}});if(!profile.ok)throw Error('profile');const user=await profile.json() as {sub?:string;email?:string;name?:string};if(!user.sub||!user.email)throw Error('user');
    const now=new Date().toISOString();try{await env.DB.prepare('INSERT INTO google_login_log(google_sub,email,name,first_login_at,last_login_at,login_count) VALUES(?,?,?,?,?,1) ON CONFLICT(google_sub) DO UPDATE SET email=excluded.email,name=excluded.name,last_login_at=excluded.last_login_at,login_count=google_login_log.login_count+1').bind(user.sub,user.email,user.name||'',now,now).run()}catch{/* Giriş, geçici günlük veritabanı sorunu nedeniyle engellenmez. */}
    const payload=encode(JSON.stringify({sub:user.sub,email:user.email,name:user.name||user.email,exp:Date.now()+30*24*60*60*1000}));const signature=await sign(payload,settings.GOOGLE_SESSION_SECRET);
    return redirect('/',[`${COOKIE_SESSION}=${payload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,`${COOKIE_STATE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`]);
  }catch{return redirect('/?google=error',[`${COOKIE_STATE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`])}
}
