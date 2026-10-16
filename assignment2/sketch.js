let state = "normal";
let clickTimes = [];
let lastHurtClick = 0;
 
let heartSize = 140;
let hurtShake = 0;
let healProgress = 0;
let hurtIntensity = 0;
 
let heartUnitPts = [];
let stars = [];
let floatHearts = [];
let bloodDrops = [];
let crackPath = [];
let heartPoly = [];
 
let bgSeed;
 
let constellationPts = [
  [400,55], [440,80], [475,60], [505,95], [530,75]
];
 
let healQuotes = [
  { en: "Time heals what words cannot.", ko: "시간은 말로 할 수 없는 것도 치유해요." },
  { en: "Even broken hearts learn to beat again.", ko: "부서진 마음도 다시 뛰는 법을 배워요." },
  { en: "Love returns slowly, like morning light.", ko: "사랑은 아침 햇살처럼 천천히 돌아와요." }
];
 
let currentQuote = healQuotes[0];
 
// ---------- ORIGINAL COLOR PALETTE ----------
let C = {
  cream:    "#F2D6C1",
  pink:     "#FABBE7",
  purple:   "#9F83D0",
  rose:     "#E887B5",
  lavender: "#B896D5",
  lilac:    "#E5B2ED",
  violet:   "#C58DE4"
};
 
function setup() {
  createCanvas(600, 600);
  bgSeed = random(1000);
  textFont("Malgun Gothic");
 
  for (let i = 0; i < 130; i++) {
    stars.push({
      x: random(width), y: random(height * 0.85),
      size: random(1, 3), alpha: random(80, 180),
      phase: random(TWO_PI), sp: random(0.02, 0.05),
      type: random() < 0.15 ? "diamond" : "dot"
    });
  }
 
  for (let i = 0; i < 9; i++) {
    floatHearts.push({
      x: random(width), y: height + random(300),
      sp: random(0.3, 0.8), sz: random(9, 20), drift: random(TWO_PI)
    });
  }
 
  heartUnitPts = buildHeartPoly(1, 40);
  heartPoly = buildHeartPoly(heartSize, 40);
 
  noStroke();
}
 
// ---------- MAIN DRAW ----------
function draw() {
  drawDreamGradient();
  drawCentralGlow();
  drawMoon();
  drawStars();
  drawConstellation();
  drawFloatingHearts();
  drawDarkOverlay();
 
  push();
  translate(width / 2, height / 2);
  drawHeartByState();
  pop();
 
  drawVignette();
  drawDecorativeFrame();
 
  updateState();
  drawHint();
}
 
// ---------- BACKGROUND ----------
function drawDreamGradient() {
  noStroke();
  let top = color(C.purple);
  let mid = color(C.lilac);
  let bottom = color(C.pink);
 
  for (let y = 0; y < height; y += 5) {
    let n = y / height;
    let c = n < 0.55
      ? lerpColor(top, mid, n / 0.55)
      : lerpColor(mid, bottom, (n - 0.55) / 0.45);
    fill(red(c), green(c), blue(c), 255);
    rect(0, y, width, 5);
  }
}
 
function drawCentralGlow() {
  noStroke();
  let breathe = 1 + sin(frameCount * 0.02) * 0.06;
  for (let r = 420; r > 80; r -= 30) {
    let alpha = map(r, 420, 80, 0, 7);
    fill(242, 214, 193, alpha);
    ellipse(width / 2, height / 2, r * breathe);
  }
}
 
function drawMoon() {
  push();
  translate(95, 95 + sin(frameCount * 0.015) * 5);
  for (let i = 6; i > 0; i--) { fill(242, 214, 193, 9); circle(0, 0, 70 + i * 14); }
  fill(C.cream); circle(0, 0, 64);
  fill(C.purple); circle(20, -12, 64);
  fill(C.cream);
  drawDiamondStar(-42, -38, 4);
  drawDiamondStar(40, 28, 3.5);
  pop();
}
 
function drawStars() {
  for (let s of stars) {
    s.phase += s.sp;
    let alpha = s.alpha + sin(s.phase) * 50;
    fill(242, 214, 193, alpha);
    if (s.type === "dot") circle(s.x, s.y, s.size);
    else drawDiamondStar(s.x, s.y, s.size * 2);
  }
}
 
