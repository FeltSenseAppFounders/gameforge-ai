// GameForge AI — Pre-built game templates
// Manually crafted, polished Phaser.js games with proper game-over + restart

export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  genre: string;
  gameCode: string;
}

// ── Star Blaster (shooter) ──────────────────────────────────

const STAR_BLASTER_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Star Blaster</title>
<style>*{margin:0;padding:0}body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body>
<script>
class GameScene extends Phaser.Scene{
  constructor(){super("game")}
  create(){
    this.score=0;this.lives=3;this.gameOver=false;this.speed=80;
    this.player=this.add.rectangle(400,550,40,20,0x7CFC00);
    this.physics.add.existing(this.player);this.player.body.setCollideWorldBounds(true);
    this.cursors=this.input.keyboard.createCursorKeys();
    this.bullets=this.physics.add.group();this.enemies=this.physics.add.group();
    this.scoreText=this.add.text(16,16,"SCORE: 0",{fontFamily:"monospace",fontSize:"18px",fill:"#7CFC00"});
    this.livesText=this.add.text(700,16,"LIVES: 3",{fontFamily:"monospace",fontSize:"18px",fill:"#FED985"});
    this.add.text(400,580,"Arrow Keys = Move | SPACE = Shoot",{fontFamily:"monospace",fontSize:"12px",fill:"#555"}).setOrigin(0.5);
    this.input.keyboard.on("keydown-SPACE",()=>{
      if(!this.gameOver){
        let b=this.add.rectangle(this.player.x,this.player.y-15,4,12,0x7CFC00);
        this.physics.add.existing(b);b.body.setVelocityY(-400);this.bullets.add(b);
      }
    });
    this.spawnTimer=this.time.addEvent({delay:800,callback:()=>{
      if(!this.gameOver){
        let x=Phaser.Math.Between(50,750);
        let e=this.add.rectangle(x,0,30,20,0xFF3131);
        this.physics.add.existing(e);e.body.setVelocityY(Phaser.Math.Between(this.speed,this.speed+100));
        this.enemies.add(e);this.speed=Math.min(this.speed+1,300);
      }
    },loop:true});
    this.physics.add.overlap(this.bullets,this.enemies,(b,e)=>{b.destroy();e.destroy();this.score+=10;this.scoreText.setText("SCORE: "+this.score);});
    this.physics.add.overlap(this.player,this.enemies,(p,e)=>{
      e.destroy();this.lives--;this.livesText.setText("LIVES: "+this.lives);
      if(this.lives<=0)this.showGameOver();
    });
  }
  showGameOver(){
    this.gameOver=true;this.physics.pause();
    this.add.rectangle(400,300,800,600,0x000000,0.75);
    this.add.text(400,240,"GAME OVER",{fontFamily:"monospace",fontSize:"52px",fill:"#FF3131",fontStyle:"bold"}).setOrigin(0.5);
    this.add.text(400,310,"Score: "+this.score,{fontFamily:"monospace",fontSize:"32px",fill:"#FED985"}).setOrigin(0.5);
    this.add.text(400,370,"Press SPACE or Click to Restart",{fontFamily:"monospace",fontSize:"20px",fill:"#7CFC00"}).setOrigin(0.5);
    let btn=this.add.rectangle(400,430,180,44,0x47761E);
    this.add.text(400,430,"RESTART",{fontFamily:"monospace",fontSize:"18px",fill:"#fff",fontStyle:"bold"}).setOrigin(0.5);
    this.input.keyboard.once("keydown-SPACE",()=>this.scene.restart());
    this.input.once("pointerdown",()=>this.scene.restart());
  }
  update(){
    if(this.gameOver)return;
    this.player.body.setVelocityX(0);
    if(this.cursors.left.isDown)this.player.body.setVelocityX(-300);
    else if(this.cursors.right.isDown)this.player.body.setVelocityX(300);
    this.bullets.getChildren().forEach(b=>{if(b.y<0)b.destroy();});
    this.enemies.getChildren().forEach(e=>{if(e.y>620)e.destroy();});
  }
}
new Phaser.Game({type:Phaser.AUTO,width:800,height:600,backgroundColor:"#0a0a2e",physics:{default:"arcade",arcade:{gravity:{y:0}}},scene:GameScene});
</script></body></html>`;

// ── Block Jump (platformer) ─────────────────────────────────

const BLOCK_JUMP_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Block Jump</title>
<style>*{margin:0;padding:0}body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body>
<script>
class GameScene extends Phaser.Scene{
  constructor(){super("game")}
  create(){
    this.score=0;this.gameOver=false;this.totalCoins=8;
    this.platforms=this.physics.add.staticGroup();
    this.platforms.add(this.add.rectangle(400,590,800,20,0x2A2A2A));
    this.platforms.add(this.add.rectangle(650,470,180,15,0x404040));
    this.platforms.add(this.add.rectangle(200,380,180,15,0x404040));
    this.platforms.add(this.add.rectangle(550,290,180,15,0x404040));
    this.platforms.add(this.add.rectangle(100,200,180,15,0x404040));
    this.platforms.add(this.add.rectangle(400,120,180,15,0x404040));
    this.platforms.getChildren().forEach(p=>p.refreshBody());
    this.player=this.add.rectangle(100,550,24,32,0x7CFC00);
    this.physics.add.existing(this.player);this.player.body.setBounce(0.1);this.player.body.setCollideWorldBounds(true);
    this.coins=this.physics.add.staticGroup();
    [[670,440],[180,350],[570,260],[120,170],[420,90],[750,350],[50,500],[350,550]].forEach(([x,y])=>{
      let c=this.add.circle(x,y,8,0xFED985);this.coins.add(c);c.refreshBody();
    });
    this.spikes=this.physics.add.staticGroup();
    [[300,575],[500,575],[700,575]].forEach(([x,y])=>{
      let s=this.add.triangle(x,y,0,12,6,0,12,12,0xFF3131);this.spikes.add(s);s.refreshBody();
    });
    this.physics.add.collider(this.player,this.platforms);
    this.physics.add.overlap(this.player,this.coins,(p,c)=>{c.destroy();this.score+=10;this.scoreText.setText("COINS: "+this.score);
      if(this.score>=this.totalCoins*10)this.showWin();
    });
    this.physics.add.overlap(this.player,this.spikes,()=>{if(!this.gameOver)this.showGameOver();});
    this.cursors=this.input.keyboard.createCursorKeys();
    this.scoreText=this.add.text(16,16,"COINS: 0",{fontFamily:"monospace",fontSize:"18px",fill:"#FED985"});
    this.add.text(400,580,"Arrow Keys = Move/Jump",{fontFamily:"monospace",fontSize:"11px",fill:"#555"}).setOrigin(0.5);
  }
  showGameOver(){
    this.gameOver=true;this.physics.pause();
    this.add.rectangle(400,300,800,600,0x000000,0.75);
    this.add.text(400,240,"GAME OVER",{fontFamily:"monospace",fontSize:"52px",fill:"#FF3131",fontStyle:"bold"}).setOrigin(0.5);
    this.add.text(400,310,"Coins: "+this.score,{fontFamily:"monospace",fontSize:"32px",fill:"#FED985"}).setOrigin(0.5);
    this.add.text(400,370,"Press SPACE or Click to Restart",{fontFamily:"monospace",fontSize:"20px",fill:"#7CFC00"}).setOrigin(0.5);
    this.add.rectangle(400,430,180,44,0x47761E);
    this.add.text(400,430,"RESTART",{fontFamily:"monospace",fontSize:"18px",fill:"#fff",fontStyle:"bold"}).setOrigin(0.5);
    this.input.keyboard.once("keydown-SPACE",()=>this.scene.restart());
    this.input.once("pointerdown",()=>this.scene.restart());
  }
  showWin(){
    this.gameOver=true;this.physics.pause();
    this.add.rectangle(400,300,800,600,0x000000,0.75);
    this.add.text(400,240,"YOU WIN!",{fontFamily:"monospace",fontSize:"52px",fill:"#7CFC00",fontStyle:"bold"}).setOrigin(0.5);
    this.add.text(400,310,"All coins collected!",{fontFamily:"monospace",fontSize:"24px",fill:"#FED985"}).setOrigin(0.5);
    this.add.text(400,370,"Press SPACE or Click to Play Again",{fontFamily:"monospace",fontSize:"20px",fill:"#7CFC00"}).setOrigin(0.5);
    this.add.rectangle(400,430,180,44,0x47761E);
    this.add.text(400,430,"PLAY AGAIN",{fontFamily:"monospace",fontSize:"18px",fill:"#fff",fontStyle:"bold"}).setOrigin(0.5);
    this.input.keyboard.once("keydown-SPACE",()=>this.scene.restart());
    this.input.once("pointerdown",()=>this.scene.restart());
  }
  update(){
    if(this.gameOver)return;
    this.player.body.setVelocityX(0);
    if(this.cursors.left.isDown)this.player.body.setVelocityX(-200);
    else if(this.cursors.right.isDown)this.player.body.setVelocityX(200);
    if(this.cursors.up.isDown&&this.player.body.touching.down)this.player.body.setVelocityY(-420);
    if(this.player.y>590&&!this.gameOver)this.showGameOver();
  }
}
new Phaser.Game({type:Phaser.AUTO,width:800,height:600,backgroundColor:"#1a1a2e",physics:{default:"arcade",arcade:{gravity:{y:600}}},scene:GameScene});
</script></body></html>`;

