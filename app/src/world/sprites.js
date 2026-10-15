// @ts-nocheck
/* Піксельний рушій, перенесений із site/app.js без змін у малюванні. */
/* ---------- colour helpers ---------- */
function toRgb(c){
  if(c.startsWith('rgb'))return c.match(/\d+/g).slice(0,3).map(Number);
  let h=c.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');
  const n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];
}
function shade(c,a){const [r,g,b]=toRgb(c);const t=a<0?0:255,p=Math.abs(a);const f=v=>Math.round((t-v)*p+v);return `rgb(${f(r)},${f(g)},${f(b)})`;}
function luminance(c){const [r,g,b]=toRgb(c).map(v=>v/255);return .2126*r+.7152*g+.0722*b;}
function hash(x,y){const s=Math.sin(x*12.9898+y*78.233)*43758.5453;return s-Math.floor(s);}
function px(ctx,x,y,s,col){ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),s,s);}

/* ---------- tiny pixel rasteriser ---------- */
class Spr{
  constructor(w,h){this.w=w;this.h=h;this.p=new Array(w*h).fill(null);}
  set(x,y,c){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h)return;this.p[y*this.w+x]=c;}
  get(x,y){if(x<0||y<0||x>=this.w||y>=this.h)return null;return this.p[y*this.w+x];}
  fill(pts,c){pts.forEach(([x,y])=>{const col=typeof c==='function'?c(x,y):c;if(col)this.set(x,y,col);});return this;}
  erase(pts){pts.forEach(([x,y])=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<this.w&&y<this.h)this.p[y*this.w+x]=null;});return this;}
  outline(amt){
    const out=[];
    for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){
      if(this.get(x,y))continue;
      const n=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>this.get(x+a,y+b)).find(Boolean);
      if(n)out.push([x,y,n]);
    }
    out.forEach(([x,y,n])=>this.set(x,y,shade(n,-amt)));
    this.ol=new Set(out.map(([x,y])=>y*this.w+x));
    return this;
  }
  draw(ctx,ox,oy,s,crop){
    const [x0,y0,x1,y1]=crop||[0,0,this.w,this.h];
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const c=this.p[y*this.w+x];if(c)px(ctx,ox+(x-x0)*s,oy+(y-y0)*s,s,c);}
  }
}
/* draw sprite A dissolving into sprite B (same size); p = 0..1 */
function drawMix(ctx,a,b,p,ox,oy,s){
  for(let y=0;y<a.h;y++)for(let x=0;x<a.w;x++){const c=(hash(x,y)<p?b:a).p[y*a.w+x];if(c)px(ctx,ox+x*s,oy+y*s,s,c);}
}
function ell(cx,cy,rx,ry){const p=[];for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1)p.push([x,y]);}return p;}
function rect(x,y,w,h){const p=[];for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)p.push([i,j]);return p;}
function poly(pts){
  const p=[],ys=pts.map(q=>q[1]);
  for(let y=Math.floor(Math.min(...ys));y<=Math.ceil(Math.max(...ys));y++){
    const sy=y+0.5,xs=[];
    for(let i=0;i<pts.length;i++){const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%pts.length];if((ay<=sy&&by>sy)||(by<=sy&&ay>sy))xs.push(ax+(sy-ay)*(bx-ax)/(by-ay));}
    xs.sort((a,b)=>a-b);
    for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]-0.5);x<=Math.floor(xs[k+1]-0.5);x++)p.push([x,y]);
  }
  return p;
}
function line(x0,y0,x1,y1,t=1){
  const p=[],n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*2+1;
  for(let i=0;i<=n;i++){
    const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;
    if(t<=1){p.push([Math.round(x),Math.round(y)]);continue;}
    const r=t/2;
    for(let yy=Math.floor(y-r);yy<=Math.ceil(y+r);yy++)for(let xx=Math.floor(x-r);xx<=Math.ceil(x+r);xx++)if((xx-x)**2+(yy-y)**2<=r*r)p.push([xx,yy]);
  }
  return p;
}
function path(pts,t){return pts.slice(1).flatMap((q,i)=>line(pts[i][0],pts[i][1],q[0],q[1],t));}

const BK='#1f1b16',RD='#b3202a',RDs='#7e1219',GD='#d9a521',GDs='#a87a12',WH='#f6f1e6';

/* ================= ГЕРОЇ ================= */

/* Еней. level: 0 чиста сорочка, 1 частково, 2 повністю вишита.
   o.pose: 'akimbo' | 'sabre' | 'mug';  o.coat: жупан;  o.blink: кліпає */
