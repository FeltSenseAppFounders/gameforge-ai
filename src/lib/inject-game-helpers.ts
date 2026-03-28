// GameForge — Inject GF helper library + virtual touch controls into game HTML.
// GF library goes in <head> (before game code), touch controls go before </body>.

import { GAMEFORGE_CORE_JS } from "./gameforge-core";

// Defensive CSS — prevents game canvas from overflowing the iframe viewport.
// Covers cases where generated code skips Phaser.Scale.FIT or uses oversized fixed dimensions.
const CANVAS_CONSTRAINT_CSS = `
<style>
/* Defensive: prevent game canvas from overflowing the iframe viewport */
html, body {
  overflow: hidden !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}
canvas {
  max-width: 100vw !important;
  max-height: 100vh !important;
  display: block !important;
}
</style>
`;

// Error handler — catches JS errors in the iframe and sends them to parent via postMessage.
// Must be injected BEFORE all other scripts so it catches early errors.
// Uses 5 detection layers: window.onerror, capture-phase error listener,
// unhandled rejections, health-check fallback, and CSP violation listener.
// Debounces errors for 600ms to collect cascading syntax errors before sending.
const ERROR_HANDLER_BLOCK = `
<script>
(function(){
  var collected=[];
  var timer=null;
  var lastSent=0;
  var MAX_ERRORS=5;
  var DEBOUNCE_MS=600;
  var COOLDOWN_MS=3000;

  function flush(){
    var now=Date.now();
    if(!collected.length||(now-lastSent)<COOLDOWN_MS){
      console.warn('[GF-HEAL] flush skipped: collected='+collected.length+' cooldown='+(now-lastSent)+'ms');
      return;
    }
    lastSent=now;
    if(timer){clearTimeout(timer);timer=null;}
    console.warn('[GF-HEAL] flush sending '+collected.length+' errors via postMessage');
    try{
      window.parent.postMessage({type:'gf-game-errors',errors:collected.slice()},'*');
      window.parent.postMessage({type:'gf-game-error',error:collected[0]},'*');
      console.warn('[GF-HEAL] postMessage sent OK');
    }catch(e){
      console.warn('[GF-HEAL] postMessage FAILED:',e);
    }
    collected=[];
  }

  function pushError(msg,line,col,stack){
    if(collected.length>=MAX_ERRORS)return;
    collected.push({message:String(msg).slice(0,500),line:line||0,column:col||0,stack:String(stack||'').slice(0,1000)});
    console.warn('[GF-HEAL] pushError #'+collected.length+':',String(msg).slice(0,120));
    if(!timer){timer=setTimeout(flush,DEBOUNCE_MS);}
    if(collected.length>=MAX_ERRORS)flush();
  }

  // Layer 1: Legacy window.onerror
  window.onerror=function(msg,source,line,col,error){
    pushError(msg,line,col,error&&error.stack||'');
    return false;
  };

  // Layer 2: Capture-phase error listener — catches SyntaxErrors that window.onerror misses
  window.addEventListener('error',function(event){
    if(event instanceof ErrorEvent){
      pushError(event.message,event.lineno||0,event.colno||0,event.error&&event.error.stack||'');
    }
  },true);

  // Layer 3: Unhandled promise rejections
  window.addEventListener('unhandledrejection',function(e){
    pushError('Unhandled: '+String(e.reason),0,0,'');
  });

  // Layer 4: Health-check fallback — if game script fails to parse entirely,
  // window.__gf_ok (set by a script AFTER game code) will never be true.
  window.addEventListener('DOMContentLoaded',function(){
    setTimeout(function(){
      if(!window.__gf_ok&&!lastSent&&collected.length===0){
        pushError('Game script failed to load — likely a syntax error in the generated code',0,0,'');
        flush();
      }
    },1500);
  });

  // Layer 5: CSP violations — blocked resources, scripts, fonts, etc.
  // CSP violations fire SecurityPolicyViolationEvent, NOT ErrorEvent,
  // so layers 1-3 cannot detect them. Without this, blocked external
  // assets (images, audio, fonts) fail silently and self-healing never triggers.
  document.addEventListener('securitypolicyviolation',function(e){
    pushError('CSP blocked '+(e.violatedDirective||'resource')+': '+(e.blockedURI||'unknown'),0,0,'');
  });
})();
</script>
`;

