var Nn=Array.isArray,nt=Array.from,tt=Object.isFrozen,et=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,Cn=Object.getOwnPropertyDescriptors,st=Object.prototype,ot=Array.prototype,kn=Object.getPrototypeOf;function ut(n){return typeof n=="function"}const R=2,rn=4,P=8,sn=16,T=32,V=64,w=128,b=256,E=512,y=1024,I=2048,k=4096,x=8192,xn=16384,on=32768,lt=65536,W=Symbol("$state"),it=Symbol("$state.frozen"),ft=Symbol("");function un(n){return n===this.v}function gn(n,t){return n!=n?t==t:n!==t||n!==null&&typeof n=="object"||typeof n=="function"}function ln(n){return!gn(n,this.v)}const at=1,ct=2,_t=4,pt=8,vt=16,dt=64,ht=1,Et=2,yt=4,Tt=8,mt=1,At=2,wt="[",Pn="]",Ot="",St=`${Pn}!`,Rt={},Ln=Symbol(),It=["touchstart","touchmove","touchend"];function qn(n){throw new Error("effect_in_teardown")}function Fn(){throw new Error("effect_in_unowned_derived")}function bn(n){throw new Error("effect_orphan")}function Mn(){throw new Error("effect_update_depth_exceeded")}function Dt(){throw new Error("hydration_failed")}function Nt(n){throw new Error("props_invalid_value")}function Hn(){throw new Error("state_unsafe_mutation")}function fn(n){return{f:0,v:n,reactions:null,equals:un,version:0}}function Ct(n){var e;const t=fn(n);return t.equals=ln,d!==null&&d.l!==null&&((e=d.l).s??(e.s=[])).push(t),t}function kt(n,t){var e=n.v!==Ln;return e&&a!==null&&z()&&a.f&R&&Hn(),n.equals(t)||(n.v=t,n.version=An(),Q(n,y,!0),z()&&e&&f!==null&&f.f&E&&!(f.f&T)&&(p!==null&&p.includes(n)?(h(f,y),j(f)):A===null?$n([n]):A.push(n))),t}function xt(n){var t=document.createElement("template");return t.innerHTML=n,t.content}function Yn(n){if(Nn(n))for(var t=0;t<n.length;t++){var e=n[t];e.isConnected&&e.remove()}else n.isConnected&&n.remove()}function an(n){f===null&&a===null&&bn(),a!==null&&a.f&w&&Fn(),G&&qn()}function X(n,t){var e=t.last;e===null?t.last=t.first=n:(e.next=n,n.prev=e,t.last=n)}function L(n,t,e){var r=(n&V)!==0,s={ctx:d,deps:null,dom:null,f:n|y,first:null,fn:t,last:null,next:null,parent:r?null:f,prev:null,teardown:null,transitions:null};if(e){var o=N;try{J(!0),Y(s),s.f|=xn}finally{J(o)}}else t!==null&&j(s);var c=e&&s.deps===null&&s.first===null&&s.dom===null&&s.teardown===null;return!c&&!r&&(f!==null&&X(s,f),a!==null&&a.f&R&&X(s,a)),s}function gt(n){an();var t=f!==null&&(f.f&P)!==0&&d!==null&&!d.m;if(t){var e=d;(e.e??(e.e=[])).push(n)}else{var r=cn(n);return r}}function Pt(n){return an(),_n(n)}function Lt(n){const t=L(V,n,!0);return()=>{$(t)}}function cn(n){return L(rn,n,!1)}function _n(n){return L(P,n,!0)}function qt(n){return _n(n)}function Ft(n,t=0){return L(P|sn|t,n,!0)}function bt(n){return L(P|T,n,!0)}function pn(n){var t=n.teardown;if(t!==null){const e=G,r=a;nn(!0),tn(null);try{t.call(null)}finally{nn(e),tn(r)}}}function $(n,t=!0){var e=n.dom;if(e!==null&&t&&Yn(e),Z(n,t),H(n,0),h(n,x),n.transitions)for(const s of n.transitions)s.stop();pn(n);var r=n.parent;r!==null&&n.f&T&&r.first!==null&&vn(n),n.next=n.prev=n.teardown=n.ctx=n.dom=n.deps=n.parent=n.fn=null}function vn(n){var t=n.parent,e=n.prev,r=n.next;e!==null&&(e.next=r),r!==null&&(r.prev=e),t!==null&&(t.first===n&&(t.first=r),t.last===n&&(t.last=e))}function Mt(n,t){var e=[];dn(n,e,!0),jn(e,()=>{$(n),t&&t()})}function jn(n,t){var e=n.length;if(e>0){var r=()=>--e||t();for(var s of n)s.out(r)}else t()}function dn(n,t,e){if(!(n.f&k)){if(n.f^=k,n.transitions!==null)for(const c of n.transitions)(c.is_global||e)&&t.push(c);for(var r=n.first;r!==null;){var s=r.next,o=(r.f&on)!==0||(r.f&T)!==0;dn(r,t,o?e:!1),r=s}}}function Ht(n){hn(n,!0)}function hn(n,t){if(n.f&k){n.f^=k,q(n)&&Y(n);for(var e=n.first;e!==null;){var r=e.next,s=(e.f&on)!==0||(e.f&T)!==0;hn(e,s?t:!1),e=r}if(n.transitions!==null)for(const o of n.transitions)(o.is_global||t)&&o.in()}}const Yt=()=>{};function jt(n){return n()}function Un(n){for(var t=0;t<n.length;t++)n[t]()}let M=!1,B=[];function En(){M=!1;const n=B.slice();B=[],Un(n)}function Ut(n){M||(M=!0,queueMicrotask(En)),B.push(n)}function Bn(){M&&En()}function zn(n){let t=R|y;f===null&&(t|=w);const e={deps:null,deriveds:null,equals:un,f:t,first:null,fn:n,last:null,reactions:null,v:null,version:0};if(a!==null&&a.f&R){var r=a;r.deriveds===null?r.deriveds=[e]:r.deriveds.push(e)}return e}function Bt(n){const t=zn(n);return t.equals=ln,t}function yn(n){Z(n);var t=n.deriveds;if(t!==null){n.deriveds=null;for(var e=0;e<t.length;e+=1)Kn(t[e])}}function Tn(n){yn(n);var t=wn(n),e=(D||n.f&w)&&n.deps!==null?I:E;h(n,e),n.equals(t)||(n.v=t,n.version=An(),Q(n,y,!1))}function Kn(n){yn(n),H(n,0),h(n,x),n.first=n.last=n.deps=n.reactions=n.fn=null}const mn=0,Vn=1;let F=mn,g=!1,N=!1,G=!1;function J(n){N=n}function nn(n){G=n}let S=[],C=0,a=null;function tn(n){a=n}let f=null,p=null,_=0,A=null;function $n(n){A=n}let Gn=0,D=!1,d=null;function An(){return Gn++}function z(){return d!==null&&d.l===null}function q(n){var O;var t=n.f,e=(t&y)!==0;if(e)return!0;var r=(t&w)!==0,s=(t&b)!==0;if(t&I){var o=n.deps;if(o!==null)for(var c=o.length,l,u=0;u<c;u++){var i=o[u];!e&&q(i)&&Tn(i);var v=i.version;if(r){if(v>n.version)return!0;!D&&!((O=i==null?void 0:i.reactions)!=null&&O.includes(n))&&(i.reactions??(i.reactions=[])).push(n)}else{if(n.f&y)return!0;s&&(v>n.version&&(e=!0),l=i.reactions,l===null?i.reactions=[n]:l.includes(n)||l.push(n))}}r||h(n,E),s&&(n.f^=b)}return e}function Zn(n,t,e){throw n}function wn(n){const t=p,e=_,r=A,s=a,o=D;p=null,_=0,A=null,a=n.f&(T|V)?null:n,D=!N&&(n.f&w)!==0;try{let c=(0,n.fn)(),l=n.deps;if(p!==null){let u;if(l!==null){const i=l.length,v=_===0?p:l.slice(0,_).concat(p),m=v.length>16&&i-_>1?new Set(v):null;for(u=_;u<i;u++){const U=l[u];(m!==null?!m.has(U):!v.includes(U))&&On(n,U)}}if(l!==null&&_>0)for(l.length=_+p.length,u=0;u<p.length;u++)l[_+u]=p[u];else n.deps=l=p;if(!D)for(u=_;u<l.length;u++){const i=l[u],v=i.reactions;v===null?i.reactions=[n]:v[v.length-1]!==n&&!v.includes(n)&&v.push(n)}}else l!==null&&_<l.length&&(H(n,_),l.length=_);return c}finally{p=t,_=e,A=r,a=s,D=o}}function On(n,t){const e=t.reactions;let r=0;if(e!==null){r=e.length-1;const s=e.indexOf(n);s!==-1&&(r===0?t.reactions=null:(e[s]=e[r],e.pop()))}r===0&&t.f&R&&(h(t,I),t.f&(w|b)||(t.f^=b),H(t,0))}function H(n,t){const e=n.deps;if(e!==null){const r=t===0?null:e.slice(0,t);let s;for(s=t;s<e.length;s++){const o=e[s];(r===null||!r.includes(o))&&On(n,o)}}}function Z(n,t=!0){let e=n.first;n.first=null,n.last=null;for(var r;e!==null;)r=e.next,$(e,t),e=r}function Y(n){var t=n.f;if(!(t&x)){h(n,E);var e=n.ctx,r=f,s=d;f=n,d=e;try{t&sn||Z(n),pn(n);var o=wn(n);n.teardown=typeof o=="function"?o:null}catch(c){Zn(c)}finally{f=r,d=s}}}function Sn(){C>1e3&&(C=0,Mn()),C++}function Rn(n){var t=n.length;if(t!==0){Sn();var e=N;N=!0;try{for(var r=0;r<t;r++){var s=n[r];if(s.first===null&&!(s.f&T))en([s]);else{var o=[];In(s,o),en(o)}}}finally{N=e}}}function en(n){var t=n.length;if(t!==0)for(var e=0;e<t;e++){var r=n[e];!(r.f&(x|k))&&q(r)&&(Y(r),r.deps===null&&r.first===null&&r.dom===null&&(r.teardown===null?vn(r):r.fn=null))}}function Qn(){if(g=!1,C>1001)return;const n=S;S=[],Rn(n),g||(C=0)}function j(n){F===mn&&(g||(g=!0,queueMicrotask(Qn)));for(var t=n;t.parent!==null;){t=t.parent;var e=t.f;if(e&T){if(!(e&E))return;h(t,I)}}S.push(t)}function In(n,t){var e=n.first,r=[];n:for(;e!==null;){var s=e.f,o=(s&(x|k))===0,c=s&T,l=(s&E)!==0,u=e.first;if(o&&(!c||!l)){if(c&&h(e,E),s&P){if(!c&&q(e)&&(Y(e),u=e.first),u!==null){e=u;continue}}else if(s&rn)if(c||l){if(u!==null){e=u;continue}}else r.push(e)}var i=e.next;if(i===null){let m=e.parent;for(;m!==null;){if(n===m)break n;var v=m.next;if(v!==null){e=v;continue n}m=m.parent}}e=i}for(var O=0;O<r.length;O++)u=r[O],t.push(u),In(u,t)}function Dn(n,t=!0){var e=F,r=S;try{Sn();const o=[];F=Vn,S=o,g=!1,t&&Rn(r);var s=n==null?void 0:n();return Bn(),(S.length>0||o.length>0)&&Dn(),C=0,s}finally{F=e,S=r}}async function zt(){await Promise.resolve(),Dn()}function Wn(n){const t=n.f;if(t&x)return n.v;if(a!==null){const e=(a.f&w)!==0,r=a.deps;p===null&&r!==null&&r[_]===n&&!(e&&f!==null)?_++:(r===null||_===0||r[_-1]!==n)&&(p===null?p=[n]:p[p.length-1]!==n&&p.push(n)),A!==null&&f!==null&&f.f&E&&!(f.f&T)&&A.includes(n)&&(h(f,y),j(f))}return t&R&&q(n)&&Tn(n),n.v}function Q(n,t,e){var r=n.reactions;if(r!==null)for(var s=z(),o=r.length,c=0;c<o;c++){var l=r[c],u=l.f;if(!(u&y||(!e||!s)&&l===f)){h(l,t);var i=(u&I)!==0,v=(u&w)!==0;(u&E||i&&v)&&(l.f&R?Q(l,I,e):j(l))}}}function Kt(n){const t=a;try{return a=null,n()}finally{a=t}}const Xn=~(y|I|E);function h(n,t){n.f=n.f&Xn|t}function Jn(n){return typeof n=="object"&&n!==null&&typeof n.f=="number"}function Vt(n,t=!1,e){d={p:d,c:null,e:null,m:!1,s:n,x:null,l:null},t||(d.l={s:null,u:null,r1:[],r2:fn(!1)})}function $t(n){const t=d;if(t!==null){const r=t.e;if(r!==null){t.e=null;for(var e=0;e<r.length;e++)cn(r[e])}d=t.p,t.m=!0}return{}}function Gt(n){if(!(typeof n!="object"||!n||n instanceof EventTarget)){if(W in n)K(n);else if(!Array.isArray(n))for(let t in n){const e=n[t];typeof e=="object"&&e&&W in e&&K(e)}}}function K(n,t=new Set){if(typeof n=="object"&&n!==null&&!(n instanceof EventTarget)&&!t.has(n)){t.add(n),n instanceof Date&&n.getTime();for(let r in n)try{K(n[r],t)}catch{}const e=kn(n);if(e!==Object.prototype&&e!==Array.prototype&&e!==Map.prototype&&e!==Set.prototype&&e!==Date.prototype){const r=Cn(e);for(let s in r){const o=r[s].get;if(o)try{o.call(n)}catch{}}}}}function Zt(n){return Jn(n)?Wn(n):n}export{$,Bt as A,Ct as B,Tt as C,ut as D,et as E,Dn as F,Rt as G,wt as H,Dt as I,nt as J,Lt as K,lt as L,It as M,Yt as N,cn as O,yt as P,tt as Q,W as R,it as S,st as T,Ln as U,ot as V,fn as W,kn as X,St as Y,Ht as Z,on as _,Yn as a,ft as a0,Pn as a1,Ot as a2,mt as a3,At as a4,Ut as a5,zt as a6,k as a7,at as a8,ct as a9,dt as aa,dn as ab,jn as ac,vt as ad,_t as ae,pt as af,Zt as ag,gn as ah,xt as b,f as c,zn as d,Ft as e,gt as f,Wn as g,d as h,Nn as i,Un as j,Kt as k,jt as l,Gt as m,$t as n,bt as o,Vt as p,Mt as q,_n as r,rt as s,qt as t,Pt as u,Nt as v,ln as w,kt as x,ht as y,Et as z};