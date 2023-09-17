let old_loudest = 0;

// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other,counter) {
  //background(20);
  rectMode(CENTER);
  textAlign(CENTER);
  textSize(40);

  let bar_spacing = width/5;
  let bar_pos_y = 2*height/3;

  let loudest = 0; // loudest should be 1, 2, 3, 4 (which of the 4 channels is strongest)
  // 
  if(vocal > drum && vocal > bass && vocal > other) {
    loudest = 1;
  }
  else if(drum > vocal && drum > bass && drum > other) {
    loudest = 2;
  }
  else if(bass > vocal && bass > drum && bass > other) {
    loudest = 3;
  }
  else {
    loudest = 4;
  }
 

  if(loudest == old_loudest) {
    background(20);
  }
  else if(loudest == 1) {
    background(200, 0, 0);
  }
  else if(loudest == 2) {
    background(0, 200, 0);
  }
  else if(loudest == 3) {
    background(0, 0, 200);
  }
  else {
    background(200, 200, 200);
  }

  old_loudest = loudest;

  // by default all bars are skinny
  let bar_width1 = width/12;
  let bar_width2 = width/12;
  let bar_width3 = width/12;
  let bar_width4 = width/12;

  // but make the loudest section fatter
  if(loudest == 1) {
    bar_width1 = width/5;
  }
  else if(loudest == 2) {
    bar_width2 = width/5;
  }
  else if(loudest == 3) {
    bar_width3 = width/5;
  }
  else {
    bar_width4 = width/5;
  }

  fill(200, 200, 0);
  text(words, width/2, height/3);

  // vocal bar is red
  fill(200, 0, 0);
  rect(1 * bar_spacing, bar_pos_y, bar_width1, 4 * vocal);

  // drum bar is green
  fill(0, 200, 0);
  rect(2 * bar_spacing, bar_pos_y, bar_width2, 4 * drum);

  // bass bar is blue
  fill(0, 0, 200);
  rect(3 * bar_spacing, bar_pos_y, bar_width3, 4 * bass);

  // other bar is white
  fill(200, 200, 200);
  rect(4 * bar_spacing, bar_pos_y, bar_width4, 4 * other);
}