function makeEnei(level=2,o={}){
  const s=new Spr(46,72);
  const pose=o.pose||'akimbo';
  const SK='#eab48a',SKs='#c98a62',SC='#dba57c',HR='#2b1a10',HRh='#6a4428',
        SH=o.coat?'#7a1f2b':'#f4efe3',SHs=o.coat?'#561520':'#d3c9b6',SHIRT='#f4efe3',SHIRTs='#d3c9b6',
        BL='#2f55a0',BLs='#203a72',BLh='#4b76c4',BT='#8e2020',BTs='#5e1414',ST='#cdd2da',STs='#8d949e';
  // чоботи і шаровари
  s.fill(poly([[12,59],[20,59],[20,66],[21,68],[8,68],[8,66],[11,64]]),(x,y)=>y>65?BTs:BT);
  s.fill(poly([[26,59],[34,59],[35,64],[38,66],[38,68],[25,68],[26,66]]),(x,y)=>(y>65||x>31)?BTs:BT);
  s.fill(poly([[14,44],[32,44],[37,52],[34,60],[25,60],[23,53],[21,60],[12,60],[9,52]]),(x,y)=>x>28?BLs:BL);
  [[13,47,11,57],[19,46,18,58],[28,46,29,58],[34,48,35,56]].forEach(([a,b,c,d])=>s.fill(line(a,b,c,d),BLs));
  s.fill(line(16,46,14,56),BLh);s.fill(line(25,47,26,57),BLh);
  // сорочка з орнаментом
  const orn=(x,y)=>{if(level===0)return null;const d=Math.abs(x-23);if(d>2)return null;if(level===1&&y>32)return null;const k=(d+y)%4;return k===0?RD:(k===2?BK:null);};
  s.fill(poly([[11,25],[35,25],[33,31],[31,41],[15,41],[13,31]]),(x,y)=>orn(x,y)||(x>28?SHIRTs:SHIRT));
  if(level===2)[[17,30],[29,30],[17,36],[29,36]].forEach(([x,y])=>{s.set(x,y,RD);s.set(x-1,y+1,RD);s.set(x+1,y+1,RD);s.set(x,y+2,RD);});
  // ліва рука в бік
  s.fill(poly([[11,25],[15,27],[11,35],[6,34]]),(x,y)=>y>31?SHs:SH);
  s.fill(poly([[6,33],[11,34],[16,40],[13,43]]),(x,y)=>(level>0&&y>=38&&!o.coat)?RD:SHs);
  // права рука за позою
  if(pose==='akimbo'){
    s.fill(poly([[35,25],[31,27],[35,35],[40,34]]),SHs);
    s.fill(poly([[40,33],[35,34],[30,40],[33,43]]),(x,y)=>(level>0&&y>=38&&!o.coat)?RDs:SHs);
  }else if(pose==='sabre'){
    s.fill(poly([[33,25],[36,27],[41,14],[38,12]]),(x,y)=>(level>0&&y<17&&!o.coat)?RD:SHs);
  }else if(pose==='mug'){
    s.fill(poly([[35,25],[31,27],[35,35],[40,34]]),SHs);
    s.fill(poly([[36,34],[40,33],[38,27],[34,28]]),SHs);
  }
  if(level>0&&!o.coat){s.fill(line(8,30,13,28),RD);s.fill(line(38,30,33,28),RD);}
  if(level===2&&!o.coat){s.fill(line(8,31,13,29),BK);s.fill(line(38,31,33,29),BK);}
  // жупан
  if(o.coat){
    const CO='#7a1f2b',COs='#561520';
    s.fill(poly([[11,25],[19,25],[19,57],[10,57],[12,41]]),(x,y)=>CO);
    s.fill(poly([[35,25],[27,25],[27,57],[36,57],[34,41]]),(x,y)=>COs);
    s.fill(line(19,25,19,57),GD);s.fill(line(27,25,27,57),GD);
    s.fill(line(10,57,19,57),GD);s.fill(line(27,57,36,57),GD);
  }
  // комір
  s.fill(rect(19,24,9,2),level>0?RD:SHIRTs);
  if(level===2)s.fill(rect(19,24,9,1),(x)=>x%2?GD:RD);
  // пояс
  s.fill(rect(14,40,19,4),(x,y)=>y===41?GD:(y===43?RDs:RD));
  s.fill(poly([[15,43],[19,43],[18,53],[14,52]]),(x,y)=>y>=51?GD:RD);
  // долоні
  s.fill(ell(14.5,41.5,2.2,2.2),SK);
  if(pose==='akimbo')s.fill(ell(31.5,41.5,2.2,2.2),SKs);
  // шабля
  if(pose==='sabre'){
    s.fill(line(34,44,40,64,1.6),'#3a2a1c');
    s.fill(line(40,10,45,0,1.6),ST);s.fill(line(41,10,45,1),STs);
    s.fill(rect(37,11,5,1),GD);s.fill(ell(39.5,12.5,2,2),SKs);
  }else{
    s.fill(line(34,44,40,64,1.6),ST);s.fill(line(35,45,41,64),STs);
    s.fill(rect(33,42,3,2),GD);s.fill(rect(32,44,5,1),GDs);
  }
  if(pose==='mug'){
    s.fill(rect(33,19,6,7),(x,y)=>y===19?WH:(x>36?'#6b4420':'#8b5a2b'));
    s.fill(rect(33,20,6,1),'#e9dcb8');
    s.set(39,21,'#6b4420');s.set(40,22,'#6b4420');s.set(40,23,'#6b4420');s.set(39,24,'#6b4420');
    s.fill(ell(36,27,2,2),SKs);
  }
  // голова
  s.fill(rect(20,21,7,4),(x)=>x>24?SKs:SK);
  s.fill(ell(16.5,16,1.6,2.2),SKs);s.fill(ell(29.5,16,1.6,2.2),SKs);
  s.fill(ell(23,15,6.6,7.6),(x,y)=>y<10?SC:(x>25?SKs:SK));
  s.fill(rect(19,12,3,1),HR);s.fill(rect(25,12,3,1),HR);
  s.fill(rect(20,14,2,1),o.blink?SKs:BK);s.fill(rect(25,14,2,1),o.blink?SKs:BK);
  if(pose==='mug'){s.set(19,16,'#e0897a');s.set(27,16,'#e0897a');}
  s.fill(line(23,14,23,17),SKs);s.set(24,17,SKs);
  s.fill(path([[23,18],[20,18],[18,19],[17,21],[16,25]],2),HR);
  s.fill(path([[23,18],[26,18],[28,19],[29,21],[30,25]],2),HR);
  // оселедець у формі {
  s.fill(path([[23,9],[22,6],[20,3]],2),HR);
  s.fill(path([[20,3],[17,2],[15,3],[14,5],[14,10],[13,12],[11,13],[13,14],[14,16],[14,22],[15,25],[17,26]],1),HR);
  s.fill(path([[21,4],[19,3]],1),HRh);
  return s.outline(0.62);
}

