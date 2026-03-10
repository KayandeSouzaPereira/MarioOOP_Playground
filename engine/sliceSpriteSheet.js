export function sliceSpriteSheet(image, frameWidth, frameHeight){

 const frames = []

 const cols = image.width / frameWidth
 const rows = image.height / frameHeight

 for(let y=0;y<rows;y++){

  for(let x=0;x<cols;x++){

   frames.push({
    x:x*frameWidth,
    y:y*frameHeight,
    width:frameWidth,
    height:frameHeight
   })

  }

 }

 return frames

}