// ── Neon Racer (racing) ─────────────────────────────────────

const NEON_RACER_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Neon Racer</title>
<style>*{margin:0;padding:0}body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body>
<script>
class GameScene extends Phaser.Scene{
  constructor(){super("game")}
  create(){
    this.score=0;this.gameOver=false;this.speed=200;
    for(let i=0;i<4;i++)this.add.rectangle(160+i*160,300,2,600,0x1A1A1A);
    this.player=this.add.rectangle(400,500,30,50,0x7CFC00);
    this.physics.add.existing(this.player);this.player.body.setCollideWorldBounds(true);
    this.obstacles=this.physics.add.group();
    this.cursors=this.input.keyboard.createCursorKeys();
    this.scoreText=this.add.text(16,16,"DISTANCE: 0",{fontFamily:"monospace",fontSize:"18px",fill:"#7CFC00"});
    this.speedText=this.add.text(680,16,"",{fontFamily:"monospace",fontSize:"14px",fill:"#FED985"});
    this.add.text(400,580,"Arrow Keys = Steer",{fontFamily:"monospace",fontSize:"12px",fill:"#555"}).setOrigin(0.5);
    this.time.addEvent({delay:600,callback:()=>{
      if(!this.gameOver){
        let x=Phaser.Math.Between(100,700);
        let colors=[0xFF3131,0xFF6B35,0xFFA500];
        let o=this.add.rectangle(x,-30,35,55,Phaser.Utils.Array.GetRandom(colors));
        this.physics.add.existing(o);o.body.setVelocityY(this.speed);this.obstacles.add(o);
        this.speed=Math.min(this.speed+3,500);
        this.speedText.setText(Math.round(this.speed/2)+" MPH");
      }
    },loop:true});
    this.physics.add.overlap(this.player,this.obstacles,()=>{if(!this.gameOver)this.showGameOver();});
    this.time.addEvent({delay:100,callback:()=>{if(!this.gameOver){this.score++;this.scoreText.setText("DISTANCE: "+this.score);}},loop:true});
  }
  showGameOver(){
    this.gameOver=true;this.physics.pause();
    this.add.rectangle(400,300,800,600,0x000000,0.75);
    this.add.text(400,220,"CRASH!",{fontFamily:"monospace",fontSize:"56px",fill:"#FF3131",fontStyle:"bold"}).setOrigin(0.5);
    this.add.text(400,300,"Distance: "+this.score,{fontFamily:"monospace",fontSize:"32px",fill:"#FED985"}).setOrigin(0.5);
    this.add.text(400,350,"Top Speed: "+Math.round(this.speed/2)+" MPH",{fontFamily:"monospace",fontSize:"18px",fill:"#888"}).setOrigin(0.5);
    this.add.text(400,410,"Press SPACE or Click to Restart",{fontFamily:"monospace",fontSize:"20px",fill:"#7CFC00"}).setOrigin(0.5);
    this.add.rectangle(400,470,180,44,0x47761E);
    this.add.text(400,470,"RESTART",{fontFamily:"monospace",fontSize:"18px",fill:"#fff",fontStyle:"bold"}).setOrigin(0.5);
    this.input.keyboard.once("keydown-SPACE",()=>this.scene.restart());
    this.input.once("pointerdown",()=>this.scene.restart());
  }
  update(){
    if(this.gameOver)return;
    this.player.body.setVelocityX(0);
    if(this.cursors.left.isDown)this.player.body.setVelocityX(-250);
    else if(this.cursors.right.isDown)this.player.body.setVelocityX(250);
    this.obstacles.getChildren().forEach(o=>{if(o.y>650)o.destroy();});
  }
}
new Phaser.Game({type:Phaser.AUTO,width:800,height:600,backgroundColor:"#0f0f0f",physics:{default:"arcade",arcade:{gravity:{y:0}}},scene:GameScene});
</script></body></html>`;

// ── Color Match (puzzle) ────────────────────────────────────

const COLOR_MATCH_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Color Match</title>
<style>*{margin:0;padding:0}body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body>
<script>
class GameScene extends Phaser.Scene{
  constructor(){super("game")}
  create(){
    this.score=0;this.gameOver=false;this.timeLeft=60;this.combo=0;
    this.colors=[0xFF3131,0x7CFC00,0x3B82F6,0xFED985,0xA855F7];
    this.grid=[];this.selected=null;this.cols=8;this.rows=8;this.tileSize=56;
    this.offsetX=(800-this.cols*this.tileSize)/2;this.offsetY=80;
    this.scoreText=this.add.text(16,16,"SCORE: 0",{fontFamily:"monospace",fontSize:"18px",fill:"#7CFC00"});
    this.timerText=this.add.text(700,16,"60s",{fontFamily:"monospace",fontSize:"18px",fill:"#FED985"});
    this.comboText=this.add.text(400,16,"",{fontFamily:"monospace",fontSize:"14px",fill:"#A855F7"}).setOrigin(0.5,0);
    this.add.text(400,568,"Click two adjacent tiles to swap & match 3+",{fontFamily:"monospace",fontSize:"11px",fill:"#555"}).setOrigin(0.5);
    this.buildGrid();
    this.input.on("pointerdown",(ptr)=>{if(this.gameOver)return;this.handleClick(ptr.x,ptr.y);});
    this.time.addEvent({delay:1000,callback:()=>{
      if(!this.gameOver){this.timeLeft--;this.timerText.setText(this.timeLeft+"s");
        if(this.timeLeft<=10)this.timerText.setFill("#FF3131");
        if(this.timeLeft<=0)this.showGameOver();
      }
    },loop:true});
  }
  buildGrid(){
    this.grid.forEach(row=>row.forEach(t=>{if(t&&t.rect)t.rect.destroy();}));
    this.grid=[];
    for(let r=0;r<this.rows;r++){this.grid[r]=[];
      for(let c=0;c<this.cols;c++){
        let color=Phaser.Utils.Array.GetRandom(this.colors);
        let x=this.offsetX+c*this.tileSize+this.tileSize/2;
        let y=this.offsetY+r*this.tileSize+this.tileSize/2;
        let rect=this.add.rectangle(x,y,this.tileSize-4,this.tileSize-4,color).setInteractive();
        this.grid[r][c]={color,rect};
      }
    }
    while(this.findMatches().length>0){
      this.grid.forEach(row=>row.forEach(t=>{
        t.color=Phaser.Utils.Array.GetRandom(this.colors);t.rect.setFillStyle(t.color);
      }));
    }
  }
  handleClick(px,py){
    let c=Math.floor((px-this.offsetX)/this.tileSize);
    let r=Math.floor((py-this.offsetY)/this.tileSize);
    if(r<0||r>=this.rows||c<0||c>=this.cols)return;
    if(!this.selected){this.selected={r,c};this.grid[r][c].rect.setStrokeStyle(3,0xFFFFFF);return;}
    let dr=Math.abs(r-this.selected.r),dc=Math.abs(c-this.selected.c);
    this.grid[this.selected.r][this.selected.c].rect.setStrokeStyle(0);
    if((dr===1&&dc===0)||(dr===0&&dc===1)){
      this.swap(this.selected.r,this.selected.c,r,c);
      let matches=this.findMatches();
      if(matches.length>0){this.clearMatches(matches);}
      else{this.swap(this.selected.r,this.selected.c,r,c);this.combo=0;this.comboText.setText("");}
    }
    this.selected=null;
  }
  swap(r1,c1,r2,c2){
    let tmp=this.grid[r1][c1].color;
    this.grid[r1][c1].color=this.grid[r2][c2].color;this.grid[r1][c1].rect.setFillStyle(this.grid[r1][c1].color);
    this.grid[r2][c2].color=tmp;this.grid[r2][c2].rect.setFillStyle(tmp);
  }
  findMatches(){
    let matches=new Set();
    for(let r=0;r<this.rows;r++)for(let c=0;c<this.cols-2;c++){
      if(this.grid[r][c].color===this.grid[r][c+1].color&&this.grid[r][c].color===this.grid[r][c+2].color){
        matches.add(r+","+c);matches.add(r+","+(c+1));matches.add(r+","+(c+2));
      }
    }
    for(let c=0;c<this.cols;c++)for(let r=0;r<this.rows-2;r++){
      if(this.grid[r][c].color===this.grid[r+1][c].color&&this.grid[r][c].color===this.grid[r+2][c].color){
        matches.add(r+","+c);matches.add((r+1)+","+c);matches.add((r+2)+","+c);
      }
    }
    return[...matches].map(s=>{let[r,c]=s.split(",").map(Number);return{r,c};});
  }
  clearMatches(matches){
    this.combo++;let pts=matches.length*10*this.combo;this.score+=pts;
    this.scoreText.setText("SCORE: "+this.score);
    if(this.combo>1)this.comboText.setText("COMBO x"+this.combo+"!");
    matches.forEach(({r,c})=>{
      this.grid[r][c].color=Phaser.Utils.Array.GetRandom(this.colors);
      this.grid[r][c].rect.setFillStyle(this.grid[r][c].color);
    });
    this.time.delayedCall(100,()=>{let m=this.findMatches();if(m.length>0)this.clearMatches(m);else{this.combo=0;this.comboText.setText("");}});
  }
  showGameOver(){
    this.gameOver=true;
    this.add.rectangle(400,300,800,600,0x000000,0.8);
    this.add.text(400,220,"TIME'S UP!",{fontFamily:"monospace",fontSize:"52px",fill:"#FED985",fontStyle:"bold"}).setOrigin(0.5);
    this.add.text(400,300,"Score: "+this.score,{fontFamily:"monospace",fontSize:"36px",fill:"#7CFC00"}).setOrigin(0.5);
    this.add.text(400,370,"Press SPACE or Click to Restart",{fontFamily:"monospace",fontSize:"20px",fill:"#7CFC00"}).setOrigin(0.5);
    this.add.rectangle(400,430,180,44,0x47761E);
    this.add.text(400,430,"RESTART",{fontFamily:"monospace",fontSize:"18px",fill:"#fff",fontStyle:"bold"}).setOrigin(0.5);
    this.input.keyboard.once("keydown-SPACE",()=>this.scene.restart());
    this.input.once("pointerdown",()=>this.scene.restart());
  }
}
new Phaser.Game({type:Phaser.AUTO,width:800,height:600,backgroundColor:"#0f0f1a",scene:GameScene});
</script></body></html>`;

