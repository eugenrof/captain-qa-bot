(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function a(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(n){if(n.ep)return;n.ep=!0;const s=a(n);fetch(n.href,s)}})();const S=document.querySelector("#chat-form"),i=document.querySelector("#message-input"),u=document.querySelector("#chat"),h=document.querySelector("#back-to-top"),v=document.querySelector("#settings-button"),l=document.querySelector("#settings-panel"),C=document.querySelector("#settings-close"),r=document.querySelector("#api-key-input"),c=document.querySelector("#save-api-key"),A=document.querySelector("#clear-api-key"),m="captain-qa-bot-gemini-api-key",k="gemini-3.5-flash-lite",E=`https://generativelanguage.googleapis.com/v1beta/models/${k}:generateContent`,I=`
You are Captain QA Bot, an AI assistant specialized in software testing and quality assurance.

Your areas of expertise include:
- Manual and automated testing
- Test automation
- Cypress
- Playwright
- Selenium
- TypeScript and JavaScript
- API testing
- CI/CD
- Performance testing
- Agile and Scrum
- Software testing principles and ISTQB concepts

You are primarily a QA and software testing assistant, but you are not restricted
to QA topics.

For unrelated questions, answer helpfully and naturally. When appropriate, use
your QA personality to make playful connections between the user's topic and
software testing, but do not force a QA analogy into every response.

Maintain a slightly obsessive, witty QA personality while remaining useful.

Give practical, technically accurate answers.
Prefer examples when they help.
If the user asks about an official standard, certification, or documentation,
clearly distinguish between your explanation and authoritative references.
`;function w(e=!1){requestAnimationFrame(()=>{window.scrollTo({top:document.documentElement.scrollHeight,behavior:e?"smooth":"auto"})})}function P(){window.scrollTo({top:0,behavior:"smooth"})}function b(){if(!h)return;const e=window.scrollY>300;h.hidden=!e}window.addEventListener("scroll",b,{passive:!0});h?.addEventListener("click",P);function g(e,t){if(!u)return;const a=document.createElement("div");a.className=t==="bot"?"message robot-message":"message user-message";const o=document.createElement("div");if(o.className="message-author",t==="bot"){const s=document.createElement("img");s.className="message-avatar",s.src="/images/qa_bot_logo.png",s.alt="";const d=document.createElement("span");d.textContent="Captain QA Bot",o.appendChild(s),o.appendChild(d)}else o.textContent="You";const n=document.createElement("div");n.className="message-content",n.textContent=e,a.appendChild(o),a.appendChild(n),u.appendChild(a),w()}function T(){if(!u)return null;const e=document.createElement("div");e.className="message robot-message loading-message";const t=document.createElement("div");t.className="message-author";const a=document.createElement("img");a.className="message-avatar",a.src="/images/qa_bot_logo.png",a.alt="";const o=document.createElement("span");o.textContent="Captain QA Bot",t.appendChild(a),t.appendChild(o);const n=document.createElement("div");return n.className="message-content thinking",n.innerHTML=`
        <span class="thinking-text">Thinking</span>
        <span class="thinking-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </span>
    `,e.appendChild(t),e.appendChild(n),u.appendChild(e),w(!0),e}function y(e){let t=document.querySelector(".settings-error");t||(t=document.createElement("p"),t.className="settings-error",r?.insertAdjacentElement("afterend",t)),t.textContent=e,t.hidden=!1}function p(){const e=document.querySelector(".settings-error");e&&(e.hidden=!0,e.textContent="")}function x(){l&&(l.hidden=!1,v?.setAttribute("aria-expanded","true"),p(),r?.focus())}function f(){l&&(l.hidden=!0,v?.setAttribute("aria-expanded","false"),p())}function q(){const e=localStorage.getItem(m);r&&e&&(r.value=e)}function L(e){return!(!e.startsWith("AIza")||e.length<30||e.length>100)}async function N(e){const t=await fetch(`${E}?key=${encodeURIComponent(e)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"Reply with exactly: OK"}]}]})}),a=await t.json();if(!t.ok){const n=a?.error?.message||`Gemini returned HTTP ${t.status}.`;throw new Error(n)}if(!a?.candidates?.[0]?.content?.parts?.[0]?.text)throw new Error("Gemini accepted the request but returned no response.")}async function O(){if(!r||!c)return;const e=r.value.trim();if(p(),!e){y("Please enter a Gemini API key."),r.focus();return}if(!L(e)){y("That doesn't look like a valid Gemini API key."),r.focus();return}const t=c.textContent||"Validate & Save";c.disabled=!0,c.textContent="Validating…",r.disabled=!0;try{await N(e),localStorage.setItem(m,e),f()}catch(a){console.error("Gemini API key validation failed:",a);let o="The Gemini API key could not be validated.";a instanceof Error&&(o=a.message),y(`API key validation failed: ${o}`),r.focus()}finally{c.disabled=!1,c.textContent=t,r.disabled=!1}}function M(){localStorage.removeItem(m),r&&(r.value=""),p(),r?.focus()}async function G(e){const t=localStorage.getItem(m);if(!t)throw new Error("No Gemini API key is configured. Open Settings and add your API key.");const a=await fetch(`${E}?key=${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system_instruction:{parts:[{text:I}]},contents:[{parts:[{text:e}]}]})}),o=await a.json();if(!a.ok)throw new Error(o?.error?.message||`Gemini request failed with status ${a.status}.`);const n=o?.candidates?.[0]?.content?.parts?.[0]?.text;if(!n)throw new Error("Gemini returned an empty response.");return n}async function _(e){return G(e)}v?.addEventListener("click",()=>{l?.hidden?x():f()});C?.addEventListener("click",f);c?.addEventListener("click",()=>{O()});A?.addEventListener("click",M);document.addEventListener("keydown",e=>{e.key==="Escape"&&l&&!l.hidden&&f()});S?.addEventListener("submit",async e=>{e.preventDefault();const t=i?.value.trim();if(!t)return;g(t,"user"),i&&(i.value="",i.disabled=!0);const a=T();try{const o=await _(t);a?.remove(),g(o,"bot")}catch(o){console.error("Chat error:",o),a?.remove();const n=o instanceof Error?o.message:"Unknown error occurred.";g(`Oops. Captain QA Bot encountered an error. 🤖💥

${n}`,"bot")}finally{i&&(i.disabled=!1,i.focus())}});q();b();
