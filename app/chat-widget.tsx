'use client';
import {useEffect,useRef,useState} from 'react';
import {LogIn,MessageCircle,Send,X} from 'lucide-react';
type Message={id:string;display_name:string;message:string};
type User={authenticated:boolean;email?:string;name?:string};
export default function ChatWidget(){
  const [open,setOpen]=useState(false),[messages,setMessages]=useState<Message[]>([]),[text,setText]=useState(''),[user,setUser]=useState<User>({authenticated:false}),[notice,setNotice]=useState('');
  const box=useRef<HTMLDivElement>(null);
  const load=()=>fetch('/api/chat',{cache:'no-store'}).then(response=>response.json()).then(setMessages).catch(()=>setNotice('Mesajlar yüklenemedi.'));
  const loadUser=()=>fetch('/api/auth/google/session',{cache:'no-store'}).then(response=>response.json()).then(setUser).catch(()=>setUser({authenticated:false}));
  useEffect(()=>{if(open){load();loadUser()}},[open]);
  useEffect(()=>{box.current?.scrollTo({top:box.current.scrollHeight,behavior:'smooth'})},[messages,open]);
  async function send(event:React.FormEvent){
    event.preventDefault();setNotice('');
    const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})});
    if(response.ok){setText('');load();return}
    const payload=await response.json().catch(()=>({}));
    setNotice(payload.error||'Mesaj gönderilemedi.');
    if(response.status===401){setUser({authenticated:false})}
  }
  return <><button className='whatsapp-float' onClick={()=>setOpen(true)} aria-label='MTSO Chatboard’u aç'><MessageCircle size={30}/></button>{open&&<section className='chat-popup' aria-label='MTSO Chatboard'><header><b><MessageCircle size={20}/> MTSO Chatboard</b><button onClick={()=>setOpen(false)} aria-label='Sohbeti kapat'><X/></button></header><div ref={box}>{messages.map(item=><p key={item.id}><b>{item.display_name}: </b>{item.message}</p>)}</div>{user.authenticated?<form onSubmit={send}><input value={text} onChange={event=>setText(event.target.value)} placeholder='Mesajınız' required/><button aria-label='Mesaj gönder'><Send size={18}/></button></form>:<div className='chat-login'><span>Mesaj yazmak için Google ile giriş yapın.</span><a href='/api/auth/google' target='_top'><LogIn size={16}/> Google ile giriş</a></div>}{notice&&<small className='chat-notice' role='status'>{notice}</small>}</section>}</>}
