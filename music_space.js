let last_words = "";
let last_words_opacity = 0;

function draw_one_frame(words, vocal, drum, bass, other,counter) {
  background(255,236,180); // cream
  fill(244,161,39); // orange

  let stripeWidth = map(other, 40, 100, 40, 80, true);

  let numStripes = height / stripeWidth;
  for(let i=0; i<numStripes; i=i+2) {
    let cury = map(i, 0, numStripes-1, 0, height);
    rect(0, cury, width, stripeWidth);
  }

  let triangleHeight = map(bass, 40, 100, 200, 550, true);
  fill(117,200,174); // teal
  for(let i=0; i<3; i++) {
    let cur_x = map(i, 0, 4, 0, width);
    let next_x = map(i+1, 0, 3, 0, width);
    let mid_x = (cur_x + next_x) / 2.0;
    //let cur_y = 4 * height / 5;
    let cur_y = height 
    triangle(cur_x, cur_y, mid_x, cur_y - triangleHeight, next_x, cur_y);
  }


  let drumSize = map(drum, 30, 100, 30, 300, true);
  fill(90,61,43); // brown
  rect(0, 0, drumSize, drumSize);
  rect(width, 0, -drumSize, drumSize);
  rect(0, height, drumSize, -drumSize);
  rect(width, height, -drumSize, -drumSize);

  let ovalPlace = map(vocal, 20, 100, height-50, 50, true);
  let ovalSize = map(vocal, 20, 100, 60, 150, true);
  fill(229,119,30); // darker orange
  ellipse(width/2, ovalPlace, ovalSize);

  if(words == "") {
    last_words_opacity = last_words_opacity * 0.95;
    words = last_words;
  }
  else {
    last_words_opacity = (1 + last_words_opacity) * 1.1;
    if(last_words_opacity > 255) {
      last_words_opacity = 255;
    }
  }
  last_words = words;

  textFont('Georgia');
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(80);
  noStroke();
  fill(0, 0, 0, int(last_words_opacity));
  text(words, width/2, height/2);
}
