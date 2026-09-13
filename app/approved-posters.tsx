'use client';
import {useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
type P={id:string;group_id:number;candidates:string;has_image:number;media_type?:string;color:string};
const names:Record<string,string>={'#ffffff':'Beyaz','#13853f':'Yeşil','#1464cd':'Mavi','#f58220':'Turuncu','#dfb200':'Sarı','#bd3643':'Kırmızı'};
export default function ApprovedPosters({group}:{group?:number}){
 const [posters,setPosters]=useState<P[]>([]);const [index,setIndex]=useState(0);const [paused,setPaused]=useState(false);
 useEffect(()=>{fetch('/api/approved-lists').then(r=>r.json()).then(data=>setPosters(Array.isArray(data)?data:[]))},[]);
 const rows=(group===undefined?posters:posters.filter(item=>item.group_id===group)).filter(item=>Boolean(item.has_image));
 useEffect(()=>{if(rows.length<2||paused)return;const timer=setInterval(()=>setIndex(current=>(current+1)%rows.length),5000);return()=>clearInterval(timer)},[rows.length,paused]);
 if(!rows.length)return null;const active=rows[index%rows.length],src='/api/posters/'+encodeURIComponent(active.id);
 return <section className='approved-slider' aria-label='Onaylı aday listesi afişleri' onPointerDown={()=>setPaused(true)}><div className='approved-slider-head'><strong>Onaylı afişler</strong><span>{index%rows.length+1} / {rows.length}</span></div><div className='approved-slider-media' style={{borderTopColor:active.color}}>{active.media_type==='video'?<video src={src} controls muted/>:<img src={src} alt={(names[active.color]||'Onaylı')+' liste afişi'} loading='lazy'/>}{rows.length>1&&<><button type='button' className='approved-nav previous' onClick={()=>setIndex(current=>(current-1+rows.length)%rows.length)} aria-label='Önceki afiş'><ChevronLeft size={18}/></button><button type='button' className='approved-nav next' onClick={()=>setIndex(current=>(current+1)%rows.length)} aria-label='Sonraki afiş'><ChevronRight size={18}/></button></>}</div><div className='approved-slider-caption'><b>{active.group_id}. grup · {names[active.color]||'Liste'} Liste</b><span className='approved-auto'>Otomatik geçiş</span></div></section>
}