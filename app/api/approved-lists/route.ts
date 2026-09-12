import {env} from 'cloudflare:workers';
export async function GET(){
  const r=await env.DB.prepare("SELECT id,group_id,list_name,candidates,color,(image_data IS NOT NULL) AS has_image FROM submissions WHERE status='approved' ORDER BY created_at DESC").all();
  return Response.json(r.results,{headers:{'Cache-Control':'no-store'}});
}
