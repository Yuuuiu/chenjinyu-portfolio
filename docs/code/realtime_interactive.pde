import java.util.Date;
import java.text.SimpleDateFormat;

/**
 * RECONSTRUCTION 15.0 - [ 数字织锦：无限山河 ]
 * 1. 按 1 录屏 | 2 壮锦 | 3 衣服 | 4 无限平铺波浪
 * 2. C 键换色 | S 键截屏 | R 键重置
 */

int N = 150000; // 提升粒子数至15万，确保平铺密度
float[] px, py, vx, vy, ax, ay;
int[] pColors;

PImage imgZhuang, imgClothes, bgPattern;
PFont customFont;

float damping = 0.92;      
float elasticity = 0.08;   
float growthRadius = 0;    
float targetGrowthRadius = 1500;
int mode = 0; // 0:壮锦, 1:衣服, 2:平铺波浪
int themeIndex = 0;

// 色彩与录制
color cTitle, cAccent, cLine, cSub, cBgLine; 
boolean isRecording = false;

void setup() {
  size(1080, 1960, P2D); 
  smooth(8);
  
  px = new float[N]; py = new float[N];
  vx = new float[N]; vy = new float[N];
  ax = new float[N]; ay = new float[N];
  pColors = new int[N];
  
  imgZhuang = loadImage("9.png");
  imgClothes = loadImage("28.png");
  
  // 提取线条纹路作为背景 (去照片感)
  bgPattern = extractPureLines(imgZhuang);
  
  try {
    customFont = createFont("hanyiliulizhuan65u.ttf", 100);
  } catch (Exception e) {
    customFont = createFont("SansSerif", 100);
  }
  
  updateTheme(); 
}

void draw() {
  background(2, 3, 7); 

  // --- 1. 背景：动态线条纹路 ---
  drawAmbientPattern();

  // --- 2. 核心：交互粒子层 ---
  updateAndRenderParticles();

  // --- 3. UI 文案层 ---
  drawPosterLayout();
  
  // --- 4. 录制逻辑 ---
  if (isRecording) {
    saveFrame("video_output/frame_#####.png");
    drawRECIndicator();
  }
}

// ===================== 核心算法：波浪平铺与物理 =====================

void updateAndRenderParticles() {
  growthRadius = lerp(growthRadius, targetGrowthRadius, 0.015);
  pushMatrix();
  translate(width/2, height/2 - 100); 
  
  strokeWeight(2.1);
  float mx = mouseX - width/2;
  float my = mouseY - (height/2 - 100);

  for (int i = 0; i < N; i++) {
    float dToCenter = dist(ax[i], ay[i], 0, 0);
    float activeF = (dToCenter < growthRadius) ? constrain(map(growthRadius - dToCenter, 0, 350, 0, 1), 0, 1) : 0;

    // 计算波动 (如果是模式2，则持续晃动)
    float waveX = 0, waveY = 0;
    if (mode == 2) {
       waveX = sin(frameCount * 0.03 + ay[i] * 0.005) * 20;
       waveY = cos(frameCount * 0.02 + ax[i] * 0.005) * 15;
    }

    float tx = (ax[i] + waveX) * activeF;
    float ty = (ay[i] + waveY) * activeF;

    // 鼠标避让交互
    float dm = dist(px[i], py[i], mx, my);
    if (dm < 220 && activeF > 0.5) {
      float f = map(dm, 0, 220, 5.0, 0);
      float ang = atan2(py[i] - my, px[i] - mx);
      vx[i] += cos(ang) * f; vy[i] += sin(ang) * f;
    }

    vx[i] += (tx - px[i]) * elasticity;
    vy[i] += (ty - py[i]) * elasticity;
    vx[i] *= damping; vy[i] *= damping;
    px[i] += vx[i]; py[i] += vy[i];

    stroke(pColors[i], activeF * 255);
    point(px[i], py[i]);
  }
  popMatrix();
}

// ===================== 采样逻辑：平铺与衣服提取 =====================

void setMode(int m) {
  mode = m;
  growthRadius = 0;
  PImage ref;
  if (mode == 1) ref = imgClothes;
  else ref = imgZhuang;
  ref.loadPixels();

  for (int i = 0; i < N; i++) {
    int rx, ry; color c;
    
    if (mode == 2) { // 【模式4：无限平铺模式】
      // 模拟 30.png 的菱形矩阵平铺
      int cols = 3; 
      int rows = 4;
      int perTile = N / (cols * rows);
      int tileIdx = i / perTile;
      int col = tileIdx % cols;
      int row = tileIdx / cols;
      
      // 平铺坐标计算
      float offsetX = (col - (cols-1)/2.0) * 450;
      float offsetY = (row - (rows-1)/2.0) * 450;
      
      rx = (int)random(imgZhuang.width);
      ry = (int)random(imgZhuang.height);
      c = imgZhuang.pixels[ry * imgZhuang.width + rx];
      
      ax[i] = map(rx, 0, imgZhuang.width, -200, 200) + offsetX;
      ay[i] = map(ry, 0, imgZhuang.height, -200, 200) + offsetY;
      
    } else { // 【普通单图模式：壮锦或衣服】
      boolean found = false; int attempts = 0;
      rx=0; ry=0; c=0;
      while (!found && attempts < 100) {
        rx = (int)random(ref.width); ry = (int)random(ref.height);
        c = ref.pixels[ry * ref.width + rx];
        // 衣服模式下过滤背景更严格
        float threshold = (mode == 1) ? 60 : 20;
        if (brightness(c) > threshold && brightness(c) < 250) found = true;
        attempts++;
      }
      ax[i] = map(rx, 0, ref.width, -500, 500);
      ay[i] = map(ry, 0, ref.height, -500, 500);
    }

    px[i] = 0; py[i] = 0;
    pColors[i] = (themeIndex == 0) ? c : applyFullColorTheme(c);
  }
}

