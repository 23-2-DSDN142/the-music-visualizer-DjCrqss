// create stars class
let firstFrame = true;
const stars = [];
const flames = [];
const asteroids = [];
const maxStarSize = 30;
let rocketAngle = 0;

class Star {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.changeSize = Math.random() > 0.8;
    this.framesSinceChange = Math.random() * 400;
  }
  draw() {
    fill(255, 255, 255, 255);
    ellipse(this.x, this.y, this.size, this.size);
  }
  drawSized(sizeMod, points) {
    fill(255, 255, 255, 255);
    stroke(0, 0, 0, 40);

    // if(this.framesSinceChange <= 0){
    
    //     if(sizeMod > 0.3 && Math.random() > 0.5 && !this.changeSize){
    //       this.changeSize = true;
    //       this.framesSinceChange = 60;
    //     } else if (sizeMod < 0.3 && Math.random() > 0.4 && this.changeSize){
    //       this.changeSize = false;
    //       this.framesSinceChange = 400;
    //     }
      
    // }
    this.framesSinceChange--;
    if(this.framesSinceChange <= 0){
      this.changeSize = !this.changeSize;
      this.framesSinceChange = random(60, 400);
    }

    if(this.changeSize){
      star(this.x, this.y, this.size * sizeMod, this.size * sizeMod * 0.25, points);
    } else {
      star(this.x, this.y, this.size * 0.4, this.size * 0.1, points);
    }
  }

  move() {
    let shift = this.size / 60;
    // convert rocketAngle to x and y shift

    this.x -= sin(rocketAngle + PI/4) * shift;
    this.y += cos(rocketAngle + PI/4) * shift;
    if (this.x < 0 || this.y > height) {
      if (random(1) > 0.5) {
        this.x = random(0, width * 0.9);
        this.y = 0;
      } else {
        this.x = width;
        this.y = random(0, height * 0.9) + height * 0.1;
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

function biasSmallRandom() {
  return max(0.01, 1 - sqrt(1 - random()));
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  background(0, 0, 0, 15);
  // setup items
  if (firstFrame) {
    setUp();
    firstFrame = false;
  }



  // draw stars
  let starSize = drum / 75;
  let starPoints = 4;
  if(bass > 70){
    starSize *= 0.65;
    // starPoints = random(4, 8);
  }
  stars.filter((star) => star.size < maxStarSize * 0.66).forEach((star) => {
    star.drawSized(starSize, starPoints);
  });




  // draw planet
  drawPlanet(bass, counter);


  // draw foreground stars
  stars.filter((star) => star.size >= maxStarSize * 0.66).forEach((star) => {
    star.drawSized(starSize, starPoints);
  });

  // draw ship and glow
  drawShip(vocal, bass);

  // draw album cover items
  drawAlbumCovertItems();

  // update items
  stars.forEach((star) => {
    star.move();
  });

}

function setUp() {
  //getnerate stars
  for (let i = 0; i < 100; i++) {
    // generate random size from 1 to maxStarSize but weighted towards smaller stars
    stars.push(new Star(random(width), random(height), biasSmallRandom() * maxStarSize));
    flames.push(new Flame());
  }
}


function drawPlanet(bass, counter) {
  noStroke();
  const planetSize = 190;
  push();
  translate(width * 0.165, height * 0.75);

  // bottom layer
  push();
    radialGradient(-planetSize / 2, -planetSize / 1.5, 0,
      -planetSize / 2, -planetSize / 1.5, planetSize * 1.3, color(200), color(0));
    circle(0, 0, planetSize - (bass/5));
  pop();


  // ring
  push();
    rotate(sin(counter/300 - 2)/4);
    noFill();
    stroke(200);
    strokeWeight(15);
    let bassAmount = bass/5;
    if(bass > 80){
      bassAmount += sin(counter)*5;
    }
    ellipse(0, 0, planetSize * 1.65 + bassAmount, planetSize * 0.4  + bassAmount/2);
  pop();


  // top layer
  push();
    noStroke();
    fill(255);
    radialGradient(-planetSize / 2, -planetSize / 1.5, 0,
    -planetSize / 2, -planetSize / 1.5, planetSize * 1.3, color(200), color(0));
    arc(0, 0, planetSize - (bass/5), planetSize - (bass/5),  PI, PI *2, CHORD);
  pop();



  pop();
}


/**
 * Draws the ship and its glow
 * Visualises the vocal value
 * @param {number} vocalValue - the vocal value
 */
function drawShip(vocal, bass) {
  // draw ship
  let shakeX = random(-vocal * 0.008, vocal * 0.008);
  let shakeY = random(-vocal * 0.008, vocal * 0.008);

  rocketAngle = -cos(frameCount/800) * 0.3;

  
  
  // draw flames
  push();
  // translate(width * 0.5 + 25, height * 0.5 - 20);
  translate(width * 0.5 + 80 + shakeX, height * 0.5 - 50 + shakeY);
  rotate(TWO_PI*(5/8) + rocketAngle);
  translate(0, -50);
  flames.forEach(flame => {
    flame.render(vocal || 0);
  });
  pop();
  
  
  push();
    translate(width * 0.5 + 80 + shakeX, height * 0.5 - 50 + shakeY);
    rotate(rocketAngle);
    imageMode(CENTER);
    image(rocketship,0, 0, 200, 200);
  pop();

  // draw ship glow
  push();
  radialGradient(width / 2 + 80, height / 2, (vocal * 2), width / 2 + 80, height / 2, vocal * 4 + 110 + bass*2, color(0, 0, 0, 0), color(0, 0, 0, 250));
  // radialGradient(width / 2, height / 2, (vocal * 2) + 20, width / 2, height / 2, vocal * 4 + 250, color(0, 0, 0, 0), color(0, 0, 0, 250));
  rect(0, 0, width, height);
  pop();


  
  // flames.forEach((flame) => {
  //   flame.move();
  // });
}

/**
 * Draws the album cover items
 * Title and artist names and parental advisory sticker
 */
function drawAlbumCovertItems() {
  // draw album cover items
  textAlign(LEFT);
  let left = width * 0.065;
  let top = height * 0.09;
  textFont('Lexend');
  textStyle(BOLD);
  textSize(width / 10);
  text("SPACE CADET", left, top + width / 20);
  textSize(width / 40);
  let gap = 10;
  text("METRO BOOMIN", left, top + width / 20 + gap + width / 40);
  textAlign(RIGHT);
  text("GUNNA", width * 0.76, top + width / 20 + gap + width / 40);

  // draw image
  image(sticker, width - 4 * gap - 200, height - 4 * gap - 100, 200, 100);
}


// HELPER FUNCTIONS
// star modified from p5.js example
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
function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE) {
  let gradient = drawingContext.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);

  drawingContext.fillStyle = gradient;
}



function linearGradient(sX, sY, eX, eY, colorS, colorE) {
  let gradient = drawingContext.createLinearGradient(
    sX, sY, eX, eY
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
  // drawingContext.strokeStyle = gradient;
}



const startLife = 7;
const decayRate = 0.1;


class Flame {
  constructor() {
    this.reset();
    this.delay = random(startLife/decayRate);
  }

  reset(vocal) {
    let vocalSpread = vocal/10 || 0;
    this.startRadius = random(25, 30);
    this.radius = this.startRadius;
    this.pos = createVector((random(-vocalSpread, vocalSpread) -4), 0);
    this.vel = createVector();
    this.lightness = random(150, 255);
    this.startAlpha = random(0, 5) + vocalSpread/5;
    this.decayRate = 0.1;
    this.startLife = 6;
    this.opacity =  vocalSpread * 3;
    this.life = this.startLife;
  }

  update(vocal) {
    let vocalSpread = vocal * 40;
    this.vel.x += (random(0, 200) - 100) / (200 + vocalSpread);
    this.vel.y -= this.life / 50 + (Math.random()/10);
    this.pos.add(this.vel);
    this.radius = this.startRadius * (this.life / this.startLife);
    this.life -= this.decayRate;
    this.opacty -= this.decayRate;
    if (this.life <= this.decayRate) {
      this.reset(vocal);
    }
    return this;
  }

  display() {
    push();
    fill(this.lightness, this.lightness, this.lightness, Math.min(this.opacity * 5 + this.startAlpha, this.life*10));
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius);
    pop();
    return this;
  }

  render(vocal) {
    if(this.delay > 0){
      this.delay--;
      return;
    }
    return this.update(vocal).display();
  }
}