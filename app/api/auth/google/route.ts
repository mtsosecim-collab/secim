import {env} from 'cloudflare:workers';

const COOKIE_STATE='mtso_google_state';
const redirectUri='https://mtso.mtsosecim.workers.dev/api/auth/google/callback';
const options=()=>env as unknown as {GOOGLE_CLIENT_ID?:string};
const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(24)),byte=>byte.toString(16).padStart(2,'0')).join('');

export async function GET(){
  const clientId=options().GOOGLE_CLIENT_ID;
  if(!clientId)return new Response('Google ile giriş henüz yapılandırılmadı.',{status:503});
  const state=random();
  const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search=new URLSearchParams({client_id:clientId,redirect_uri:redirectUri,response_type:'code',scope:'openid email profile',state,prompt:'select_account'}).toString();
  return new Response(null,{status:302,headers:{Location:url.toString(),'Set-Cookie':`${COOKIE_STATE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`}});
}
