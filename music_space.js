// create stars class
let firstFrame = true;
const stars = [];
const maxStarSize = 60;

class Star{
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw(){
    fill(255, 255, 255, 255);
    ellipse(this.x, this.y, this.size, this.size);
  }
  drawSized(sizeMod){
    fill(255, 255, 255, 255);
    stroke(0,0,0, 40);
    star(this.x, this.y, this.size*sizeMod, this.size*sizeMod * 0.3, 4);
  }

  move(){
    let shift = this.size/30;
    this.x -= shift;
    this.y += shift;
    if(this.x < 0 || this.y > height){
      if(random(1) > 0.5){
        this.x = random(0, width);
        this.y = 0;
      } else{
        this.x = width;
        this.y = random(0, height);
      }
      this.size = random(1, maxStarSize);
    }
  }
}

function generateRandomStarSize(maxStarSize) {
  // Adjust the lambda parameter to control the weighting
  const lambda = 0.4; 
  const randomValue = Math.random() + 0.1;
  const starSize = -Math.log(1 - randomValue) / lambda;
  return Math.min(starSize, maxStarSize);
}

function draw_one_frame(words, vocal, drum, bass, other,counter) {
    background(0, 0, 0, 40);
    if(firstFrame){
      for(let i=0; i<30; i++){
        // generate random size from 1 to maxStarSize but weighted towards smaller stars


        stars.push(new Star(random(width), random(height), generateRandomStarSize(maxStarSize)));
      }
      firstFrame = false;
    }


    // draw stars
    for(let i=0; i<stars.length; i++){
      // stars[i].draw();
      stars[i].drawSized(drum/75);
      stars[i].move();
    }



    // circle(width/2, height/2, 400);





    // draw album cover items
    textAlign(LEFT);
    let left = width*0.065;
    let top = height*0.09;
    textFont('Lexend');
    textStyle(BOLD);
    textSize(width/10);
    text("SPACE CADET", left, top + width/20);
    textSize(width/40);
    let gap = 10;
    text("METRO BOOMIN", left, top + width/20 + gap + width/40);
    textAlign(RIGHT);
    text("GUNNA", width*0.76, top + width/20 + gap + width/40);

    // draw image
    image(sticker, width - 4*gap - 200, height - 4*gap - 100, 200, 100);

    



  
}


// modified from p5.js examples
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0 + halfAngle; a < TWO_PI + halfAngle; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


// background(255,236,180); // cream
//   fill(244,161,39); // orange

//   let stripeWidth = map(other, 40, 100, 40, 80, true);

//   let numStripes = height / stripeWidth;
//   for(let i=0; i<numStripes; i=i+2) {
//     let cury = map(i, 0, numStripes-1, 0, height);
//     rect(0, cury, width, stripeWidth);
//   }

//   let triangleHeight = map(bass, 40, 100, 200, 550, true);
//   fill(117,200,174); // teal
//   for(let i=0; i<3; i++) {
//     let cur_x = map(i, 0, 4, 0, width);
//     let next_x = map(i+1, 0, 3, 0, width);
//     let mid_x = (cur_x + next_x) / 2.0;
//     //let cur_y = 4 * height / 5;
//     let cur_y = height 
//     triangle(cur_x, cur_y, mid_x, cur_y - triangleHeight, next_x, cur_y);
//   }


//   let drumSize = map(drum, 30, 100, 30, 300, true);
//   fill(90,61,43); // brown
//   rect(0, 0, drumSize, drumSize);
//   rect(width, 0, -drumSize, drumSize);
//   rect(0, height, drumSize, -drumSize);
//   rect(width, height, -drumSize, -drumSize);

//   let ovalPlace = map(vocal, 20, 100, height-50, 50, true);
//   let ovalSize = map(vocal, 20, 100, 60, 150, true);
//   fill(229,119,30); // darker orange
//   ellipse(width/2, ovalPlace, ovalSize);

//   if(words == "") {
//     last_words_opacity = last_words_opacity * 0.95;
//     words = last_words;
//   }
//   else {
//     last_words_opacity = (1 + last_words_opacity) * 1.1;
//     if(last_words_opacity > 255) {
//       last_words_opacity = 255;
//     }
//   }
//   last_words = words;

//   textFont('Georgia');
//   textAlign(CENTER);
//   textStyle(BOLD);
//   textSize(80);
//   noStroke();
//   fill(0, 0, 0, int(last_words_opacity));
//   text(words, width/2, height/2);
