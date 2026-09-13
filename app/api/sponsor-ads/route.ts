import {env} from 'cloudflare:workers';
const cache=()=>((env as unknown as {VOTES_CACHE:KVNamespace}).VOTES_CACHE);
type Sponsor={id:string;type:string;created_at:string};
export async function GET(){const items=await cache().get<Sponsor[]>('sponsor-ads','json')||[];return Response.json(items,{headers:{'Cache-Control':'public, max-age=60'}})}
