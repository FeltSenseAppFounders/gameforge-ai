// GameForge Core — Pre-built helper library injected into every game iframe.
// Provides window.GF with audio, particles, screens, HUD, and palettes.
// This eliminates ~20% of boilerplate from every LLM-generated game.

export const GAMEFORGE_CORE_JS = `
<script>
(function(){
  "use strict";

  // ── Color Palettes ──
  var palettes = {
    cyberpunk: { primary:'#00e5ff', secondary:'#ff006e', accent:'#ffbe0b', highlight:'#8338ec', bg:'#0f0f0f' },
    neonArcade: { primary:'#7CFC00', secondary:'#ff3131', accent:'#00bfff', highlight:'#ffd700', bg:'#1a1a1a' },
    ocean: { primary:'#0077b6', secondary:'#00b4d8', accent:'#90e0ef', highlight:'#caf0f8', bg:'#03045e' },
    fire: { primary:'#ff4500', secondary:'#ff6b35', accent:'#ffd700', highlight:'#dc143c', bg:'#1a0a00' },
    forest: { primary:'#2d6a4f', secondary:'#40916c', accent:'#74c69d', highlight:'#d4a373', bg:'#1b4332' },
    pastel: { primary:'#ff6b9d', secondary:'#c084fc', accent:'#67e8f9', highlight:'#86efac', bg:'#1e1b4b' }
  };

  // ── Audio System ──
  var audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  var soundDefs = {
    shoot:    { wave:'square',   f0:600, f1:200, dur:0.1,  vol:0.3 },
    explosion:{ wave:'sawtooth', f0:200, f1:40,  dur:0.3,  vol:0.4 },
    coin:     { wave:'sine',     f0:800, f1:1200,dur:0.15, vol:0.2 },
    jump:     { wave:'sine',     f0:300, f1:600, dur:0.15, vol:0.2 },
    hit:      { wave:'triangle', f0:400, f1:100, dur:0.08, vol:0.3 },
    powerup:  { wave:'sine',     f0:400, f1:1200,dur:0.3,  vol:0.2 },
    gameover: { wave:'sawtooth', f0:400, f1:80,  dur:0.6,  vol:0.3 }
  };

  function playSound(type) {
    try {
      var ctx = ensureAudio();
      var d = soundDefs[type];
      if (!d) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      var now = ctx.currentTime;
      osc.type = d.wave;
      osc.frequency.setValueAtTime(d.f0, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(d.f1, 1), now + d.dur);
      gain.gain.setValueAtTime(d.vol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + d.dur);
      osc.start(now);
      osc.stop(now + d.dur);
    } catch(e) {}
  }

  // ── Particle Texture Creator (Phaser) ──
  function createParticle(scene, key, color, size) {
    size = size || 8;
    color = color || '#ffcc00';
    var g = scene.textures.createCanvas(key, size, size);
    var ctx = g.getContext();
    var h = size / 2;
    var grad = ctx.createRadialGradient(h, h, 0, h, h, h);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    g.refresh();
  }

  // ── Start Screen (Phaser) ──
  function startScreen(scene, cfg) {
    cfg = cfg || {};
    var w = scene.scale.width;
    var h = scene.scale.height;
    var pal = cfg.palette || palettes.neonArcade;
    var els = [];

    // Dark overlay
    var bg = scene.add.rectangle(w/2, h/2, w, h, 0x000000, 0.7).setDepth(100);
    els.push(bg);

    // Title
    var title = scene.add.text(w/2, h * 0.3, cfg.title || 'GAME', {
      fontSize: '48px', fontFamily: 'Arial Black, Arial, sans-serif',
      fill: pal.primary, stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(101);
    els.push(title);

    // Subtitle
    if (cfg.subtitle) {
      var sub = scene.add.text(w/2, h * 0.3 + 56, cfg.subtitle, {
        fontSize: '16px', fill: '#aaaaaa'
      }).setOrigin(0.5).setDepth(101);
      els.push(sub);
    }

    // Controls
    if (cfg.controls) {
      var ctrl = scene.add.text(w/2, h * 0.55, cfg.controls, {
        fontSize: '14px', fill: '#cccccc', align: 'center'
      }).setOrigin(0.5).setDepth(101);
      els.push(ctrl);
    }

    // Press SPACE
    var start = scene.add.text(w/2, h * 0.72, 'Press SPACE to Start', {
      fontSize: '22px', fontFamily: 'Arial, sans-serif', fill: pal.accent || '#ffd700'
    }).setOrigin(0.5).setDepth(101);
    els.push(start);
    scene.tweens.add({ targets: start, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    return {
      destroy: function() { els.forEach(function(e) { e.destroy(); }); }
    };
  }

  // ── Game Over Screen (Phaser) ──
  function gameOverScreen(scene, cfg) {
    cfg = cfg || {};
    var w = scene.scale.width;
    var h = scene.scale.height;
    var pal = cfg.palette || palettes.neonArcade;

    playSound('gameover');

    // Overlay
    scene.add.rectangle(w/2, h/2, w, h, 0x000000, 0.75).setDepth(200);

    // GAME OVER text
    scene.add.text(w/2, h * 0.3, 'GAME OVER', {
      fontSize: '52px', fontFamily: 'Arial Black, Arial, sans-serif',
      fill: '#ff3333', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(201);

    // Score
    scene.add.text(w/2, h * 0.45, 'Score: ' + (cfg.score || 0), {
      fontSize: '32px', fill: pal.primary || '#ffffff'
    }).setOrigin(0.5).setDepth(201);

    // High score
    if (cfg.highScore !== undefined) {
      scene.add.text(w/2, h * 0.53, 'Best: ' + cfg.highScore, {
        fontSize: '20px', fill: '#aaaaaa'
      }).setOrigin(0.5).setDepth(201);
    }

    // Restart prompt
    var restartText = scene.add.text(w/2, h * 0.68, 'Press SPACE or Click to Restart', {
      fontSize: '20px', fill: pal.accent || '#ffd700'
    }).setOrigin(0.5).setDepth(201);
    scene.tweens.add({ targets: restartText, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });

    // Restart button
    var btn = scene.add.rectangle(w/2, h * 0.78, 180, 44, 0x22aa22).setDepth(201).setInteractive();
    scene.add.text(w/2, h * 0.78, 'RESTART', {
      fontSize: '18px', fontFamily: 'Arial, sans-serif', fill: '#ffffff'
    }).setOrigin(0.5).setDepth(202);

    var restart = function() { scene.scene.restart(); };
    scene.input.keyboard.once('keydown-SPACE', restart);
    btn.once('pointerdown', restart);
    scene.input.once('pointerdown', function(p) {
      // Delay to avoid double-trigger with button
      scene.time.delayedCall(50, restart);
    });
  }

  // ── HUD Helper (Phaser) ──
  function createHUD(scene, items) {
    var texts = {};
    items.forEach(function(item) {
      texts[item.key] = scene.add.text(item.x, item.y, item.text || '', Object.assign({
        fontSize: '18px', fontFamily: 'Arial, sans-serif', fill: '#ffffff',
        stroke: '#000000', strokeThickness: 2
      }, item.style || {})).setDepth(150).setScrollFactor(0);
    });
    return {
      update: function(key, val) { if (texts[key]) texts[key].setText(val); },
      get: function(key) { return texts[key]; }
    };
  }

  // ── Floating Text (Phaser) ──
  function floatingText(scene, x, y, text, color) {
    var t = scene.add.text(x, y, text, {
      fontSize: '20px', fontFamily: 'Arial, sans-serif',
      fill: color || '#ffcc00', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(180);
    scene.tweens.add({
      targets: t, y: y - 40, alpha: 0, duration: 600,
      onComplete: function() { t.destroy(); }
    });
  }

  // ── Expose global GF namespace ──
  window.GF = {
    sound: { play: playSound },
    particle: createParticle,
    startScreen: startScreen,
    gameOver: gameOverScreen,
    hud: createHUD,
    floatingText: floatingText,
    palettes: palettes
  };

})();
</script>
`;
