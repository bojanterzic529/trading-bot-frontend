(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[914,626],{9358:(e,t,a)=>{Promise.resolve().then(a.bind(a,7950))},7950:(e,t,a)=>{"use strict";a.d(t,{default:()=>c});var s=a(4650),r=a(2531),n=a(2195),o=a(3064),l=a(4702);function c(e){let{isLogin:t}=e,a=(0,n.useRouter)(),{login:c,signup:i,userData:u}=(0,l.a)();(0,o.useEffect)(()=>{u&&a.push("/")},[u,a]);let[d,m]=(0,o.useState)(""),[g,h]=(0,o.useState)({email:"",password:"",confirmPassword:""}),x=e=>{h({...g,[e.target.name]:e.target.value})},f=async e=>{e.preventDefault();try{t?await c(g.email,g.password):await i(g.email,g.password,g.confirmPassword)}catch(e){m(e.message)}};return(0,s.jsxs)("div",{className:"flex flex-col items-center bg-background-dark p-8 rounded-lg shadow-lg w-full max-w-md",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold text-foreground mb-6",children:t?"Login":"Sign Up"}),d&&(0,s.jsx)("p",{className:"text-red-500 mb-4",children:d}),(0,s.jsxs)("form",{className:"w-full",onSubmit:f,children:[(0,s.jsxs)("div",{className:"mb-4",children:[(0,s.jsx)("label",{className:"block text-white mb-2",children:"Email"}),(0,s.jsx)("input",{type:"email",name:"email",value:g.email,onChange:x,className:"w-full p-3 rounded bg-background-light text-white outline-none focus:ring-2 focus:ring-foreground",required:!0})]}),(0,s.jsxs)("div",{className:"mb-4",children:[(0,s.jsx)("label",{className:"block text-white mb-2",children:"Password"}),(0,s.jsx)("input",{type:"password",name:"password",value:g.password,onChange:x,className:"w-full p-3 rounded bg-background-light text-white outline-none focus:ring-2 focus:ring-foreground",required:!0})]}),!t&&(0,s.jsxs)("div",{className:"mb-4",children:[(0,s.jsx)("label",{className:"block text-white mb-2",children:"Confirm Password"}),(0,s.jsx)("input",{type:"password",name:"confirmPassword",value:g.confirmPassword,onChange:x,className:"w-full p-3 rounded bg-background-light text-white outline-none focus:ring-2 focus:ring-foreground",required:!0})]}),(0,s.jsx)("button",{type:"submit",className:"w-full py-3 mt-4 bg-foreground rounded text-background-dark font-semibold hover:bg-foreground/90 transition",children:t?"Log In":"Sign Up"})]}),(0,s.jsxs)("p",{className:"text-sm text-gray-400 mt-6",children:[t?"Don't have an account?":"Already have an account?",(0,s.jsx)(r.default,{href:t?"/sign-up":"/login",className:"text-foreground hover:underline ml-1",children:t?"Sign Up":"Log In"})]})]})}},7711:(e,t,a)=>{"use strict";a.d(t,{Z:()=>n});var s=a(4650),r=a(2008);function n(){return(0,s.jsx)("div",{className:"h-screen w-screen flex justify-center items-center bg-background",children:(0,s.jsx)(r.xz6,{className:"text-5xl animate-spin text-white"})})}},4702:(e,t,a)=>{"use strict";a.d(t,{AuthProvider:()=>i,a:()=>u});var s=a(4650),r=a(7711),n=a(1441),o=a(3064);let l=(0,o.createContext)(),c="https://trading-bot-backend-cypx.onrender.com",i=e=>{let{children:t}=e,[a,i]=(0,o.useState)(null),[u,d]=(0,o.useState)(!0);(0,o.useEffect)(()=>{let e=localStorage.getItem("token");e&&n.Z.get("".concat(c,"/api/auth/me"),{headers:{Authorization:"Bearer ".concat(e)}}).then(e=>{i(e.data)}).catch(()=>{localStorage.removeItem("token")}),d(!1)},[]);let m=async(e,t)=>{try{let{data:a}=await n.Z.post("".concat(c,"/api/auth/login"),{email:e,password:t});return localStorage.setItem("token",a.token),i(a.user),a}catch(e){throw Error(e.response.data.message)}},g=async(e,t,a)=>{try{let{data:s}=await n.Z.post("".concat(c,"/api/auth/signup"),{email:e,password:t,confirmPassword:a});return localStorage.setItem("token",s.token),i(s.user),s}catch(e){throw Error(e.response.data.message)}};return u?(0,s.jsx)(r.Z,{}):(0,s.jsx)(l.Provider,{value:{userData:a,login:m,signup:g,logout:()=>{localStorage.removeItem("token"),i(null)},loading:u},children:t})},u=()=>(0,o.useContext)(l)}},e=>{var t=t=>e(e.s=t);e.O(0,[399,222,209,947,170,744],()=>t(9358)),_N_E=e.O()}]);