const {chromium} = require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
(async()=>{
 fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
 const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(!pathname.startsWith('/Endgamedossier/')) {res.writeHead(404);res.end();return;}
  const file=path.resolve(root,pathname.slice('/Endgamedossier/'.length)||'index.html');
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{const content=fs.readFileSync(file);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(content);}catch{res.writeHead(404);res.end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {}),headless:true});
 const errors=[]; const failed=[];
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith('http://127.')&&r.status()>=400)failed.push(r.url())});
 await page.route('https://**/*',r=>r.abort());
 await page.goto(base+'/Endgamedossier/');
 assert.equal(await page.locator('.card').count(),88);
 const widths=[320,375,390,430,768,1024,1440];
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  const size=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
  console.log('Viewport',size);
  assert.equal(size.scroll,size.inner,'Page overflow at '+width);
  if(size.scroll>size.inner){
   console.log('Overflow elements',await page.locator('body *').evaluateAll(els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&!e.closest('.mapwindow,.heroDeck,.portalgrid,.chips,.cinema')}).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width})).slice(0,20)));
  }
 }
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.querySelector('.topology svg').animationsPaused()),true);
 assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
 await page.locator('.heroCard').first().focus(); await page.keyboard.press('Enter');
 assert.equal(await page.locator('#dossier-001').getAttribute('open'),'');
 await page.locator('#q').fill('no such subject');
 assert.equal(await page.locator('.card:visible').count(),0);
 await page.locator('.portalperson').first().click();
 assert.equal(await page.locator('#dossier-020').isVisible(),true);
 assert.equal(await page.locator('#dossier-020').getAttribute('open'),'');
 await page.locator('.subjectchip[data-target="dossier-015"]').click();
 assert.equal(await page.locator('#dossier-015').getAttribute('open'),'');
 assert.equal(await page.locator('.route-overlay path').count(),1);
 assert.equal(await page.locator('.route-overlay circle').count(),2);
 await page.locator('#unlock').click();
 assert.equal(await page.locator('body').getAttribute('class'),'');
 await page.locator('#nextbattle').click();
 assert.match(await page.locator('#battlecount').textContent(),/02/);
 await page.locator('#eventpeople button').first().click();
 assert.equal(await page.locator('#dossier-002').getAttribute('open'),'');
 await page.locator('#openconsole').click();
 await page.locator('#cmd').fill('Natasha');
 await page.locator('#results button').first().click();
 assert.equal(await page.locator('#dossier-005').getAttribute('open'),'');
 await page.locator('#openconsole').click(); await page.keyboard.press('Escape');
 assert.equal(await page.locator('#console').isVisible(),false);
 await page.locator('.chip[data-f="dead"]').click();
 assert.equal(await page.locator('.card:visible').count(),21);
 await page.locator('.chip[data-f="all"]').click();
 assert.equal(await page.locator('.card:visible').count(),88);
 const recordText=await page.locator('.card').evaluateAll(cards=>cards.map(c=>({name:c.querySelector('.who b').textContent,endgame:c.querySelectorAll('.body section p')[0].textContent,endpoint:c.querySelectorAll('.body section p')[1].textContent})));
 const baseline=execFileSync('git',['show','c354f76:index.html'],{cwd:root,encoding:'utf8'});
 const original=await page.evaluate(html=>[...new DOMParser().parseFromString(html,'text/html').querySelectorAll('.card')].map(c=>({name:c.querySelector('.who b').textContent,endgame:c.querySelectorAll('.body section p')[0].textContent,endpoint:c.querySelectorAll('.body section p')[1].textContent})),baseline);
 assert.deepEqual(recordText,original);
 // Force every dossier image to load, not only those above the fold.
 const media=JSON.parse(fs.readFileSync(path.join(root,'data/media.json'),'utf8'));
 const imageResults=await page.locator('img').evaluateAll(async images=>{
   images.forEach(image=>image.loading='eager');
   return Promise.all(images.map(async image=>{try{await image.decode();return {src:image.getAttribute('src'),ok:image.naturalWidth>0};}catch{return {src:image.getAttribute('src'),ok:false};}}));
 });
 assert.ok(imageResults.length>100,'Expected populated local artwork');
 assert.ok(imageResults.every(image=>image.src.startsWith('./assets/')&&image.ok),'Every image must decode from a local asset');
 assert.equal(await page.locator('.image-credit').count(),media.reduce((n,row)=>n+Number(Boolean(row.screen))+Number(Boolean(row.comic)),0));
 console.log('PASS:',imageResults.length,'local image instances decoded');
 await page.goto(base+'/Endgamedossier/');
 await page.screenshot({path:path.join(root,'test-results/mobile.png')});
 await page.locator('.portalroom').scrollIntoViewIfNeeded(); await page.screenshot({path:path.join(root,'test-results/portals.png')});
 await page.locator('.subjectchip[data-target="dossier-001"]').first().click();
 await page.locator('#temporal-map').scrollIntoViewIfNeeded(); await page.screenshot({path:path.join(root,'test-results/map.png')});
 await page.setViewportSize({width:1440,height:1000}); await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:path.join(root,'test-results/desktop.png')});
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await nojs.route('https://**/*',r=>r.abort());
 await nojs.goto(base+'/Endgamedossier/');
 assert.equal(await nojs.locator('.card').count(),88);
 await nojs.locator('#dossier-001 > summary').click();
 assert.equal(await nojs.locator('#dossier-001 .body').isVisible(),true);
 console.log('Script errors',errors,'asset failures',failed);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 console.log('PASS: record preservation, links, lock geometry, filters, console, replay, no-JS');
 await browser.close(); await new Promise(resolve=>server.close(resolve));
})().catch(e=>{console.error(e);process.exit(1)});
