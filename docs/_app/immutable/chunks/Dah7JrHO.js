var fn=Array.isArray,un=Array.prototype.indexOf,zn=Array.from,Wn=Object.defineProperty,G=Object.getOwnPropertyDescriptor,on=Object.getOwnPropertyDescriptors,_n=Object.prototype,cn=Array.prototype,Pt=Object.getPrototypeOf,Dt=Object.isExtensible;function Xn(t){return typeof t=="function"}const Jn=()=>{};function Qn(t){return t()}function Ct(t){for(var n=0;n<t.length;n++)t[n]()}const b=2,Ft=4,it=8,mt=16,O=32,B=64,et=128,A=256,rt=512,m=1024,P=2048,H=4096,Y=8192,ot=16384,vn=32768,Mt=65536,te=1<<17,hn=1<<19,Lt=1<<20,dt=1<<21,K=Symbol("$state"),ne=Symbol("legacy props"),ee=Symbol("");function qt(t){return t===this.v}function pn(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function Yt(t){return!pn(t,this.v)}function dn(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function wn(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function yn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function En(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function re(){throw new Error("https://svelte.dev/e/hydration_failed")}function le(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function gn(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function mn(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Tn(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let _t=!1;function ae(){_t=!0}const se=1,fe=2,ue=16,ie=1,oe=2,_e=4,ce=8,ve=16,he=1,pe=2,An="[",xn="[!",Rn="]",jt={},E=Symbol(),de="http://www.w3.org/1999/xhtml";function Bt(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let d=null;function Ot(t){d=t}function we(t,n=!1,e){var r=d={p:d,c:null,d:!1,e:null,m:!1,s:t,x:null,l:null};_t&&!n&&(d.l={s:null,u:null,r1:[],r2:Tt(!1)}),Nn(()=>{r.d=!0})}function ye(t){const n=d;if(n!==null){const _=n.e;if(_!==null){var e=h,r=v;n.e=null;try{for(var a=0;a<_.length;a++){var l=_[a];st(l.effect),j(l.reaction),Zt(l.fn)}}finally{st(e),j(r)}}d=n.p,n.m=!0}return{}}function ct(){return!_t||d!==null&&d.l===null}function q(t,n){if(typeof t!="object"||t===null||K in t)return t;const e=Pt(t);if(e!==_n&&e!==cn)return t;var r=new Map,a=fn(t),l=k(0),_=v,c=u=>{var s=v;j(_);var f;return f=u(),j(s),f};return a&&r.set("length",k(t.length)),new Proxy(t,{defineProperty(u,s,f){(!("value"in f)||f.configurable===!1||f.enumerable===!1||f.writable===!1)&&gn();var i=r.get(s);return i===void 0?(i=c(()=>k(f.value)),r.set(s,i)):S(i,c(()=>q(f.value))),!0},deleteProperty(u,s){var f=r.get(s);if(f===void 0)s in u&&r.set(s,c(()=>k(E)));else{if(a&&typeof s=="string"){var i=r.get("length"),o=Number(s);Number.isInteger(o)&&o<i.v&&S(i,o)}S(f,E),It(l)}return!0},get(u,s,f){var I;if(s===K)return t;var i=r.get(s),o=s in u;if(i===void 0&&(!o||(I=G(u,s))!=null&&I.writable)&&(i=c(()=>k(q(o?u[s]:E))),r.set(s,i)),i!==void 0){var p=V(i);return p===E?void 0:p}return Reflect.get(u,s,f)},getOwnPropertyDescriptor(u,s){var f=Reflect.getOwnPropertyDescriptor(u,s);if(f&&"value"in f){var i=r.get(s);i&&(f.value=V(i))}else if(f===void 0){var o=r.get(s),p=o==null?void 0:o.v;if(o!==void 0&&p!==E)return{enumerable:!0,configurable:!0,value:p,writable:!0}}return f},has(u,s){var p;if(s===K)return!0;var f=r.get(s),i=f!==void 0&&f.v!==E||Reflect.has(u,s);if(f!==void 0||h!==null&&(!i||(p=G(u,s))!=null&&p.writable)){f===void 0&&(f=c(()=>k(i?q(u[s]):E)),r.set(s,f));var o=V(f);if(o===E)return!1}return i},set(u,s,f,i){var bt;var o=r.get(s),p=s in u;if(a&&s==="length")for(var I=f;I<o.v;I+=1){var Q=r.get(I+"");Q!==void 0?S(Q,E):I in u&&(Q=c(()=>k(E)),r.set(I+"",Q))}o===void 0?(!p||(bt=G(u,s))!=null&&bt.writable)&&(o=c(()=>k(void 0)),S(o,c(()=>q(f))),r.set(s,o)):(p=o.v!==E,S(o,c(()=>q(f))));var tt=Reflect.getOwnPropertyDescriptor(u,s);if(tt!=null&&tt.set&&tt.set.call(i,f),!p){if(a&&typeof s=="string"){var Rt=r.get("length"),pt=Number(s);Number.isInteger(pt)&&pt>=Rt.v&&S(Rt,pt+1)}It(l)}return!0},ownKeys(u){V(l);var s=Reflect.ownKeys(u).filter(o=>{var p=r.get(o);return p===void 0||p.v!==E});for(var[f,i]of r)i.v!==E&&!(f in u)&&s.push(f);return s},setPrototypeOf(){mn()}})}function It(t,n=1){S(t,t.v+n)}const Z=new Map;function Tt(t,n){var e={f:0,v:t,reactions:null,equals:qt,rv:0,wv:0};return e}function k(t,n){const e=Tt(t);return nn(e),e}function Ee(t,n=!1){var r;const e=Tt(t);return n||(e.equals=Yt),_t&&d!==null&&d.l!==null&&((r=d.l).s??(r.s=[])).push(e),e}function S(t,n,e=!1){v!==null&&!R&&ct()&&(v.f&(b|mt))!==0&&!(y!=null&&y.includes(t))&&Tn();let r=e?q(n):n;return bn(t,r)}function bn(t,n){if(!t.equals(n)){var e=t.v;X?Z.set(t,n):Z.set(t,e),t.v=n,t.wv=rn(),Ht(t,P),ct()&&h!==null&&(h.f&m)!==0&&(h.f&(O|B))===0&&(T===null?jn([t]):T.push(t))}return n}function Ht(t,n){var e=t.reactions;if(e!==null)for(var r=ct(),a=e.length,l=0;l<a;l++){var _=e[l],c=_.f;(c&P)===0&&(!r&&_===h||(D(_,n),(c&(m|A))!==0&&((c&b)!==0?Ht(_,H):ht(_))))}}let F=!1;function ge(t){F=t}let x;function z(t){if(t===null)throw Bt(),jt;return x=t}function me(){return z(L(x))}function Te(t){if(F){if(L(x)!==null)throw Bt(),jt;x=t}}function Ae(t=1){if(F){for(var n=t,e=x;n--;)e=L(e);x=e}}function xe(){for(var t=0,n=x;;){if(n.nodeType===8){var e=n.data;if(e===Rn){if(t===0)return n;t-=1}else(e===An||e===xn)&&(t+=1)}var r=L(n);n.remove(),n=r}}var kt,Dn,On,Ut,Vt;function Re(){if(kt===void 0){kt=window,Dn=document,On=/Firefox/.test(navigator.userAgent);var t=Element.prototype,n=Node.prototype,e=Text.prototype;Ut=G(n,"firstChild").get,Vt=G(n,"nextSibling").get,Dt(t)&&(t.__click=void 0,t.__className=void 0,t.__attributes=null,t.__style=void 0,t.__e=void 0),Dt(e)&&(e.__t=void 0)}}function wt(t=""){return document.createTextNode(t)}function yt(t){return Ut.call(t)}function L(t){return Vt.call(t)}function be(t,n){if(!F)return yt(t);var e=yt(x);if(e===null)e=x.appendChild(wt());else if(n&&e.nodeType!==3){var r=wt();return e==null||e.before(r),z(r),r}return z(e),e}function De(t,n){if(!F){var e=yt(t);return e instanceof Comment&&e.data===""?L(e):e}return x}function Oe(t,n=1,e=!1){let r=F?x:t;for(var a;n--;)a=r,r=L(r);if(!F)return r;var l=r==null?void 0:r.nodeType;if(e&&l!==3){var _=wt();return r===null?a==null||a.after(_):r.before(_),z(_),_}return z(r),r}function Ie(t){t.textContent=""}function At(t){var n=b|P,e=v!==null&&(v.f&b)!==0?v:null;return h===null||e!==null&&(e.f&A)!==0?n|=A:h.f|=Lt,{ctx:d,deps:null,effects:null,equals:qt,f:n,fn:t,reactions:null,rv:0,v:null,wv:0,parent:e??h}}function ke(t){const n=At(t);return nn(n),n}function Se(t){const n=At(t);return n.equals=Yt,n}function Gt(t){var n=t.effects;if(n!==null){t.effects=null;for(var e=0;e<n.length;e+=1)M(n[e])}}function In(t){for(var n=t.parent;n!==null;){if((n.f&b)===0)return n;n=n.parent}return null}function kn(t){var n,e=h;st(In(t));try{Gt(t),n=an(t)}finally{st(e)}return n}function Kt(t){var n=kn(t),e=(N||(t.f&A)!==0)&&t.deps!==null?H:m;D(t,e),t.equals(n)||(t.v=n,t.wv=rn())}function $t(t){h===null&&v===null&&yn(),v!==null&&(v.f&A)!==0&&h===null&&wn(),X&&dn()}function Sn(t,n){var e=n.last;e===null?n.last=n.first=t:(e.next=t,t.prev=e,n.last=t)}function U(t,n,e,r=!0){var a=h,l={ctx:d,deps:null,nodes_start:null,nodes_end:null,f:t|P,first:null,fn:n,last:null,next:null,parent:a,prev:null,teardown:null,transitions:null,wv:0};if(e)try{xt(l),l.f|=vn}catch(u){throw M(l),u}else n!==null&&ht(l);var _=e&&l.deps===null&&l.first===null&&l.nodes_start===null&&l.teardown===null&&(l.f&(Lt|et))===0;if(!_&&r&&(a!==null&&Sn(l,a),v!==null&&(v.f&b)!==0)){var c=v;(c.effects??(c.effects=[])).push(l)}return l}function Nn(t){const n=U(it,null,!1);return D(n,m),n.teardown=t,n}function Ne(t){$t();var n=h!==null&&(h.f&O)!==0&&d!==null&&!d.m;if(n){var e=d;(e.e??(e.e=[])).push({fn:t,effect:h,reaction:v})}else{var r=Zt(t);return r}}function Pe(t){return $t(),Pn(t)}function Ce(t){const n=U(B,t,!0);return(e={})=>new Promise(r=>{e.outro?Mn(n,()=>{M(n),r(void 0)}):(M(n),r(void 0))})}function Zt(t){return U(Ft,t,!1)}function Pn(t){return U(it,t,!0)}function Fe(t,n=[],e=At){const r=n.map(e);return Cn(()=>t(...r.map(V)))}function Cn(t,n=0){return U(it|mt|n,t,!0)}function Me(t,n=!0){return U(it|O,t,!0,n)}function zt(t){var n=t.teardown;if(n!==null){const e=X,r=v;Nt(!0),j(null);try{n.call(null)}finally{Nt(e),j(r)}}}function Wt(t,n=!1){var e=t.first;for(t.first=t.last=null;e!==null;){var r=e.next;(e.f&B)!==0?e.parent=null:M(e,n),e=r}}function Fn(t){for(var n=t.first;n!==null;){var e=n.next;(n.f&O)===0&&M(n),n=e}}function M(t,n=!0){var e=!1;if((n||(t.f&hn)!==0)&&t.nodes_start!==null){for(var r=t.nodes_start,a=t.nodes_end;r!==null;){var l=r===a?null:L(r);r.remove(),r=l}e=!0}Wt(t,n&&!e),ut(t,0),D(t,ot);var _=t.transitions;if(_!==null)for(const u of _)u.stop();zt(t);var c=t.parent;c!==null&&c.first!==null&&Xt(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Xt(t){var n=t.parent,e=t.prev,r=t.next;e!==null&&(e.next=r),r!==null&&(r.prev=e),n!==null&&(n.first===t&&(n.first=r),n.last===t&&(n.last=e))}function Mn(t,n){var e=[];Jt(t,e,!0),Ln(e,()=>{M(t),n&&n()})}function Ln(t,n){var e=t.length;if(e>0){var r=()=>--e||n();for(var a of t)a.out(r)}else n()}function Jt(t,n,e){if((t.f&Y)===0){if(t.f^=Y,t.transitions!==null)for(const _ of t.transitions)(_.is_global||e)&&n.push(_);for(var r=t.first;r!==null;){var a=r.next,l=(r.f&Mt)!==0||(r.f&O)!==0;Jt(r,n,l?e:!1),r=a}}}function Le(t){Qt(t,!0)}function Qt(t,n){if((t.f&Y)!==0){t.f^=Y,(t.f&m)===0&&(t.f^=m),J(t)&&(D(t,P),ht(t));for(var e=t.first;e!==null;){var r=e.next,a=(e.f&Mt)!==0||(e.f&O)!==0;Qt(e,a?n:!1),e=r}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||n)&&l.in()}}let W=[],Et=[];function tn(){var t=W;W=[],Ct(t)}function qn(){var t=Et;Et=[],Ct(t)}function qe(t){W.length===0&&queueMicrotask(tn),W.push(t)}function St(){W.length>0&&tn(),Et.length>0&&qn()}let nt=!1,lt=!1,at=null,C=!1,X=!1;function Nt(t){X=t}let $=[];let v=null,R=!1;function j(t){v=t}let h=null;function st(t){h=t}let y=null;function Yn(t){y=t}function nn(t){v!==null&&v.f&dt&&(y===null?Yn([t]):y.push(t))}let w=null,g=0,T=null;function jn(t){T=t}let en=1,ft=0,N=!1;function rn(){return++en}function J(t){var i;var n=t.f;if((n&P)!==0)return!0;if((n&H)!==0){var e=t.deps,r=(n&A)!==0;if(e!==null){var a,l,_=(n&rt)!==0,c=r&&h!==null&&!N,u=e.length;if(_||c){var s=t,f=s.parent;for(a=0;a<u;a++)l=e[a],(_||!((i=l==null?void 0:l.reactions)!=null&&i.includes(s)))&&(l.reactions??(l.reactions=[])).push(s);_&&(s.f^=rt),c&&f!==null&&(f.f&A)===0&&(s.f^=A)}for(a=0;a<u;a++)if(l=e[a],J(l)&&Kt(l),l.wv>t.wv)return!0}(!r||h!==null&&!N)&&D(t,m)}return!1}function Bn(t,n){for(var e=n;e!==null;){if((e.f&et)!==0)try{e.fn(t);return}catch{e.f^=et}e=e.parent}throw nt=!1,t}function Hn(t){return(t.f&ot)===0&&(t.parent===null||(t.parent.f&et)===0)}function vt(t,n,e,r){if(nt){if(e===null&&(nt=!1),Hn(n))throw t;return}e!==null&&(nt=!0);{Bn(t,n);return}}function ln(t,n,e=!0){var r=t.reactions;if(r!==null)for(var a=0;a<r.length;a++){var l=r[a];y!=null&&y.includes(t)||((l.f&b)!==0?ln(l,n,!1):n===l&&(e?D(l,P):(l.f&m)!==0&&D(l,H),ht(l)))}}function an(t){var p;var n=w,e=g,r=T,a=v,l=N,_=y,c=d,u=R,s=t.f;w=null,g=0,T=null,N=(s&A)!==0&&(R||!C||v===null),v=(s&(O|B))===0?t:null,y=null,Ot(t.ctx),R=!1,ft++,t.f|=dt;try{var f=(0,t.fn)(),i=t.deps;if(w!==null){var o;if(ut(t,g),i!==null&&g>0)for(i.length=g+w.length,o=0;o<w.length;o++)i[g+o]=w[o];else t.deps=i=w;if(!N)for(o=g;o<i.length;o++)((p=i[o]).reactions??(p.reactions=[])).push(t)}else i!==null&&g<i.length&&(ut(t,g),i.length=g);if(ct()&&T!==null&&!R&&i!==null&&(t.f&(b|H|P))===0)for(o=0;o<T.length;o++)ln(T[o],t);return a!==null&&(ft++,T!==null&&(r===null?r=T:r.push(...T))),f}finally{w=n,g=e,T=r,v=a,N=l,y=_,Ot(c),R=u,t.f^=dt}}function Un(t,n){let e=n.reactions;if(e!==null){var r=un.call(e,t);if(r!==-1){var a=e.length-1;a===0?e=n.reactions=null:(e[r]=e[a],e.pop())}}e===null&&(n.f&b)!==0&&(w===null||!w.includes(n))&&(D(n,H),(n.f&(A|rt))===0&&(n.f^=rt),Gt(n),ut(n,0))}function ut(t,n){var e=t.deps;if(e!==null)for(var r=n;r<e.length;r++)Un(t,e[r])}function xt(t){var n=t.f;if((n&ot)===0){D(t,m);var e=h,r=d,a=C;h=t,C=!0;try{(n&mt)!==0?Fn(t):Wt(t),zt(t);var l=an(t);t.teardown=typeof l=="function"?l:null,t.wv=en;var _=t.deps,c}catch(u){vt(u,t,e,r||t.ctx)}finally{C=a,h=e}}}function Vn(){try{En()}catch(t){if(at!==null)vt(t,at,null);else throw t}}function sn(){var t=C;try{var n=0;for(C=!0;$.length>0;){n++>1e3&&Vn();var e=$,r=e.length;$=[];for(var a=0;a<r;a++){var l=Kn(e[a]);Gn(l)}}}finally{lt=!1,C=t,at=null,Z.clear()}}function Gn(t){var n=t.length;if(n!==0)for(var e=0;e<n;e++){var r=t[e];if((r.f&(ot|Y))===0)try{J(r)&&(xt(r),r.deps===null&&r.first===null&&r.nodes_start===null&&(r.teardown===null?Xt(r):r.fn=null))}catch(a){vt(a,r,null,r.ctx)}}}function ht(t){lt||(lt=!0,queueMicrotask(sn));for(var n=at=t;n.parent!==null;){n=n.parent;var e=n.f;if((e&(B|O))!==0){if((e&m)===0)return;n.f^=m}}$.push(n)}function Kn(t){for(var n=[],e=t;e!==null;){var r=e.f,a=(r&(O|B))!==0,l=a&&(r&m)!==0;if(!l&&(r&Y)===0){if((r&Ft)!==0)n.push(e);else if(a)e.f^=m;else{var _=v;try{v=e,J(e)&&xt(e)}catch(s){vt(s,e,null,e.ctx)}finally{v=_}}var c=e.first;if(c!==null){e=c;continue}}var u=e.parent;for(e=e.next;e===null&&u!==null;)e=u.next,u=u.parent}return n}function $n(t){var n;for(St();$.length>0;)lt=!0,sn(),St();return n}async function Ye(){await Promise.resolve(),$n()}function V(t){var n=t.f,e=(n&b)!==0;if(v!==null&&!R){if(!(y!=null&&y.includes(t))){var r=v.deps;t.rv<ft&&(t.rv=ft,w===null&&r!==null&&r[g]===t?g++:w===null?w=[t]:(!N||!w.includes(t))&&w.push(t))}}else if(e&&t.deps===null&&t.effects===null){var a=t,l=a.parent;l!==null&&(l.f&A)===0&&(a.f^=A)}return e&&(a=t,J(a)&&Kt(a)),X&&Z.has(t)?Z.get(t):t.v}function je(t){var n=R;try{return R=!0,t()}finally{R=n}}const Zn=-7169;function D(t,n){t.f=t.f&Zn|n}function Be(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(K in t)gt(t);else if(!Array.isArray(t))for(let n in t){const e=t[n];typeof e=="object"&&e&&K in e&&gt(e)}}}function gt(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let r in t)try{gt(t[r],n)}catch{}const e=Pt(t);if(e!==Object.prototype&&e!==Array.prototype&&e!==Map.prototype&&e!==Set.prototype&&e!==Date.prototype){const r=on(e);for(let a in r){const l=r[a].get;if(l)try{l.call(t)}catch{}}}}}export{Dn as $,be as A,Te as B,_t as C,G as D,le as E,Se as F,Yt as G,jt as H,q as I,S as J,Ee as K,te as L,ce as M,ne as N,oe as O,_e as P,ie as Q,ve as R,K as S,Xn as T,Mt as U,An as V,xn as W,xe as X,ge as Y,Le as Z,Mn as _,me as a,E as a0,Wn as a1,j as a2,st as a3,fn as a4,v as a5,h as a6,Re as a7,Rn as a8,re as a9,se as aA,ue as aB,pn as aC,Ie as aa,zn as ab,Ce as ac,wt as ad,hn as ae,On as af,he as ag,pe as ah,Jn as ai,de as aj,Pt as ak,on as al,ee as am,k as an,Zt as ao,Pn as ap,qe as aq,$n as ar,Ye as as,ke as at,Tt as au,Y as av,fe as aw,bn as ax,Jt as ay,Ln as az,Cn as b,Me as c,x as d,ae as e,De as f,L as g,F as h,Bt as i,z as j,yt as k,M as l,d as m,Ae as n,Ne as o,je as p,V as q,Ct as r,Oe as s,Qn as t,Pe as u,Be as v,At as w,we as x,Fe as y,ye as z};
