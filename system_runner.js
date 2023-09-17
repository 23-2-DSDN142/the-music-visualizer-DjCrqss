const canvasWidth = 540;
const canvasHeight = 960;


let mainCanvas;

let textInput;
let slider1, slider2, slider3, slider4;
let songButton;

let editorMode = true;          // false when in song mode
let songLoadStatus = "loading"; // "error", "loaded"
let song;
let songIsPlaying = false;
let songEpoch = 0;              // millis when song starts
let table;
let words;

function songLoadedError() {
  songButton.elt.innerHTML = "Song: Load Error";
  print(songButton.elt.innerHTML);
  songLoadStatus = "error";
}

function songLoaded() {
  print("Song loaded");
  songLoadStatus = "loaded";
  songButton.elt.innerHTML = "run song";
  songButton.elt.disabled = false;
  // let now = millis();
  // songEpoch = now + 5000;
  if(debugFastRefresh && getAudioContext().state != "suspended"){
    switchRunMode()
  }
}

function songLoadedSoFar(soFar) {
  let loaded = int(100 * soFar);
  songButton.elt.innerHTML = "Song: " + loaded + "% loaded";
  print(songButton.elt.innerHTML);
}

function preload() {
  table = loadTable('volumes.csv', 'csv');
  words = loadStrings('words.txt');
}

let volumes = [];
let volume_length = 0;

function setup() {
  main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');
  song = loadSound('song.mp3', songLoaded, songLoadedError, songLoadedSoFar);  
  
  frameRate(60);
  angleMode(DEGREES);

  // create text inputs
  textInput = createInput('words...');
  textInput.parent('wordsContainer');

  // create sliders
  slider1 = createSlider(0, 100, 50);
  slider2 = createSlider(0, 100, 50);
  slider3 = createSlider(0, 100, 50);
  slider4 = createSlider(0, 100, 50);

  slider1.parent('slider1Container');
  slider2.parent('slider2Container');
  slider3.parent('slider3Container');
  slider4.parent('slider4Container');

  songButton = createButton('(music loading)');
  songButton.mousePressed(switchRunMode);
  songButton.parent('button1Container');
  songButton.elt.disabled = true;

  vol1 = [];
  vol2 = [];
  vol3 = [];
  vol4 = [];
  volumes = [vol1, vol2, vol3, vol4];
  volume_table_length = table.getRowCount();
  for(let i=0; i< volume_table_length;i++) {
    let row = table["rows"][i].arr;
    vol1.push(float(row[1]));
    vol2.push(float(row[2]));
    vol3.push(float(row[3]));
    vol4.push(float(row[4]));
  }
  /*
  for(let i=0; i<4; i++) {
    let radius = map(i, 0, 3, 0, 3);
    volumes[i] = Taira.smoothen(vol1, Taira.ALGORITHMS.GAUSSIAN, 10, radius, true)
  }
  volumes[0] = vol1;
  */
  if(smoothing != 0) {
    let radius = map(smoothing, 0, 100, 0, 3);
    for(let i=0; i<4; i++) {
      volumes[i] = Taira.smoothen(volumes[i], Taira.ALGORITHMS.GAUSSIAN, 10, radius, true)
    }
  }
}

function switchRunMode() {
  if(editorMode) {
    if(songLoadStatus == "loading") {
      alert("Song still loading...");
      return;
    }
    else if (songLoadStatus == "error") {
      alert("Cannot switch mode, there was a problem loading the audio")
      return;
    }
    textInput.elt.disabled = true;
    slider1.elt.disabled = true;
    slider2.elt.disabled = true;
    slider3.elt.disabled = true;
    slider4.elt.disabled = true;

    editorMode = false;
    let now = millis();
    songEpoch = now + (debugFastRefresh ? 0 : 5000);
    songButton.elt.innerHTML = "stop music";
  }
  else {
    if(songIsPlaying) {
      song.stop();
      songIsPlaying = false;
    }
    textInput.elt.disabled = false;
    slider1.elt.disabled = false;
    slider2.elt.disabled = false;
    slider3.elt.disabled = false;
    slider4.elt.disabled = false;

    editorMode = true;
    songButton.elt.innerHTML = "start music";
  }
}

function draw() {
  if (editorMode) {
    let w = textInput.value();
    let s1 = slider1.value();
    let s2 = slider2.value();
    let s3 = slider3.value();
    let s4 = slider4.value();

    draw_one_frame(w, s1, s2, s3, s4, 0);
  }
  else {
    if(songEpoch > 0) {
      let now = millis();
      let songOffset = now - songEpoch;
      if(songOffset < 0) {
        background(0);
        let secondsRemaining = songOffset / -1000.0;
        let intSecs = int(secondsRemaining);
        if(intSecs > 0) {
          let remainder = secondsRemaining - intSecs;
          let curAngle = map(remainder, 0, 1, 630, 270);
          // print(secondsRemaining, intSecs, remainder, curAngle);
          noStroke();
          fill(200);
          arc(width/2, height/2, 400, 400, curAngle, curAngle+10);
          stroke(255);
          fill(255);
          textSize(200);
          textAlign(CENTER, CENTER);
          text(intSecs, width/2, height/2);
        }
        // text("Song starting in: " + secondsRemaining, width/2, height/2)      
      }
      else if (!songIsPlaying) {
        song.play();
        songIsPlaying = true;
        songEpoch = millis();
        if (typeof reset_music === "function") {
          reset_music();
        }
      }
    }
    if(songIsPlaying) {
      let curMillis = millis();
      let timeOffset = curMillis - songEpoch;
      let curSlice = int(60 * timeOffset / 1000.0);
      if (curSlice < volume_table_length) {
        // print("Processing " + curSlice + " of " + table.getRowCount())
        // let row = table["rows"][curSlice].arr
        // draw_one_frame(row);
        // print(row);
        let row = [volumes[0][curSlice], volumes[1][curSlice], volumes[2][curSlice], volumes[3][curSlice]]
        cur_words = "";
        if (curSlice < words.length) {
          cur_words = words[curSlice];
        }
        textInput.value(cur_words);
        slider1.value(row[0]);
        slider2.value(row[1]);
        slider3.value(row[2]);
        slider4.value(row[3]);
        draw_one_frame(cur_words, row[0], row[1], row[2], row[3], curSlice);
      }
    }
  }
}

function keyTyped() {
  if (key == '1') {
    song.setVolume(0.1);
  }
  if (key == '2') {
    song.setVolume(0.2);
  }
  if (key == '3') {
    song.setVolume(0.3);
  }
  if (key == '4') {
    song.setVolume(0.4);
  }
  if (key == '5') {
    song.setVolume(0.5);
  }
  if (key == '6') {
    song.setVolume(0.6);
  }
  if (key == '7') {
    song.setVolume(0.7);
  }
  if (key == '8') {
    song.setVolume(0.8);
  }
  if (key == '9') {
    song.setVolume(0.9);
  }
  if (key == '0') {
    song.setVolume(1.0);
  }
}
