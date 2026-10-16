function setup() {
  createCanvas(756, 1008);
}

function draw() {

  // 색상 설정
  let cyan = color(0, 117, 169);
  let black = color(43, 52, 59);
  let darkBlack = color(62, 68, 71);
  let metal = color(183, 184, 175);
  let clockColor = color(178, 177, 146);


  // 하늘 배경
  background(212, 222, 225);

  // 검은색 큰 구조물
  noStroke();
  fill(darkBlack);

  beginShape();
  vertex(160, 248);
  vertex(292, 248);
  vertex(292, 700);
  vertex(461, 700);
  vertex(461, 248);
  vertex(592, 248);
  vertex(592, 1009);
  vertex(160, 1009);
  endShape(CLOSE);

  fill(black)
  rect(298, 685, 163, 324);
  
  //가운데 청록색 구조물
  noStroke();
  fill(cyan);

  rect(292, 241, 169, 459);


  // 오른쪽 청록색 구조물 (빈틈 및 겹침 수정 완료)
  
  // 1. 가장 밝은 청록색 (상단 & 하단 좌측)
  fill(cyan);
  rect(557, 308, 38, 197);  // 상단 세로 높이 연결 (308~505)
  rect(557, 505, 38, 277);  // 하단 영역 X좌표 맞춤 (557)

  // 2. 중간 청록색 (상단 중앙 & 중간 우측)
  fill(0, 100, 145);
  rect(595, 308, 26, 197);  // Y: 308~505, X: 595~621
  rect(621, 444, 32, 137);  // X: 621~653

  // 3. 진한 청록색 (우측 하단 & 우측 끝)
  fill(0, 85, 125);
  rect(653, 444, 55, 137);  // Y좌표 맞춤 (444)
  rect(621, 581, 87, 141);  // 너비 확장 (621~708)

  // 4. 가장 진한 청록색 (하단 중앙)
  fill(0, 70, 105);
  rect(595, 505, 26, 277);  // X: 595~621, Y: 505~782

  
  // 왼쪽 바깥쪽의 사각형
  noStroke();

  // 윗면
  fill(cyan);
  rect(30, 432, 130, 160);

  // 아랫면
  fill(0, 95, 135);
  rect(47, 573, 100, 90);

    // 가장 바깥쪽의 타원
  fill(clockColor)
  ellipse(37, 542, 28, 134);

  // 닭 그림 뒤쪽의 청록색 구조물
  noStroke();
  fill(cyan);
  rect(141, 306, 51, 423);
  rect(124, 727, 45, 55);

// 얇은 검은색 상자
  noFill();
  stroke(darkBlack);
  strokeWeight(5);

  rect(305, 510, 148, 139);


  // 네 모서리의 작은 못
  stroke(darkBlack);
  strokeWeight(3);

  ellipse(305, 510, 14, 14);
  ellipse(453, 510, 14, 14);
  ellipse(305, 649, 14, 14);
  ellipse(453, 649, 14, 14);


  // 가운데 문틈
  line(379, 510, 379, 649);

   // 시계와 나침반 사이의 금속 기둥
  noStroke();
  fill(metal);

  rect(361, 175, 20, 55);
  ellipse(371, 175, 20, 12);
  ellipse(371, 230, 20, 12);


  // 나침반
  noStroke();
  fill(metal);
  ellipse(371, 112, 180, 70);

  // 나침반 바늘
  stroke(black);
  strokeWeight(4);

  line(310, 112, 432, 112);
  line(371, 60, 371, 164);
  line(330, 75, 412, 149);
  line(330, 149, 412, 75);

  // 나침반 중심
  noStroke();
  fill(black);
  ellipse(371, 112, 18, 18);

  // 나침반 외곽선
  noFill();
  stroke(metal);
  strokeWeight(3);

  ellipse(371, 112, 200, 88);


  // 시계 테두리
  noFill();
  stroke(clockColor);
  strokeWeight(15);

  ellipse(376, 356, 190, 190);


  // 시계판
  noStroke();
  fill(186, 216, 224);

  ellipse(376, 356, 160, 160);


  // 시계 숫자
  fill(black);

  textAlign(CENTER, CENTER);
  textFont("Malgun Gothic");
  textSize(12);

  let centerX = 376;
  let centerY = 356;
  let radius = 80;

  let numbers = [
    "XII", "I", "II", "III",
    "IV", "V", "VI", "VII",
    "VIII", "IX", "X", "XI"
  ];

  for (let i = 0; i < 12; i++) {
    let angle = radians(i * 30 - 90);

    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);

    text(numbers[i], x, y);
  }


  // 시계 바늘 - 6시 정각
  stroke(black);
  strokeWeight(6);

  // 분침 - 12시 방향
  line(376, 356, 376, 282);

  // 시침 - 6시 방향
  strokeWeight(8);
  line(376, 356, 376, 421);

  // 시계 중심점
  noStroke();
  fill(black);
  ellipse(376, 356, 12, 12);

    // 닭이 있는 공간
  noStroke();
  fill(210);
  rect(127, 356, 140, 149);


  // 닭 몸통
  noStroke();
  fill(150, 150, 0, 150);

  beginShape();

  vertex(209, 389);
  vertex(205, 393);
  vertex(201, 405);
  vertex(196, 414);
  vertex(194, 411);
  vertex(189, 421);
  vertex(189, 429);
  vertex(191, 433);
  vertex(195, 430);
  vertex(199, 438);
  vertex(207, 439);
  vertex(208, 435);
  vertex(212, 435);
  vertex(213, 438);
  vertex(220, 438);
  vertex(222, 434);
  vertex(225, 428);
  vertex(226, 435);
  vertex(230, 433);
  vertex(230, 424);
  vertex(227, 414);
  vertex(225, 415);
  vertex(220, 404);
  vertex(218, 394);
  vertex(216, 390);

  endShape(CLOSE);


  // 닭 벼슬
  noStroke();
  fill(255, 0, 0);

  beginShape();

  vertex(210, 387);
  vertex(211, 384);
  vertex(214, 384);
  vertex(215, 388);
  vertex(212, 389);

  endShape(CLOSE);

  ellipse(212, 394, 6, 3);


  // 닭 발판
  noStroke();
  fill(metal);

  beginShape();

  vertex(226, 442);
  vertex(256, 460);
  vertex(226, 474);
  vertex(187, 452);
  vertex(226, 442);
  vertex(256, 460);

  endShape(CLOSE);