// Touch controls block (same as before — D-pad + action button, touch devices only)
const TOUCH_CONTROLS_BLOCK = `
<!-- GameForge Touch Controls -->
<style>
canvas { position: relative; z-index: 1; }
#gf-touch-controls {
  position: fixed !important;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  z-index: 99999 !important;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* D-PAD */
#gf-dpad {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 140px;
  height: 140px;
}
.gf-dpad-btn {
  position: absolute;
  width: 44px;
  height: 44px;
  background: rgba(26, 26, 26, 0.7);
  border: 1.5px solid rgba(124, 252, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  pointer-events: auto !important;
  cursor: pointer;
}
.gf-dpad-btn.active {
  background: rgba(124, 252, 0, 0.25);
  border-color: rgba(124, 252, 0, 0.9);
  box-shadow: 0 0 12px rgba(124, 252, 0, 0.5), inset 0 0 8px rgba(124, 252, 0, 0.15);
}
.gf-dpad-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: rgba(124, 252, 0, 0.8);
  stroke-width: 2.5;
  stroke-linecap: square;
  stroke-linejoin: miter;
  pointer-events: none;
}
.gf-dpad-btn.active svg { stroke: #7CFC00; }
#gf-dpad-up    { top: 0;    left: 48px; border-radius: 2px 2px 0 0; }
#gf-dpad-down  { bottom: 0; left: 48px; border-radius: 0 0 2px 2px; }
#gf-dpad-left  { top: 48px; left: 0;    border-radius: 2px 0 0 2px; }
#gf-dpad-right { top: 48px; right: 0;   border-radius: 0 2px 2px 0; }
#gf-dpad-center {
  position: absolute;
  top: 48px;
  left: 48px;
  width: 44px;
  height: 44px;
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(64, 64, 64, 0.4);
  pointer-events: none;
}

/* ACTION BUTTON */
#gf-action-btn {
  position: absolute;
  bottom: 40px;
  right: 30px;
  width: 64px;
  height: 64px;
  background: rgba(26, 26, 26, 0.7);
  border: 2px solid rgba(124, 252, 0, 0.5);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  pointer-events: auto !important;
  cursor: pointer;
}
#gf-action-btn.active {
  background: rgba(124, 252, 0, 0.3);
  border-color: #7CFC00;
  box-shadow: 0 0 20px rgba(124, 252, 0, 0.6), 0 0 40px rgba(124, 252, 0, 0.2);
}
#gf-action-btn span {
  font-family: monospace;
  font-size: 22px;
  font-weight: bold;
  color: rgba(124, 252, 0, 0.85);
  letter-spacing: 1px;
  pointer-events: none;
}
#gf-action-btn.active span {
  color: #7CFC00;
  text-shadow: 0 0 8px rgba(124, 252, 0, 0.8);
}
</style>
<div id="gf-touch-controls" style="display:none">
  <div id="gf-dpad">
    <div class="gf-dpad-btn" id="gf-dpad-up" data-key="up">
      <svg viewBox="0 0 24 24"><path d="M12 5l0 14M12 5l-6 6M12 5l6 6"/></svg>
    </div>
    <div class="gf-dpad-btn" id="gf-dpad-down" data-key="down">
      <svg viewBox="0 0 24 24"><path d="M12 19l0-14M12 19l-6-6M12 19l6-6"/></svg>
    </div>
    <div class="gf-dpad-btn" id="gf-dpad-left" data-key="left">
      <svg viewBox="0 0 24 24"><path d="M5 12l14 0M5 12l6-6M5 12l6 6"/></svg>
    </div>
    <div class="gf-dpad-btn" id="gf-dpad-right" data-key="right">
      <svg viewBox="0 0 24 24"><path d="M19 12l-14 0M19 12l-6-6M19 12l-6 6"/></svg>
    </div>
    <div id="gf-dpad-center"></div>
  </div>
  <div id="gf-action-btn" data-key="space"><span>A</span></div>
</div>
<script>
(function() {
  'use strict';

  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (!isTouch) return;

  var container = document.getElementById('gf-touch-controls');
  if (!container) return;
  container.style.display = 'block';

  if (!document.querySelector('meta[name="viewport"]')) {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';
    document.head.appendChild(meta);
  }

  var KEY_MAP = {
    up:    { keyCode: 38, key: 'ArrowUp',    code: 'ArrowUp' },
    down:  { keyCode: 40, key: 'ArrowDown',  code: 'ArrowDown' },
    left:  { keyCode: 37, key: 'ArrowLeft',  code: 'ArrowLeft' },
    right: { keyCode: 39, key: 'ArrowRight', code: 'ArrowRight' },
    space: { keyCode: 32, key: ' ',          code: 'Space' }
  };

  function fireKey(type, keyName) {
    var m = KEY_MAP[keyName];
    if (!m) return;
    var evt = new KeyboardEvent(type, {
      keyCode: m.keyCode, which: m.keyCode,
      key: m.key, code: m.code,
      bubbles: true, cancelable: true
    });
    Object.defineProperty(evt, 'keyCode', { get: function() { return m.keyCode; } });
    Object.defineProperty(evt, 'which',   { get: function() { return m.keyCode; } });
    window.dispatchEvent(evt);
  }

  var activeTouches = {};
  var buttons = container.querySelectorAll('[data-key]');

  buttons.forEach(function(btn) {
    var keyName = btn.getAttribute('data-key');

    btn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      for (var i = 0; i < e.changedTouches.length; i++) {
        activeTouches[e.changedTouches[i].identifier] = { element: btn, keyName: keyName };
      }
      btn.classList.add('active');
      fireKey('keydown', keyName);
    }, { passive: false });

    function handleEnd(e) {
      e.preventDefault();
      e.stopPropagation();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var id = e.changedTouches[i].identifier;
        if (activeTouches[id] && activeTouches[id].element === btn) {
          delete activeTouches[id];
        }
      }
      var stillActive = false;
      for (var key in activeTouches) {
        if (activeTouches[key].element === btn) { stillActive = true; break; }
      }
      if (!stillActive) {
        btn.classList.remove('active');
        fireKey('keyup', keyName);
      }
    }

    btn.addEventListener('touchend', handleEnd, { passive: false });
    btn.addEventListener('touchcancel', handleEnd, { passive: false });
  });
})();
</script>
`;

