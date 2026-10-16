// Assignment 3: Button - "Flappy Chicken" v0.3 (SNU palette + landmarks)
// The gold sign at the bottom is the BUTTON: you flap by clicking it.
// Button states: normal / mouseover (lighter + raised) / pressed (darker + pushed down)
// Any key press = reset everything (screen + global variables, including best score)


const USE_RETROPIX = true;
const FONT_FILE = "libraries/PixelifySans-Bold.ttf";
let retro;

function preload() {
  if (USE_RETROPIX) retro = loadFont(FONT_FILE);
}

// ---------- constants ----------
const W = 480, H = 640, GROUND = 560;
const BTN = { x: 130, y: 574, w: 220, h: 56 };
const GAP = 190, PIPE_W = 60, SPEED = 2.2, GRAVITY = 0.25, FLAP = -5.6;
const BIRD_X = 120, PX = 4;

// palette (Pantone values are on-screen approximations; edit the numbers freely)
const PAL = {
  navy:   [0, 24, 113],      // Pantone 2748 C
  sand:   [208, 206, 177],   // Pantone 453 C (approx.)
  gray:   [99, 102, 106],    // Pantone Cool Gray 10 C
  gold:   [168, 132, 74],    // Pantone 874 C (metallic, lightened for screen)
  silver: [138, 141, 143],   // Pantone 877 C (metallic)
  cream:  [250, 240, 215],
  coral:  [232, 106, 80],    // warm accents
  orange: [244, 164, 96],
  pink:   [240, 140, 165]
};

// sky gradients: day -> sunset -> night (changes as the score goes up)
const SKIES = [
  { top: [92, 124, 196], bottom: [236, 230, 205], cloud: [250, 245, 230] },
  { top: [28, 48, 130],  bottom: [244, 150, 90],  cloud: [255, 205, 170] },
  { top: [0, 12, 60],    bottom: [52, 64, 120],   cloud: [104, 110, 138] }
];

// ---------- pixel art ----------
const CHICKEN = [
  ".....RR.....",
  "....WWWW....",
  "...WWKWWYY..",
  "...WWWWWRY..",
  "..WWWWWWWW..",
  ".WWWwwWWWWW.",
  ".WWWwwWWWWW.",
  "..WWWWWWWW..",
  "...WWWWWW...",
  "....Y..Y...."
];
const CHICKEN_UP = [   // wing raised, shown briefly after each flap
  ".....RR.....",
  "....WWWW....",
  "...WWKWWYY..",
  "..wwWWWWRY..",
  ".wwwWWWWWW..",
  ".WWWWWWWWWW.",
  ".WWWWWWWWWW.",
  "..WWWWWWWW..",
  "...WWWWWW...",
  "....Y..Y...."
];
const CHICKEN_COLORS = {
  R: [214, 60, 50], W: [250, 245, 230], w: [222, 212, 185],
  K: [40, 30, 30], Y: [240, 170, 50]
};

const GATE = [
  "..........X.......",
  ".........XX.......",
  ".........XX.......",
  "........X.X.......",
  ".......X..XXXX....",
  "..........X.......",
  "..........XXXX....",
  "..........X.......", // the "샤" symbol, built from blocks
  "....XX....X.......",
  "...X..X...X.......",
  "..X....X..X.......",
  ".X......X.XX......",
  "X.........X......."
];
const LETTER_A = [".XXX.", "X...X", "X...X", "XXXXX", "X...X", "X...X", "X...X"];
const PLUS = ["..X..", "..X..", "XXXXX", "..X..", "..X.."];

// scenery props that drift by (x = position along a looping road of length PROP_LOOP)
const PROP_LOOP = 1300;
const PROPS = [
  { type: "gate", x: 260 },
  { type: "card", x: 700 },
  { type: "donut", x: 1050 }
];

// ---------- global variables ----------
let state, birdY, birdV, pipes, score, best, frames, scrollX;
let puffs, flapT, shownScore;

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  noSmooth();
  textFont(USE_RETROPIX ? retro : "monospace");
  textAlign(CENTER, CENTER);
  resetAll();
}

// full reset: screen AND every global variable
function resetAll() {
  best = 0;
  startRound();
}