/* Лис Микита, олюднений. o: rainbow, cursorOff, crown, chains, sad */
const RAINBOW=['#b3202a','#e2702b','#d9a521','#4f9d4a','#2f6db5','#6b3fa0'];
function makeFox(fur,o={}){
  const s=new Spr(42,60);
  const F=(x,y)=>o.rainbow?RAINBOW[Math.floor((y+x/2)/5)%RAINBOW.length]:fur;
  const Fs=(x,y)=>shade(F(x,y),-0.24);
  const W='#f7f3ea',Ws='#d9d2c3',DK='#2a211a',VE='#24302b',VEs='#18201c',TR='#6b4b2a',TRs='#4d361e',SH='#f4efe3',SHs='#d3c9b6';
  s.fill(poly([[24,44],[30,47],[36,43],[39,35],[38,28],[34,29],[34,37],[28,42]]),(x,y)=>x>35?Fs(x,y):F(x,y));
  if(!o.cursorOff)s.fill(ell(36.5,27.5,2.6,2.8),W);
  s.fill(poly([[9,52],[16,52],[16,57],[6,57],[6,55]]),DK);
  s.fill(poly([[20,52],[27,52],[30,55],[30,57],[20,57]]),DK);
  s.fill(poly([[11,41],[26,41],[27,53],[20,53],[18,47],[16,53],[9,53]]),(x,y)=>x>22?TRs:TR);
  s.fill(poly([[11,26],[25,26],[27,41],[9,41]]),(x,y)=>{if(x>=16&&x<=20)return (x===16||x===20)?GD:W;return x>22?VEs:VE;});
  s.fill(rect(10,39,17,1),(x)=>x%2?RD:GD);
  s.fill(rect(10,40,17,2),'#1f6b4a');
  s.fill(poly([[11,27],[13,30],[10,36],[7,34]]),SH);
  s.fill(poly([[7,33],[10,36],[16,37],[15,34]]),SHs);
  s.fill(rect(11,32,9,8),(x,y)=>(x===11||y===39)?RDs:RD);
  [[13,34],[13,35],[12,36],[13,37],[13,38],[18,34],[18,35],[19,36],[18,37],[18,38]].forEach(([x,y])=>s.set(x,y,GD));
  s.fill(ell(15.5,36,1.5,1.3),DK);
  if(o.chains){
    // руки скуті, книга відібрана
    s.erase(rect(11,32,9,8));s.fill(rect(11,32,9,8),(x,y)=>x>=16&&x<=20?W:VE);
    s.fill(poly([[25,27],[29,31],[23,37],[21,35]]),SHs);
    s.fill(ell(15,36,1.6,1.4),DK);s.fill(ell(21,36,1.6,1.4),DK);
    s.fill(rect(13,35,10,2),(x)=>x%2?'#9aa1a9':'#5f666e');
    s.fill(line(18,37,24,50),'#7f868e');s.fill(ell(24,52,2.2,2.2),'#4a5058');
  }else{
    s.fill(poly([[25,27],[29,31],[27,33],[24,30]]),SH);
    s.fill(poly([[27,32],[29,31],[31,23],[29,23]]),SHs);
    s.fill(rect(28,25,4,2),RD);
    s.fill(ell(30,22,1.7,1.7),DK);s.set(30,19,DK);s.set(30,20,DK);
  }
  s.fill(ell(18,25,4,2.5),W);
  s.fill(poly([[10,10],[12,0],[17,7]]),F);s.fill(poly([[12,8],[12.5,3],[15,7]]),DK);
  s.fill(poly([[19,7],[24,0],[26,10]]),Fs);s.fill(poly([[21,7],[23.5,3],[24,8]]),DK);
  s.fill(ell(18,12,8,6),(x,y)=>x>21?Fs(x,y):F(x,y));
  s.fill(poly([[10,12],[26,12],[23,19],[18,24],[13,19]]),(x,y)=>x>21?Fs(x,y):F(x,y));
  s.fill(poly([[10,13],[15,15],[18,24],[12,18]]),W);
  s.fill(poly([[26,13],[21,15],[18,24],[24,18]]),Ws);
  if(o.sad){
    s.fill(rect(13,14,3,1),BK);s.fill(rect(20,14,3,1),BK);
    s.fill(line(12,11,15,12),BK);s.fill(line(24,11,21,12),BK);
    s.fill(line(16,24,19,24),DK);
  }else{
    s.fill(rect(13,13,3,1),'#f0b429');s.set(15,13,BK);s.fill(line(12,12,16,12),BK);
    s.fill(rect(20,13,3,1),'#f0b429');s.set(20,13,BK);s.fill(line(20,12,24,12),BK);
    s.fill(line(16,24,19,23),DK);
  }
  s.fill(rect(17,21,3,2),BK);
  if(o.crown){s.fill(poly([[13,7],[24,7],[24,2],[22,4.5],[18.5,1],[15,4.5],[13,2]]),GD);s.set(18,4,RD);s.set(15,5,'#1fa3a3');s.set(22,5,'#1fa3a3');}
  return s.outline(0.62);
}

/* Лис у рідному лісі: звичайний звір на чотирьох лапах */
function makeFoxWild(fur){
  const s=new Spr(50,32),Fs=shade(fur,-0.24),W='#f7f3ea',DK='#2a211a';
  s.fill(poly([[12,14],[4,8],[0,12],[1,18],[6,22],[13,19]]),fur);s.fill(ell(2,11,2.6,2.6),W);
  [[14,20],[19,21],[30,21],[35,20]].forEach(([x,y],i)=>s.fill(rect(x,y,3,10),(xx,yy)=>yy>=y+5?DK:(i%2?Fs:fur)));
  s.fill(ell(25,17,12,6),(x,y)=>y>19?Fs:fur);
  s.fill(ell(36,19,3,4),W);
  s.fill(ell(40,12,6,5),fur);
  s.fill(poly([[43,10],[49,14],[43,17]]),fur);s.fill(poly([[42,14],[49,14],[44,17]]),W);
  s.set(49,13,BK);s.set(48,13,BK);
  s.fill(poly([[36,9],[37,2],[40,7]]),fur);s.fill(poly([[39,7],[42,2],[43,9]]),Fs);s.set(37,5,DK);s.set(41,5,DK);
  s.fill(rect(41,10,2,1),BK);
  return s.outline(0.62);
}