function drawDiamondStar(x, y, size) {
  beginShape();
  vertex(x, y - size);
  vertex(x + size * 0.35, y);
  vertex(x, y + size);
  vertex(x - size * 0.35, y);
  endShape(CLOSE);
}
 
function drawConstellation() {
  for (let i = 0; i < constellationPts.length - 1; i++) {
    let a = constellationPts[i], b = constellationPts[i + 1];
    stroke(242, 214, 193, 20);
    strokeWeight(1);
    line(a[0], a[1], b[0], b[1]);
  }
  noStroke();
  for (let i = 0; i < constellationPts.length; i++) {
    let p = constellationPts[i];
    let alpha = 70 + sin(frameCount * 0.05 + i) * 40;
    fill(242, 214, 193, alpha);
    circle(p[0], p[1], 3);
  }
}
 
function drawFloatingHearts() {
  for (let fh of floatHearts) {
    fh.y -= fh.sp;
    if (fh.y < -20) { fh.y = height + 20; fh.x = random(width); }
    let x = fh.x + sin(frameCount * 0.02 + fh.drift) * 14;
    let y = fh.y + cos(frameCount * 0.018 + fh.drift) * 8;
    fill(232, 135, 181, 90);
    drawHeart(x, y, fh.sz, false, 1.2);
  }
}
 
function drawDarkOverlay() {
  let alpha = min(hurtIntensity * 175, 235);
  if (alpha > 1) { fill(40, 20, 45, alpha); rect(0, 0, width, height); }
}
 
function drawVignette() {
  noStroke();
  for (let i = 0; i < 10; i++) {
    fill(159, 131, 208, 7);
    rect(i * 6, i * 6, width - i * 12, height - i * 12, 10);
  }
}
 
function drawDecorativeFrame() {
  let breathe = 55 + sin(frameCount * 0.03) * 15;
  noFill();
  stroke(229, 178, 237, breathe);
  strokeWeight(2);
  rect(18, 18, width - 36, height - 36, 15);
  strokeWeight(1);
  rect(28, 28, width - 56, height - 56, 12);
  noStroke();
  fill(242, 214, 193, 90);
  textAlign(CENTER, CENTER);
  let sp = 18 + sin(frameCount * 0.04) * 2;
  textSize(sp);
  text("✦", 35, 35);
  text("✦", width - 35, 35);
  text("✦", 35, height - 35);
  text("✦", width - 35, height - 35);
}
 
// ---------- HEART SHAPE ----------
function drawHeart(x, y, size, outline, minW) {
  push();
  translate(x, y);
  if (outline) {
    stroke(110, 70, 120, 220);
    strokeWeight(max(minW || 2, size * 0.03));
  } else {
    noStroke();
  }
  beginShape();
  for (let p of heartUnitPts) vertex(p.x * size, p.y * size);
  endShape(CLOSE);
  pop();
}
 
function buildHeartPoly(size, steps) {
  let pts = [];
  let p0 = { x: 0, y: size * 0.35 };
  let c1 = { x: -size * 0.7, y: -size * 0.1 };
  let c2 = { x: -size * 0.5, y: -size * 0.65 };
  let p1 = { x: 0, y: -size * 0.3 };
  let c3 = { x: size * 0.5, y: -size * 0.65 };
  let c4 = { x: size * 0.7, y: -size * 0.1 };
  let p2 = { x: 0, y: size * 0.35 };
 
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    pts.push({ x: bezierPoint(p0.x, c1.x, c2.x, p1.x, t), y: bezierPoint(p0.y, c1.y, c2.y, p1.y, t) });
  }
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    pts.push({ x: bezierPoint(p1.x, c3.x, c4.x, p2.x, t), y: bezierPoint(p1.y, c3.y, c4.y, p2.y, t) });
  }
  return pts;
}
 
function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
    if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi)) inside = !inside;
  }
  return inside;
}
 
function beatPulse(t, period) {
  let ph = (t % period) / period;
  return exp(-pow((ph - 0.08) * 18, 2)) + exp(-pow((ph - 0.22) * 18, 2)) * 0.55;
}
 
