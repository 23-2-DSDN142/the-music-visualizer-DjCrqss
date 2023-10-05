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
    if (this.framesSinceChange <= 0) {
      this.changeSize = !this.changeSize;
      this.framesSinceChange = random(60, 400);
    }


    push()
    if (this.changeSize) {
      star(this.x, this.y, this.size * sizeMod, this.size * sizeMod * 0.25, points);
      // this.drawStarGlow(sizeMod);

    } else {
      star(this.x, this.y, this.size * 0.4, this.size * 0.1, points);
      // this.drawStarGlow(sizeMod);
     
    }
    pop();
  }

  drawStarGlow(sizeMod){
    push();
    noStroke();
    // make overlay style ADD
    blendMode(ADD);
    radialGradient(this.x, this.y, 0,
      this.x, this.y, this.size * sizeMod * 20, color(255, 255, 255, 3), color(0, 0, 0, 0));
    circle(this.x, this.y, this.size * sizeMod * 25 + 100);
    pop();

  }

  move() {
    let shift = this.size / 60;
    // convert rocketAngle to x and y shift

    this.x -= sin(rocketAngle + PI / 4) * shift;
    this.y += cos(rocketAngle + PI / 4) * shift;
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


  setExtraSounds(counter);
  console.log(other);


  // draw stars
  let starSize = drum / 75;
  let starPoints = 4;
  if (bass > 70) {
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



  // draw asteroids
  if (other < 62) {
    other = 62;
  } else if (other > 78) {
    other = 78;
  }
  let mappedOther = map(other, 62, 78, 0.001, 0.01);
  asteroids.forEach((asteroid) => {
    asteroid.update(mappedOther).display();
  });

  // draw ship and glow
  drawShip(vocal, bass);

  stars.forEach((star) => {
    star.drawStarGlow(starSize);
  });


  // draw album cover items
  drawAlbumCovertItems();

  // update items
  stars.forEach((star) => {
    star.move();
  });

}


const maxTime = 2 * Math.PI;
function setUp() {
  //getnerate stars, flames and asteroids
  for (let i = 0; i < 100; i++) {
    // generate random size from 1 to maxStarSize but weighted towards smaller stars
    stars.push(new Star(random(width), random(height), biasSmallRandom() * maxStarSize));
    flames.push(new Flame());
  }

  for (let i = 0; i < maxTime; i += 0.02) {
    asteroids.push(new Asteroid(i, random(minAsteroidSpread, maxAsteroidSpread)));
    asteroids.push(new Asteroid(i, random(minAsteroidSpread, maxAsteroidSpread)));
    asteroids.push(new Asteroid(i, random(minAsteroidSpread, maxAsteroidSpread)));
  }
}


let word1opacity = 0;
let word2opacity = 0;
let word3opacity = 0;
let enableTriplePing = true;
let timeSincePing = 999;
const triplePingEnable = [[80, 2100], [3200, 5200], [6400, 7400], [10600, 11500]];
const metalPingEnable = [[2100, 4100], [5200, 7300], [8500, 9400]];
function setExtraSounds(counter) {
  // console.log(counter);
  // console.log(counter);
  let triplePingDelay = 80;
  let timeBetweenPings = 132;
  let pingGap = 10;


  // check if counter is between any of the triplePingEnable ranges
  enableTriplePing = triplePingEnable.some((range) => {
    return counter > range[0] && counter < range[1];
  });

  if (enableTriplePing) {
    if ((counter - triplePingDelay) % timeBetweenPings <= 2) {
      word1opacity = 255;
    } else if ((counter - triplePingDelay - pingGap) % timeBetweenPings <= 2) {
      word2opacity = 255;
    } else if ((counter - triplePingDelay - pingGap * 2) % timeBetweenPings <= 2) {
      word3opacity = 255;
    } else {
      triplePing = -1;
      word1opacity--;
      word2opacity--;
      word3opacity--;
    }
  } else {
    // slowly bring all opacities back to 200
    word1opacity += (200 - word1opacity) / 100;
    word2opacity += (200 - word2opacity) / 100;
    word3opacity += (200 - word3opacity) / 100;
  }


  let metalPingDelay = 55;
  let metalPingGap = 264; // 264


  // if(metalPingEnable.some((range) => {
  //   return counter > range[0] && counter < range[1]})){
  //     console.log("ping on");
  //   } else {
  //     console.log("ping off");
  //   }



  if (
    metalPingEnable.some((range) => {
      return counter > range[0] && counter < range[1]
    }) &&
    (counter - metalPingDelay) % metalPingGap <= 2) {
    timeSincePing = 0;
  } else {
    timeSincePing += 2;
  }




}


function drawPlanet(bass, counter) {

  let bassAmount = bass / 5;
  if (bass > 80) {
    bassAmount += sin(counter * 1.5) * 5 + 2;
  } else {
    bassAmount -= 2;
  }


  noStroke();
  const planetSize = 190;
  push();
  translate(width * 0.165, height * 0.75);

  // bottom layer
  push();
  radialGradient(-planetSize / 2, -planetSize / 1.5, 0,
    -planetSize / 2, -planetSize / 1.5, planetSize * 1.3, color(200), color(0));
  circle(0, 0, planetSize - (bass / 5) + bassAmount / 10);
  pop();


  // ring
  push();
  rotate(sin(counter / 300 - 2) / 4);
  noFill();
  stroke(200);
  strokeWeight(15);

  ellipse(0, 0, planetSize * 1.65 + bassAmount, planetSize * 0.4 + bassAmount / 2);
  pop();


  // top layer
  push();
  noStroke();
  fill(255);
  radialGradient(-planetSize / 2, -planetSize / 1.5, 0,
    -planetSize / 2, -planetSize / 1.5, planetSize * 1.3, color(200), color(0));
  arc(0, 0, planetSize - (bass / 5) + bassAmount / 10, planetSize - (bass / 5) + bassAmount / 10, PI, PI * 2, CHORD);
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

  rocketAngle = -cos(frameCount / 800) * 0.3;



  // draw flames
  push();
  // translate(width * 0.5 + 25, height * 0.5 - 20);
  translate(width * 0.5 + 80 + shakeX, height * 0.5 - 50 + shakeY);
  rotate(TWO_PI * (5 / 8) + rocketAngle);
  translate(0, -50);
  flames.forEach(flame => {
    flame.render(vocal || 0);
  });
  pop();

  // draw metal ping radar
  if (timeSincePing < 255) {
    push();
    translate(width * 0.5 + 80, height * 0.5 - 50);
    // replace with circle that has white edge and fades to clear in middle later
    noFill();
    stroke(255, 255, 255, 240 - timeSincePing);
    strokeWeight(2);
    circle(0, 0, timeSincePing * 2);

    pop();
  }

  push();
  translate(width * 0.5 + 80 + shakeX, height * 0.5 - 50 + shakeY);
  rotate(rocketAngle);
  imageMode(CENTER);
  image(rocketship, 0, 0, 200, 200);
  pop();

  // draw ship glow
  push();
  let outerRadius = map(vocal * 3 + bass * 3, 0, 600, 110, width);
  radialGradient(width / 2 + 80, height / 2, 0,
    width / 2 + 80, height / 2, outerRadius,
    color(0, 0, 0, 0), color(0, 0, 0, 250));
  rect(0, 0, width, height);
  pop();

  // radialGradient(width / 2, height / 2, (vocal * 2) + 20, width / 2, height / 2, vocal * 4 + 250, color(0, 0, 0, 0), color(0, 0, 0, 250));


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
  fill(255, 255, 255, word2opacity);
  text("SPACE CADET", left, top + width / 20);

  textSize(width / 40);
  let gap = 10;
  fill(255, 255, 255, word1opacity);
  text("METRO BOOMIN", left, top + width / 20 + gap + width / 40);
  textAlign(RIGHT);
  fill(255, 255, 255, word3opacity);
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
function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE, colorM) {
  let gradient = drawingContext.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  gradient.addColorStop(0, colorS);
  if (colorM) {
    gradient.addColorStop(0.5, colorM);
  }
  gradient.addColorStop(1, colorE);

  drawingContext.fillStyle = gradient;
}





// Classes
class Flame {
  constructor() {
    const startLife = 7;
    const decayRate = 0.1;
    this.reset();
    this.delay = random(startLife / decayRate);
  }

  reset(vocal) {
    let vocalSpread = vocal / 10 || 0;
    this.startRadius = random(25, 30);
    this.radius = this.startRadius;
    this.pos = createVector((random(-vocalSpread, vocalSpread) - 4), 0);
    this.vel = createVector();
    this.lightness = random(200, 255);
    this.startAlpha = random(0, 5) + vocalSpread / 5;
    this.decayRate = 0.1;
    this.startLife = 6;
    this.opacity = vocalSpread * 3;
    this.life = this.startLife;
  }

  update(vocal) {
    let vocalSpread = vocal * 40;
    this.vel.x += (random(0, 200) - 100) / (200 + vocalSpread);
    this.vel.y -= this.life / 50 + (Math.random() / 10);
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
    fill(this.lightness, this.lightness, this.lightness, Math.min(this.opacity * 5 + this.startAlpha, this.life * 10));
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius);
    pop();
    return this;
  }

  render(vocal) {
    if (this.delay > 0) {
      this.delay--;
      return;
    }
    return this.update(vocal).display();
  }
}