/* Вовк Неситий у лівреї Юнони. o: drool (1..4), food, feast */
function makeWolf(o={}){
  const s=new Spr(48,66);
  const G='#6f747c',Gs='#50545b',Gh='#959ba3',ML='#b9bdc2',MLs='#9a9ea4',PU='#5b3591',PUs='#41246d',TE='#1fa3a3',TR='#5e4630',TRs='#45321f',RP='#8b6b3e',CL='#f4efe3';
  s.fill(ell(14,61,5.5,2.6),G);s.fill(ell(33,61,5.5,2.6),Gs);
  [[9,62],[11,63],[13,63],[30,63],[32,63],[34,62]].forEach(([x,y])=>s.set(x,y,CL));
  s.fill(poly([[12,46],[35,46],[37,59],[28,59],[24,52],[20,59],[10,59]]),(x,y)=>(y>=58&&x%3===0)?null:(x>28?TRs:TR));
  s.fill(rect(14,52,3,3),'#7a6040');
  s.fill(rect(12,44,23,2),RP);s.fill(line(15,46,14,51),RP);
  s.fill(poly([[10,26],[15,28],[11,43],[6,45],[4,38]]),(x,y)=>x<8?Gh:G);
  s.fill(poly([[37,26],[32,28],[36,43],[41,45],[43,38]]),Gs);
  [[5,46],[7,47],[9,46],[38,46],[40,47],[42,46]].forEach(([x,y])=>s.set(x,y,CL));
  s.fill(poly([[11,25],[36,25],[35,45],[12,45]]),(x,y)=>(x===12||x===35||y===44)?GD:(x>28?PUs:PU));
  s.fill(ell(23.5,34,4.2,4.2),GD);s.fill(ell(23.5,34,2.8,2.8),TE);s.fill(ell(23.5,34,1.2,1.2),'#1b3f8f');
  if(o.feast){
    s.fill(poly([[16,25],[31,25],[27,35],[20,35]]),(x,y)=>y>=33?RD:CL);
    s.fill(line(41,40,45,30),'#c9ced6');s.fill(ell(45,29,1.3,1.6),'#c9ced6');
  }
  if(o.food){
    s.fill(line(7,46,6,35,1.6),CL);s.fill(ell(6,30,4.6,5.2),'#9a4a24');s.fill(ell(5,28.5,2.2,2),'#c46a3c');s.fill(ell(7.5,33,1.4,1),'#7a3418');
    s.fill(ell(4.8,24,1.4,1.3),CL);s.fill(ell(7.2,24,1.4,1.3),CL);s.fill(ell(7,45.5,2.6,2.2),'#6f747c');
  }
  s.fill(poly([[14,12],[15,1],[21,9]]),G);s.fill(poly([[16,10],[16,4],[19,9]]),'#3a2f2a');
  s.fill(poly([[26,9],[32,1],[33,12]]),Gs);s.fill(poly([[28,9],[31,4],[31,10]]),'#3a2f2a');
  s.fill(ell(23.5,16,9.5,7.5),(x,y)=>x>27?Gs:G);
  s.fill(poly([[17,17],[30,17],[28,26],[19,26]]),(x,y)=>x>26?MLs:ML);
  s.fill(rect(21,17,5,2),BK);
  s.fill(rect(19,22,9,3),'#6e1212');
  [[19,22],[21,22],[23,22],[25,22],[27,22],[20,24],[24,24],[26,24]].forEach(([x,y])=>s.set(x,y,CL));
  s.set(22,24,'#d0505a');s.set(23,24,'#d0505a');
  if(o.feast){
    [[17,14],[18,13],[19,13],[20,14],[26,14],[27,13],[28,13],[29,14]].forEach(([x,y])=>s.set(x,y,BK));
  }else{
    s.fill(rect(18,14,2,1),'#f2c230');s.fill(rect(27,14,2,1),'#f2c230');
    s.fill(line(16,12,20,13),BK);s.fill(line(31,12,27,13),BK);
  }
  const d=o.drool===undefined?3:o.drool;
  for(let i=0;i<d;i++)s.set(27,25+i,'#bfe3f2');
  return s.outline(0.62);
}

/* Вовк у рідному лісі */
function makeWolfWild(){
  const s=new Spr(56,36),G='#6f747c',Gs='#50545b',ML='#b9bdc2';
  s.fill(poly([[13,14],[5,18],[2,26],[6,27],[13,20]]),Gs);
  [[15,22],[21,23],[34,23],[40,22]].forEach(([x,y],i)=>s.fill(rect(x,y,4,12),i%2?Gs:G));
  s.fill(ell(28,18,15,7),(x,y)=>y>21?Gs:G);
  s.fill(ell(26,13,10,2.4),'#858a92');
  s.fill(ell(44,13,7,6),G);
  s.fill(poly([[47,11],[55,15],[54,18],[46,18]]),ML);
  s.set(55,14,BK);s.set(54,14,BK);
  s.fill(rect(49,18,4,2),'#c0392b');
  s.fill(poly([[40,9],[41,1],[44,7]]),G);s.fill(poly([[44,7],[47,1],[48,9]]),Gs);
  s.fill(rect(45,11,2,1),'#f2c230');
  return s.outline(0.62);
}

