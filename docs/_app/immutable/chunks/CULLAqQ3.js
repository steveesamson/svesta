import{b as A,h as R,a as I,U as k,V as p,W as w,X as P,j as y,Y as T,Z as d,c as g,_ as S,a0 as L,d as N}from"./Dah7JrHO.js";function B(h,u,[a,n]=[0,0]){R&&a===0&&I();var l=h,i=null,s=null,e=L,m=a>0?k:0,r=!1;const c=(E,t=!0)=>{r=!0,v(t,E)},v=(E,t)=>{if(e===(e=E))return;let o=!1;if(R&&n!==-1){if(a===0){const b=l.data;b===p?n=0:b===w?n=1/0:(n=parseInt(b.substring(1)),n!==n&&(n=e?1/0:-1))}const f=n>a;!!e===f&&(l=P(),y(l),T(!1),o=!0,n=-1)}e?(i?d(i):t&&(i=g(()=>t(l))),s&&S(s,()=>{s=null})):(s?d(s):t&&(s=g(()=>t(l,[a+1,n]))),i&&S(i,()=>{i=null})),o&&T(!0)};A(()=>{r=!1,u(c),r||v(null,null)},m),R&&(l=N)}const C="modulepreload",U=function(h,u){return new URL(h,u).href},_={},D=function(u,a,n){let l=Promise.resolve();if(a&&a.length>0){const s=document.getElementsByTagName("link"),e=document.querySelector("meta[property=csp-nonce]"),m=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));l=Promise.allSettled(a.map(r=>{if(r=U(r,n),r in _)return;_[r]=!0;const c=r.endsWith(".css"),v=c?'[rel="stylesheet"]':"";if(!!n)for(let o=s.length-1;o>=0;o--){const f=s[o];if(f.href===r&&(!c||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${r}"]${v}`))return;const t=document.createElement("link");if(t.rel=c?"stylesheet":C,c||(t.as="script"),t.crossOrigin="",t.href=r,m&&t.setAttribute("nonce",m),document.head.appendChild(t),c)return new Promise((o,f)=>{t.addEventListener("load",o),t.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${r}`)))})}))}function i(s){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=s,window.dispatchEvent(e),!e.defaultPrevented)throw s}return l.then(s=>{for(const e of s||[])e.status==="rejected"&&i(e.reason);return u().catch(i)})};export{D as _,B as i};
