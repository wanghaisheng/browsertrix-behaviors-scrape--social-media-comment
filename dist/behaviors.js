(()=>{"use strict";function t(t){return new Promise((e=>setTimeout(e,t)))}async function e(e,i){for(;!e();)await t(i)}function i(t){"complete"===document.readyState?t():window.addEventListener("load",t)}class s{constructor(t,e){this.matchValue=o(t,e)}async restore(e,i){let s=null;for(;s=r(e),!s;)await t(100);return r(i.replace("$1",this.matchValue),s)}}class a{constructor(t){this.loc=window.location.href,t()}get changed(){return window.location.href!==this.loc}goBack(t){if(!this.changed)return Promise.resolve(!0);const e=r(t);return new Promise(((t,i)=>{window.addEventListener("popstate",(e=>{t()}),{once:!0}),e?e.click():window.history.back()}))}}function r(t,e){return e=e||document,document.evaluate(t,e,null,XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue}function o(t,e){return e=e||document,document.evaluate(t,e,null,XPathResult.STRING_TYPE).stringValue}class n{constructor(){this._running=null,this.paused=null,this._unpause=null}start(){this._running=this.run()}done(){return this._running?this._running:Promise.resolve()}async run(){const t=this[Symbol.asyncIterator]();for await(const e of t)console.log(e),this.paused&&await this.paused}pause(){this.paused||(this.paused=new Promise((t=>{this._unpause=t})))}unpause(){this._unpause&&(this._unpause(),this.paused=null,this._unpause=null)}}const c=/\s*(\S*\s+[\d.]+[wx]),|(?:\s*,(?:\s+|(?=https?:)))/,l=/(url\s*\(\s*[\\"']*)([^)'"]+)([\\"']*\s*\))/gi,h=/(@import\s*[\\"']*)([^)'";]+)([\\"']*\s*;?)/gi;class u{constructor(){this.urlSet=new Set,this.urlqueue=[],this.numPending=0,this.start()}start(){i((()=>{this.run(),this.initObserver()}))}async run(){this.extractSrcSrcSetAll(document),this.extractStyleSheets()}isValidUrl(t){return t&&(t.startsWith("http:")||t.startsWith("https:"))}queueUrl(t){try{t=new URL(t,document.baseURI).href}catch(t){return}this.isValidUrl(t)&&(this.urlSet.has(t)||(this.urlSet.add(t),this.doFetch(t)))}async doFetch(t){if(this.urlqueue.push(t),this.numPending<=6)for(;this.urlqueue.length>0;){const t=this.urlqueue.shift();try{this.numPending++,console.log("AutoFetching: "+t);const e=await fetch(t);await e.blob()}catch(t){console.log(t)}this.numPending--}}initObserver(){this.mutobz=new MutationObserver((t=>this.observeChange(t))),this.mutobz.observe(document.documentElement,{characterData:!1,characterDataOldValue:!1,attributes:!0,attributeOldValue:!0,subtree:!0,childList:!0,attributeFilter:["srcset"]})}processChangedNode(t){switch(t.nodeType){case Node.ATTRIBUTE_NODE:"srcset"===t.nodeName&&this.extractSrcSetAttr(t.nodeValue);break;case Node.TEXT_NODE:t.parentNode&&"STYLE"===t.parentNode.tagName&&this.extractStyleText(t.nodeValue);break;case Node.ELEMENT_NODE:t.sheet&&this.extractStyleSheet(t.sheet),this.extractSrcSrcSet(t),setTimeout((()=>this.extractSrcSrcSetAll(t)),1e3)}}observeChange(t){for(const e of t)if(this.processChangedNode(e.target),"childList"===e.type)for(const t of e.addedNodes)this.processChangedNode(t)}extractSrcSrcSetAll(t){const e=t.querySelectorAll("img[srcset], img[data-srcset], img[data-src], video[srcset], video[data-srcset], video[data-src], audio[srcset], audio[data-srcset], audio[data-src], picture > source[srcset], picture > source[data-srcset], picture > source[data-src], video > source[srcset], video > source[data-srcset], video > source[data-src], audio > source[srcset], audio > source[data-srcset], audio > source[data-src]");for(const t of e)this.extractSrcSrcSet(t)}extractSrcSrcSet(t){if(!t||t.nodeType!==Node.ELEMENT_NODE)return void console.warn("No elem to extract from");const e=t.src||t.getAttribute("data-src");e&&this.queueUrl(e);const i=t.srcset||t.getAttribute("data-srcset");i&&this.extractSrcSetAttr(i)}extractSrcSetAttr(t){for(const e of t.split(c))if(e){const t=e.trim().split(" ");this.queueUrl(t[0])}}extractStyleSheets(t){t=t||document;for(const e of t.styleSheets)this.extractStyleSheet(e)}extractStyleSheet(t){let e;try{e=t.cssRules||t.rules}catch(t){return void console.log("Can't access stylesheet")}for(const t of e)t.type===CSSRule.MEDIA_RULE&&this.extractStyleText(t.cssText)}extractStyleText(t){const e=(t,e,i,s)=>(this.queueUrl(i),e+i+s);t.replace(l,e).replace(h,e)}}const d=[{rx:[/w\.soundcloud\.com/],handle:t=>"true"===t.searchParams.get("auto_play")?null:(t.searchParams.set("auto_play","true"),t.searchParams.set("continuous_play","true"),t.href)},{rx:[/player\.vimeo\.com/,/youtube(?:-nocookie)?\.com\/embed\//],handle:t=>"1"===t.searchParams.get("autoplay")?null:(t.searchParams.set("autoplay","1"),t.href)}];class w{constructor(){this.mediaSet=new Set,this.promises=[],this.start()}async checkAutoPlayRedirect(){const e=new URL(self.location.href);for(const i of d)for(const s of i.rx)if(e.href.search(s)>=0){const s=i.handle(e);s&&(await t(1e3),window.location.href=s)}}start(){i((()=>{this.checkAutoPlayRedirect(),this.initObserver()}))}initObserver(){this.mutobz=new MutationObserver((t=>this.observeChange(t))),this.mutobz.observe(document.documentElement,{characterData:!1,characterDataOldValue:!1,attributes:!1,attributeOldValue:!1,subtree:!0,childList:!0})}observeChange(t){for(const e of t)if("childList"===e.type)for(const t of e.addedNodes)t instanceof HTMLMediaElement&&this.addMediaWait(t)}addMediaWait(t){if(t.src&&t.src.startsWith("http:")||t.src.startsWith("https:"))if(this.mediaSet.has(t.src)){if(t.play){let e;const i=new Promise((t=>{e=t}));t.addEventListener("ended",(()=>e())),t.addEventListener("paused",(()=>e())),t.addEventListener("error",(()=>e())),t.paused&&t.play(),this.promises.push(i)}}else this.mediaSet.add(t.src),this.promises.push(fetch(t.src))}done(){return Promise.all(this.promises)}}class m extends n{async*[Symbol.asyncIterator](){const e={top:250,left:0,behavior:"auto"};for(;self.scrollY+self.innerHeight<Math.max(self.document.body.scrollHeight,self.document.body.offsetHeight,self.document.documentElement.clientHeight,self.document.documentElement.scrollHeight,self.document.documentElement.offsetHeight);)self.scrollBy(e),yield{msg:"Scrolling by "+e.top},await t(500)}}class f extends n{static isMatch(){return window.location.href.match(/https:\/\/(www\.)?instagram\.com\/\w[\w]+/)}static get name(){return"Instagram"}constructor(){super(),this.state={},this.rootPath="//article/div/div",this.childMatchSelect="string(.//a[starts-with(@href, '/')]/@href)",this.childMatch="child::div[.//a[@href='$1']]",this.firstPostInRow="div[1]/a",this.postCloseButton='//button[.//*[@aria-label="Close"]]',this.nextPost="//div[@role='dialog']//a[text()='Next']",this.postLoading="//*[@aria-label='Loading...']",this.subpostNextOnlyChevron="//article[@role='presentation']//div[@role='presentation']/following-sibling::button",this.subpostPrevNextChevron=this.subpostNextOnlyChevron+"[2]",this.commentRoot="//article/div[3]/div[1]/ul",this.viewReplies="li//button[span[contains(text(), 'View replies')]]",this.loadMore="//button[span[@aria-label='Load more comments']]",this.scrollOpts={block:"start",inline:"nearest",behavior:"smooth"}}async waitForNext(e){return e?(await t(100),e.nextElementSibling?e.nextElementSibling:null):null}async*iterRow(){let e=r(this.rootPath);if(!e)return;let i=e.firstElementChild;if(i)for(;i;){await t(100);const e=new s(this.childMatchSelect,i);e.matchValue&&(yield i,i=await e.restore(this.rootPath,this.childMatch)),i=await this.waitForNext(i)}}async viewFirstPost(){let t=r(this.rootPath);if(!t||!t.firstElementChild)return;const i=o(this.childMatchSelect,t.firstElementChild),s=window.location.href;window.history.replaceState({},"",i),window.dispatchEvent(new PopStateEvent("popstate",{state:{}}));let a=null,n=null;await e((()=>(a=r(this.rootPath))!==t&&a),1e3),window.history.replaceState({},"",s),window.dispatchEvent(new PopStateEvent("popstate",{state:{}})),await e((()=>(n=r(this.rootPath))!==a&&n),1e3)}async*iterSubposts(){let e=r(this.subpostNextOnlyChevron);for(yield this.state;e;)e.click(),await t(1e3),e=r(this.subpostPrevNextChevron);await t(1e3)}async iterComments(){let e=r(this.commentRoot).firstElementChild;for(;e;){let i;for(e.scrollIntoView(this.scrollOpts);null!==(i=r(this.viewReplies,e));)i.click(),await t(500);if(e.nextElementSibling&&"LI"===e.nextElementSibling.tagName){let i=r(this.loadMore,e.nextElementSibling);i&&(i.click(),await t(1e3))}e=e.nextElementSibling,await t(500)}}async*iterPosts(e){let i=0;for(;e&&++i<=3;)for(e.click(),await t(1e3),await fetch(window.location.href),yield*this.iterSubposts(),await Promise.race([this.iterComments(),t(2e4)]),e=r(this.nextPost);!e&&r(this.postLoading);)await t(500);await t(1e3)}async*[Symbol.asyncIterator](){await this.viewFirstPost();for await(const e of this.iterRow()){e.scrollIntoView(this.scrollOpts),await t(500);const i=r(this.firstPostInRow,e);yield*this.iterPosts(i);const s=r(this.postCloseButton);s&&s.click(),await t(1e3)}}async run(){for await(const t of this)console.log("scroll instagram row",t)}}class p extends n{static isMatch(){return window.location.href.match(/https:\/\/(www\.)?twitter\.com\//)}static get name(){return"Twitter"}constructor(t=1){super(),this.maxDepth=t||0,this.rootPath="//div[starts-with(@aria-label, 'Timeline')]/*[1]",this.anchorQuery=".//article",this.childMatchSelect="string(.//article//a[starts-with(@href, '/') and @aria-label]/@href)",this.childMatch="child::div[.//a[@href='$1']]",this.expandQuery=".//div[@role='button' and @aria-haspopup='false']//*[contains(text(), 'more repl')]",this.quoteQuery=".//div[@role='blockquote' and @aria-haspopup='false']",this.imageQuery=".//a[@role='link' and @aria-haspopup='false' and starts-with(@href, '/') and contains(@href, '/photo/')]",this.imageNextQuery="//div[@aria-label='Next']",this.imageCloseQuery="//div[@aria-label='Close' and @role='button']",this.backButtonQuery="//div[@aria-label='Back' and @role='button']",this.progressQuery=".//*[@role='progressbar']",this.promoted='.//*[text()="Promoted"]',this.seenTweets=new Set,this.seenMediaTweets=new Set,this.state={videos:0,images:0,threadsOrReplies:0,viewedFully:0}}getState(t,e){return e&&null!=this.state[e]&&this.state[e]++,{state:this.state,msg:t}}async waitForNext(e){if(!e)return null;if(await t(100),!e.nextElementSibling)return null;for(;r(this.progressQuery,e.nextElementSibling);)await t(100);return e.nextElementSibling}async expandMore(e){const i=r(this.expandQuery,e);if(!i)return e;const s=e.previousElementSibling;for(i.click(),await t(100);r(this.progressQuery,s.nextElementSibling);)await t(100);return s.nextElementSibling}async*infScroll(){let e=r(this.rootPath);if(!e)return;let i=e.firstElementChild;if(i)for(;i;){let e=r(this.anchorQuery,i);if(!e&&this.expandQuery&&(i=await this.expandMore(i,this.expandQuery,this.progressQuery),e=r(this.anchorQuery,i)),i&&i.innerText&&i.scrollIntoView(),i&&e){await t(100);const a=new s(this.childMatchSelect,i);a.matchValue&&(yield e,i=await a.restore(this.rootPath,this.childMatch))}i=await this.waitForNext(i,this.progressQuery)}}async*mediaPlaying(e){const i=r("(.//video | .//audio)",e);if(!i||i.paused)return;let s="Waiting for media playback ";try{const t=new URL(o(this.childMatchSelect,e.parentElement),window.location.origin).href;if(this.seenMediaTweets.has(t))return;s+="for "+t,this.seenMediaTweets.add(t)}catch(t){console.warn(t)}s+="to finish...",yield this.getState(s,"videos");const a=new Promise((t=>{i.addEventListener("ended",(()=>t())),i.addEventListener("abort",(()=>t())),i.addEventListener("error",(()=>t())),i.addEventListener("pause",(()=>t()))}));await Promise.race([a,t(6e4)])}async*iterTimeline(e=0){if(!this.seenTweets.has(window.location.href)){yield this.getState("Capturing thread/timeline: "+window.location.href);for await(const i of this.infScroll()){if(r(this.promoted,i))continue;await t(1e3);const s=r(this.imageQuery,i);if(s){const e=new a((()=>s.click()));yield this.getState("Loading Image: "+window.location.href,"images"),await t(1e3);let i=null,o=window.location.href;for(;null!=(i=r(this.imageNextQuery));){if(i.click(),await t(400),window.location.href===o){await t(1e3);break}o=window.location.href,yield this.getState("Loading Image: "+window.location.href,"images"),await t(1e3)}await e.goBack(this.imageCloseQuery)}const o=r(this.quoteQuery,i);if(o){const i=new a((()=>o.click()));await t(100),yield this.getState("Capturing Quote: "+window.location.href),!this.seenTweets.has(window.location.href)&&e<this.maxDepth&&(yield*this.iterTimeline(e+1,this.maxDepth),this.seenTweets.add(window.location.href)),await t(2e3),await i.goBack(this.backButtonQuery),await t(1e3)}yield*this.mediaPlaying(i);const n=new a((()=>i.click()));await t(200),n.changed&&(yield this.getState("Capturing Tweet: "+window.location.href),!this.seenTweets.has(window.location.href)&&e<this.maxDepth&&(yield*this.iterTimeline(e+1,this.maxDepth),this.seenTweets.add(window.location.href)),await t(500),await n.goBack(this.backButtonQuery)),0===e?this.state.viewedFully++:this.state.threadsOrReplies++,await t(1e3)}}}async*[Symbol.asyncIterator](){yield*this.iterTimeline(0),yield this.getState("Done")}}const g=[f,p];self.__wb_behaviors=new class{constructor(){this.behaviors=[],this.mainBehavior=null}init(t={}){t.autofetch&&this.behaviors.push(new u),t.autoplay&&this.behaviors.push(new w);let e=!1;if(t.siteSpecific)for(const t of g)if(t.isMatch()){console.log("Starting Site-Specific Behavior: "+t.name),this.mainBehavior=new t,e=!0;break}!e&&t.autoscroll&&(this.mainBehavior=new m),this.mainBehavior&&this.behaviors.push(this.mainBehavior),this.timeout=t.timeout}start(){i((()=>{this.mainBehavior&&this.mainBehavior.start()}))}done(){const e=Promise.all(this.behaviors.map((t=>t.done())));return this.timeout?Promise.race([e,t(this.timeout)]):e}pause(){console.log("pausing"),this.mainBehavior&&this.mainBehavior.pause()}unpause(){console.log("unpausing"),this.mainBehavior&&this.mainBehavior.unpause()}}})();