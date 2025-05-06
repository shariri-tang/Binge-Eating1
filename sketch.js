let objects = [];
let sound;
let introSound;
let newMusic;
let inactivitySound;
let volumeInterval;
let inactivityTimeout;
let inactivityVolume = 0;

let showIntro = true;
let video;
let introStill;
let interactionBg;

let objectImages = [];
let afterClickImages = [];
let startButtonImg;

let flashAlpha = 0;
let flashTimer = 0;

let closingImg;
let showClosing = false;
let closingY = -1000;
let closingTimerStarted = false;
let closingStartTime;
let element = document.querySelector('.custom-cursor');

element.addEventListener('mouseenter', function() {
  document.body.style.cursor = 'url("cursor.png"), auto';
});

element.addEventListener('mouseleave', function() {
  document.body.style.cursor = 'default'; // Reset to the default cursor
});


function preload() {
  sound = loadSound('click.mp3');
  introSound = loadSound('intro-sound.mp3');
  newMusic = loadSound('new-music.mp3');  // New music file
  inactivitySound = loadSound('inactivity.mp3');
  introStill = loadImage('intro-still.png');
  interactionBg = loadImage('interaction-bg.png');
  startButtonImg = loadImage('start-button.png');
  closingImg = loadImage('closing.png');

  for (let i = 0; i < 5; i++) {
    objectImages[i] = loadImage(`object${i + 1}.png`);
    afterClickImages[i] = loadImage(`after${i + 1}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  rectMode(CORNER);

  video = createVideo(['intro.mp4'], videoLoaded);
  video.size(windowWidth, windowHeight);
  video.position(0, 0);
  video.hide();
  video.volume(1);
}

function draw() {
  if (showIntro) {
    image(introStill, 0, 0, width, height);
    let buttonW = 200;
    let buttonH = 60;
    let buttonX = width / 2 - buttonW / 2;
    let buttonY = height - 100;
    image(startButtonImg, buttonX, buttonY, buttonW, buttonH);
  } else {
    // Apply the vintage effect to the background image
    filter(SEPIA);  // Apply sepia filter
    filter(CONTRAST, 1.2);  // Apply contrast filter
    filter(SATURATE, 0.8);  // Reduce saturation

    // You can also apply these filters to objects or other images if needed
    image(interactionBg, 0, 0, width, height);
    
    // Continue with the rest of your drawing logic...
  }

  // Handle other animations or interactions below
}



function videoLoaded() {
  video.style('z-index', '1');
  video.style('position', 'absolute');
  video.style('top', '0');
  video.style('left', '0');
  video.style('object-fit', 'cover');
}

function draw() {
  if (showIntro) {
    image(introStill, 0, 0, width, height);
    let buttonW = 200;
    let buttonH = 60;
    let buttonX = width / 2 - buttonW / 2;
    let buttonY = height - 100;
    image(startButtonImg, buttonX, buttonY, buttonW, buttonH);
  } else if (!video.elt.paused && video.elt.style.display !== 'none') {
    // Video is playing
  } else {
    // Background
    image(interactionBg, 0, 0, width, height);

    // Flash effect
    if (random(1) < 0.005 && flashAlpha === 0) {
      flashAlpha = 100;
      flashTimer = 10;
    }
    if (flashTimer > 0) {
      noStroke();
      fill(255, 255, 0, flashAlpha);
      rect(0, 0, width, height);
      flashTimer--;
    } else {
      flashAlpha = 0;
    }

    // Show objects
    for (let obj of objects) {
      if (obj.visible) {
        image(obj.img, obj.x, obj.y, obj.w, obj.h);
      } else if (obj.wasClicked) {
        obj.x += obj.dx;
        obj.y += obj.dy;
        if (obj.x <= 0 || obj.x + obj.afterW >= width) obj.dx *= -1;
        if (obj.y <= 0 || obj.y + obj.afterH >= height) obj.dy *= -1;
        image(obj.afterClickImg, obj.x, obj.y, obj.afterW, obj.afterH);


      }
    }
  }

  // Closing animation
  if (showClosing) {
    image(closingImg, 0, closingY, width, height);
    if (closingY < 0) {
      closingY += 10;
    } else if (!closingTimerStarted) {
      closingTimerStarted = true;
      closingStartTime = millis();
    } else if (millis() - closingStartTime > 5000) {
      location.reload();
    }
  }
}

function mousePressed() {
  if (showIntro) {
    showIntro = false;
    video.show();
    video.play();
    introSound.play();
    video.onended(() => {
      video.hide();
      introSound.stop();
      initObjects();
      resetInactivityTimer();
    });
    return;
  }

  let clicked = false;
  for (let obj of objects) {
    if (
      obj.visible &&
      mouseX >= obj.x &&
      mouseX <= obj.x + obj.w &&
      mouseY >= obj.y &&
      mouseY <= obj.y + obj.h
    ) {
      obj.visible = false;
      obj.wasClicked = true;
      sound.play();
      clicked = true;
    }
  }

  if (clicked) {
    inactivitySound.stop();
    clearInterval(volumeInterval);
    clearTimeout(inactivityTimeout);
    inactivityVolume = 0;
    resetInactivityTimer();
    checkInteractionEnd();
  }
}

function initObjects() {
  objects = [
    {
      x: 100, y: 130, w: 400, h: 230,
      afterW: 690, afterH: 500,
      visible: true,
      wasClicked: false,
      img: objectImages[0],
      afterClickImg: afterClickImages[0],
      dx: random(-2, 2), dy: random(-2, 2)
    },
    {
      x: 530, y: 130 , w: 340, h: 240,
      afterW: 700, afterH: 600,
      visible: true,
      wasClicked: false,
      img: objectImages[1],
      afterClickImg: afterClickImages[1],
      dx: random(-2, 2), dy: random(-2, 2)
    },
    {
      x: 680, y: 400, w: 500, h: 390,
      afterW: 600, afterH: 520,
      visible: true,
      wasClicked: false,
      img: objectImages[2],
      afterClickImg: afterClickImages[2],
      dx: random(-2, 2), dy: random(-2, 2)
    },
    {
      x: 100, y: 410, w: 450, h: 390,
      afterW: 600, afterH: 500,
      visible: true,
      wasClicked: false,
      img: objectImages[3],
      afterClickImg: afterClickImages[3],
      dx: random(-2, 2), dy: random(-2, 2)
    },
    {
      x: 1000, y: 90, w: 320, h: 295,
      afterW: 800, afterH: 650,
      visible: true,
      wasClicked: false,
      img: objectImages[4],
      afterClickImg: afterClickImages[4],
      dx: random(-2, 2), dy: random(-2, 2)
    }
  ];
}

function resetInactivityTimer() {
  clearInterval(volumeInterval);
  clearTimeout(inactivityTimeout);
  inactivitySound.stop();
  inactivityVolume = 0;

  inactivitySound.setVolume(0);
  inactivitySound.loop();

  volumeInterval = setInterval(() => {
    inactivityVolume = min(inactivityVolume + 0.1, 1);
    inactivitySound.setVolume(inactivityVolume);
    if (inactivityVolume >= 1) {
      clearInterval(volumeInterval);
    }
  }, 300);

  inactivityTimeout = setTimeout(() => {
    for (let obj of objects) {
      if (obj.visible) {
        obj.visible = false;
        obj.wasClicked = true;
        sound.play();
      }
    }
    checkInteractionEnd();
  }, 32000); // 32 seconds
}

function checkInteractionEnd() {
  if (objects.every(obj => !obj.visible)) {
    triggerClosing();
  }
}

function triggerClosing() {
  showClosing = true;
  closingY = -closingImg.height;
  closingTimerStarted = false;
}

// Check if cursor is hovering over the intro image
function checkIntroHover() {
  let introX = 0;
  let introY = 0;
  let introWidth = introStill.width;
  let introHeight = introStill.height;

  if (mouseX > introX && mouseX < introX + introWidth && mouseY > introY && mouseY < introY + introHeight) {
    if (!newMusic.isPlaying()) { // Only play the music if it's not already playing
      newMusic.setVolume(0.3); 
      newMusic.play();
    }
  }
}

// This function will handle the mouse movement event
function mouseMoved() {
  checkIntroHover();  // Check hover state when mouse moves
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