/* Юнона. o.shimmer — інший кадр павиних очей */
function makeJuno(o={}){
  const s=new Spr(52,76);
  const GR='#2e8b57',TE=o.shimmer?'#5fd0cf':'#1fa3a3',DB='#1b3f8f',PU='#6b3fa0',PUs='#4a2a78',SK='#eec09a',SKs='#cf9b75',HR='#2a1d14';
  for(let i=0;i<9;i++){
    const a=(-152+i*15.5)*Math.PI/180,ex=26+Math.cos(a)*26,ey=40+Math.sin(a)*27;
    s.fill(line(26,40,ex,ey,2),GR);s.fill(ell(ex,ey,3,3.4),TE);s.fill(ell(ex,ey,1.6,1.8),DB);s.set(ex,ey,GD);
  }
  s.fill(poly([[19,28],[33,28],[37,50],[42,72],[10,72],[15,50]]),(x,y)=>x>28?PUs:PU);
  s.fill(rect(10,70,33,2),GD);
  s.fill(rect(16,40,20,2),(x)=>x%3?GD:GDs);
  s.fill(line(26,42,26,70),PUs);s.fill(line(20,46,17,70),PUs);s.fill(line(32,46,36,70),'#3b2163');
  s.fill(poly([[19,29],[15,31],[14,40],[18,41],[18,33]]),PU);
  s.fill(ell(17,41,1.8,1.6),SK);
  s.fill(poly([[33,29],[37,31],[39,41],[36,42],[34,33]]),PUs);
  s.fill(line(39,24,39,70,1.6),'#6b4420');s.fill(line(39,24,39,30,1.6),GD);
  s.fill(ell(39,21,2.6,2.8),GD);s.fill(ell(39,21,1.5,1.7),TE);s.set(39,21,DB);
  s.fill(ell(38,42,1.8,1.6),SKs);
  s.fill(rect(23,23,6,5),SK);
  s.fill(ell(26,16,8,8),HR);
  s.fill(poly([[18,16],[21,16],[21,30],[17,32]]),HR);
  s.fill(poly([[34,16],[31,16],[31,30],[35,32]]),HR);
  s.fill(path([[21,27],[26,30],[31,27]],1),GD);s.set(26,30,RD);
  s.fill(ell(26,18,5.6,6.6),(x,y)=>x>28?SKs:SK);
  s.fill(poly([[19,11],[33,11],[33,6],[31,9],[29,4],[26,8],[23,4],[21,9],[19,6]]),(x,y)=>x>29?GDs:GD);
  s.set(26,9,RD);s.set(22,9,'#1fa3a3');s.set(30,9,'#1fa3a3');
  s.fill(rect(23,18,2,1),BK);s.fill(rect(28,18,2,1),BK);
  s.fill(line(22,16,25,15),HR);s.fill(line(27,15,30,16),HR);
  s.fill(rect(25,22,3,1),RD);
  return s.outline(0.62);
}

/* ================= NPC СВІТІВ ================= */

/* Еол на хмарі з мішком вітрів */
function makeEol(){
  const s=new Spr(64,60);
  const SK='#e8b892',SKs='#c98f6c',CH='#f0a08a',HR='#e2eaf2',HRs='#b9c7d6',RO='#3a6ea5',ROs='#2b5487',BAG='#8b5a2b';
  s.fill(poly([[20,30],[44,30],[46,46],[18,46]]),(x)=>x>36?ROs:RO);
  s.fill(ell(10,30,7,8),(x,y)=>y>33?'#6b4420':BAG);s.fill(rect(9,21,3,2),GD);
  s.fill(poly([[20,31],[13,35],[11,32],[19,29]]),SK);
  s.fill(poly([[44,31],[52,26],[54,29],[45,35]]),SKs);s.fill(ell(54,26,2,2),SKs);
  s.fill(ell(32,10,11,7),HR);
  [[22,8,15,2],[24,5,19,0],[42,8,49,2],[40,5,45,0],[32,3,32,0]].forEach(([a,b,c,d])=>s.fill(line(a,b,c,d,2),HR));
  s.fill(ell(32,18,9,10),(x,y)=>x>35?SKs:SK);
  s.fill(ell(24,21,4,4),CH);s.fill(ell(40,21,4,4),shade(CH,-0.12));
  s.fill(rect(27,15,3,1),BK);s.fill(rect(35,15,3,1),BK);
  s.fill(rect(26,13,5,1),HRs);s.fill(rect(34,13,5,1),HRs);
  s.fill(ell(32,24,1.6,1.6),'#7a2a2a');
  s.fill(poly([[24,26],[40,26],[36,40],[28,40]]),(x)=>x>33?HRs:HR);
  s.fill(ell(16,50,14,9),(x,y)=>y>52?'#b8c6d4':'#e4ebf2');
  s.fill(ell(32,47,16,11),(x,y)=>y>52?'#b8c6d4':'#eef3f8');
  s.fill(ell(48,50,14,9),(x,y)=>y>52?'#b8c6d4':'#e4ebf2');
  return s.outline(0.6);
}

/* Дидона з волячою шкурою-стрічкою */
function makeDido(){
  const s=new Spr(46,72);
  const SK='#d9a77e',SKs='#b8875f',HR='#1a1210',RO='#7b2d6b',ROs='#5a1f4f',HIDE='#9a6a3a';
  s.fill(poly([[15,26],[31,26],[34,48],[39,70],[7,70],[12,48]]),(x)=>x>27?ROs:RO);
  s.fill(rect(7,68,33,2),GD);s.fill(rect(13,40,20,2),(x)=>x%3?GD:GDs);
  s.fill(line(23,42,23,68),ROs);s.fill(line(17,46,13,68),ROs);
  s.fill(poly([[31,27],[35,30],[37,39],[34,40],[32,32]]),ROs);s.fill(ell(35,40,1.8,1.6),SKs);
  s.fill(poly([[15,27],[11,30],[9,38],[12,39],[14,32]]),RO);
  s.fill(ell(9,42,6,6),HIDE);s.erase(ell(9,42,2.6,2.6));s.fill(ell(9,42,4.3,4.3).filter(([x,y])=>(x+y)%3===0),'#6e4a26');
  s.fill(path([[13,46],[18,58],[16,66]],1.6),HIDE);
  s.fill(ell(11,38,1.8,1.6),SK);
  s.fill(rect(20,21,7,5),SK);
  s.fill(ell(23,14,7,8),HR);
  s.fill(poly([[15,14],[18,14],[18,34],[14,36]]),HR);s.fill(poly([[31,14],[28,14],[28,34],[32,36]]),HR);
  s.fill(ell(23,16,5.5,6.6),(x)=>x>25?SKs:SK);
  s.fill(rect(17,9,13,2),GD);s.set(23,8,RD);s.set(23,9,RD);
  s.fill(rect(20,15,2,1),BK);s.fill(rect(25,15,2,1),BK);s.set(19,15,BK);s.set(27,15,BK);
  s.fill(rect(22,20,3,1),'#a3243a');
  s.fill(path([[19,26],[23,29],[27,26]],1),GD);
  return s.outline(0.6);
}

