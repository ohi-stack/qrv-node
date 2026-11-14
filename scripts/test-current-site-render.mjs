import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const temp = await mkdtemp(path.join(tmpdir(), 'qrv-render-'));
try {
 await build({stdin:{contents:`
 import React from 'react';
 import { renderToStaticMarkup } from 'react-dom/server';
 import assert from 'node:assert/strict';
 import Home from './src/web/site/qrv-app';
 import Page from './src/web/site/subpage-app';
 import {newsPosts} from './src/web/site/news-data';
 const home=renderToStaticMarkup(React.createElement(Home));
 assert(home.includes('Turn every')); assert(home.includes('/signin'));
 for(const route of ['store','pricing','news','docs']) {
  const html=renderToStaticMarkup(React.createElement(Page,{path:route}));
  assert(html.includes('<h1'), route); assert(!html.includes('Continue through the network hub.'),route);
 }
 const post=newsPosts[0];
 const article=renderToStaticMarkup(React.createElement(Page,{path:'news/'+post.slug}));
 assert(article.includes('news-article')); assert(article.includes('Back to all news'));
 console.log('Rendered homepage, store, pricing, news, docs and article successfully.');
 `,resolveDir:process.cwd(),loader:'tsx'},bundle:true,platform:'node',format:'cjs',jsx:'automatic',outfile:path.join(temp,'test.cjs')});
 execFileSync(process.execPath,[path.join(temp,'test.cjs')],{stdio:'inherit'});
} finally {await rm(temp,{recursive:true,force:true});}
