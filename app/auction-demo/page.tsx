'use client';

import {useState} from 'react';

type Ad={name:string;stars:number;image:string;color:string};
const initial:Ad={name:'İlk reklam',stars:100,image:'/media/mtso-bina.png',color:'#0d7080'};
const challengers:Ad[]=[
 {name:'120 Stars teklifi',stars:120,image:'/media/mtso-bina.png',color:'#7d4a12'},
 {name:'140 Stars teklifi',stars:140,image:'/media/mtso-bina.png',color:'#643470'},
];

export default function AuctionDemo(){
 const [leader,setLeader]=useState(initial);
 const [history,setHistory]=useState<Ad[]>([]);
 const [step,setStep]=useState(0);
 const [moving,setMoving]=useState(false);
 const next=leader.stars+20;
 function outbid(){
  if(step>=challengers.length)return;
  const incoming=challengers[step];
  setMoving(true);
  window.setTimeout(()=>{setHistory(current=>[leader,...current]);setLeader(incoming);setStep(current=>current+1);setMoving(false)},420);
 }
 function reset(){setLeader(initial);setHistory([]);setStep(0);setMoving(false)}
 return <main className="auction-demo">
  <header><a href="/">← Ana sayfaya dön</a><span>YEREL TEST · CANLIYA ALINMADI</span></header>
  <section className="auction-hero"><p>TELEGRAM STARS REKLAM AÇIK ARTIRMASI</p><h1>Öne çıkmak için teklif ver</h1><span className="auction-subtitle">Her teklif, mevcut tutara <b>20 Stars</b> ekler.</span></section>
  <section className={"auction-stage "+(moving?"auction-transition":"")} aria-live="polite"><span className="auction-spark spark-one">✦</span><span className="auction-spark spark-two">✦</span><span className="auction-spark spark-three">✦</span><div className="auction-live"><i/>CANLI TEKLİF</div>
   <div className={'auction-card leader '+(moving?'leaving':'')} style={{'--auction':leader.color} as React.CSSProperties}>
    <div className="auction-rank">★ ŞU ANDA ÖNDE</div><img src={leader.image} alt={leader.name}/><div className="auction-meta"><span>{leader.name}</span><b>{leader.stars} <small>★ Stars</small></b></div>
   </div>
   <div className="auction-arrow">→</div>
   <div className={'auction-action '+(moving?'entering':'')}>
    <p className="auction-question">{step<challengers.length?'Reklamın üzerine çıkmak ister misiniz?':'Açık artırma testi tamamlandı'}</p>
    <div className="auction-price-label">SIRADAKİ TEKLİF</div><strong>{step<challengers.length?next:'140'} <small>★ Stars</small></strong>
    {step<challengers.length?<button onClick={outbid}>Telegram’da {next} Stars ile öne geç</button>:<button className="again" onClick={reset}>Testi yeniden başlat</button>}
   </div>
  </section>
  <section className="auction-flow"><div><i>1</i><strong>Görsel gönderilir</strong><span>Bot reklam afişini alır.</span></div><div><i>2</i><strong>Stars ödenir</strong><span>100 Stars ile ilk teklif açılır.</span></div><div><i>3</i><strong>Teklif yükseltilir</strong><span>Her teklif 20 Stars artırır.</span></div><div><i>4</i><strong>Yeni reklam öne çıkar</strong><span>Eski reklam arka sıraya geçer.</span></div></section>
  <section className="auction-history"><div><p>TEKLİF GEÇMİŞİ</p><h2>Arka sıraya geçen reklamlar</h2></div>{history.length?<div className="auction-history-list">{history.map(ad=><article key={ad.stars}><img src={ad.image} alt=""/><span>{ad.name}</span><b>{ad.stars} ★</b><small>Arka sıra</small></article>)}</div>:<p className="auction-empty">Henüz geriye düşen reklam yok. 120 Stars teklifini test edin.</p>}</section>
 </main>
}