// Health-check script — injected AFTER the game code (before </body>).
// If the game script has a syntax error, it fails to parse entirely and this flag
// is never set. The error handler's DOMContentLoaded timeout detects this.
const HEALTH_CHECK_BLOCK = `<script>window.__gf_ok=true;</script>`;

/**
 * Injects the GF helper library and virtual touch controls into game HTML.
 * - GF library: injected before </head> (available to game scripts)
 * - Health check + touch controls: injected before </body> (after game code)
 */
export function injectGameHelpers(html: string): string {
  // 1. Inject error handler + GF core library before </head>
  // Error handler goes FIRST so it catches errors in all scripts
  const headScripts = CANVAS_CONSTRAINT_CSS + ERROR_HANDLER_BLOCK + GAMEFORGE_CORE_JS;
  const headCloseIdx = html.indexOf("</head>");
  if (headCloseIdx !== -1) {
    html = html.slice(0, headCloseIdx) + headScripts + html.slice(headCloseIdx);
  } else {
    html = headScripts + html;
  }

  // 2. Inject health check + touch controls before </body>
  const bodyInsert = HEALTH_CHECK_BLOCK + TOUCH_CONTROLS_BLOCK;
  const bodyCloseIdx = html.lastIndexOf("</body>");
  if (bodyCloseIdx !== -1) {
    html = html.slice(0, bodyCloseIdx) + bodyInsert + html.slice(bodyCloseIdx);
  } else {
    html = html + bodyInsert;
  }

  return html;
}
