window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 700;
  let zombies = [];
  let score = 0;
  let beans = [];
  let gameOver = false;
  let hearts = [];
  let getLife = false;
  let lives = [];

  class InputHandler {
    constructor(){
      this.keys = [];
      window.addEventListener('keydown', e => {
        if(!this.keys.includes(e.key)){
          this.keys.push(e.key);
        }
      });
      window.addEventListener('keyup', e => {
        if(this.keys.includes(e.key)) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }
  
  class Player {
    constructor(gameWidth, gameHeight){
      this.image = document.getElementById("playerImage");
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 150;
      this.height = 110;
      this.x = 0; 
      this.y = (this.gameHeight - 40) - this.height;
      this.frameX = 0;
      this.maxFrame = 9;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000/this.fps;
      this.frameY = 0;
      this.speed = 1;
      this.vy = 0;
      this.weight = 1;
      this.doubleJump = 0;
    }
    draw(context){
      // context.strokeStyle = 'white';
      // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(this.x + this.width/2, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
      // context.stroke();
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(input, deltaTime, zombies, hearts, beans){
      // collision detection
      zombies.forEach(zombie => {
        const dx = (zombie.x + zombie.width/2) - (this.x + this.width/2);
        const dy = (zombie.y + zombie.height/2) - (this.y + this.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < zombie.width/4 + this.width/4){
          gameOver = true;
        }
      });
      hearts.forEach(heart => {
        const dx = (heart.x + heart.width/2) - (this.x + this.width/2);
        const dy = (heart.y + heart.height/2) - (this.y + this.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < heart.width/4 + this.width/4){
          heart.markedForDeletion = true;
          getLife = true;
        }
      });
      beans.forEach(bean => {
        const dx = (bean.x + bean.width/2) - (this.x + this.width/2);
        const dy = (bean.y + bean.height/2) - (this.y + this.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < bean.width/4 + this.width/4){
          bean.markedForDeletion = true;
        }
      });
      // sprite animation
      if(this.frameTimer > this.frameInterval) {
        if(this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      // controls
      if (input.keys.indexOf('ArrowRight') > -1){
        this.speed = 5;
      } else if(input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -3;
      } else {
        this.speed = 0;
      }
      // horizontal movement
      this.x += this.speed;
      if(this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
      // vertical movement
      this.y += this.vy;
      if(this.onGround()){
        this.doubleJump = true;
        this.maxFrame = 9;
        this.frameY = 1;
        if(input.keys.indexOf('ArrowUp') > -1 ){
          this.vy = -20;
          this.doubleJump = 1;
        }
      } else {
        this.vy += this.weight;
        this.maxFrame = 0;
        this.frameY = 0;
        window.addEventListener('keydown', e => {
          if(e.key === 'ArrowUp' && this.doubleJump === 1){
            this.vy = -22;
            this.doubleJump = 0;
          }
        });
      }
      if(this.y > (this.gameHeight - 40) - this.height) this.y = (this.gameHeight - 40) - this.height;
    }
    onGround(){
      return this.y >= (this.gameHeight - this.height) - 40;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight){
      this.image = document.getElementById("backgroundImage");
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.x = 0;
      this.y = 0;
      this.width = 2074;
      this.height = 700;
      this.speed = 7;
    }
    draw(context){
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
    }
    update(){
      this.x -= this.speed;
      if(this.x < 0 - this.width) this.x = 0;
    }
  }

  class Coffee {
    constructor(gameWidth, gameHeight){
      this.image = document.getElementById("coffee_bean");
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 45;
      this.height = 45;
      this.x = gameWidth;
      this.y = gameHeight - this.height * 9;
      this.speed = Math.floor(Math.random()*3);
      this.markedForDeletion = false;
    }
    draw(context){
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update(){
      this.x -= this.speed;
      if(this.speed < 2) this.speed = 2;
      if(this.x < 0 - this.width) this.markedForDeletion = true;
    } 
  }

  class Life {
    constructor(gameWidth, gameHeight){
      this.image = document.getElementById("life");
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 50;
      this.height = 44;
      this.viewX = 15;
      this.viewY = 15; 
      this.x = gameWidth;
      this.y = gameHeight - this.height * 9;
      this.speed = Math.floor(Math.random()*5);
      this.markedForDeletion = false;
    }
    draw(context){
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    viewLife (context){
      context.drawImage(this.image, this.width * + this.viewX, this.viewY, this.width, this.height);
    }
    update(){
      this.x -= this.speed;
      if(this.speed < 2) this.speed = 2
      if(this.x < 0 - this.width) this.markedForDeletion = true;
    } 
  }

  ///// Enemies /////
  class Zombie {
    constructor(gameWidth, gameHeight){
      this.image = document.getElementById("zombie");
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 93;
      this.height = 110;
      this.x = this.gameWidth;
      this.y = (this.gameHeight - this.height) - 30;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 9;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000/this.fps;
      this.speed = Math.floor(Math.random()*12);
      this.markedForDeletion = false;
    }
    draw(context){
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(deltaTime){
      if(this.frameTimer > this.frameInterval) {
        if(this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if(this.speed < 2) this.speed = 3;
      if(this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score += 100;
      }
    }
  }

  function HandleCoffee(deltaTime){
    if(beanTimer > coffeeInterval + randomEnemyInterval*5){
      beans.push(new Coffee(canvas.width, canvas.height));
      beanTimer = 0;
    } else {
      beanTimer += deltaTime;
    }
    beans.forEach(bean => {
      bean.draw(ctx);
      bean.update();
    });
    beans = beans.filter(bean => !bean.markedForDeletion);
  }
  
  function HandleLife(deltaTime){
    if(heartTimer > heartInterval ){
      hearts.push(new Life(canvas.width, canvas.height));
      heartTimer = 0;
    } else {
      heartTimer += deltaTime;
    }
    hearts.forEach(heart => {
      heart.draw(ctx);
      heart.update();
    });
    hearts = hearts.filter(heart => !heart.markedForDeletion);
  }

  function handleZombies(deltaTime){
    if(Timer > enemyInterval + randomEnemyInterval){
      zombies.push(new Zombie(canvas.width, canvas.height));
      Timer = 0;
    } else {
      Timer += deltaTime;
    }
    zombies.forEach(zombie => {
      zombie.draw(ctx);
      zombie.update(deltaTime);
    });
    zombies = zombies.filter(zombie => !zombie.markedForDeletion);
  }

  function displayStatusText(context){
    context.fillStyle = 'black';
    context.font = '40px Helvetica';
    context.fillText('Score: '+ score, 20, 50);
    if(gameOver){
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.fillText('GAME OVER, TRY AGAIN!', canvas.width/2, canvas.height/2);
    }
  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.Width, canvas.Height);

  // coffee
  let beanTimer = 0;
  let coffeeInterval = 3000;

  // heart
  let heartTimer = 0;
  let heartInterval = 15000;

  // enemy
  let Timer = 0;
  let lastTime = 0;
  let enemyInterval = 1500;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update();
    player.draw(ctx);
    player.update(input, deltaTime, zombies, hearts, beans);
    HandleLife(deltaTime);
    HandleCoffee(deltaTime);
    handleZombies(deltaTime);
    displayStatusText(ctx);
    if(!gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});