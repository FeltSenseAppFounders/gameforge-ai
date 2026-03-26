// GameForge AI — Pre-built game templates
// Polished Phaser.js and Three.js games using GF helper library (window.GF)

export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  genre: string;
  gameCode: string;
}

// ── Star Blaster (shooter) ──────────────────────────────────

const STAR_BLASTER_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Star Blaster</title>
<style>*{margin:0;padding:0}body{background:#0f0f0f;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
</head><body>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
<script>
class GameScene extends Phaser.Scene{
constructor(){super('game')}
create(){
  // Textures
  this.makeTextures();
  // State
  this.score=0;this.lives=3;this.wave=1;this.gameOver=false;this.gameStarted=false;
  this.enemySpeed=80;this.fireRate=200;this.lastFired=0;
  // Stars background
  this.stars=[];for(let i=0;i<100;i++){const s=this.add.circle(Phaser.Math.Between(0,800),Phaser.Math.Between(0,600),Phaser.Math.Between(1,2),0xffffff,Phaser.Math.FloatBetween(.2,.8));this.stars.push({obj:s,speed:Phaser.Math.Between(20,80)})}
  // Groups
  this.bullets=this.physics.add.group({maxSize:30});
  this.enemies=this.physics.add.group();
  this.powerups=this.physics.add.group();
  this.explosionEmitters=[];
  // Particle textures
  GF.particle(this,'spark','#ffcc00',8);
  GF.particle(this,'sparkBlue','#00e5ff',6);
  // Player
  this.player=this.physics.add.sprite(400,540,'ship');
  this.player.setCollideWorldBounds(true);
  // HUD
  this.scoreText=this.add.text(16,16,'SCORE: 0',{fontSize:'18px',fill:'#00e5ff',fontFamily:'monospace'});
  this.livesText=this.add.text(650,16,'',{fontSize:'18px',fill:'#ff006e',fontFamily:'monospace'});
  this.waveText=this.add.text(350,16,'',{fontSize:'18px',fill:'#ffbe0b',fontFamily:'monospace'});
  this.updateHUD();
  // Cursors
  this.cursors=this.input.keyboard.createCursorKeys();
  // Collisions
  this.physics.add.overlap(this.bullets,this.enemies,(b,e)=>this.hitEnemy(b,e),null,this);
  this.physics.add.overlap(this.player,this.enemies,(p,e)=>this.playerHit(e),null,this);
  this.physics.add.overlap(this.player,this.powerups,(p,pw)=>this.getPowerup(pw),null,this);
  // Start screen
  this.startUI=GF.startScreen(this,{title:'STAR BLASTER',controls:'Arrow keys to move | SPACE to shoot',palette:GF.palettes.cyberpunk});
}
makeTextures(){
  // Ship
  let g=this.textures.createCanvas('ship',40,48);let c=g.getContext();
  c.fillStyle='#00e5ff';c.beginPath();c.moveTo(20,0);c.lineTo(38,44);c.lineTo(20,36);c.lineTo(2,44);c.closePath();c.fill();
  c.fillStyle='#ff006e';c.beginPath();c.arc(20,38,5,0,Math.PI*2);c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(20,16,4,0,Math.PI*2);c.fill();g.refresh();
  // Enemy types
  g=this.textures.createCanvas('enemy1',32,32);c=g.getContext();
  c.fillStyle='#ff006e';c.fillRect(4,4,24,24);c.fillStyle='#ff3366';c.fillRect(8,8,16,16);
  c.fillStyle='#fff';c.fillRect(10,12,4,4);c.fillRect(18,12,4,4);g.refresh();
  g=this.textures.createCanvas('enemy2',36,28);c=g.getContext();
  c.fillStyle='#8338ec';c.beginPath();c.moveTo(18,0);c.lineTo(36,28);c.lineTo(0,28);c.closePath();c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(18,16,3,0,Math.PI*2);c.fill();g.refresh();
  // Bullet
  g=this.textures.createCanvas('bullet',4,12);c=g.getContext();
  c.fillStyle='#ffbe0b';c.fillRect(0,0,4,12);c.fillStyle='#fff';c.fillRect(1,0,2,4);g.refresh();
  // Powerup
  g=this.textures.createCanvas('powerup',20,20);c=g.getContext();
  c.fillStyle='#7CFC00';c.beginPath();c.arc(10,10,9,0,Math.PI*2);c.fill();
  c.fillStyle='#fff';c.font='bold 12px monospace';c.textAlign='center';c.textBaseline='middle';c.fillText('P',10,10);g.refresh();
}
updateHUD(){this.scoreText.setText('SCORE: '+this.score);this.livesText.setText('\\u2764'.repeat(this.lives));this.waveText.setText('WAVE '+this.wave)}
spawnWave(){const count=3+this.wave*2;const type=this.wave%3===0?'enemy2':'enemy1';for(let i=0;i<count;i++){this.time.delayedCall(i*300,()=>{if(this.gameOver)return;const e=this.enemies.create(Phaser.Math.Between(30,770),-30,type);e.setVelocityY(this.enemySpeed+this.wave*8);e.hp=type==='enemy2'?2:1;if(type==='enemy2')e.setVelocityX(Phaser.Math.Between(-40,40))})}}
hitEnemy(b,e){b.disableBody(true,true);e.hp--;if(e.hp<=0){GF.sound.play('explosion');this.score+=e.texture.key==='enemy2'?200:100;this.updateHUD();
const em=this.add.particles(e.x,e.y,'spark',{speed:{min:60,max:200},scale:{start:1.2,end:0},lifespan:350,blendMode:'ADD',emitting:false});em.explode(15);
this.time.delayedCall(500,()=>em.destroy());
// Score popup
GF.floatingText(this,e.x,e.y,e.texture.key==='enemy2'?'+200':'+100','#ffcc00');
if(Phaser.Math.Between(1,8)===1){const p=this.powerups.create(e.x,e.y,'powerup');p.setVelocityY(60)}
e.destroy()}else{GF.sound.play('hit');e.setTint(0xffffff);this.time.delayedCall(60,()=>{if(e.active)e.clearTint()})}}
playerHit(e){e.destroy();this.lives--;GF.sound.play('hit');this.cameras.main.shake(150,.015);this.cameras.main.flash(100,255,0,100);this.updateHUD();
if(this.lives<=0){this.doGameOver()}}
getPowerup(pw){pw.destroy();GF.sound.play('powerup');this.fireRate=Math.max(80,this.fireRate-30);
this.tweens.add({targets:this.player,scaleX:1.3,scaleY:1.3,duration:80,yoyo:true})}
doGameOver(){this.gameOver=true;this.physics.pause();GF.gameOver(this,{score:this.score,palette:GF.palettes.cyberpunk})}
update(time){
  // Stars
  this.stars.forEach(s=>{s.obj.y+=s.speed*.016;if(s.obj.y>610){s.obj.y=-5;s.obj.x=Phaser.Math.Between(0,800)}});
  if(!this.gameStarted){if(this.cursors.space.isDown){this.gameStarted=true;this.startUI.destroy();this.spawnWave()}return}
  if(this.gameOver)return;
  // Movement
  const spd=350;
  if(this.cursors.left.isDown)this.player.setVelocityX(-spd);
  else if(this.cursors.right.isDown)this.player.setVelocityX(spd);
  else this.player.setVelocityX(0);
  // Shoot
  if(this.cursors.space.isDown&&time>this.lastFired+this.fireRate){this.lastFired=time;
  const b=this.bullets.create(this.player.x,this.player.y-20,'bullet');if(b){b.setVelocityY(-500);GF.sound.play('shoot');
  const tr=this.add.particles(this.player.x,this.player.y-10,'sparkBlue',{speed:{min:10,max:40},scale:{start:.6,end:0},lifespan:150,blendMode:'ADD',emitting:false});tr.explode(3);this.time.delayedCall(200,()=>tr.destroy())}}
  // Cleanup offscreen
  this.bullets.getChildren().forEach(b=>{if(b.active&&b.y<-20)b.disableBody(true,true)});
  this.enemies.getChildren().forEach(e=>{if(e.active&&e.y>650){e.destroy();this.lives--;this.updateHUD();if(this.lives<=0)this.doGameOver()}});
  // Next wave
  if(this.enemies.countActive()===0&&this.gameStarted&&!this.gameOver){this.wave++;this.updateHUD();this.spawnWave()}
}}
new Phaser.Game({type:Phaser.AUTO,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:800,height:600},backgroundColor:'#0f0f0f',physics:{default:'arcade',arcade:{debug:false}},scene:GameScene});
</script></body></html>`;

// ── Block Jump (platformer) ──────────────────────────────────

const BLOCK_JUMP_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Block Jump</title>
<style>*{margin:0;padding:0}body{background:#0f0f0f;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
</head><body>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
<script>
class GameScene extends Phaser.Scene{
constructor(){super('game')}
create(){
  this.makeTextures();
  this.score=0;this.coinsCollected=0;this.totalCoins=10;this.gameOver=false;this.gameStarted=false;this.canDoubleJump=false;this.hasDoubleJumped=false;
  // Sky gradient bg
  const bg=this.add.graphics();bg.fillGradientStyle(0x1b4332,0x1b4332,0x0f0f0f,0x0f0f0f,1);bg.fillRect(0,0,800,600);
  // Particle tex
  GF.particle(this,'sparkGold','#ffd700',6);GF.particle(this,'sparkGreen','#7CFC00',6);
  // Platforms
  this.platforms=this.physics.add.staticGroup();
  // Ground
  for(let x=0;x<800;x+=48){this.platforms.create(x+24,588,'ground')}
  // Ledges
  const ledges=[[150,450,3],[400,350,3],[650,250,3],[250,180,2],[550,450,2],[50,300,2],[700,150,2]];
  ledges.forEach(([x,y,w])=>{for(let i=0;i<w;i++){this.platforms.create(x+i*48,y,'platform')}});
  // Moving platform
  this.movPlat=this.add.sprite(400,520,'platform');this.physics.add.existing(this.movPlat,true);
  this.tweens.add({targets:this.movPlat,x:600,duration:2000,yoyo:true,repeat:-1,ease:'Sine.easeInOut',onUpdate:()=>{this.movPlat.body.updateFromGameObject()}});
  // Coins
  this.coins=this.physics.add.group();
  const coinPos=[[180,410],[420,310],[680,210],[270,140],[570,410],[80,260],[730,110],[400,150],[550,210],[150,180]];
  coinPos.forEach(([x,y])=>{const c=this.coins.create(x,y,'coin');c.setBounceY(.3);this.tweens.add({targets:c,y:y-8,duration:800+Math.random()*400,yoyo:true,repeat:-1,ease:'Sine.easeInOut'})});
  // Spikes
  this.spikes=this.physics.add.staticGroup();
  [[300,570],[500,570],[350,330]].forEach(([x,y])=>{this.spikes.create(x,y,'spike')});
  // Player
  this.player=this.physics.add.sprite(80,500,'hero');
  this.player.setBounce(.1);this.player.setCollideWorldBounds(true);
  // Collisions
  this.physics.add.collider(this.player,this.platforms);
  this.physics.add.collider(this.player,this.movPlat);
  this.physics.add.collider(this.coins,this.platforms);
  this.physics.add.overlap(this.player,this.coins,(p,c)=>this.collectCoin(c),null,this);
  this.physics.add.overlap(this.player,this.spikes,()=>this.hitSpike(),null,this);
  // HUD
  this.scoreText=this.add.text(16,16,'COINS: 0/'+this.totalCoins,{fontSize:'18px',fill:'#ffd700',fontFamily:'monospace'});
  this.cursors=this.input.keyboard.createCursorKeys();
  // Start screen
  this.startUI=GF.startScreen(this,{title:'BLOCK JUMP',controls:'Arrows to move | UP to jump (x2)',palette:GF.palettes.forest});
}
makeTextures(){
  let g,c;
  // Hero — character with body, head, eyes
  g=this.textures.createCanvas('hero',28,36);c=g.getContext();
  c.fillStyle='#00e5ff';c.fillRect(6,14,16,18);// body
  c.fillStyle='#00b4d8';c.fillRect(2,20,6,12);c.fillRect(20,20,6,12);// arms
  c.fillStyle='#005577';c.fillRect(8,32,5,4);c.fillRect(15,32,5,4);// feet
  c.fillStyle='#ffcc88';c.beginPath();c.arc(14,8,8,0,Math.PI*2);c.fill();// head
  c.fillStyle='#000';c.fillRect(10,6,3,3);c.fillRect(16,6,3,3);// eyes
  c.fillStyle='#ff006e';c.fillRect(12,11,4,2);// mouth
  g.refresh();
  // Ground tile
  g=this.textures.createCanvas('ground',48,24);c=g.getContext();
  c.fillStyle='#2d6a4f';c.fillRect(0,0,48,24);c.fillStyle='#40916c';c.fillRect(0,0,48,6);
  c.strokeStyle='#1b4332';c.lineWidth=1;c.strokeRect(0,0,48,24);g.refresh();
  // Platform
  g=this.textures.createCanvas('platform',48,16);c=g.getContext();
  c.fillStyle='#8B4513';c.fillRect(0,0,48,16);c.fillStyle='#a0522d';c.fillRect(0,0,48,4);
  c.strokeStyle='#654321';c.lineWidth=1;c.strokeRect(0,0,48,16);g.refresh();
  // Coin
  g=this.textures.createCanvas('coin',16,16);c=g.getContext();
  c.fillStyle='#ffd700';c.beginPath();c.arc(8,8,7,0,Math.PI*2);c.fill();
  c.fillStyle='#ffed4a';c.beginPath();c.arc(7,6,3,0,Math.PI*2);c.fill();g.refresh();
  // Spike
  g=this.textures.createCanvas('spike',24,18);c=g.getContext();
  c.fillStyle='#dc143c';c.beginPath();c.moveTo(12,0);c.lineTo(24,18);c.lineTo(0,18);c.closePath();c.fill();
  c.fillStyle='#ff3333';c.beginPath();c.moveTo(12,5);c.lineTo(19,18);c.lineTo(5,18);c.closePath();c.fill();g.refresh();
}
collectCoin(coin){coin.destroy();this.coinsCollected++;this.score+=100;GF.sound.play('coin');
this.scoreText.setText('COINS: '+this.coinsCollected+'/'+this.totalCoins);
const em=this.add.particles(coin.x,coin.y,'sparkGold',{speed:{min:30,max:100},scale:{start:1,end:0},lifespan:300,blendMode:'ADD',emitting:false});em.explode(8);this.time.delayedCall(400,()=>em.destroy());
this.tweens.add({targets:this.player,scaleX:1.2,scaleY:1.2,duration:80,yoyo:true});
if(this.coinsCollected>=this.totalCoins){this.winGame()}}
hitSpike(){if(this.gameOver)return;GF.sound.play('hit');this.cameras.main.shake(200,.02);this.cameras.main.flash(100,255,0,0);this.doGameOver()}
winGame(){this.gameOver=true;this.physics.pause();GF.sound.play('powerup');
const ov=this.add.rectangle(400,300,800,600,0x000000,.75);
this.add.text(400,220,'YOU WIN!',{fontSize:'52px',fill:'#7CFC00',fontFamily:'monospace',fontStyle:'bold'}).setOrigin(.5);
this.add.text(400,290,'All '+this.totalCoins+' coins collected!',{fontSize:'22px',fill:'#ffd700',fontFamily:'monospace'}).setOrigin(.5);
const btn=this.add.rectangle(400,380,200,48,0x7CFC00);this.add.text(400,380,'PLAY AGAIN',{fontSize:'20px',fill:'#000',fontFamily:'monospace',fontStyle:'bold'}).setOrigin(.5);
btn.setInteractive();btn.on('pointerdown',()=>this.scene.restart());
this.input.keyboard.once('keydown-SPACE',()=>this.scene.restart())}
doGameOver(){this.gameOver=true;this.physics.pause();GF.gameOver(this,{score:this.coinsCollected,palette:GF.palettes.forest})}
update(){
  if(!this.gameStarted){if(this.cursors.space.isDown){this.gameStarted=true;this.startUI.destroy()}return}
  if(this.gameOver)return;
  const onGround=this.player.body.touching.down;
  if(onGround){this.hasDoubleJumped=false}
  if(this.cursors.left.isDown){this.player.setVelocityX(-200);this.player.setFlipX(true)}
  else if(this.cursors.right.isDown){this.player.setVelocityX(200);this.player.setFlipX(false)}
  else{this.player.setVelocityX(0)}
  if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
    if(onGround){this.player.setVelocityY(-480);GF.sound.play('jump')}
    else if(!this.hasDoubleJumped){this.player.setVelocityY(-420);this.hasDoubleJumped=true;GF.sound.play('jump');
    const em=this.add.particles(this.player.x,this.player.y+16,'sparkGreen',{speed:{min:20,max:60},scale:{start:.8,end:0},lifespan:200,blendMode:'ADD',emitting:false});em.explode(5);this.time.delayedCall(300,()=>em.destroy())}}
  // Fall death
  if(this.player.y>580&&!this.gameOver){this.doGameOver()}
}}
new Phaser.Game({type:Phaser.AUTO,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:800,height:600},backgroundColor:'#0f0f0f',physics:{default:'arcade',arcade:{gravity:{y:700},debug:false}},scene:GameScene});
</script></body></html>`;

