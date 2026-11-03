class Game {
  constructor(canvasId){
    this.canvas = document.getElementById(canvasId)
    this.canvas.width = CANVAS_W
    this.canvas.height = CANVAS_H

    this.ctx = this.canvas.getContext("2d") //el lapiz que va a pintar todo

    this.fps = FPS
    this.drawIntervalId = null

    this.nubes = new Background(this.ctx, "/assets/img/nubes.png", BG_VX/9)
    this.montanas = new Background(this.ctx, "/assets/img/montanas.png", BG_VX/12)
    this.suelo = new Background(this.ctx, "/assets/img/suelo.png", BG_VX/8)
    
    this.mario = new Mario(this.ctx, 20, 20)
    this.mario.groundTo(this.canvas.height - BG_FLOOR)

    this.coins = []
    this.coinsTimeoutId = null

    this.enemies = []
    this.enemiesTimeoutId = null

    this.score = 0
    this.hearts = 3

    this.heart = new Image()
    this.heart.src = HEARTS_IMG
    this.heart.onload = () => {
      this.heart.isReady = true
    }

    this.audio = new Audio("/assets/audio/GameSong.mp3")
    this.audio.volume = 0.5
    this.audio.loop = true

    this.coinAudio = new Audio("/assets/audio/coin.mp3")
    this.coinAudio.volume = 0.3

    this.gameOverAudio = new Audio("/assets/audio/death.mp3")
    this.gameOverAudio.volume = 0.7

    this.damageAudio = new Audio("/assets/audio/damage.mp3")
    this.damageAudio.volume = 0.7

    this.hurtAudio = new Audio ("/assets/audio/classic_hurt.mp3")
    this.hurtAudio.volume = 0.7
  }

  start() {
    if(this.drawIntervalId === null){
      this.audio.play()
      this.setUpListeners()
      this.drawIntervalId = setInterval(() => {
        this.clear()
        this.move()
        this.draw()
        this.generateElements()
        this.checkCollisions()

        if(this.checkGameOver()){
          this.stop()
          this.gameOver()
        }
      }, this.fps)
    }
  }
  
  draw() {
    this.nubes.draw()
    this.montanas.draw()
    this.suelo.draw()
    this.mario.draw()
    this.coins.forEach(coin => coin.draw())
    this.enemies.forEach(enemy => enemy.draw())
    this.drawScore()
    this.drawHearts()
  }
  
  move() {
    this.nubes.move()
    this.montanas.move()
    this.suelo.move()
    this.mario.move()
    this.coins.forEach(coin => coin.move())
    this.enemies.forEach(enemy => enemy.move())

    this.checkBounds()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  stop() {
    clearInterval(this.drawIntervalId)
    this.drawIntervalId = null
    this.audio.pause()
  }

  gameOver() {
    // alert("Perdiste wey")
    // window.location.reload()
    this.gameOverAudio.currentTime = 1.2
    this.gameOverAudio.play()
    this.audio.pause()
    document.getElementById("canvas-container").style.display = "none"
    document.getElementById("gameover-screen").style.display = "flex"
  }

  restart() {
    window.location.reload()
  }

  setUpListeners() {
    addEventListener("keydown", (event) => { //es lo mismo que document.addEventListener()
      this.mario.onKeyEvent(event)
    })

    addEventListener("keyup", (event) => {
      this.mario.onKeyEvent(event)
    })
  }

  generateElements(){
    if(this.coinsTimeoutId === null){
      this.coinsTimeoutId = setTimeout(() => {
        const randomY = Math.floor(Math.random() * 121)

        this.coins.push(
          new Coin(
            this.ctx, 
            this.canvas.width, 
            this.canvas.height - BG_FLOOR - COIN_H - randomY)
        )
        this.coinsTimeoutId = null
      }, 1500);
    }

    if(this.enemiesTimeoutId === null) {
      const randomTime = Math.floor(Math.random() * 10001)
      this.enemiesTimeoutId = setTimeout(() => {
        this.enemies.push(
          Enemy.generateBeetle(
            this.ctx,
            this.canvas.width,
          )
        )
        this.enemiesTimeoutId = null
      }, randomTime);
    }
  }

  checkBounds() {
    this.coins = this.coins.filter(coin => coin.x + coin.w >= 0)
    this.enemies = this.enemies.filter(enemy => enemy.x + enemy.w >= 0)
  }

  checkCollisions() {
    this.coins = this.coins.filter(coin => {
      if(this.mario.collidesWith(coin)){
        this.coinAudio.currentTime = 0.3
        this.coinAudio.play()
        this.score += coin.score
        return false
      }
      return true
    })

    this.enemies = this.enemies.filter(enemy => {
      if(this.mario.collidesWith(enemy)){
        if(this.mario.isJumping && this.mario.y < enemy.y) {
          this.hurtAudio.currentTime = 0
          this.hurtAudio.play()
          this.score += enemy.score

        }else{
          this.hearts--
          this.mario.damageFrames = 90
          if(this.hearts > 0){
            this.damageAudio.play()
          }
        }
        return false
      }
      return true
    })
  }

  drawHearts(){
    if(this.heart.isReady){
      for(let i = 0; i < this.hearts; i++){
        this.ctx.drawImage(
          this.heart,
          (10 + HEARTS_W) * i + 20,
          20,
          HEARTS_W,
          HEARTS_H
        )
      }
    }
  }

  drawScore() {
    this.ctx.font = "24px sans-serif"
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width -150, 30)
  }

  checkGameOver(){
    return this.hearts <= 0
  }
}