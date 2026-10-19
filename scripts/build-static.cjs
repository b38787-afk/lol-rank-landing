// Re-run after editing css/style.css. GitHub Pages serves the generated index.html directly.
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
fs.writeFileSync(file,html,'utf8');console.log('Embedded main stylesheet without a blocking stylesheet request.');