// ── Dungeon Crawl (rpg) ─────────────────────────────────────

const DUNGEON_CRAWL_CODE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Dungeon Crawl</title>
<style>*{margin:0;padding:0}body{background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden}</style>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head><body>
<script>
class GameScene extends Phaser.Scene{
  constructor(){super("game")}
  create(){
    this.tileSize=40;this.cols=20;this.rows=15;this.hp=5;this.maxHp=5;this.score=0;this.gameOver=false;this.level=1;
    this.map=[
      "####################",
      "#..................#",
      "#.##.####.##.####.#",
      "#.#....#....#....#.#",
      "#.#.##.#.##.#.##.#.#",
      "#...#..........#...#",
      "###.#.########.#.###",
      "#.......#..........#",
      "#.####..#..####.##.#",
      "#.#.....#......#...#",
      "#.#.###.####.#.#.#.#",
      "#...#........#.#.#.#",
      "#.###.######.#...#.#",
      "#..............#...#",
      "####################"
    ];
    this.tiles=[];this.enemies=[];this.potions=[];
    this.drawMap();
    this.placePlayer();this.placeEnemies();this.placePotions();this.placeExit();
    this.hpText=this.add.text(16,4,"HP: "+this.hp+"/"+this.maxHp,{fontFamily:"monospace",fontSize:"14px",fill:"#FF3131"}).setDepth(10);
    this.scoreText=this.add.text(200,4,"SCORE: 0",{fontFamily:"monospace",fontSize:"14px",fill:"#FED985"}).setDepth(10);
    this.levelText=this.add.text(700,4,"FLOOR "+this.level,{fontFamily:"monospace",fontSize:"14px",fill:"#7CFC00"}).setDepth(10);
    this.cursors=this.input.keyboard.createCursorKeys();
    this.moveDelay=0;
  }
  drawMap(){
    this.tiles.forEach(t=>t.destroy());this.tiles=[];
    for(let r=0;r<this.rows;r++)for(let c=0;c<this.cols;c++){
      let ch=this.map[r][c];
      let x=c*this.tileSize+this.tileSize/2;let y=r*this.tileSize+this.tileSize/2;
      if(ch==="#"){let w=this.add.rectangle(x,y,this.tileSize,this.tileSize,0x2A2A2A).setStrokeStyle(1,0x3A3A3A);this.tiles.push(w);}
      else{let f=this.add.rectangle(x,y,this.tileSize,this.tileSize,0x111118);this.tiles.push(f);}
    }
  }
  isWalkable(c,r){return r>=0&&r<this.rows&&c>=0&&c<this.cols&&this.map[r][c]!=='#';}
  getOpenSpots(){
    let spots=[];
    for(let r=1;r<this.rows-1;r++)for(let c=1;c<this.cols-1;c++){if(this.map[r][c]==='.')spots.push({r,c});}
    return Phaser.Utils.Array.Shuffle(spots);
  }
  placePlayer(){
    let spots=this.getOpenSpots();let s=spots[0];
    this.playerPos={r:s.r,c:s.c};
    if(!this.playerRect){
      this.playerRect=this.add.rectangle(0,0,this.tileSize-8,this.tileSize-8,0x7CFC00).setDepth(5);
    }
    this.playerRect.setPosition(s.c*this.tileSize+this.tileSize/2,s.r*this.tileSize+this.tileSize/2);
  }
  placeEnemies(){
    this.enemies.forEach(e=>e.rect.destroy());this.enemies=[];
    let spots=this.getOpenSpots().filter(s=>Math.abs(s.r-this.playerPos.r)+Math.abs(s.c-this.playerPos.c)>4);
    for(let i=0;i<Math.min(4+this.level,8);i++){
      if(!spots[i])break;
      let s=spots[i];
      let rect=this.add.rectangle(s.c*this.tileSize+this.tileSize/2,s.r*this.tileSize+this.tileSize/2,this.tileSize-10,this.tileSize-10,0xFF3131).setDepth(4);
      this.enemies.push({r:s.r,c:s.c,rect,hp:1});
    }
  }
  placePotions(){
    this.potions.forEach(p=>p.rect.destroy());this.potions=[];
    let spots=this.getOpenSpots().filter(s=>Math.abs(s.r-this.playerPos.r)+Math.abs(s.c-this.playerPos.c)>3);
    for(let i=0;i<2;i++){
      if(!spots[i])break;
      let s=spots[i];
      let rect=this.add.circle(s.c*this.tileSize+this.tileSize/2,s.r*this.tileSize+this.tileSize/2,8,0x3B82F6).setDepth(4);
      this.potions.push({r:s.r,c:s.c,rect});
    }
  }
  placeExit(){
    if(this.exitRect)this.exitRect.destroy();
    let spots=this.getOpenSpots().filter(s=>Math.abs(s.r-this.playerPos.r)+Math.abs(s.c-this.playerPos.c)>8);
    if(spots.length===0)spots=this.getOpenSpots().slice(-1);
    let s=spots[0];this.exitPos={r:s.r,c:s.c};
    this.exitRect=this.add.rectangle(s.c*this.tileSize+this.tileSize/2,s.r*this.tileSize+this.tileSize/2,this.tileSize-6,this.tileSize-6,0xFED985).setStrokeStyle(2,0xFFA500).setDepth(3);
  }
  movePlayer(dc,dr){
    if(this.gameOver)return;
    let nc=this.playerPos.c+dc,nr=this.playerPos.r+dr;
    if(!this.isWalkable(nc,nr))return;
    let enemy=this.enemies.find(e=>e.c===nc&&e.r===nr);
    if(enemy){enemy.hp--;this.score+=25;this.scoreText.setText("SCORE: "+this.score);
      if(enemy.hp<=0){enemy.rect.destroy();this.enemies=this.enemies.filter(e=>e!==enemy);}
      return;
    }
    this.playerPos.c=nc;this.playerPos.r=nr;
    this.playerRect.setPosition(nc*this.tileSize+this.tileSize/2,nr*this.tileSize+this.tileSize/2);
    let potion=this.potions.find(p=>p.c===nc&&p.r===nr);
    if(potion){potion.rect.destroy();this.potions=this.potions.filter(p=>p!==potion);this.hp=Math.min(this.hp+2,this.maxHp);this.hpText.setText("HP: "+this.hp+"/"+this.maxHp);}
    if(nc===this.exitPos.c&&nr===this.exitPos.r){this.level++;this.levelText.setText("FLOOR "+this.level);this.score+=100;this.scoreText.setText("SCORE: "+this.score);this.nextLevel();}
    this.moveEnemies();
  }
  moveEnemies(){
    this.enemies.forEach(e=>{
      let dx=Math.sign(this.playerPos.c-e.c),dy=Math.sign(this.playerPos.r-e.r);
      if(Math.random()<0.4)return;
      let nc=e.c+dx,nr=e.r+dy;
      if(nc===this.playerPos.c&&nr===this.playerPos.r){this.hp--;this.hpText.setText("HP: "+this.hp+"/"+this.maxHp);if(this.hp<=0)this.showGameOver();return;}
      if(this.isWalkable(nc,nr)&&!this.enemies.some(o=>o!==e&&o.c===nc&&o.r===nr)){
        e.c=nc;e.r=nr;e.rect.setPosition(nc*this.tileSize+this.tileSize/2,nr*this.tileSize+this.tileSize/2);
      }
    });
  }
  nextLevel(){
    this.drawMap();this.placePlayer();this.placeEnemies();this.placePotions();this.placeExit();
  }
  showGameOver(){
    this.gameOver=true;
    this.add.rectangle(400,300,800,600,0x000000,0.8).setDepth(20);
    this.add.text(400,210,"YOU DIED",{fontFamily:"monospace",fontSize:"52px",fill:"#FF3131",fontStyle:"bold"}).setOrigin(0.5).setDepth(21);
    this.add.text(400,280,"Floor: "+this.level,{fontFamily:"monospace",fontSize:"24px",fill:"#888"}).setOrigin(0.5).setDepth(21);
    this.add.text(400,320,"Score: "+this.score,{fontFamily:"monospace",fontSize:"32px",fill:"#FED985"}).setOrigin(0.5).setDepth(21);
    this.add.text(400,380,"Press SPACE or Click to Restart",{fontFamily:"monospace",fontSize:"20px",fill:"#7CFC00"}).setOrigin(0.5).setDepth(21);
    this.add.rectangle(400,440,180,44,0x47761E).setDepth(21);
    this.add.text(400,440,"RESTART",{fontFamily:"monospace",fontSize:"18px",fill:"#fff",fontStyle:"bold"}).setOrigin(0.5).setDepth(21);
    this.input.keyboard.once("keydown-SPACE",()=>this.scene.restart());
    this.input.once("pointerdown",()=>this.scene.restart());
  }
  update(time){
    if(this.gameOver)return;
    if(time<this.moveDelay)return;
    if(this.cursors.left.isDown){this.movePlayer(-1,0);this.moveDelay=time+150;}
    else if(this.cursors.right.isDown){this.movePlayer(1,0);this.moveDelay=time+150;}
    else if(this.cursors.up.isDown){this.movePlayer(0,-1);this.moveDelay=time+150;}
    else if(this.cursors.down.isDown){this.movePlayer(0,1);this.moveDelay=time+150;}
  }
}
new Phaser.Game({type:Phaser.AUTO,width:800,height:600,backgroundColor:"#0a0a12",scene:GameScene});
</script></body></html>`;

// ── Exports ─────────────────────────────────────────────────

export const GAME_TEMPLATES: GameTemplate[] = [
  {
    id: "star-blaster",
    name: "Star Blaster",
    description: "Classic space shooter — destroy alien waves, collect power-ups, survive as long as you can",
    genre: "shooter",
    gameCode: STAR_BLASTER_CODE,
  },
  {
    id: "block-jump",
    name: "Block Jump",
    description: "Precision platformer — jump between platforms, collect all coins, avoid the spikes",
    genre: "platformer",
    gameCode: BLOCK_JUMP_CODE,
  },
  {
    id: "neon-racer",
    name: "Neon Racer",
    description: "Top-down racing — dodge traffic at increasing speeds on a neon highway",
    genre: "racing",
    gameCode: NEON_RACER_CODE,
  },
  {
    id: "color-match",
    name: "Color Match",
    description: "Match-3 puzzle — swap tiles to match colors, chain combos, beat the clock",
    genre: "puzzle",
    gameCode: COLOR_MATCH_CODE,
  },
  {
    id: "dungeon-crawl",
    name: "Dungeon Crawl",
    description: "Tile-based RPG — explore dungeons, fight enemies, find potions, descend deeper",
    genre: "rpg",
    gameCode: DUNGEON_CRAWL_CODE,
  },
];
