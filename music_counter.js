
let lastWords = "...";
let wordBrightness = 255;
let yOffset = 0;

function draw_one_frame(words, vocal, drum, bass, other, counter) {
background(0);
rectMode(CENTER);
textAlign(CENTER);
textFont('Helvetica'); // please use CSS safe fonts

if (words == "") {
  wordBrightness = int(wordBrightness * 0.95); //fade brightness 
  words = lastWords; // safe the last known word so we can display 
  if (yOffset < height / 4) {
    yOffset = yOffset + 1;
  }
} else {
  wordBrightness = 255; // set brightness to max
  yOffset = 0; //don't offset down
  lastWords = words; // keep track of what the most recent word is
}

fill(wordBrightness);
textSize(40);
text(words, width / 2, height / 5 + yOffset); // display current lyric in middle of page, then fade down

let volume_vocal = map(vocal, 0, 100, 0, 0.7 * height, true);
let volume_drum  = map(drum, 0, 100, 0, 0.7 * height, true);
let volume_bass  = map(bass, 0, 100, 0, 0.7 * height, true);
let volume_other = map(other, 0, 100, 0, 0.7 * height, true);


rectMode(CENTER);
let rectY = height/3 *2
fill(200, 0, 0);
rect(2*width/10, rectY, width/6, volume_vocal);
fill(0, 200, 0);
rect(4*width/10, rectY, width/6, volume_drum);
fill(200, 200, 200);
rect(6*width/10, rectY, width/6, volume_bass);
fill(0, 0, 200);
rect(8*width/10, rectY, width/6, volume_other);

fill(200)
textAlign(LEFT);
// demonstrate use of non-documented "counter" variable
let seconds = counter/60
if(seconds > 0) {
  textSize(60);
  text(nf(seconds, 3, 2), 20, height-20);
}
}