// ---------- HEART STATES ----------
function drawHeartByState() {
  if (state === "normal") drawNormal();
  else if (state === "loved") drawLoved();
  else if (state === "hurt") drawHurt();
  else if (state === "healing") drawHealing();
}
 
function drawNormal() {
  let b = beatPulse(frameCount / 60, 0.9);
  let s = 1 + b * 0.09;
 
  for (let i = 4; i > 0; i--) {
    fill(229, 178, 237, 7);
    drawHeart(0, 0, (heartSize + i * 14) * s, false);
  }
 
  fill(C.rose);
  drawHeart(0, 0, heartSize * s, true);
 
  fill(242, 214, 193, 120);
  drawHeart(-heartSize * 0.15, -heartSize * 0.12, heartSize * 0.32 * s, false);
}
 
function drawLoved() {
  let b = beatPulse(frameCount / 60, 1.1);
  let s = 1 + b * 0.07;
  let glow = 160 + sin(frameCount * 0.05) * 70;
 
  push();
  blendMode(ADD);
 
  for (let i = 10; i > 0; i--) {
    let a = map(i, 10, 1, 3, 35);
    fill(242, 214, 193, a);
    drawHeart(0, 0, (heartSize + i * 16) * s, false);
  }
 
  for (let i = 0; i < 16; i++) {
    let a = frameCount * 0.02 + i;
    let r = 100 + sin(frameCount * 0.04 + i) * 25;
    fill(242, 214, 193, glow);
    circle(cos(a) * r, sin(a) * r, 5);
  }
 
  pop();
 
  fill(C.rose);
  drawHeart(0, 0, heartSize * s, true);
 
  fill(242, 214, 193, 140);
  drawHeart(-heartSize * 0.15, -heartSize * 0.12, heartSize * 0.28 * s, false);
}
 
function drawHurt() {
  hurtShake = min(hurtShake + 0.02 + hurtIntensity * 0.02, 1.6);
  let shakeMag = 3 + hurtIntensity * 10;
 
  push();
  translate(random(-shakeMag, shakeMag) * hurtShake, random(-shakeMag, shakeMag) * hurtShake);
 
  fill(C.violet);
  drawHeart(-4, 2, heartSize * 0.97, true);
 
  stroke(80, 50, 100, 235);
  strokeWeight(2);
  for (let seg of crackPath) {
    line(
      seg.x1 + random(-1, 1) * hurtShake, seg.y1 + random(-1, 1) * hurtShake,
      seg.x2 + random(-1, 1) * hurtShake, seg.y2 + random(-1, 1) * hurtShake
    );
  }
  noStroke();
 
  if (frameCount % 3 === 0 && bloodDrops.length < 50) {
    bloodDrops.push({
      x: random(-32, 32), y: random(20, 60),
      vy: random(1.2, 2.8 + hurtIntensity * 2),
      sz: random(3, 8), a: random(160, 230)
    });
  }
 
  for (let d of bloodDrops) {
    d.y += d.vy;
    d.x += random(-0.3, 0.3);
    fill(232, 135, 181, d.a);
    rect(d.x, d.y, d.sz, d.sz * 1.7);
  }
  bloodDrops = bloodDrops.filter(d => d.y < 170);
 
  pop();
}
 
function drawHealing() {
  healProgress = min(healProgress + 0.0045, 1);
  let ease = 1 - pow(1 - healProgress, 3);
  let haloPulse = 0.6 + 0.4 * (sin(frameCount * 0.08) * 0.5 + 0.5);
 
  fill(242, 214, 193, 90 * (1 - ease) * haloPulse);
  circle(0, 0, heartSize + 80 + sin(frameCount * 0.05) * 8);
 
  let bri = lerp(48, 88, ease);
  let sat = lerp(35, 78, ease);
  let b = beatPulse(frameCount / 60, 0.9) * ease;
 
  fill(232, 135, 181);
  drawHeart(0, 0, heartSize * (1 + b * 0.08), true);
 
  fill(242, 214, 193, 50 * ease);
  drawHeart(-heartSize * 0.15, -heartSize * 0.12, heartSize * 0.28, false);
 
  let crackW = lerp(3, 0, ease);
  let crackA = lerp(230, 0, ease);
  if (crackA > 2) {
    stroke(80, 50, 100, crackA);
    strokeWeight(max(0.3, crackW));
    for (let seg of crackPath) line(seg.x1, seg.y1, seg.x2, seg.y2);
    noStroke();
  }
 
  for (let i = 0; i < 6; i++) {
    let a = frameCount * 0.015 + i * 1.2;
    let r = 90 + sin(frameCount * 0.03 + i) * 15;
    fill(242, 214, 193, 120 * (1 - ease));
    circle(cos(a) * r, sin(a) * r * 0.9 - 10, 3);
  }
}
 