/* Рукавичка з мешканцями */
function makeMitten(){
  const s=new Spr(76,58),R='#c0242e',Rs='#8a1620',CU='#f4eee2',CUs='#d6cdbb',HOLE='#5a2a20';
  // тіло рукавички і великий палець
  s.fill(ell(64,23,6,8.5),(x,y)=>x>66?Rs:R);
  s.fill(ell(46,38,27,15),(x,y)=>y>44?Rs:R);
  for(let x=26;x<72;x++)for(let y=35;y<=40;y++){const k=(Math.round(Math.abs(y-37.5))+x)%5;if(k===0)s.set(x,y,GD);else if(k===2)s.set(x,y,WH);}
  // віконце: рукавичка стала хаткою
  s.fill(rect(50,26,7,6),'#f2c75c');s.fill(rect(53,26,1,6),'#6b4420');s.fill(rect(50,28,7,1),'#6b4420');
  // хутряний манжет з отвором, повернутим до глядача
  s.fill(ell(19,38,10,17),(x,y)=>x>24?CUs:CU);
  for(let y=23;y<54;y+=3){const hw=Math.floor(10*Math.sqrt(Math.max(0,1-((y-38)/17)**2)))-1;if(hw<2)continue;s.set(19-hw+((y>>1)%2),y,RD);s.set(19+hw-((y>>1)%2),y,BK);}
  s.fill(ell(19,38,6.5,13),HOLE);
  // мешканці малюються окремим шаром і отримують власний темний контур, щоб читатися на тлі отвору
  const L=new Spr(76,58);
  {const s=L;
  // заєць: вуха стирчать з отвору догори
    s.fill(line(16,27,13,8,2.2),'#d8d2c8');s.fill(line(22,27,25,8,2.2),'#d8d2c8');
    s.fill(line(15.5,24,13.5,11),'#e7a3ad');s.fill(line(22.5,24,24.5,11),'#e7a3ad');
    s.fill(ell(19,29,4.5,3.4),'#e3ddd3');s.set(17,29,BK);s.set(21,29,BK);s.set(19,31,'#e58a9a');
    // мишка
    s.fill(ell(15,35.5,1.8,1.8),'#a39c96');s.fill(ell(15,35.5,1,1),'#e9a8b2');s.fill(ell(17,38,3.2,2.8),'#a39c96');s.set(16,37,BK);s.set(18,37,BK);s.set(17,39,'#e58a9a');
    // жабка
    s.fill(ell(21,44,4.2,2.6),'#5fa04a');s.fill(ell(19.2,41.5,1.6,1.6),'#5fa04a');s.fill(ell(22.8,41.5,1.6,1.6),'#5fa04a');
    s.set(19,41,WH);s.set(23,41,WH);s.set(19,42,BK);s.set(23,42,BK);s.fill(line(19,45,23,45),'#2f5a28');
  }
  const mask=new Set();
  for(let y=0;y<58;y++)for(let x=0;x<76;x++){const c=L.get(x,y);if(c){s.set(x,y,c);mask.add(y*76+x);}}
  s.kind='mitten';s.animMask=mask;
  return s.outline(0.6);
}

/* Сотник Забрьоха з перначем */
function makeSotnyk(){
  const s=new Spr(46,72);
  const SK='#e6ad85',SKs='#c58660',CO='#8e1c22',COs='#651419',BL='#2f55a0',BLs='#203a72',FUR='#2a1d14';
  s.fill(poly([[11,61],[20,61],[20,68],[7,68]]),'#3a2416');s.fill(poly([[26,61],[35,61],[39,68],[26,68]]),'#2a1a10');
  s.fill(poly([[12,50],[34,50],[36,62],[25,62],[23,56],[21,62],[10,62]]),(x)=>x>27?BLs:BL);
  s.fill(ell(23,40,14,13),(x,y)=>x>28?COs:CO);
  s.fill(poly([[13,26],[33,26],[36,40],[10,40]]),(x)=>x>28?COs:CO);
  s.fill(line(23,27,23,52),GD);
  s.fill(rect(11,44,25,3),(x,y)=>y===45?'#e6c15a':GD);
  s.fill(poly([[13,27],[8,40],[11,42],[15,31]]),CO);s.fill(ell(10,42,2,2),SK);
  s.fill(poly([[33,27],[38,36],[36,38],[31,31]]),COs);s.fill(ell(37,37,2,2),SKs);
  s.fill(line(37,30,37,52,1.6),GDs);s.fill(ell(37,28,2.6,3),GD);
  s.fill(rect(19,22,9,4),SK);
  s.fill(ell(23,17,7.5,7.5),(x)=>x>26?SKs:SK);
  s.fill(ell(17,19,1.8,1.8),'#e48a7a');s.fill(ell(29,19,1.8,1.8),'#e48a7a');
  s.fill(rect(16,4,15,7),FUR);s.fill(poly([[18,4],[28,4],[33,1],[30,6]]),RD);s.set(32,1,GD);
  s.fill(rect(19,15,2,1),BK);s.fill(rect(26,15,2,1),BK);
  s.fill(path([[23,20],[19,21],[16,24],[15,28]],2),'#4a3220');s.fill(path([[23,20],[27,21],[30,24],[31,28]],2),'#4a3220');
  return s.outline(0.6);
}

