import{w as F,a as j,o as M,j as I,t as x,i as w,e as U,x as A,m as D,f as R,d as k,l as G}from"./index-Dgi8wYgQ.js";var g;function C(e){return{lang:e?.lang??g?.lang,message:e?.message,abortEarly:e?.abortEarly??g?.abortEarly,abortPipeEarly:e?.abortPipeEarly??g?.abortPipeEarly}}var L;function O(e){return L?.get(e)}var N;function T(e){return N?.get(e)}var V;function X(e,r){return V?.get(e)?.get(r)}function Z(e){const r=typeof e;return r==="string"?`"${e}"`:r==="number"||r==="bigint"||r==="boolean"?`${e}`:r==="object"||r==="function"?(e&&Object.getPrototypeOf(e)?.constructor?.name)??"null":r}function m(e,r,t,i,s){const o=s&&"input"in s?s.input:t.value,n=s?.expected??e.expects??null,l=s?.received??Z(o),a={kind:e.kind,type:e.type,input:o,expected:n,received:l,message:`Invalid ${r}: ${n?`Expected ${n} but r`:"R"}eceived ${l}`,requirement:e.requirement,path:s?.path,issues:s?.issues,lang:i.lang,abortEarly:i.abortEarly,abortPipeEarly:i.abortPipeEarly},u=e.kind==="schema",c=s?.message??e.message??X(e.reference,a.lang)??(u?T(a.lang):null)??i.message??O(a.lang);c!==void 0&&(a.message=typeof c=="function"?c(a):c),u&&(t.typed=!1),t.issues?t.issues.push(a):t.issues=[a]}function P(e){return{version:1,vendor:"valibot",validate(r){return e["~run"]({value:r},C())}}}function B(e){if(e.path){let r="";for(const t of e.path)if(typeof t.key=="string"||typeof t.key=="number")r?r+=`.${t.key}`:r+=t.key;else return null;return r}return null}var H=/^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/iu;function $(e){return{kind:"validation",type:"email",reference:$,expects:null,async:!1,requirement:H,message:e,"~run"(r,t){return r.typed&&!this.requirement.test(r.value)&&m(this,"email",r,t),r}}}function z(e,r){return{kind:"validation",type:"max_length",reference:z,async:!1,expects:`<=${e}`,requirement:e,message:r,"~run"(t,i){return t.typed&&t.value.length>this.requirement&&m(this,"length",t,i,{received:`${t.value.length}`}),t}}}function b(e,r){return{kind:"validation",type:"min_length",reference:b,async:!1,expects:`>=${e}`,requirement:e,message:r,"~run"(t,i){return t.typed&&t.value.length<this.requirement&&m(this,"length",t,i,{received:`${t.value.length}`}),t}}}function p(e){return{kind:"validation",type:"non_empty",reference:p,async:!1,expects:"!0",message:e,"~run"(r,t){return r.typed&&r.value.length===0&&m(this,"length",r,t,{received:"0"}),r}}}function J(e,r){if(e.issues)for(const t of r)for(const i of e.issues){let s=!1;const o=Math.min(t.length,i.path?.length??0);for(let n=0;n<o;n++)if(t[n]!==i.path[n].key&&(t[n]!=="$"||i.path[n].type!=="array")){s=!0;break}if(!s)return!1}return!0}function E(e,r,t){return{kind:"validation",type:"partial_check",reference:E,async:!1,expects:null,paths:e,requirement:r,message:t,"~run"(i,s){return(i.typed||J(i,e))&&!this.requirement(i.value)&&m(this,"input",i,s),i}}}function S(e,r){return{kind:"validation",type:"regex",reference:S,async:!1,expects:`${e}`,requirement:e,message:r,"~run"(t,i){return t.typed&&!this.requirement.test(t.value)&&m(this,"format",t,i),t}}}function K(e,r,t){return typeof e.fallback=="function"?e.fallback(r,t):e.fallback}function q(e,r){return{...e,"~run"(t,i){const s=t.issues&&[...t.issues];if(t=e["~run"](t,i),t.issues){for(const o of t.issues)if(!s?.includes(o)){let n=t.value;for(const l of r){const a=n[l],u={type:"unknown",origin:"value",input:n,key:l,value:a};if(o.path?o.path.push(u):o.path=[u],!a)break;n=a}}}return t}}}function Q(e,r,t){return typeof e.default=="function"?e.default(r,t):e.default}function v(e,r){return{kind:"schema",type:"object",reference:v,expects:"Object",async:!1,entries:e,message:r,get"~standard"(){return P(this)},"~run"(t,i){const s=t.value;if(s&&typeof s=="object"){t.typed=!0,t.value={};for(const o in this.entries){const n=this.entries[o];if(o in s||(n.type==="exact_optional"||n.type==="optional"||n.type==="nullish")&&n.default!==void 0){const l=o in s?s[o]:Q(n),a=n["~run"]({value:l},i);if(a.issues){const u={type:"object",origin:"value",input:s,key:o,value:l};for(const c of a.issues)c.path?c.path.unshift(u):c.path=[u],t.issues?.push(c);if(t.issues||(t.issues=a.issues),i.abortEarly){t.typed=!1;break}}a.typed||(t.typed=!1),t.value[o]=a.value}else if(n.fallback!==void 0)t.value[o]=K(n);else if(n.type!=="exact_optional"&&n.type!=="optional"&&n.type!=="nullish"&&(m(this,"key",t,i,{input:void 0,expected:`"${o}"`,path:[{type:"object",origin:"key",input:s,key:o,value:s[o]}]}),i.abortEarly))break}}else m(this,"type",t,i);return t}}}function d(e){return{kind:"schema",type:"string",reference:d,expects:"string",async:!1,message:e,get"~standard"(){return P(this)},"~run"(r,t){return typeof r.value=="string"?r.typed=!0:m(this,"type",r,t),r}}}function f(...e){return{...e[0],pipe:e,get"~standard"(){return P(this)},"~run"(r,t){for(const i of e)if(i.kind!=="metadata"){if(r.issues&&(i.kind==="schema"||i.kind==="transformation")){r.typed=!1;break}(!r.issues||!t.abortEarly&&!t.abortPipeEarly)&&(r=i["~run"](r,t))}return r}}}async function W(e,r,t){const i=await e["~run"]({value:r},C(t));return{typed:i.typed,success:!i.issues,output:i.value,issues:i.issues}}function ie(e){return async r=>{const t=await W(e,r,{abortPipeEarly:!0}),i={};if(t.issues)for(const s of t.issues)i[B(s)]=s.message;return i}}var Y=x('<div><div class="flex items-center justify-between"><label></label></div><div><input>'),ee=x('<p class="text-xs text-red-600">');function ne(e){const[r,t]=F(e,["value","error","label","containerClass","inputClass"]),{isDarkMode:i}=j();let s;return M(()=>{if(s){const o=document.createElement("style");return o.textContent=`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px ${i()?"#374151":"white"} inset !important;
          -webkit-text-fill-color: ${i()?"white":"black"} !important;
          font-size: inherit !important;
        }
        
        /* Fix for hover suggestion text size */
        input::-webkit-list-button-appearance,
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
        }
        
        /* Fix text size in autocomplete dropdown */
        input:-webkit-autofill-selected {
          font-size: inherit !important;
        }

        /* Fix for Chrome and other webkit browsers */
        @media screen and (-webkit-min-device-pixel-ratio:0) {
          select,
          input {
            font-size: 16px !important;
          }
        }
      `,document.head.appendChild(o),()=>{document.head.removeChild(o)}}}),I(()=>{const o=i(),n=document.querySelectorAll("style"),l=Array.from(n).find(a=>a.textContent.includes("input:-webkit-autofill"));l&&(l.textContent=`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px ${o?"#374151":"white"} inset !important;
          -webkit-text-fill-color: ${o?"white":"black"} !important;
          font-size: inherit !important;
        }
        
        /* Fix for hover suggestion text size */
        input::-webkit-list-button-appearance,
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
        }
        
        /* Fix text size in autocomplete dropdown */
        input:-webkit-autofill-selected {
          font-size: inherit !important;
        }

        /* Fix for Chrome and other webkit browsers */
        @media screen and (-webkit-min-device-pixel-ratio:0) {
          select,
          input {
            font-size: 16px !important;
          }
        }
      `)}),(()=>{var o=Y(),n=o.firstChild,l=n.firstChild,a=n.nextSibling,u=a.firstChild;w(l,()=>r.label),w(n,(()=>{var y=U(()=>!!r.error);return()=>y()&&(()=>{var h=ee();return w(h,()=>r.error),h})()})(),null);var c=s;return typeof c=="function"?G(c,u):s=u,A(u,D(t,{style:{"font-size":"16px"},get class(){return`mt-1 block w-full px-4 py-3 rounded-xl ${r.error?"border-red-500":i()?"border-gray-600":"border-gray-300"} shadow-sm focus:border-blue-500 focus:outline-none transition-colors ${i()?"bg-gray-700 text-white":""} ${r.inputClass||""}`},get value(){return r.value||""}}),!1,!1),R(y=>{var h=r.containerClass||"",_=`block text-sm font-medium ${i()?"text-gray-300":"text-gray-700"}`;return h!==y.e&&k(o,y.e=h),_!==y.t&&k(l,y.t=_),y},{e:void 0,t:void 0}),o})()}const se=f(v({email:f(d(),p("Email is required"),$("Please enter a valid email address")),username:f(d(),p("Username is required"),b(3,"Username must be at least 3 characters"),z(20,"Username cannot exceed 20 characters"),S(/^[a-zA-Z0-9]+$/,"Username can only contain letters and numbers")),password:f(d(),p("Password is required"),b(8,"Password must be at least 8 characters")),confirmPassword:f(d(),p("Please confirm your password"))}),q(E([["password"],["confirmPassword"]],e=>e.password===e.confirmPassword,"Passwords do not match."),["confirmPassword"])),oe=v({userormail:f(d(),p("Username or email is required"),b(1,"Please enter your username or email")),password:f(d(),p("Password is required"),b(4,"Password must be at least 4 characters"))}),ae=v({email:f(d(),p("Username or email is required"),$("Please enter a valid your email address"))}),le=f(v({password:f(d(),p("Password is required"),b(8,"Password must be at least 8 characters")),confirmPassword:f(d(),p("Please confirm your password"))}),q(E([["password"],["confirmPassword"]],e=>e.password===e.confirmPassword,"Passwords do not match."),["confirmPassword"]));var te=x("<div>");const ue=({color:e="white"})=>(()=>{var r=te();return k(r,`w-4 h-4 border-2 border-${e} rounded-full border-t-transparent animate-spin`),r})();export{ne as F,ue as S,se as a,ae as f,oe as l,le as r,ie as v};