// start a fresh round (keeps best score)
function startRound() {
  state = "ready";   // "ready" | "playing" | "over"
  birdY = 280;
  birdV = 0;
  pipes = [];
  score = 0;
  frames = 0;
  scrollX = 0;
  puffs = [];        // feather particles
  flapT = 0;         // wing-up timer
  shownScore = 0;    // smoothed score for the sky colour
}

function draw() {
  frames++;
  if (state !== "over") scrollX += SPEED;
  update();
  shownScore = lerp(shownScore, score, 0.03);

  drawSky();
  drawMountains();
  drawHills();
  drawProps();
  drawNightTint();
  for (let p of pipes) drawPipe(p);
  drawGround();
  drawPuffs();
  drawBird();
  drawHUD();
  drawButton();
  cursor(overBtn() ? HAND : ARROW);
}

// ---------- game logic ----------
function update() {
  if (state === "ready") {
    birdY = 280 + sin(frames * 0.08) * 8;
    return;
  }
  if (state !== "playing") return;

  // If game over, count the frame 
  if (state === "over") {
    freezeTimer++;
    if (freezeTimer > 35) {
      noLoop(); 
    }
    return;
  }

  birdV += GRAVITY;
  birdY += birdV;
  if (birdY < 14) { birdY = 14; birdV = 0; }

  if (frames % 110 === 60) {
    pipes.push({ x: W, gapY: random(200, 430), passed: false });
  }
  for (let p of pipes) {
    p.x -= SPEED;
    if (!p.passed && p.x + PIPE_W < BIRD_X) { p.passed = true; score++; }
  }
  pipes = pipes.filter(p => p.x > -PIPE_W - 20);

  if (hitSomething()) {
    best = max(best, score);
    state = "over";
  }
}

function hitSomething() {
  if (birdY + 14 >= GROUND) return true;
  let bx = BIRD_X - 17, by = birdY - 14, bw = 34, bh = 28;
  for (let p of pipes) {
    let inX = bx + bw > p.x && bx < p.x + PIPE_W;
    if (inX && (by < p.gapY - GAP / 2 || by + bh > p.gapY + GAP / 2)) return true;
  }
  return false;
}

// ---------- sky ----------
function skyPhase() {
  let i = floor(shownScore / 5) % 3;
  return { i: i, j: (i + 1) % 3, f: (shownScore % 5) / 5 };
}

function skyMix(key) {
  let s = skyPhase();
  return lerpColor(color(SKIES[s.i][key]), color(SKIES[s.j][key]), s.f);
}

function drawSky() {
  let top = skyMix("top"), bottom = skyMix("bottom");
  noStroke();
  for (let y = 0; y < GROUND; y += 4) {           // pixel-banded gradient
    fill(lerpColor(top, bottom, y / GROUND));
    rect(0, y, W, 4);
  }
  fill(skyMix("cloud"));
  for (let i = 0; i < 4; i++) {                   // blocky clouds
    let x = ((i * 190 - scrollX * 0.2) % (W + 120) + (W + 120)) % (W + 120) - 60;
    let y = 70 + (i % 2) * 70;
    rect(x, y, 64, 16); rect(x + 12, y - 12, 36, 12); rect(x + 8, y + 16, 48, 8);
  }
}

function drawNightTint() {
  let s = skyPhase();
  let n = s.i === 1 ? s.f : (s.i === 2 ? 1 - s.f : 0);
  noStroke();
  fill(PAL.navy[0], PAL.navy[1], PAL.navy[2], n * 110);
  rect(0, 0, W, GROUND);
}

// ---------- background scenery ----------
function drawMountains() {                         // Gwanak-style rocky peaks
  let off = -((scrollX * 0.12) % 360);
  noStroke();
  for (let k = 0; k < 3; k++) {
    let x0 = off + k * 360;
    fill(PAL.gray);
    beginShape();
    vertex(x0, GROUND); vertex(x0 + 50, 430); vertex(x0 + 85, 455);
    vertex(x0 + 140, 370); vertex(x0 + 200, 450); vertex(x0 + 245, 415);
    vertex(x0 + 290, 460); vertex(x0 + 360, GROUND);
    endShape(CLOSE);
    fill(PAL.silver);                              // lit faces
    triangle(x0 + 140, 370, x0 + 176, 436, x0 + 140, 436);
    triangle(x0 + 245, 415, x0 + 268, 452, x0 + 245, 452);
  }
}