/* Харон у човні */
function makeCharon(){
  const s=new Spr(60,76);
  const RO='#3b3a40',ROs='#26252a',BONE='#d8d2c3',WOOD='#4b2e1c';
  s.fill(line(46,2,49,74,1.8),'#6b4a2a');
  s.fill(poly([[19,22],[35,22],[40,62],[14,62]]),(x)=>x>30?ROs:RO);
  s.fill(ell(27,15,8,9),RO);s.fill(ell(27,17,4.6,5.4),'#0b0a0c');
  s.set(25,17,'#f2c230');s.set(29,17,'#f2c230');
  s.fill(poly([[34,27],[45,30],[45,33],[34,32]]),ROs);s.fill(ell(46,31,2,2),BONE);
  s.fill(poly([[20,28],[11,36],[13,38],[22,32]]),RO);s.fill(ell(11,38,2.2,1.8),BONE);s.set(10,36,GD);s.set(11,36,GD);
  s.fill(poly([[2,62],[58,62],[50,73],[10,73]]),(x,y)=>y>68?'#2f1c10':WOOD);
  s.fill(line(4,63,56,63),'#6b4a2a');
  return s.outline(0.6);
}

/* Мольфар з трембітою */
function makeMolfar(){
  const s=new Spr(50,76);
  const SK='#e2ad86',SKs='#bf8a64',SH='#f4efe3',SHs='#d3c9b6',KE='#efe2c3',KEs='#d3c29a',FUR='#2a211a',PA='#b3202a',PAs='#7e1219',BE='#cfd3d8';
  s.fill(line(41,74,45,2,2.2),'#c9b48a');s.fill(line(42,74,46,3),'#9c8458');s.fill(ell(45.5,3,2.4,2),'#9c8458');
  s.fill(poly([[11,66],[20,66],[20,71],[8,71]]),'#7a5432');s.fill(poly([[26,66],[35,66],[38,71],[26,71]]),'#5c3e24');
  s.fill(poly([[13,46],[33,46],[35,67],[25,67],[23,56],[21,67],[11,67]]),(x)=>x>27?PAs:PA);
  s.fill(poly([[12,25],[34,25],[33,47],[13,47]]),(x)=>x>28?SHs:SH);
  s.fill(poly([[12,25],[19,25],[19,47],[11,47]]),KE);s.fill(poly([[34,25],[27,25],[27,47],[35,47]]),KEs);
  s.fill(line(19,25,19,47),FUR);s.fill(line(27,25,27,47),FUR);s.fill(rect(11,46,25,1),FUR);
  [[14,29,RD],[16,32,'#2e8b57'],[14,36,GD],[16,40,RD],[30,29,RD],[32,32,'#2e8b57'],[30,36,GD],[32,40,RD]].forEach(([x,y,c])=>{s.set(x,y,c);s.set(x+1,y,c);s.set(x,y+1,c);s.set(x+1,y+1,c);});
  s.fill(rect(12,44,23,3),(x)=>x%2?'#6b4420':'#8b5a2b');
  s.fill(poly([[12,26],[8,40],[11,42],[15,31]]),SHs);s.fill(ell(10,42,2,2),SKs);
  s.fill(poly([[34,26],[41,30],[41,33],[34,31]]),SHs);s.fill(ell(42,31,2,2),SK);
  s.fill(rect(20,21,7,5),SK);
  s.fill(ell(23,16,6.4,7.2),(x)=>x>25?SKs:SK);
  s.fill(poly([[17,19],[29,19],[27,30],[19,30]]),BE);
  s.fill(path([[23,20],[19,21],[17,25]],2),BE);s.fill(path([[23,20],[27,21],[29,25]],2),BE);
  s.fill(rect(19,15,2,1),BK);s.fill(rect(25,15,2,1),BK);s.fill(rect(18,13,4,1),BE);s.fill(rect(24,13,4,1),BE);
  s.fill(rect(11,9,25,3),BK);s.fill(rect(15,2,17,8),BK);
  s.fill(rect(15,7,17,2),(x)=>['#b3202a','#d9a521','#2e8b57','#2f55a0'][x%4]);
  s.fill(line(31,3,37,0),'#d9a521');s.set(36,0,RD);
  return s.outline(0.6);
}

