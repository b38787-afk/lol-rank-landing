// Re-run after editing the main page text or css/style.css.
'use strict';
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
if(/<\/style/i.test(css))throw new Error('Unexpected closing style tag in stylesheet');
const file=path.join(root,'index.html');let html=fs.readFileSync(file,'utf8');
const embedded='<style id="site-styles">\n'+css+'\n</style>';
if(/<style id="site-styles">[\s\S]*?<\/style>/.test(html))html=html.replace(/<style id="site-styles">[\s\S]*?<\/style>/,()=>embedded);
else if(html.includes('<link rel="stylesheet" href="css/style.css">'))html=html.replace('<link rel="stylesheet" href="css/style.css">',()=>embedded);
else throw new Error('Expected main stylesheet slot is missing');
const body=html.split('<body>')[1]?.split('</body>')[0];
if(!body)throw new Error('Expected main page body is missing');
const text=body.replace(/<!--[\s\S]*?-->/g,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,'').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&nbsp;',' ');
const characters=[...new Set(text)].filter(c=>c===' '||!(/\s/.test(c))).sort().join('');
html=html.replace(/href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"/g,(_,encoded)=>{const url=new URL(encoded.replaceAll('&amp;','&'));url.searchParams.set('text',characters);return 'href="'+url.href.replaceAll('&','&amp;')+'"';});
fs.writeFileSync(file,html,'utf8');console.log('Embedded main stylesheet without a blocking stylesheet request.');
console.log('Subset font requests to '+characters.length+' characters used in the main page.');