const asteroidBeltX = 1300;
const asteroidBeltY = 700;
const asteroidBeltRad = 500;
const maxAsteroidSize = 8;
const minAsteroidSize = 0.1;
const minAsteroidSpread = -40;
const maxAsteroidSpread = 40;
class Asteroid {
  constructor(initialTime, initialOffset) {
    this.offset = initialOffset;
    this.time = initialTime;
    this.rotation = random(0, TWO_PI);
    this.size = random(minAsteroidSize, maxAsteroidSize);

    // create vertices array for a blob
    this.vertices = [];
    let numVertices = random(4, 8);
    for (let corner = 0; corner < numVertices; corner++) {
      let angle = corner * TWO_PI / numVertices;
      let x = this.size * cos(angle) + random(-this.size / 4, this.size / 4);
      let y = this.size * sin(angle) + random(-this.size / 4, this.size / 4);
      this.vertices.push(x);
      this.vertices.push(y);
    }

  }

  reset() {
    this.time = 0;
    this.size = random(minAsteroidSize, maxAsteroidSize);
  }

  update(other) {
    this.time += other;
    this.rotation += 0.001;
    if (this.time > maxTime) {
      this.reset();
    }
    return this;
  }

  display() {
    push();
    rotate(-0.1);
    translate(1.55 * cos(this.time) * (this.offset + asteroidBeltRad) + asteroidBeltX,
      0.5 * tan(this.time) * (this.offset + asteroidBeltRad) + asteroidBeltY);
    rotate(this.rotation);
    imageMode(CENTER);
    fill(255, 255, 255, map(Math.abs(this.offset), 0, maxAsteroidSpread, 255, 0));

    // draw shape from vertices
    beginShape();
    for (let i = 0; i < this.vertices.length; i += 2) {
      curveVertex(this.vertices[i], this.vertices[i + 1]);
    }
    endShape(CLOSE);


    pop();
  }
}