// ---------- CRACK GENERATION ----------
function branchCrack(segs, x, y, angle, len, depth) {
  if (depth <= 0 || len < 4) return;
 
  let nx = x + cos(angle) * len;
  let ny = y + sin(angle) * len;
  let tries = 0;
 
  while (!pointInPoly(nx, ny, heartPoly) && len > 3 && tries < 6) {
    len *= 0.6;
    nx = x + cos(angle) * len;
    ny = y + sin(angle) * len;
    tries++;
  }
  if (!pointInPoly(nx, ny, heartPoly)) return;
 
  segs.push({ x1: x, y1: y, x2: nx, y2: ny });
 
  branchCrack(segs, nx, ny, angle + random(-0.6, 0.6), len * 0.6, depth - 1);
  if (random() < 0.5) {
    branchCrack(segs, nx, ny, angle + random(0.4, 1.2) * (random() < 0.5 ? 1 : -1), len * 0.45, depth - 2);
  }
}
 
function generateCrack() {
  let segs = [];
  let origins = 4;
 
  for (let k = 0; k < origins; k++) {
    let ox, oy, tries = 0;
    do {
      ox = random(-heartSize * 0.5, heartSize * 0.5);
      oy = random(-heartSize * 0.5, heartSize * 0.3);
      tries++;
    } while (!pointInPoly(ox, oy, heartPoly) && tries < 25);
 
    if (!pointInPoly(ox, oy, heartPoly)) continue;
    branchCrack(segs, ox, oy, random(TWO_PI), heartSize * 0.16, 3);
  }
  return segs;
}
 
// ---------- STATE / INPUT ----------
function updateState() {
  let d = dist(mouseX, mouseY, width / 2, height / 2);
 
  if (state === "normal" && d < heartSize * 0.75) state = "loved";
  else if (state === "loved" && d > heartSize * 1.1) state = "normal";
 
  if (state === "hurt") {
    hurtIntensity = max(0, hurtIntensity - 0.0015);
    if (millis() - lastHurtClick > 1600) {
      state = "healing";
      healProgress = 0;
      currentQuote = random(healQuotes);
    }
  }
 
  if (state === "healing") {
    hurtIntensity = max(0, hurtIntensity - 0.012);
    if (healProgress >= 1) {
      state = "normal";
      hurtShake = 0;
      bloodDrops = [];
      clickTimes = [];
      crackPath = [];
    }
  }
}
 
function mousePressed() {
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  if (d < heartSize) {
    let now = millis();
 
    if (state !== "hurt") {
      clickTimes.push(now);
      clickTimes = clickTimes.filter(tm => now - tm < 900);
      lastHurtClick = now;
 
      if (clickTimes.length >= 3) {
        state = "hurt";
        hurtShake = 0;
        hurtIntensity = 0.5;
        crackPath = generateCrack();
      }
    } else {
      lastHurtClick = now;
      hurtIntensity = min(hurtIntensity + 0.35, 1.6);
      if (crackPath.length < 110) crackPath = crackPath.concat(generateCrack());
    }
  }
}
 
// ---------- USER FEEDBACK ----------
function drawHint() {
  fill(255, 245, 245, 210);
  textAlign(CENTER);
 
  if (state === "hurt") {
    textSize(13);
    text("please, be gentle... 💔", width / 2, 552);
    textSize(12);
    text("제발 살살 만져주세요", width / 2, 570);
  } else if (state === "healing") {
    textSize(12);
    text(currentQuote.en, width / 2, 552);
    text(currentQuote.ko, width / 2, 570);
  } else {
    textSize(13);
    text("touch gently ♡", width / 2, 552);
    text("부드럽게 만져주세요", width / 2, 570);
  }
}