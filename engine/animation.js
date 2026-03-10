export class Animator{

  constructor(sprite, animations){
    this.sprite = sprite
    this.animations = animations
    this.current = "idle"
    this.frameIndex = 0
    this.timer = 0

    this.frameWidth = 31
    this.frameHeight = 64
    this.scale = 0.7
  }

  set(animation){
    if(this.current !== animation){
      this.current = animation
      this.frameIndex = 0
      this.timer = 0
    }
  }

  setSprite(newSprite){
    this.sprite = newSprite
  }

  update(delta){
    const anim = this.animations[this.current]
    if(!anim) return

    this.timer += delta

    if(this.timer > anim.speed){
      this.frameIndex++
      this.timer = 0

      if(this.frameIndex >= anim.frames.length){
        this.frameIndex = 0
      }
    }
  }

  draw(ctx, x, y, direction = 1) {
    const anim = this.animations[this.current]
    if (!anim || !this.sprite) return

    const frame = anim.frames[this.frameIndex]
    const frameX = frame * this.frameWidth
    const frameY = anim.row * this.frameHeight

    const drawWidth = this.frameWidth * this.scale
    const drawHeight = this.frameHeight * this.scale

    ctx.save()

    if (direction === -1) {
      ctx.translate(x + drawWidth, y)
      ctx.scale(-1, 1)

      ctx.drawImage(
        this.sprite,
        frameX,
        frameY,
        this.frameWidth,
        this.frameHeight,
        0,
        0,
        drawWidth,
        drawHeight
      )
    } else {
      ctx.drawImage(
        this.sprite,
        frameX,
        frameY,
        this.frameWidth,
        this.frameHeight,
        x,
        y,
        drawWidth,
        drawHeight
      )
    }

    ctx.restore()
  }
}