function drawHills() {
  noStroke();
  fill(101, 128, 112);
  for (let i = 0; i < 5; i++) {
    let x = ((i * 150 - scrollX * 0.35) % (W + 300) + (W + 300)) % (W + 300) - 150;
    ellipse(x, GROUND, 260, 150);
  }
  fill(79, 106, 92);
  for (let i = 0; i < 4; i++) {
    let x = ((i * 190 - scrollX * 0.6) % (W + 300) + (W + 300)) % (W + 300) - 150;
    ellipse(x, GROUND + 10, 220, 90);
  }
}

function drawProps() {
  for (let p of PROPS) {
    let x = ((p.x - scrollX * 0.5) % PROP_LOOP + PROP_LOOP) % PROP_LOOP - 100;
    if (x > W + 20) continue;
    if (p.type === "gate") drawGate(x, GROUND - 78);
    if (p.type === "card") drawGradeCard(x, 120 + sin(frames * 0.04) * 6);
    if (p.type === "donut") drawDonut(x, 200 + sin(frames * 0.05 + 2) * 7);
  }
}

function drawMap(map, x, y, px) {                  // fills with the current fill()
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] !== ".") rect(x + c * px, y + r * px, px, px);
    }
  }
}

function drawGate(x, y) {                          // the 샤 landmark
  noStroke();
  fill(PAL.gold);   drawMap(GATE, x + 3, y + 3, 6);
  fill(PAL.navy);   drawMap(GATE, x, y, 6);
}

function drawGradeCard(x, y) {                     // floating "A+" card
  noStroke();
  fill(PAL.gold);   rect(x, y, 70, 50);
  fill(PAL.cream);  rect(x + 3, y + 3, 64, 44);
  fill(PAL.coral);
  drawMap(LETTER_A, x + 10, y + 8, 4);
  drawMap(PLUS, x + 38, y + 16, 4);
}

function drawDonut(x, y) {                         // pixel donut with icing + sprinkles
  noStroke();
  let sprinkle = [PAL.cream, PAL.gold, PAL.navy];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      let d = dist(c + 0.5, r + 0.5, 6, 6);
      if (d > 6 || d < 2.2) continue;
      if (d <= 5 && d >= 2.7) {
        fill((r * 5 + c * 3) % 7 === 0 ? sprinkle[(r + c) % 3] : PAL.pink);
      } else {
        fill(214, 160, 96);
      }
      rect(x + c * 4, y + r * 4, 4, 4);
    }
  }
}

function drawGround() {
  noStroke();
  fill(122, 96, 66);
  rect(0, GROUND, W, H - GROUND);
  fill(96, 138, 92);
  rect(0, GROUND, W, 14);
  fill(70, 110, 76);
  for (let x = -(scrollX % 16); x < W; x += 16) rect(x, GROUND + 14, 4, 4);
}

function drawPipe(p) {
  let top = p.gapY - GAP / 2, bottom = p.gapY + GAP / 2;
  noStroke();
  fill(126, 96, 62);                               // wooden log
  rect(p.x, 0, PIPE_W, top);
  rect(p.x, bottom, PIPE_W, GROUND - bottom);
  fill(92, 68, 42);
  rect(p.x + 8, 0, 4, top);  rect(p.x + 8, bottom, 4, GROUND - bottom);
  rect(p.x + 36, 0, 4, top); rect(p.x + 36, bottom, 4, GROUND - bottom);
  fill(64, 120, 104);                              // leafy caps
  rect(p.x - 8, top - 26, PIPE_W + 16, 26);
  rect(p.x - 8, bottom, PIPE_W + 16, 26);
  fill(112, 172, 140);
  for (let i = 0; i < 4; i++) {
    rect(p.x - 4 + i * 16, top - 22, 8, 6);
    rect(p.x - 4 + i * 16, bottom + 6, 8, 6);
  }
}

