class Mario {
  constructor(ctx, x, y) {
    this.ctx = ctx
    
    this.x = x
    this.y = y
    this.ground = 0


    this.w = MARIO_W
    this.h = MARIO_H

    this.vx = 0
    this.vy = 0
    this.ay = 0

    this.isJumping = false
    this.isCrouched = false

    this.spriteRight = new Image()
    this.spriteRight.src = MARIO_SPRITE_RIGHT
    this.spriteRight.cols = 2
    this.spriteRight.rows = 4

    this.spriteRight.colsFrame = 0
    this.spriteRight.rowsFrame = 0

    this.spriteRight.onload = () => {
      this.spriteRight.isReady = true

      this.spriteRight.frameW = Math.floor(this.spriteRight.width / this.spriteRight.cols)
      this.spriteRight.frameH = Math.floor(this.spriteRight.height / this.spriteRight.rows)
    }

    this.spriteLeft = new Image()
    this.spriteLeft.src = MARIO_SPRITE_LEFT
    this.spriteLeft.cols = 2
    this.spriteLeft.rows = 4

    this.spriteLeft.colsFrame = 0
    this.spriteLeft.rowsFrame = 0

    this.spriteLeft.onload = () => {
      this.spriteLeft.isReady = true

      this.spriteLeft.frameW = Math.floor(this.spriteLeft.width / this.spriteLeft.cols)
      this.spriteLeft.frameH = Math.floor(this.spriteLeft.height / this.spriteLeft.rows)
    }

    this.sprite = this.spriteRight

    this.drawCount = 5
    this.damageFrames = 0

    this.jumpAudio = new Audio("/Mario-Clone/assets/audio/jump.mp3")
    this.jumpAudio.volume = 0.1
  }

  groundTo(groundY){
    this.y = groundY - this.h
    this.ground = groundY

  }

  draw(){
    if(this.sprite.isReady){
      this.ctx.drawImage(
        this.sprite, 
        this.sprite.colsFrame * this.sprite.frameW,
        this.sprite.rowsFrame * this.sprite.frameH,
        this.sprite.frameW,
        this.sprite.frameH,
        this.x,
        this.y,
        this.w,
        this.h
      )
    }

    this.animate()
    this.drawCount++
  }

  move(){
    this.vy += this.ay
    
    this.x += this.vx
    this.y += this.vy
    
    if(this.y + this.h > this.ground) {
      this.groundTo(this.ground)
      this.vy = 0
      this.ay = 0
      
      this.isJumping = false
    }
    
    if(this.x + this.w > this.ctx.canvas.width){
      this.x = this.ctx.canvas.width - this.w
    }
    
    if(this.x < 0){
      this.x = 0
    }
  }
  
  onKeyEvent(event) {
    const isPressed = event.type === "keydown" //true si aprietas y false si dejas de apretar
    
    switch(event.keyCode) {
      case KEY_RIGHT:
        if(isPressed) {
          this.sprite = this.spriteRight
          this.vx = MARIO_VX
        }else{
          this.vx = 0
        }
        break
        
        case KEY_LEFT:
          if(isPressed) {
          this.sprite = this.spriteLeft
          this.vx = -MARIO_VX
        }else{
          this.vx = 0
        }
        break

      case KEY_DOWN:
        if(isPressed) {
          this.isCrouched = true
        }else{
          this.isCrouched = false
        }
        break

      case SPACE:
        if(isPressed && !this.isJumping){
          this.isJumping = true
          this.ay = MARIO_AY
          this.vy = -MARIO_VY
          this.jumpAudio.currentTime = 0.1 
           this.jumpAudio.play()
        }
        break
    }
  }

  animate() {
    if(this.damageFrames > 0) {
      this.animateFrame(0, 3, 2, 10)
      this.damageFrames--
      return
    }
    if(this.damageFrames >= 0){
    }
    if(this.isJumping && this.vy >= 0) {
      this.sprite.colsFrame = 1 
      this.sprite.rowsFrame = 2
      
    }else if (this.isJumping && this.vy < 0){
      this.sprite.colsFrame = 0
      this.sprite.rowsFrame = 2
      
    }else if(this.isCrouched){
      this.sprite.colsFrame = 1
      this.sprite.rowsFrame = 0
      
    }else if(this.vx !== 0){
      this.animateFrame(0, 1, 2, 15)
      
    }else{
      this.sprite.colsFrame = 0
      this.sprite.rowsFrame = 0
    }
  }
  
  animateFrame(initialColFrame, initialRowFrame, frames, freq) { 
    if(this.sprite.rowsFrame !== initialRowFrame){
      this.sprite.rowsFrame = initialRowFrame
      this.sprite.colsFrame = initialColFrame
    }

    if(this.drawCount % freq === 0){
      this.drawCount = 0
      this.sprite.colsFrame = (this.sprite.colsFrame +1) % frames
    }
  }

  collidesWith(element) {
    return (this.x + this.w > element.x) &&
    (this.x < element.x + element.w) &&
    (this.y + this.h > element.y) &&
    (this.y < element.y + element.h)
  }
}