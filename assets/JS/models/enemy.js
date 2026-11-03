class Enemy {
  static generateBeetle(ctx, x, y) {
    return new Enemy(
      ctx,
      x,
      ctx.canvas.height - BG_FLOOR - BEETLE_H,
      BEETLE_W,
      BEETLE_H,
      BEETLE_SPRITE,
      BEETLE_COLFRAMES,
      BEETLE_ROWFRAMES,
      BEETLE_SCORE
    )
  }

  constructor(ctx, x, y, w, h, src, colFrames, rowFrames, score){
    this.ctx = ctx
    this.x = x
    this.y = y

    this.w = w
    this.h = h
    this.score = score

    this.vx = -ENEMY_VX

    this.sprite = new Image()
    this.sprite.src = src
    this.sprite.cols = colFrames
    this.sprite.rows = rowFrames
    this.sprite.colFrames = 0
    this.sprite.rowFrames = 0

    this.sprite.onload = () => {
      this.sprite.isReady = true

      this.sprite.frameW = this.sprite.width / this.sprite.cols
      this.sprite.frameH = this.sprite.height / this.sprite.rows
    }

    this.drawCount = 0

  }

  draw() {
    if(this.sprite.isReady){
      this.ctx.drawImage(
        this.sprite,
        this.sprite.colFrames * this.sprite.frameW,
        this.sprite.rowFrames * this.sprite.frameH,
        this.sprite.frameW,
        this.sprite.frameH,
        this.x,
        this.y,
        this.w,
        this.h
      )

      this.animate()
      this.drawCount++
    }
  }

  animate() {
    if(this.drawCount >= ENEMY_SPRITE_FREQ){
      this.drawCount = 0
      this.sprite.colFrames = (this.sprite.colFrames + 1) % this.sprite.cols
    }
  }

  move(){
    this.x += this.vx
  }
}