import { useEffect, useState } from 'react';
import Guide from './pages/Guide';
import Rules from './pages/Rules';
import Diagnoser from './pages/Diagnoser';

function readRoute(){
  const h = window.location.hash.replace(/^#/, '');
  if(h.startsWith('/rules')) return 'rules';
  if(h.startsWith('/diagnoser')) return 'diagnoser';
  return 'settings';
}

export default function Root(){
  const [route, setRoute] = useState<string>(readRoute());

  useEffect(()=>{
    const onHash = ()=>{
      const next = readRoute();
      setRoute(prev=>{
        if(prev !== next) requestAnimationFrame(()=> window.scrollTo({top:0, behavior:'auto'}));
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash);
  },[]);

  if(route==='rules') return <Rules />;
  if(route==='diagnoser') return <Diagnoser />;
  return <Guide />;
}
