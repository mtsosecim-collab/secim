import Election from './election';
const schema={
  '@context':'https://schema.org',
  '@type':'WebSite',
  name:'MTSO Seçimleri 2026',
  url:'https://mtso.mtsosecim.workers.dev/',
  inLanguage:'tr-TR',
  description:'Mersin Ticaret ve Sanayi Odası meslek grupları için bağımsız aday listeleri ve anket sonuçları.'
};
export default function Page(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><Election/></>}