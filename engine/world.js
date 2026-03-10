export class World{

 constructor(canvasId){

  this.canvas = document.getElementById(canvasId)
  this.ctx = this.canvas.getContext("2d")

  this.canvas.width = 800
  this.canvas.height = 450

  this.entities = []

  this.lastTime = 0

  requestAnimationFrame((time)=>this.loop(time))

 }

 spawn(entity){

  this.entities.push(entity)

 }

 loop(time){

  const delta = time - this.lastTime
  this.lastTime = time

  this.update(delta)
  this.render()

  requestAnimationFrame((t)=>this.loop(t))

 }

 update(delta){

  this.entities.forEach(e=>{

   if(e.update)
    e.update(delta)

  })

 }

 render(){
 
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

  this.entities.forEach(e=>{

   if(e.draw)
    e.draw(this.ctx)

  })

 }

}