/* ================= HD: подвоєна роздільність, світло, тінь, фактура, дрібні деталі ================= */
function tagged(fn,kind){return function(...a){const s=fn(...a);s.kind=kind;s.args=a;return s;};}
function colDist(a,b){const p=toRgb(a),q=toRgb(b);return Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2]);}
function lum(c){const [r,g,b]=toRgb(c);return .2126*r+.7152*g+.0722*b;}
/* HD: без старого контуру → scale2x → світло/тінь → деталі → cel-лінії між частинами → тонкий зовнішній контур */
function makeHD(b){
  const PAD=1,W=b.w*2+PAD*2,H=b.h*2+PAD*2,h=new Spr(W,H);h.noHD=true;h.pad=PAD;
  const base=(x,y)=>{if(x<0||y<0||x>=b.w||y>=b.h)return null;const i=y*b.w+x;return (b.ol&&b.ol.has(i))?null:b.p[i];};
  for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++){
    const P=base(x,y),A=base(x,y-1),B=base(x+1,y),C=base(x-1,y),D=base(x,y+1);
    const q=[C===A&&C!==D&&A!==B?A:P,A===B&&A!==C&&B!==D?B:P,D===C&&D!==B&&C!==A?C:P,B===D&&B!==A&&D!==C?D:P];
    q.forEach((c,k)=>{if(c)h.p[(y*2+(k>>1)+PAD)*W+x*2+(k&1)+PAD]=c;});
  }
  const src=h.p.slice(),empty=(x,y)=>x<0||y<0||x>=W||y>=H||!src[y*W+x];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,c=src[i];if(!c)continue;
    const L=empty(x-2,y-2)||empty(x-1,y-2),D=empty(x+2,y+2)||empty(x+1,y+2);
    let out=c;
    if(L&&!D)out=shade(c,0.16);else if(D&&!L)out=shade(c,-0.18);
    else if(hash(x,y)<0.04&&src[i-1]===c&&src[i+1]===c&&src[i-W]===c&&src[i+W]===c)out=shade(c,-0.07);
    h.p[i]=out;
  }
  hdDetails(b,h);
  // cel-лінії: межа між різними матеріалами темнішає з боку темнішого пікселя
  const cur=h.p.slice(),mark=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,a=cur[i];if(!a)continue;
    [[1,0],[0,1]].forEach(([dx,dy])=>{const j=(y+dy)*W+x+dx;if(x+dx>=W||y+dy>=H)return;const c=cur[j];if(!c)return;
      if(colDist(a,c)>150)mark[lum(a)<lum(c)?i:j]=1;});}
  for(let i=0;i<W*H;i++)if(mark[i])h.p[i]=shade(cur[i],-0.55);
  // зовнішній контур 1 HD-піксель
  const fin=h.p.slice();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(fin[y*W+x])continue;
    const n=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,c])=>{const X=x+a,Y=y+c;return X<0||Y<0||X>=W||Y>=H?null:fin[Y*W+X];}).find(Boolean);
    if(n)h.p[y*W+x]=shade(n,-0.72);}
  return h;
}
function hdDetails(b,h){
  const P=h.pad,get=(x,y)=>h.get(x+P,y+P),put=(x,y,c)=>h.set(x+P,y+P,c),set=(x,y,c)=>{if(get(x,y))put(x,y,c);};
  const fur=(k,amt)=>{for(let y=0;y<h.h;y++)for(let x=0;x<h.w;x++){if(hash(x*3+k,y*7)<0.03&&h.get(x,y)&&h.get(x+1,y+1)){h.set(x,y,shade(h.get(x,y),-amt));h.set(x+1,y+1,shade(h.get(x+1,y+1),-amt));}}};
  const o=(b.args&&b.args[1])||{};
  if(b.kind==='enei'&&!o.blink){
    // спокійні очі: темні зіниці 2×3 з відблиском, без «білків»
    [[40,50],[50,60]].forEach(([x0])=>{for(let x=x0-1;x<=x0+4;x++){const sk=get(x,31)||get(x,32);for(let y=27;y<=30;y++)if(get(x,y))put(x,y,sk);}
      for(let y=27;y<=29;y++){put(x0+1,y,'#2a1a10');put(x0+2,y,'#2a1a10');}put(x0+1,27,'#ffffff');});
    if((o.pose||'akimbo')!=='sabre'){set(71,95,'#ffffff');set(74,103,'#ffffff');}
  }
  if(b.kind==='fox'){
    const d='#2a211a';
    [[33,44,29,43],[33,46,29,47],[41,44,45,43],[41,46,45,47]].forEach(([a,c,e,f])=>line(a,c,e,f).forEach(([x,y])=>{if(get(x,y))put(x,y,'#5a4a40');}));
    fur(1,0.1);
  }
  if(b.kind==='wolf'||b.kind==='wolfwild'){fur(2,0.2);if(!o.feast&&b.kind==='wolf'){set(36,28,'#ffffff');set(54,28,'#ffffff');}}
  if(b.kind==='foxwild')fur(3,0.1);
  if(b.kind==='mitten'&&b.animMask){
    // тонкий контур навколо звірят: 1 HD-піксель (≈2px на екрані)
    const W=h.w,H=h.h,A=new Uint8Array(W*H);
    b.animMask.forEach(i=>{const x=i%b.w,y=(i/b.w)|0;for(let k=0;k<4;k++){const X=x*2+(k&1)+P,Y=y*2+(k>>1)+P;A[Y*W+X]=1;}});
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(A[i]||!h.p[i])continue;
      if((x>0&&A[i-1])||(x<W-1&&A[i+1])||(y>0&&A[i-W])||(y<H-1&&A[i+W]))h.p[i]='#1f1b16';}
  }
  if(b.kind==='juno'){[[52,17],[44,17],[60,17],[52,59]].forEach(([x,y])=>set(x,y,'#ffffff'));}
}
const hdOf=s=>s.noHD?s:(s.hd||(s.hd=makeHD(s)));
const _sprDraw=Spr.prototype.draw;
Spr.prototype.draw=function(ctx,ox,oy,s,crop){
  if(!this.noHD&&s>=2&&s%2===0){const h=hdOf(this),q=s/2;return _sprDraw.call(h,ctx,ox-q*h.pad,oy-q*h.pad,q,crop&&crop.map(v=>v*2+h.pad));}
  return _sprDraw.call(this,ctx,ox,oy,s,crop);
};

const tEnei=tagged(makeEnei,'enei'),tFox=tagged(makeFox,'fox'),tWolf=tagged(makeWolf,'wolf'),tFoxWild=tagged(makeFoxWild,'foxwild'),tWolfWild=tagged(makeWolfWild,'wolfwild'),tJuno=tagged(makeJuno,'juno');
export {Spr,px,shade,hash,rect,poly,ell,line,path,BK,RD,GD,WH,
  tEnei as makeEnei,tFox as makeFox,tWolf as makeWolf,tFoxWild as makeFoxWild,tWolfWild as makeWolfWild,tJuno as makeJuno,makeDido,makeEol};
