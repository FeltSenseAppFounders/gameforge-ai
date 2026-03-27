// GameForge — Inject GF helper library + virtual touch controls into game HTML.
// GF library goes in <head> (before game code), touch controls go before </body>.

import { GAMEFORGE_CORE_JS } from "./gameforge-core";

// Error handler — catches JS errors in the iframe and sends them to parent via postMessage.
// Must be injected BEFORE all other scripts so it catches early errors.
const ERROR_HANDLER_BLOCK = `
<script>
(function(){
  var errors=[];
  window.onerror=function(msg,source,line,col,error){
    if(errors.length>=3)return false;
    errors.push(1);
    try{window.parent.postMessage({type:'gf-game-error',error:{message:String(msg),line:line||0,column:col||0,stack:error&&error.stack||''}},'*');}catch(e){}
    return false;
  };
  window.addEventListener('unhandledrejection',function(e){
    if(errors.length>=3)return;
    errors.push(1);
    try{window.parent.postMessage({type:'gf-game-error',error:{message:'Unhandled: '+String(e.reason),line:0,column:0,stack:''}},'*');}catch(ex){}
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

/**
 * Injects the GF helper library and virtual touch controls into game HTML.
 * - GF library: injected before </head> (available to game scripts)
 * - Touch controls: injected before </body> (D-pad + action button)
 */
export function injectGameHelpers(html: string): string {
  // 1. Inject error handler + GF core library before </head>
  // Error handler goes FIRST so it catches errors in all scripts
  const headScripts = ERROR_HANDLER_BLOCK + GAMEFORGE_CORE_JS;
  const headCloseIdx = html.indexOf("</head>");
  if (headCloseIdx !== -1) {
    html = html.slice(0, headCloseIdx) + headScripts + html.slice(headCloseIdx);
  } else {
    html = headScripts + html;
  }

  // 2. Inject touch controls before </body>
  const bodyCloseIdx = html.lastIndexOf("</body>");
  if (bodyCloseIdx !== -1) {
    html = html.slice(0, bodyCloseIdx) + TOUCH_CONTROLS_BLOCK + html.slice(bodyCloseIdx);
  } else {
    html = html + TOUCH_CONTROLS_BLOCK;
  }

  return html;
}