color applyFullColorTheme(color original) {
  float b = brightness(original) / 255.0;
  float cb = constrain(map(b, 0.1, 0.8, 0, 1), 0, 1);
  if (themeIndex == 1) return lerpColor(#330000, #FFD700, cb); 
  if (themeIndex == 2) return lerpColor(#001122, #00FFFF, cb); 
  if (themeIndex == 3) return lerpColor(#110022, #FF00FF, cb); 
  return original;
}

// ===================== UI、底纹与排版 =====================

void drawAmbientPattern() {
  pushMatrix();
  translate(width/2, height/2);
  imageMode(CENTER);
  rotate(frameCount * 0.001);
  tint(cBgLine, 40); 
  image(bgPattern, 0, 0, 2000, 2000); 
  popMatrix();
}

void drawPosterLayout() {
  blendMode(BLEND);
  textFont(customFont);
  fill(cTitle); textAlign(CENTER, TOP); textSize(110);
  text("ZHUANG BROCADE", width/2, 85);
  textAlign(LEFT, TOP); textSize(32); fill(cTitle, 200);
  text("广西壮锦 王朝贡品", 85, 210);
  fill(cAccent); textAlign(RIGHT, TOP); textSize(145);
  text("壮锦", width-85, 190);
  fill(cTitle); textAlign(LEFT, BOTTOM);
  textSize(115); text("民族 · 记忆", 85, height-75); 
  textSize(110); text("源于汉代", 85, height-200);
  textAlign(RIGHT, BOTTOM); fill(cSub, 180); textSize(19);
  text("THE FABRIC IS DELICATE AND SOFT\nMATURE SKILL, LISTED AS TRIBUTE\nBY THE DYNASTY", width-85, height-185);
  textSize(34); fill(cTitle);
  text("广西壮锦\n王朝贡品", width-85, height-75);
  stroke(cLine, 220); strokeWeight(3);
  line(40, 200, width-40, 200);
}

void updateTheme() {
  if (themeIndex == 0) { cTitle = #FFFFFF; cAccent = #FFFFFF; cLine = #FFFFFF; cSub = #FFFFFF; cBgLine = color(150); }
  else if (themeIndex == 1) { cTitle = #F5E8D3; cAccent = #FFD700; cLine = #FFCC33; cSub = #B22222; cBgLine = #662222; }
  else if (themeIndex == 2) { cTitle = #E0FFFF; cAccent = #00FFFF; cLine = #00FFFF; cSub = #3A70B8; cBgLine = #1A3050; }
  setMode(mode); 
}

PImage extractPureLines(PImage src) {
  PImage out = createImage(src.width, src.height, ARGB);
  src.loadPixels();
  for (int i = 0; i < src.pixels.length; i++) {
    float b = brightness(src.pixels[i]);
    if (b > 150) out.pixels[i] = color(255, map(b, 150, 255, 0, 180)); 
    else out.pixels[i] = color(0, 0); 
  }
  out.updatePixels();
  return out;
}

void drawRECIndicator() {
  fill(255, 0, 0, 200 + sin(frameCount*0.1)*55);
  noStroke(); ellipse(50, 50, 20, 20);
  fill(255); textSize(16); textAlign(LEFT, CENTER);
  text("REC", 70, 50);
}

void keyPressed() {
  if (key == '1') isRecording = !isRecording;
  if (key == '2') setMode(0);
  if (key == '3') setMode(1);
  if (key == '4') setMode(2); // 切换到无限平铺模式
  if (key == 's' || key == 'S') {
    String ts = new SimpleDateFormat("yyyyMMdd-HHmmss").format(new Date());
    saveFrame("output/Poster_" + ts + ".png");
  }
  if (key == 'c' || key == 'C') {
    themeIndex = (themeIndex + 1) % 3;
    updateTheme();
  }
  if (key == 'r' || key == 'R') growthRadius = 0;
}

void mousePressed() {
  for (int i = 0; i < N; i++) {
    vx[i] += random(-100, 100);
    vy[i] += random(-100, 100);
  }
}
