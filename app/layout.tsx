import type {Metadata} from 'next';
import './globals.css';

export const metadata:Metadata={
  metadataBase:new URL('https://mtso.mtsosecim.workers.dev'),
  title:{default:'MTSO Seçimleri 2026 | Mersin Meslek Grupları Anketi',template:'%s | MTSO Seçimleri 2026'},
  description:'Mersin Ticaret ve Sanayi Odası meslek grupları için bağımsız 2026 aday listeleri ve anket sonuçları.',
  keywords:['MTSO seçimleri 2026','Mersin Ticaret ve Sanayi Odası','MTSO meslek grupları','Mersin oda seçimleri','MTSO anket'],
  alternates:{canonical:'/'},
  openGraph:{type:'website',locale:'tr_TR',url:'/',siteName:'MTSO Seçimleri 2026',title:'MTSO Seçimleri 2026 | Mersin Meslek Grupları Anketi',description:'MTSO 2026 meslek grupları için bağımsız aday listeleri ve anket sonuçları.',images:[{url:'/media/mtso-bina.png',width:806,height:453,alt:'Mersin Ticaret ve Sanayi Odası binası'}]},
  twitter:{card:'summary_large_image',title:'MTSO Seçimleri 2026',description:'MTSO meslek grupları aday listeleri ve bağımsız anket sonuçları.',images:['/media/mtso-bina.png']},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  icons:{icon:'/favicon.svg'}
};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>}