// ── Neon Racer (racing) ──────────────────────────────────

const NEON_RACER_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Neon Racer</title>
<style>*{margin:0;padding:0}body{background:#0f0f0f;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
</head><body>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
<script>
class GameScene extends Phaser.Scene{
constructor(){super('game')}
create(){
  this.makeTextures();GF.particle(this,'trailP','#00e5ff',6);GF.particle(this,'sparkY','#ffd700',6);
  this.score=0;this.distance=0;this.speed=3;this.maxSpeed=10;this.lives=3;this.gameOver=false;this.gameStarted=false;this.boosting=false;
  this.roadLines=[];for(let i=0;i<15;i++){const l=this.add.rectangle(400,i*45,4,25,0x444444);this.roadLines.push(l)}
  // Borders
  this.add.rectangle(170,300,4,600,0xff006e);this.add.rectangle(630,300,4,600,0xff006e);
  // Lane positions
  this.lanes=[245,350,455,555];
  // Player
  this.player=this.physics.add.sprite(350,500,'car');this.player.setCollideWorldBounds(true);
  this.targetX=350;
  // Obstacles & coins
  this.obstacles=this.physics.add.group();this.coinGroup=this.physics.add.group();
  this.physics.add.overlap(this.player,this.obstacles,()=>this.hitObstacle(),null,this);
  this.physics.add.overlap(this.player,this.coinGroup,(p,c)=>{c.destroy();this.score+=50;GF.sound.play('coin');this.scoreText.setText('SCORE: '+this.score);
  const em=this.add.particles(c.x,c.y,'sparkY',{speed:{min:30,max:80},scale:{start:1,end:0},lifespan:250,blendMode:'ADD',emitting:false});em.explode(6);this.time.delayedCall(300,()=>em.destroy())},null,this);
  // Spawn timer
  this.spawnTimer=this.time.addEvent({delay:800,callback:()=>this.spawnRow(),loop:true});
  // HUD
  this.scoreText=this.add.text(16,16,'SCORE: 0',{fontSize:'18px',fill:'#00e5ff',fontFamily:'monospace'});
  this.distText=this.add.text(16,40,'0m',{fontSize:'14px',fill:'#aaa',fontFamily:'monospace'});
  this.livesText=this.add.text(680,16,'',{fontSize:'18px',fill:'#ff006e',fontFamily:'monospace'});this.updateLives();
  this.spdText=this.add.text(680,40,'',{fontSize:'14px',fill:'#7CFC00',fontFamily:'monospace'});
  this.cursors=this.input.keyboard.createCursorKeys();
  // Start screen
  this.startUI=GF.startScreen(this,{title:'NEON RACER',controls:'LEFT/RIGHT to steer | SPACE to boost',palette:GF.palettes.cyberpunk});
}
makeTextures(){
  let g,c;
  // Player car
  g=this.textures.createCanvas('car',28,44);c=g.getContext();
  c.fillStyle='#00e5ff';c.fillRect(4,8,20,28);// body
  c.fillStyle='#005577';c.fillRect(0,12,4,10);c.fillRect(24,12,4,10);// wheels front
  c.fillStyle='#005577';c.fillRect(0,28,4,10);c.fillRect(24,28,4,10);// wheels back
  c.fillStyle='#fff';c.fillRect(8,8,12,6);// windshield
  c.fillStyle='#ff006e';c.fillRect(8,34,5,4);c.fillRect(15,34,5,4);// taillights
  g.refresh();
  // Obstacle car
  g=this.textures.createCanvas('obs',28,44);c=g.getContext();
  c.fillStyle='#ff006e';c.fillRect(4,8,20,28);
  c.fillStyle='#880033';c.fillRect(0,12,4,10);c.fillRect(24,12,4,10);c.fillRect(0,28,4,10);c.fillRect(24,28,4,10);
  c.fillStyle='#ffcc00';c.fillRect(8,8,12,6);g.refresh();
  // Coin
  g=this.textures.createCanvas('rcoin',14,14);c=g.getContext();
  c.fillStyle='#ffd700';c.beginPath();c.arc(7,7,6,0,Math.PI*2);c.fill();
  c.fillStyle='#ffed4a';c.beginPath();c.arc(5,5,2,0,Math.PI*2);c.fill();g.refresh();
}
updateLives(){this.livesText.setText('\\u2764'.repeat(this.lives))}
spawnRow(){if(this.gameOver||!this.gameStarted)return;
  const blocked=Phaser.Math.Between(0,3);
  for(let i=0;i<4;i++){if(i===blocked){const obs=this.obstacles.create(this.lanes[i],-40,'obs');obs.setVelocityY(this.speed*60)}
  else if(Phaser.Math.Between(1,4)===1){const cn=this.coinGroup.create(this.lanes[i],-20,'rcoin');cn.setVelocityY(this.speed*60)}}}
hitObstacle(){if(this.gameOver)return;this.lives--;this.updateLives();GF.sound.play('hit');this.cameras.main.shake(200,.02);this.cameras.main.flash(100,255,0,0);
  // Remove overlapping obstacles
  this.obstacles.getChildren().filter(o=>Math.abs(o.x-this.player.x)<30&&Math.abs(o.y-this.player.y)<50).forEach(o=>o.destroy());
  if(this.lives<=0){this.doGameOver()}}
doGameOver(){this.gameOver=true;this.physics.pause();GF.gameOver(this,{score:this.score,palette:GF.palettes.cyberpunk})}
update(time,delta){
  // Road lines
  this.roadLines.forEach(l=>{l.y+=this.speed*2;if(l.y>620){l.y=-20}});
  if(!this.gameStarted){if(this.cursors.space.isDown){this.gameStarted=true;this.startUI.destroy()}return}
  if(this.gameOver)return;
  this.distance+=this.speed*delta*.01;this.distText.setText(Math.floor(this.distance)+'m');
  // Speed ramp
  if(!this.boosting)this.speed=Math.min(this.maxSpeed,3+this.distance*.003);
  this.spdText.setText(Math.floor(this.speed*30)+'km/h');
  // Steer
  if(this.cursors.left.isDown)this.targetX=Math.max(200,this.targetX-5);
  if(this.cursors.right.isDown)this.targetX=Math.min(600,this.targetX+5);
  this.player.x+=(this.targetX-this.player.x)*.15;
  // Boost
  if(this.cursors.space.isDown&&!this.boosting){this.boosting=true;this.speed=this.maxSpeed+3;GF.sound.play('powerup');this.time.delayedCall(1500,()=>{this.boosting=false})}
  // Cleanup
  this.obstacles.getChildren().forEach(o=>{if(o.y>650)o.destroy()});
  this.coinGroup.getChildren().forEach(c=>{if(c.y>650)c.destroy()});
  this.score+=Math.floor(this.speed);this.scoreText.setText('SCORE: '+this.score);
}}
new Phaser.Game({type:Phaser.AUTO,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:800,height:600},backgroundColor:'#1a1a1a',physics:{default:'arcade',arcade:{debug:false}},scene:GameScene});
</script></body></html>`;

// ── Dungeon Crawl (RPG) ──────────────────────────────────

const DUNGEON_CRAWL_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dungeon Crawl</title>
<style>*{margin:0;padding:0}body{background:#0f0f0f;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
</head><body>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
<script>
const T=32,W=25,H=18;
class GameScene extends Phaser.Scene{
constructor(){super('game')}
create(){
  this.makeTextures();GF.particle(this,'sparkR','#ff3131',6);GF.particle(this,'sparkG','#7CFC00',6);
  this.floor=1;this.hp=10;this.maxHp=10;this.atk=2;this.score=0;this.gameOver=false;this.gameStarted=false;this.moving=false;
  this.generateFloor();
  this.cursors=this.input.keyboard.createCursorKeys();
  // HUD
  this.hpText=this.add.text(16,4,'HP: 10/10',{fontSize:'14px',fill:'#ff3131',fontFamily:'monospace'}).setScrollFactor(0).setDepth(100);
  this.floorText=this.add.text(400,4,'FLOOR 1',{fontSize:'14px',fill:'#ffd700',fontFamily:'monospace'}).setOrigin(.5,0).setScrollFactor(0).setDepth(100);
  this.scoreText=this.add.text(700,4,'0',{fontSize:'14px',fill:'#7CFC00',fontFamily:'monospace'}).setScrollFactor(0).setDepth(100);
  // Start
  this.titleBg=this.add.rectangle(400,288,500,200,0x000000,.85).setScrollFactor(0).setDepth(200);
  this.startUI=GF.startScreen(this,{title:'DUNGEON CRAWL',controls:'Arrow keys to move — bump enemies to fight',palette:GF.palettes.fire});
}
makeTextures(){
  let g,c;
  g=this.textures.createCanvas('wall',T,T);c=g.getContext();c.fillStyle='#333';c.fillRect(0,0,T,T);c.fillStyle='#444';c.fillRect(2,2,T-4,T-4);c.fillStyle='#3a3a3a';c.fillRect(4,4,12,12);c.fillRect(16,16,12,12);g.refresh();
  g=this.textures.createCanvas('floorT',T,T);c=g.getContext();c.fillStyle='#1a1a2e';c.fillRect(0,0,T,T);c.strokeStyle='#222';c.strokeRect(0,0,T,T);g.refresh();
  g=this.textures.createCanvas('player',T,T);c=g.getContext();
  c.fillStyle='#00e5ff';c.fillRect(8,4,16,22);c.fillStyle='#ffcc88';c.beginPath();c.arc(16,6,6,0,Math.PI*2);c.fill();
  c.fillStyle='#ffd700';c.fillRect(24,10,6,3);// sword
  c.fillStyle='#000';c.fillRect(13,4,2,2);c.fillRect(17,4,2,2);g.refresh();
  g=this.textures.createCanvas('enemy',T,T);c=g.getContext();
  c.fillStyle='#ff006e';c.fillRect(6,6,20,20);c.fillStyle='#fff';c.fillRect(10,10,4,4);c.fillRect(18,10,4,4);
  c.fillStyle='#ff3366';c.fillRect(10,18,12,4);g.refresh();
  g=this.textures.createCanvas('potion',T,T);c=g.getContext();
  c.fillStyle='#ff3131';c.beginPath();c.arc(16,18,7,0,Math.PI*2);c.fill();c.fillStyle='#aaa';c.fillRect(13,6,6,8);g.refresh();
  g=this.textures.createCanvas('stairs',T,T);c=g.getContext();
  c.fillStyle='#ffd700';c.fillRect(4,4,24,24);for(let i=0;i<4;i++){c.fillStyle=i%2?'#ffd700':'#cc9900';c.fillRect(4,4+i*6,24,6)}g.refresh();
}
generateFloor(){
  // Clear
  if(this.tileGroup)this.tileGroup.clear(true,true);
  if(this.enemyGroup)this.enemyGroup.clear(true,true);
  if(this.itemGroup)this.itemGroup.clear(true,true);
  this.tileGroup=this.add.group();this.enemyGroup=[];this.itemGroup=[];
  // Map
  this.map=[];for(let y=0;y<H;y++){this.map[y]=[];for(let x=0;x<W;x++)this.map[y][x]=1}
  // Rooms
  const rooms=[];for(let i=0;i<6+this.floor;i++){const rw=Phaser.Math.Between(3,6),rh=Phaser.Math.Between(3,5);
  const rx=Phaser.Math.Between(1,W-rw-1),ry=Phaser.Math.Between(1,H-rh-1);
  rooms.push({x:rx,y:ry,w:rw,h:rh});
  for(let y=ry;y<ry+rh;y++)for(let x=rx;x<rx+rw;x++)this.map[y][x]=0}
  // Corridors
  for(let i=0;i<rooms.length-1;i++){let cx=Math.floor(rooms[i].x+rooms[i].w/2),cy=Math.floor(rooms[i].y+rooms[i].h/2);
  const tx=Math.floor(rooms[i+1].x+rooms[i+1].w/2),ty=Math.floor(rooms[i+1].y+rooms[i+1].h/2);
  while(cx!==tx){cx+=cx<tx?1:-1;if(cy>=0&&cy<H&&cx>=0&&cx<W)this.map[cy][cx]=0}
  while(cy!==ty){cy+=cy<ty?1:-1;if(cy>=0&&cy<H&&cx>=0&&cx<W)this.map[cy][cx]=0}}
  // Render tiles
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(this.map[y][x]===1){const w=this.tileGroup.create(x*T+T/2,y*T+T/2,'wall')}else{this.add.image(x*T+T/2,y*T+T/2,'floorT')}}
  // Player start
  const sr=rooms[0];
  if(!this.playerSprite){this.playerSprite=this.add.sprite(0,0,'player').setDepth(10)}
  this.px=sr.x+1;this.py=sr.y+1;this.playerSprite.setPosition(this.px*T+T/2,this.py*T+T/2);
  // Stairs in last room
  const lr=rooms[rooms.length-1];
  this.stairsSprite=this.add.sprite((lr.x+Math.floor(lr.w/2))*T+T/2,(lr.y+Math.floor(lr.h/2))*T+T/2,'stairs');
  this.stairsX=lr.x+Math.floor(lr.w/2);this.stairsY=lr.y+Math.floor(lr.h/2);
  // Enemies
  const numEnemies=3+this.floor*2;
  for(let i=0;i<numEnemies;i++){const r=rooms[Phaser.Math.Between(1,rooms.length-1)];
  const ex=r.x+Phaser.Math.Between(0,r.w-1),ey=r.y+Phaser.Math.Between(0,r.h-1);
  if(this.map[ey][ex]===0&&!(ex===this.px&&ey===this.py)){
  const es=this.add.sprite(ex*T+T/2,ey*T+T/2,'enemy').setDepth(5);
  this.enemyGroup.push({sprite:es,x:ex,y:ey,hp:1+Math.floor(this.floor/2)})}}
  // Potions
  for(let i=0;i<2;i++){const r=rooms[Phaser.Math.Between(1,rooms.length-2)];
  const ix=r.x+Phaser.Math.Between(0,r.w-1),iy=r.y+Phaser.Math.Between(0,r.h-1);
  if(this.map[iy][ix]===0){const ps=this.add.sprite(ix*T+T/2,iy*T+T/2,'potion');this.itemGroup.push({sprite:ps,x:ix,y:iy,type:'potion'})}}
}
tryMove(dx,dy){
  if(this.moving||this.gameOver)return;
  const nx=this.px+dx,ny=this.py+dy;
  if(nx<0||nx>=W||ny<0||ny>=H||this.map[ny][nx]===1)return;
  // Check enemy
  const ei=this.enemyGroup.findIndex(e=>e.x===nx&&e.y===ny);
  if(ei>=0){this.attackEnemy(ei);return}
  this.moving=true;this.px=nx;this.py=ny;GF.sound.play('hit');
  this.tweens.add({targets:this.playerSprite,x:nx*T+T/2,y:ny*T+T/2,duration:120,onComplete:()=>{
    this.moving=false;
    // Check items
    const ii=this.itemGroup.findIndex(i=>i.x===this.px&&i.y===this.py);
    if(ii>=0){const item=this.itemGroup[ii];if(item.type==='potion'){this.hp=Math.min(this.maxHp,this.hp+4);GF.sound.play('powerup');this.updateHUD();
    const em=this.add.particles(item.sprite.x,item.sprite.y,'sparkG',{speed:{min:20,max:60},scale:{start:1,end:0},lifespan:300,blendMode:'ADD',emitting:false});em.explode(8);this.time.delayedCall(400,()=>em.destroy())}
    item.sprite.destroy();this.itemGroup.splice(ii,1)}
    // Check stairs
    if(this.px===this.stairsX&&this.py===this.stairsY){GF.sound.play('coin');this.floor++;this.score+=500;this.updateHUD();this.generateFloor()}
  }});
}
attackEnemy(ei){
  const e=this.enemyGroup[ei];e.hp-=this.atk;GF.sound.play('hit');this.cameras.main.shake(80,.008);
  // Damage number
  GF.floatingText(this,e.sprite.x,e.sprite.y-10,'-'+this.atk,'#ffcc00');
  e.sprite.setTint(0xffffff);this.time.delayedCall(80,()=>{if(e.sprite.active)e.sprite.clearTint()});
  if(e.hp<=0){this.score+=100;
  const em=this.add.particles(e.sprite.x,e.sprite.y,'sparkR',{speed:{min:40,max:120},scale:{start:1,end:0},lifespan:300,blendMode:'ADD',emitting:false});em.explode(10);this.time.delayedCall(400,()=>em.destroy());
  e.sprite.destroy();this.enemyGroup.splice(ei,1);this.updateHUD()}
  else{// Enemy counter-attack
    this.hp--;this.cameras.main.flash(60,255,0,0);this.updateHUD();
    if(this.hp<=0)this.doGameOver()}}
updateHUD(){this.hpText.setText('HP: '+this.hp+'/'+this.maxHp);this.floorText.setText('FLOOR '+this.floor);this.scoreText.setText(this.score+'')}
doGameOver(){this.gameOver=true;GF.gameOver(this,{score:this.score,palette:GF.palettes.fire})}
update(){
  if(!this.gameStarted){if(this.cursors.space.isDown){this.gameStarted=true;this.titleBg.destroy();this.startUI.destroy()}return}
  if(this.gameOver)return;
  if(Phaser.Input.Keyboard.JustDown(this.cursors.left))this.tryMove(-1,0);
  if(Phaser.Input.Keyboard.JustDown(this.cursors.right))this.tryMove(1,0);
  if(Phaser.Input.Keyboard.JustDown(this.cursors.up))this.tryMove(0,-1);
  if(Phaser.Input.Keyboard.JustDown(this.cursors.down))this.tryMove(0,1);
}}
new Phaser.Game({type:Phaser.AUTO,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:W*T,height:H*T},backgroundColor:'#0a0a0a',scene:GameScene});
</script></body></html>`;

