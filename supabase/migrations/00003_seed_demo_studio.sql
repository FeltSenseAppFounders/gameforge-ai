-- ============================================================
-- GameForge AI — seed_demo_studio() RPC
-- Creates a demo studio with sample game projects for new users
-- ============================================================

CREATE OR REPLACE FUNCTION seed_demo_studio(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_studio_id UUID;
BEGIN
  -- Create demo studio
  INSERT INTO studios (name, owner_id, subscription_tier)
  VALUES ('Demo Studio', p_user_id, 'free')
  RETURNING id INTO v_studio_id;

  -- Insert 5 demo game projects with real Phaser.js code
  -- 1. Star Blaster (shooter, playable)
  INSERT INTO game_projects (studio_id, name, description, genre, status, game_code, is_public, likes_count, views_count)
  VALUES (v_studio_id, 'Star Blaster', 'Classic space invaders — shoot down waves of alien enemies', 'shooter', 'playable',
  '<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Star Blaster</title>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body style="margin:0;background:#000">
<script>
const config={type:Phaser.AUTO,width:800,height:600,backgroundColor:"#0a0a2e",physics:{default:"arcade",arcade:{gravity:{y:0}}},scene:{preload,create,update}};
let player,cursors,bullets,enemies,scoreText,score=0,gameOver=false,livesText,lives=3;
function preload(){}
function create(){
  player=this.add.rectangle(400,550,40,20,0x7CFC00);this.physics.add.existing(player);player.body.setCollideWorldBounds(true);
  cursors=this.input.keyboard.createCursorKeys();
  bullets=this.physics.add.group();enemies=this.physics.add.group();
  scoreText=this.add.text(16,16,"SCORE: 0",{fontFamily:"monospace",fontSize:"18px",fill:"#7CFC00"});
  livesText=this.add.text(700,16,"LIVES: 3",{fontFamily:"monospace",fontSize:"18px",fill:"#FED985"});
  this.input.keyboard.on("keydown-SPACE",()=>{if(!gameOver){let b=this.add.rectangle(player.x,player.y-15,4,12,0x7CFC00);this.physics.add.existing(b);b.body.setVelocityY(-400);bullets.add(b);}});
  this.time.addEvent({delay:800,callback:()=>{if(!gameOver){let x=Phaser.Math.Between(50,750);let e=this.add.rectangle(x,0,30,20,0xFF3131);this.physics.add.existing(e);e.body.setVelocityY(Phaser.Math.Between(80,180));enemies.add(e);}},loop:true});
  this.physics.add.overlap(bullets,enemies,(b,e)=>{b.destroy();e.destroy();score+=10;scoreText.setText("SCORE: "+score);});
  this.physics.add.overlap(player,enemies,(p,e)=>{e.destroy();lives--;livesText.setText("LIVES: "+lives);if(lives<=0){gameOver=true;this.add.text(400,300,"GAME OVER",{fontFamily:"monospace",fontSize:"48px",fill:"#FF3131"}).setOrigin(0.5);this.add.text(400,360,"Score: "+score,{fontFamily:"monospace",fontSize:"24px",fill:"#FED985"}).setOrigin(0.5);this.physics.pause();}});
}
function update(){
  if(gameOver)return;
  player.body.setVelocityX(0);
  if(cursors.left.isDown)player.body.setVelocityX(-300);
  else if(cursors.right.isDown)player.body.setVelocityX(300);
  bullets.getChildren().forEach(b=>{if(b.y<0)b.destroy();});
  enemies.getChildren().forEach(e=>{if(e.y>620)e.destroy();});
}
new Phaser.Game(config);
</script></body></html>', false, 42, 156);

  -- 2. Block Jump (platformer, playable)
  INSERT INTO game_projects (studio_id, name, description, genre, status, game_code, is_public, likes_count, views_count)
  VALUES (v_studio_id, 'Block Jump', 'Simple platformer — jump between platforms and collect coins', 'platformer', 'playable',
  '<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Block Jump</title>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body style="margin:0;background:#000">
<script>
const config={type:Phaser.AUTO,width:800,height:600,backgroundColor:"#1a1a2e",physics:{default:"arcade",arcade:{gravity:{y:600}}},scene:{preload,create,update}};
let player,cursors,platforms,coins,scoreText,score=0;
function preload(){}
function create(){
  platforms=this.physics.add.staticGroup();
  platforms.add(this.add.rectangle(400,580,800,20,0x2A2A2A));
  platforms.add(this.add.rectangle(600,450,200,15,0x404040));
  platforms.add(this.add.rectangle(200,350,200,15,0x404040));
  platforms.add(this.add.rectangle(500,250,200,15,0x404040));
  platforms.add(this.add.rectangle(100,150,200,15,0x404040));
  platforms.getChildren().forEach(p=>p.refreshBody());
  player=this.add.rectangle(100,540,24,32,0x7CFC00);this.physics.add.existing(player);player.body.setBounce(0.1);player.body.setCollideWorldBounds(true);
  coins=this.physics.add.staticGroup();
  [[620,420],[180,320],[520,220],[120,120],[700,350],[350,480]].forEach(([x,y])=>{let c=this.add.circle(x,y,8,0xFED985);coins.add(c);c.refreshBody();});
  this.physics.add.collider(player,platforms);
  this.physics.add.overlap(player,coins,(p,c)=>{c.destroy();score+=10;scoreText.setText("COINS: "+score);});
  cursors=this.input.keyboard.createCursorKeys();
  scoreText=this.add.text(16,16,"COINS: 0",{fontFamily:"monospace",fontSize:"18px",fill:"#FED985"});
}
function update(){
  player.body.setVelocityX(0);
  if(cursors.left.isDown)player.body.setVelocityX(-200);
  else if(cursors.right.isDown)player.body.setVelocityX(200);
  if(cursors.up.isDown&&player.body.touching.down)player.body.setVelocityY(-400);
}
new Phaser.Game(config);
</script></body></html>', false, 28, 93);

  -- 3. Neon Racer (racing, playable)
  INSERT INTO game_projects (studio_id, name, description, genre, status, game_code, is_public, likes_count, views_count)
  VALUES (v_studio_id, 'Neon Racer', 'Top-down car avoidance — dodge traffic on a neon highway', 'racing', 'playable',
  '<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Neon Racer</title>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body style="margin:0;background:#000">
<script>
const config={type:Phaser.AUTO,width:800,height:600,backgroundColor:"#0f0f0f",physics:{default:"arcade",arcade:{gravity:{y:0}}},scene:{preload,create,update}};
let player,cursors,obstacles,scoreText,score=0,gameOver=false,speed=200;
function preload(){}
function create(){
  this.add.rectangle(200,300,4,600,0x2A2A2A);this.add.rectangle(400,300,4,600,0x2A2A2A);this.add.rectangle(600,300,4,600,0x2A2A2A);
  player=this.add.rectangle(400,500,30,50,0x7CFC00);this.physics.add.existing(player);player.body.setCollideWorldBounds(true);
  obstacles=this.physics.add.group();
  cursors=this.input.keyboard.createCursorKeys();
  scoreText=this.add.text(16,16,"DISTANCE: 0",{fontFamily:"monospace",fontSize:"18px",fill:"#7CFC00"});
  this.time.addEvent({delay:600,callback:()=>{if(!gameOver){let x=Phaser.Math.Between(100,700);let o=this.add.rectangle(x,-30,35,55,0xFF3131);this.physics.add.existing(o);o.body.setVelocityY(speed);obstacles.add(o);speed=Math.min(speed+2,500);}},loop:true});
  this.physics.add.overlap(player,obstacles,()=>{if(!gameOver){gameOver=true;this.add.text(400,300,"CRASH!",{fontFamily:"monospace",fontSize:"48px",fill:"#FF3131"}).setOrigin(0.5);this.add.text(400,360,"Distance: "+score,{fontFamily:"monospace",fontSize:"24px",fill:"#FED985"}).setOrigin(0.5);this.physics.pause();}});
  this.time.addEvent({delay:100,callback:()=>{if(!gameOver){score+=1;scoreText.setText("DISTANCE: "+score);}},loop:true});
}
function update(){
  if(gameOver)return;
  player.body.setVelocityX(0);
  if(cursors.left.isDown)player.body.setVelocityX(-250);
  else if(cursors.right.isDown)player.body.setVelocityX(250);
  obstacles.getChildren().forEach(o=>{if(o.y>650)o.destroy();});
}
new Phaser.Game(config);
</script></body></html>', false, 35, 120);

  -- 4. Color Match (puzzle, draft)
  INSERT INTO game_projects (studio_id, name, description, genre, status, game_code, is_public)
  VALUES (v_studio_id, 'Color Match', 'Pattern matching puzzle — match colors before time runs out', 'puzzle', 'draft', NULL, false);

  -- 5. Dungeon Crawl (rpg, draft)
  INSERT INTO game_projects (studio_id, name, description, genre, status, game_code, is_public)
  VALUES (v_studio_id, 'Dungeon Crawl', 'Tile-based dungeon explorer — find the exit', 'rpg', 'draft', NULL, false);

  RETURN v_studio_id;
END;
$$;