// ---------- bird + feathers ----------
function drawPuffs() {
  noStroke();
  for (let p of puffs) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    fill(PAL.cream[0], PAL.cream[1], PAL.cream[2], map(p.life, 0, 24, 0, 255));
    rect(p.x, p.y, 5, 5);
  }
  puffs = puffs.filter(p => p.life > 0);
  if (flapT > 0) flapT--;
}

function drawBird() {
  push();
  translate(BIRD_X, birdY);
  rotate(constrain(birdV * 0.06, -0.5, 0.9));
  noStroke();
  let sprite = flapT > 0 ? CHICKEN_UP : CHICKEN;
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      let ch = sprite[r][c];
      if (ch === ".") continue;
      fill(CHICKEN_COLORS[ch]);
      rect(-24 + c * PX, -20 + r * PX, PX, PX);
    }
  }
  pop();
}

// ---------- HUD ----------

function drawHUD() {
  textSize(12);
  shadowText("PRESS ANY KEY = RESET ALL", W / 2, 28);

  textSize(52);
  shadowText(score, W / 2, 85);

  if (state === "ready") {
    textSize(14);
    shadowText("▼ CLICK THE SIGN TO FLAP ▼", W / 2, 160);
  } else if (state === "over") {
    noStroke();
    fill(0, 0, 0, 140);
    rect(W / 2 - 150, 185, 300, 85, 6);

    textSize(26);
    shadowText("GAME OVER", W / 2, 212);

    textSize(15);
    shadowText("SCORE: " + score + "   |   BEST: " + best, W / 2, 248);
  }
}

function shadowText(str, x, y) {
  fill(PAL.navy);  text(str, x + 1, y + 1);
  fill(PAL.cream); text(str, x, y);
}

// ---------- the BUTTON ----------
function overBtn() {
  return mouseX > BTN.x && mouseX < BTN.x + BTN.w &&
         mouseY > BTN.y && mouseY < BTN.y + BTN.h;
}

// Fixed button text centering and optical shadow balance
function drawButton() {
  let over = overBtn();
  let pressed = over && mouseIsPressed;
  let lift = pressed ? 4 : (over ? -3 : 0);
  let body = pressed ? color(124, 96, 52) : (over ? color(208, 170, 100) : color(PAL.gold));
  let shine = pressed ? color(140, 110, 62) : (over ? color(226, 192, 126) : color(190, 154, 92));
  let edge = color(PAL.navy);

  noStroke();
  if (!pressed) { fill(0, 0, 0, 70); rect(BTN.x + 4, BTN.y + 8, BTN.w, BTN.h); }
  fill(edge);
  rect(BTN.x, BTN.y + lift, BTN.w, BTN.h);
  fill(body);
  rect(BTN.x + 4, BTN.y + lift + 4, BTN.w - 8, BTN.h - 8);
  fill(shine);
  rect(BTN.x + 4, BTN.y + lift + 4, BTN.w - 8, (BTN.h - 8) / 2);
  fill(edge);
  rect(BTN.x + 10, BTN.y + lift + 10, 6, 6);
  rect(BTN.x + BTN.w - 16, BTN.y + lift + 10, 6, 6);
  rect(BTN.x + 10, BTN.y + lift + BTN.h - 16, 6, 6);
  rect(BTN.x + BTN.w - 16, BTN.y + lift + BTN.h - 16, 6, 6);

  let label = state === "ready" ? "START" : (state === "playing" ? "FLAP!" : "RETRY");
  textSize(26);
  
  let textX = BTN.x + BTN.w / 2;
  let textY = BTN.y + lift + BTN.h / 2 - 1; 
  
  fill(edge);       text(label, textX + 1, textY + 1);
  fill(PAL.cream);  text(label, textX, textY);
}

// ---------- input ----------
function mousePressed() {
  if (!overBtn()) return;
  if (state === "over") {
    startRound();
  } else {
    state = "playing";
    birdV = FLAP;
    flapT = 8;
    for (let i = 0; i < 4; i++) {
      puffs.push({ x: BIRD_X - 20, y: birdY + 6, vx: random(-1.6, -0.4), vy: random(-0.5, 0.8), life: 24 });
    }
  }
}

// any key -> back to the very first state
function keyPressed() {
  resetAll();
}