// ── Tower Defense ──────────────────────────────────────

const TOWER_DEFENSE_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Neon Towers</title>
<style>*{margin:0;padding:0}body{background:#0f0f0f;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
</head><body>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
<script>
const T=40,GW=20,GH=15;
const PATH=[[0,7],[3,7],[3,3],[8,3],[8,11],[14,11],[14,5],[19,5]];
class GameScene extends Phaser.Scene{
constructor(){super('game')}
create(){
  this.makeTextures();GF.particle(this,'sparkO','#ff6600',6);
  this.gold=100;this.lives=10;this.wave=0;this.score=0;this.gameOver=false;this.gameStarted=false;
  this.towers=[];this.enemies=[];this.projectiles=[];this.selectedTower='basic';
  // Draw grid
  this.pathSet=new Set();
  for(let i=0;i<PATH.length-1;i++){const[x1,y1]=PATH[i],[x2,y2]=PATH[i+1];
  let cx=x1,cy=y1;while(cx!==x2||cy!==y2){this.pathSet.add(cy*GW+cx);if(cx!==x2)cx+=cx<x2?1:-1;else cy+=cy<y2?1:-1}
  this.pathSet.add(cy*GW+cx)}
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const onPath=this.pathSet.has(y*GW+x);
  this.add.rectangle(x*T+T/2,y*T+T/2,T-1,T-1,onPath?0x2a2a00:0x1a1a2e).setAlpha(onPath?.5:.3)}
  // Path line
  const gfx=this.add.graphics();gfx.lineStyle(2,0xffcc00,.4);gfx.beginPath();
  PATH.forEach(([x,y],i)=>{i===0?gfx.moveTo(x*T+T/2,y*T+T/2):gfx.lineTo(x*T+T/2,y*T+T/2)});gfx.strokePath();
  // Click to place
  this.input.on('pointerdown',(p)=>{if(this.gameOver||!this.gameStarted)return;
  const gx=Math.floor(p.x/T),gy=Math.floor(p.y/T);
  if(gx<0||gx>=GW||gy<0||gy>=GH)return;
  if(this.pathSet.has(gy*GW+gx))return;
  if(this.towers.find(t=>t.gx===gx&&t.gy===gy))return;
  const cost=this.selectedTower==='splash'?75:this.selectedTower==='slow'?60:50;
  if(this.gold<cost)return;
  this.gold-=cost;GF.sound.play('coin');
  const color=this.selectedTower==='splash'?0xff6600:this.selectedTower==='slow'?0x00bfff:0x7CFC00;
  const ts=this.add.rectangle(gx*T+T/2,gy*T+T/2,T-6,T-6,color).setDepth(5);
  this.towers.push({sprite:ts,gx,gy,type:this.selectedTower,range:this.selectedTower==='slow'?100:120,rate:this.selectedTower==='splash'?1200:800,dmg:this.selectedTower==='splash'?2:1,lastFired:0,splash:this.selectedTower==='splash'});
  this.updateHUD()});
  // HUD
  this.hudBg=this.add.rectangle(400,GH*T+20,800,40,0x111111).setDepth(50);
  this.goldText=this.add.text(16,GH*T+10,'GOLD: 100',{fontSize:'14px',fill:'#ffd700',fontFamily:'monospace'}).setDepth(50);
  this.livesText=this.add.text(200,GH*T+10,'LIVES: 10',{fontSize:'14px',fill:'#ff3131',fontFamily:'monospace'}).setDepth(50);
  this.waveText=this.add.text(380,GH*T+10,'WAVE: 0',{fontSize:'14px',fill:'#7CFC00',fontFamily:'monospace'}).setDepth(50);
  this.scoreText=this.add.text(550,GH*T+10,'',{fontSize:'14px',fill:'#fff',fontFamily:'monospace'}).setDepth(50);
  // Tower select buttons
  ['basic','splash','slow'].forEach((t,i)=>{const colors={basic:0x7CFC00,splash:0xff6600,slow:0x00bfff};const costs={basic:50,splash:75,slow:60};
  const btn=this.add.rectangle(680+i*40,GH*T+20,34,28,colors[t]).setDepth(50).setInteractive();
  this.add.text(680+i*40,GH*T+20,costs[t]+'',{fontSize:'9px',fill:'#000',fontFamily:'monospace',fontStyle:'bold'}).setOrigin(.5).setDepth(50);
  btn.on('pointerdown',()=>{this.selectedTower=t})});
  this.cursors=this.input.keyboard.createCursorKeys();
  // Start screen
  this.titleBg=this.add.rectangle(400,300,500,250,0x000000,.85).setDepth(100);
  this.startUI=GF.startScreen(this,{title:'NEON TOWERS',subtitle:'Click empty cells to place towers',controls:'Green=Basic | Orange=Splash | Blue=Slow',palette:GF.palettes.neonArcade});
}
makeTextures(){}
updateHUD(){this.goldText.setText('GOLD: '+this.gold);this.livesText.setText('LIVES: '+this.lives);this.waveText.setText('WAVE: '+this.wave);this.scoreText.setText('SCORE: '+this.score)}
spawnWave(){this.wave++;this.updateHUD();const count=5+this.wave*2;const hp=2+this.wave;
for(let i=0;i<count;i++){this.time.delayedCall(i*600,()=>{if(this.gameOver)return;
const e={pathIdx:0,progress:0,hp,maxHp:hp,speed:1+this.wave*.1,sprite:null,hpBar:null};
e.sprite=this.add.circle(PATH[0][0]*T+T/2,PATH[0][1]*T+T/2,8,0xff006e).setDepth(8);
e.hpBar=this.add.rectangle(e.sprite.x,e.sprite.y-14,20,3,0x00ff00).setDepth(9);
this.enemies.push(e)})}}
update(time,delta){
  if(!this.gameStarted){if(this.cursors.space.isDown){this.gameStarted=true;this.titleBg.destroy();this.startUI.destroy();this.spawnWave()}return}
  if(this.gameOver)return;
  const dt=delta/1000;
  // Move enemies along path
  this.enemies.forEach(e=>{if(!e.sprite.active)return;
  if(e.pathIdx>=PATH.length-1){// Reached end
    this.lives--;e.sprite.destroy();e.hpBar.destroy();e.sprite.active=false;this.updateHUD();
    if(this.lives<=0)this.doGameOver();return}
  const[tx,ty]=PATH[e.pathIdx+1];const targetX=tx*T+T/2,targetY=ty*T+T/2;
  const dx=targetX-e.sprite.x,dy=targetY-e.sprite.y;const dist=Math.sqrt(dx*dx+dy*dy);
  if(dist<2){e.pathIdx++;return}
  const spd=e.speed*60*dt;e.sprite.x+=dx/dist*spd;e.sprite.y+=dy/dist*spd;
  e.hpBar.x=e.sprite.x;e.hpBar.y=e.sprite.y-14;e.hpBar.width=20*(e.hp/e.maxHp)});
  // Towers shoot
  this.towers.forEach(t=>{if(time<t.lastFired+t.rate)return;
  let target=null,minD=t.range;
  this.enemies.forEach(e=>{if(!e.sprite.active)return;const d=Phaser.Math.Distance.Between(t.sprite.x,t.sprite.y,e.sprite.x,e.sprite.y);
  if(d<minD){minD=d;target=e}});
  if(target){t.lastFired=time;GF.sound.play('shoot');
  // Projectile
  const p=this.add.circle(t.sprite.x,t.sprite.y,3,t.type==='slow'?0x00bfff:t.type==='splash'?0xff6600:0x7CFC00).setDepth(7);
  this.projectiles.push({sprite:p,target,dmg:t.dmg,speed:300,splash:t.splash,slow:t.type==='slow'})}});
  // Move projectiles
  for(let i=this.projectiles.length-1;i>=0;i--){const p=this.projectiles[i];
  if(!p.target.sprite.active){p.sprite.destroy();this.projectiles.splice(i,1);continue}
  const dx=p.target.sprite.x-p.sprite.x,dy=p.target.sprite.y-p.sprite.y;const dist=Math.sqrt(dx*dx+dy*dy);
  if(dist<8){// Hit
    p.target.hp-=p.dmg;if(p.slow)p.target.speed=Math.max(.3,p.target.speed-.3);
    if(p.target.hp<=0){GF.sound.play('explosion');this.gold+=10+this.wave;this.score+=50;
    const em=this.add.particles(p.target.sprite.x,p.target.sprite.y,'sparkO',{speed:{min:30,max:80},scale:{start:1,end:0},lifespan:250,blendMode:'ADD',emitting:false});em.explode(8);this.time.delayedCall(300,()=>em.destroy());
    p.target.sprite.destroy();p.target.hpBar.destroy();p.target.sprite.active=false;this.updateHUD()}
    p.sprite.destroy();this.projectiles.splice(i,1)}
  else{const spd=p.speed*dt;p.sprite.x+=dx/dist*spd;p.sprite.y+=dy/dist*spd}}
  // Cleanup dead enemies
  this.enemies=this.enemies.filter(e=>e.sprite.active);
  // Next wave
  if(this.enemies.length===0&&this.gameStarted&&!this.gameOver){this.time.delayedCall(1500,()=>{if(!this.gameOver)this.spawnWave()})}
}
doGameOver(){this.gameOver=true;GF.gameOver(this,{score:this.score,palette:GF.palettes.neonArcade})}
}
new Phaser.Game({type:Phaser.AUTO,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:GW*T,height:GH*T+40},backgroundColor:'#0a0a1a',scene:GameScene});
</script></body></html>`;

// ── 3D Marble Roller (Three.js) ──────────────────────────

const MARBLE_3D_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Marble Roll 3D</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;overflow:hidden}canvas{display:block}
#hud{position:fixed;top:0;left:0;right:0;padding:16px 24px;display:flex;justify-content:space-between;font-family:'Courier New',monospace;color:#7CFC00;font-size:18px;font-weight:bold;text-shadow:0 0 10px rgba(124,252,0,.5);pointer-events:none;z-index:10}
#overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Courier New',monospace;color:#fff;z-index:20}
#overlay h1{font-size:48px;margin-bottom:16px;color:#00e5ff;text-shadow:0 0 20px rgba(0,229,255,.5)}
#overlay p{font-size:18px;margin-bottom:8px;color:#aaa}
#overlay .btn{margin-top:24px;padding:12px 32px;background:#7CFC00;color:#000;border:none;font-size:20px;font-weight:bold;cursor:pointer;font-family:'Courier New',monospace}
.hidden{display:none!important}
</style></head><body>
<div id="hud"><span id="score">SCORE: 0</span><span id="level">LEVEL 1</span></div>
<div id="overlay"><h1>MARBLE ROLL 3D</h1><p>Arrow keys to roll the marble</p><p>Collect gems, don't fall off!</p><button class="btn" id="startBtn" onclick="startGame()">START</button></div>
<script src="https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.min.js"></script>
<script>
let scene,camera,renderer,marble,marbleVel,platforms,gems,score=0,level=1,gameActive=false,gameOver=false;
const keys={};const clock=new THREE.Clock();
window.addEventListener('keydown',e=>{keys[e.code]=true});
window.addEventListener('keyup',e=>{keys[e.code]=false});

function init(){
  scene=new THREE.Scene();scene.background=new THREE.Color(0x0a0a2e);
  scene.fog=new THREE.Fog(0x0a0a2e,30,80);
  camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,200);
  camera.position.set(0,12,14);camera.lookAt(0,0,0);
  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled=true;document.body.appendChild(renderer.domElement);
  // Lights
  scene.add(new THREE.AmbientLight(0x404060,.5));
  const dl=new THREE.DirectionalLight(0xffffff,1);dl.position.set(8,15,8);dl.castShadow=true;scene.add(dl);
  const pl=new THREE.PointLight(0x00e5ff,.6,30);pl.position.set(0,5,0);scene.add(pl);
  // Marble
  const mg=new THREE.SphereGeometry(.5,24,24);
  const mm=new THREE.MeshStandardMaterial({color:0x00e5ff,metalness:.7,roughness:.2});
  marble=new THREE.Mesh(mg,mm);marble.position.set(0,.5,0);marble.castShadow=true;scene.add(marble);
  marbleVel=new THREE.Vector3();
  // Generate level
  generateLevel();
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
  animate();
}
function generateLevel(){
  // Clear old
  if(platforms)platforms.forEach(p=>scene.remove(p));
  if(gems)gems.forEach(g=>{scene.remove(g.mesh)});
  platforms=[];gems=[];
  // Start platform
  addPlatform(0,0,0,4,4);
  // Random platforms
  let px=0,pz=0;
  const numPlats=8+level*3;
  for(let i=0;i<numPlats;i++){
    const dx=Phaser?0:0;
    px+=Math.random()*4-2+.5*(Math.random()>.5?1:-1);
    pz-=2+Math.random()*2;
    const w=2+Math.random()*2,d=2+Math.random()*2;
    addPlatform(px,0,pz,w,d);
    if(Math.random()>.4){addGem(px+(Math.random()-.5),1,pz+(Math.random()-.5))}
  }
  // Goal platform
  pz-=3;addPlatform(px,0,pz,3,3);
  const goalGeo=new THREE.CylinderGeometry(.3,.3,.1,16);
  const goalMat=new THREE.MeshStandardMaterial({color:0xffd700,emissive:0xffd700,emissiveIntensity:.5});
  const goal=new THREE.Mesh(goalGeo,goalMat);goal.position.set(px,.05,pz);scene.add(goal);
  platforms.push(goal);goal.userData.isGoal=true;
  // Reset marble
  marble.position.set(0,.5,0);marbleVel.set(0,0,0);
}
function addPlatform(x,y,z,w,d){
  const g=new THREE.BoxGeometry(w,.3,d);
  const hue=(Math.abs(z)/80)%1;
  const c=new THREE.Color().setHSL(.55+hue*.3,.6,.35);
  const m=new THREE.MeshStandardMaterial({color:c});
  const p=new THREE.Mesh(g,m);p.position.set(x,y-.15,z);p.receiveShadow=true;
  p.userData.bounds={minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2,top:y};
  scene.add(p);platforms.push(p);
}
function addGem(x,y,z){
  const g=new THREE.OctahedronGeometry(.3);
  const m=new THREE.MeshStandardMaterial({color:0xffd700,emissive:0xffd700,emissiveIntensity:.4});
  const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);scene.add(mesh);
  gems.push({mesh,collected:false});
}
function startGame(){
  document.getElementById('overlay').classList.add('hidden');
  gameActive=true;gameOver=false;score=0;level=1;
  document.getElementById('score').textContent='SCORE: 0';
  document.getElementById('level').textContent='LEVEL 1';
  generateLevel();clock.getDelta();
}
function showGameOver(won){
  gameActive=false;gameOver=true;
  const ov=document.getElementById('overlay');ov.classList.remove('hidden');
  if(won){GF.sound.play('powerup');ov.innerHTML='<h1>LEVEL COMPLETE!</h1><p>Score: '+score+'</p><button class="btn" onclick="nextLevel()">NEXT LEVEL</button>'}
  else{GF.sound.play('gameover');ov.innerHTML='<h1 style="color:#ff3131">GAME OVER</h1><p>Score: '+score+' | Level: '+level+'</p><button class="btn" onclick="startGame()">RESTART</button>'}
}
function nextLevel(){level++;document.getElementById('level').textContent='LEVEL '+level;
document.getElementById('overlay').classList.add('hidden');gameActive=true;generateLevel();clock.getDelta()}
function animate(){
  requestAnimationFrame(animate);
  if(!gameActive){
    // Rotate gems for visual appeal
    if(gems)gems.forEach(g=>{if(!g.collected)g.mesh.rotation.y+=.02});
    renderer.render(scene,camera);return}
  const dt=Math.min(clock.getDelta(),.033);
  // Input
  const force=15*dt;
  if(keys['ArrowLeft']||keys['KeyA'])marbleVel.x-=force;
  if(keys['ArrowRight']||keys['KeyD'])marbleVel.x+=force;
  if(keys['ArrowUp']||keys['KeyW'])marbleVel.z-=force;
  if(keys['ArrowDown']||keys['KeyS'])marbleVel.z+=force;
  // Gravity
  marbleVel.y-=20*dt;
  // Friction
  marbleVel.x*=.97;marbleVel.z*=.97;
  // Move
  marble.position.add(marbleVel.clone().multiplyScalar(dt));
  marble.rotation.x+=marbleVel.z*dt*3;marble.rotation.z-=marbleVel.x*dt*3;
  // Platform collision
  let onPlatform=false;
  platforms.forEach(p=>{if(!p.userData.bounds)return;const b=p.userData.bounds;
  if(marble.position.x>b.minX-.4&&marble.position.x<b.maxX+.4&&marble.position.z>b.minZ-.4&&marble.position.z<b.maxZ+.4){
  if(marble.position.y<=b.top+.5&&marble.position.y>b.top-.5){marble.position.y=b.top+.5;marbleVel.y=0;onPlatform=true}}
  if(p.userData.isGoal&&marble.position.x>b.minX&&marble.position.x<b.maxX&&marble.position.z>b.minZ&&marble.position.z<b.maxZ&&Math.abs(marble.position.y-(b.top+.5))<.3){showGameOver(true)}});
  // Fall
  if(marble.position.y<-10){showGameOver(false)}
  // Gems
  gems.forEach(g=>{if(g.collected)return;g.mesh.rotation.y+=.03;
  if(marble.position.distanceTo(g.mesh.position)<.8){g.collected=true;scene.remove(g.mesh);score+=100;GF.sound.play('coin');
  document.getElementById('score').textContent='SCORE: '+score}});
  // Camera follow
  const camTarget=new THREE.Vector3(marble.position.x,marble.position.y+10,marble.position.z+12);
  camera.position.lerp(camTarget,.05);camera.lookAt(marble.position);
  renderer.render(scene,camera);
}
init();
</script></body></html>`;

