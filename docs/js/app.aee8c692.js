(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{0:function(e,n,o){e.exports=o("2f39")},"2f39":function(e,n,o){"use strict";o.r(n);o("7d6e"),o("9f29"),o("62f2"),o("7e6d"),o("a1e8");var t=o("2b0e"),r=o("875c"),a=o("b05d"),i=o("2a19");t["a"].use(a["a"],{config:{},iconSet:r["a"],plugins:{Notify:i["a"]}});var c=function(){var e=this,n=e.$createElement,o=e._self._c||n;return o("div",{attrs:{id:"q-app"}},[o("router-view")],1)},u=[],l={name:"App"},s=l,p=o("2877"),f=Object(p["a"])(s,c,u,!1,null,null,null),d=f.exports,w=o("8c4f");const h=[{path:"/",component:()=>Promise.all([o.e(0),o.e(3)]).then(o.bind(null,"f241")),children:[{path:"",redirect:"/docs"},{path:"/docs",component:()=>Promise.all([o.e(0),o.e(5)]).then(o.bind(null,"8b24"))}]}];h.push({path:"*",component:()=>o.e(4).then(o.bind(null,"e51e"))});var b=h;t["a"].use(w["a"]);var v=function(){const e=new w["a"]({scrollBehavior:()=>({x:0,y:0}),routes:b,mode:"history",base:"/app-extension-q-filter-configurator/"});return e},m=async function(){const e="function"===typeof v?await v({Vue:t["a"]}):v,n={router:e,render:e=>e(d),el:"#q-app"};return{app:n,router:e}},y=o("028a"),g=o("4b46");async function x(){const{app:e,router:n}=await m();let o=!0;const r=e=>{o=!1,window.location.href=e},a=window.location.href.replace(window.location.origin,""),i=[y["a"],g["default"]];for(let u=0;!0===o&&u<i.length;u++)if("function"===typeof i[u])try{await i[u]({app:e,router:n,Vue:t["a"],ssrContext:null,redirect:r,urlPath:a})}catch(c){return c&&c.url?void(window.location.href=c.url):void console.error("[Quasar] boot error:",c)}!1!==o&&new t["a"](e)}x()},"7e6d":function(e,n,o){}},[[0,2,0]]]);