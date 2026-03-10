export async function loadSprite(path){

 return new Promise(resolve=>{

  const img = new Image()

  img.src = path

  img.onload = ()=>resolve(img)

 })

}