// 수탉
  // 유시 글자 위에 배치
  push();
  translate(0, 220);

  stroke(darkBlack);
  strokeWeight(3);
  noFill();


  // 몸통
  beginShape();
  vertex(350, 606);
  vertex(356, 594);
  vertex(369, 587);
  vertex(385, 588);
  vertex(397, 596);
  vertex(402, 608);
  vertex(397, 618);
  vertex(385, 624);
  vertex(367, 623);
  vertex(355, 617);
  vertex(350, 606);
  endShape();


  // 목과 머리
  beginShape();
  vertex(350, 606);
  vertex(344, 595);
  vertex(345, 582);
  vertex(352, 573);
  vertex(363, 571);
  vertex(371, 577);
  vertex(370, 587);
  endShape();


  // 부리
  line(344, 582, 337, 585);
  line(337, 585, 344, 588);


  // 닭 벼슬
  beginShape();
  vertex(351, 573);
  vertex(349, 568);
  vertex(353, 570);
  vertex(356, 565);
  vertex(359, 570);
  vertex(363, 567);
  vertex(365, 574);
  endShape();


  // 눈
  fill(darkBlack);
  ellipse(358, 578, 3, 3);


  // 꼬리
  noFill();
  beginShape();
  vertex(397, 596);
  vertex(407, 585);
  vertex(414, 576);
  vertex(413, 589);
  vertex(421, 581);
  vertex(417, 596);
  vertex(408, 605);
  endShape();


  // 다리
  line(370, 622, 370, 634);
  line(388, 623, 388, 634);


  // 발
  line(370, 634, 364, 637);
  line(370, 634, 376, 637);
  line(388, 634, 382, 637);
  line(388, 634, 394, 637);


  // 닭 날개
  beginShape();
  vertex(363, 593);
  vertex(374, 596);
  vertex(386, 607);
  vertex(377, 613);
  vertex(366, 607);
  vertex(363, 593);
  endShape();

  pop();


  // 유시와 시간 표시
  noStroke();
  fill(metal);

  textAlign(CENTER, CENTER);

  // 첫 번째 줄
  textSize(22);
  text("유시", 378, 917);

  // 두 번째 줄
  textSize(18);
  text("(17~19시)", 378, 937);


  // 설명 문구
  textSize(8);
  text("출제와 성실, 강한 고집을 상징", 378, 979);

}