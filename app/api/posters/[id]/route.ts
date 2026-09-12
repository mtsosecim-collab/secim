import {env} from 'cloudflare:workers';

function decodeBase64(value:string){
  const raw=atob(value);
  const bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  return bytes;
}

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const row=await env.DB.prepare("SELECT image_data FROM submissions WHERE id=? AND status='approved'").bind(id).first<{image_data:string|null}>();
  if(!row?.image_data)return new Response('Afiş bulunamadı.',{status:404});
  const match=/^data:([^;]+);base64,(.+)$/.exec(row.image_data);
  if(!match)return new Response('Geçersiz afiş.',{status:422});
  return new Response(decodeBase64(match[2]),{headers:{'Content-Type':match[1],'Cache-Control':'public, max-age=3600'}});
}