// ── Export all templates ──────────────────────────────────

export const GAME_TEMPLATES: GameTemplate[] = [
  {
    id: "star-blaster",
    name: "Star Blaster",
    description: "Space shooter with detailed sprites, particle explosions, power-ups, sound effects, and wave progression",
    genre: "shooter",
    gameCode: STAR_BLASTER_CODE,
  },
  {
    id: "block-jump",
    name: "Block Jump",
    description: "Platformer with a character, double-jump, moving platforms, coin collection with sparkle effects",
    genre: "platformer",
    gameCode: BLOCK_JUMP_CODE,
  },
  {
    id: "neon-racer",
    name: "Neon Racer",
    description: "Top-down racing with lane switching, speed boost, obstacles, coins, and increasing speed",
    genre: "racing",
    gameCode: NEON_RACER_CODE,
  },
  {
    id: "dungeon-crawl",
    name: "Dungeon Crawl",
    description: "Tile-based RPG dungeon crawler with procedural rooms, bump combat, potions, and floor progression",
    genre: "rpg",
    gameCode: DUNGEON_CRAWL_CODE,
  },
  {
    id: "neon-towers",
    name: "Neon Towers",
    description: "Tower defense with 3 tower types, enemy waves, gold economy, and path-based enemies",
    genre: "towerdefense",
    gameCode: TOWER_DEFENSE_CODE,
  },
  {
    id: "marble-roll-3d",
    name: "Marble Roll 3D",
    description: "3D marble roller using Three.js — roll across floating platforms, collect gems, don't fall off!",
    genre: "3d-marble",
    gameCode: MARBLE_3D_CODE,
  },
];
