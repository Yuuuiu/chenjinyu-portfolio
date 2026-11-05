import java.util.Date;
import java.text.SimpleDateFormat;
import processing.sound.*;

/**
 * RECONSTRUCTION - 展厅沉浸式星空版 (增加按'1'录制功能)
 */

int N = 150000;
float[] px = new float[N], py = new float[N];
float[] ax = new float[N], ay = new float[N];
float[] vx = new float[N], vy = new float[N];
int[] pColors = new int[N];
float[] pType = new float[N]; // 0: 主体(稳固) 1: 装饰(跳动)

PImage img;
PFont customFont;
SoundFile music;
Amplitude amp;
FFT fft;
int bands = 512;
float[] spectrum = new float[bands];

float growthRadius = 0;
float damping = 0.88;
float elasticity = 0.15;

// --- 星空系统 ---
int numStars = 300;
float[] starX = new float[numStars];
float[] starY = new float[numStars];
float[] starPhase = new float[numStars];
float[] starSize = new float[numStars];

// --- 录制系统 ---
boolean isRecording = false;

void setup() {
  size(1920, 1080, P2D);
  smooth(8);
  background(4, 5, 12);

  // 1. 加载资源 (请确保文件名一致)
  img = loadImage("3.png"); 
  
  try {
    music = new SoundFile(this, "bgm.mp3");
    music.loop();
    amp = new Amplitude(this);
    amp.input(music);
    fft = new FFT(this, bands);
    fft.input(music);
  } catch (Exception e) {
    println("Music Error: Check data folder.");
  }

  try {
    customFont = createFont("hanyiliulizhuan65u.ttf", 100);
  } catch (Exception e) {
    customFont = createFont("SansSerif-Bold", 100);
  }

  samplePrecisePixels();

  // 初始化粒子从中心爆发
  for (int i = 0; i < N; i++) {
    px[i] = width / 2; py[i] = height / 2;
  }
  
  // 初始化星空
  for(int i = 0; i < numStars; i++){
    starX[i] = random(width);
    starY[i] = random(height);
    starPhase[i] = random(TWO_PI);
    starSize[i] = random(1.5, 4.5);
  }
}

void draw() {
  // 视觉残影/拖尾的展厅迷幻感
  noStroke();
  fill(4, 5, 12, 60); 
  rect(0, 0, width, height);

  float vol = (amp != null) ? amp.analyze() : 0;
  if (fft != null) fft.analyze(spectrum);
  float bass = (spectrum[1] + spectrum[2] + spectrum[3]) * 1.5;

  // 展厅中心聚光灯呼吸效果
  drawSpotlight(vol);

  // 背景星空闪烁
  drawStars(vol);
  
  // 更新与渲染主体粒子
  renderParticles(vol, bass);

  // 海报排版 UI
  drawPosterUI(vol);
  
  // ===================== 录制功能逻辑 =====================
  if (isRecording) {
    // 绘制右上角 REC 录制提示 (带有呼吸闪烁效果)
    float recAlpha = map(sin(frameCount * 0.1), -1, 1, 100, 255);
    noStroke();
    fill(255, 50, 50, recAlpha);
    ellipse(width - 160, 90, 25, 25);
    
    fill(255, recAlpha);
    textFont(customFont != null ? customFont : createFont("SansSerif", 30));
    textSize(35);
    textAlign(LEFT, CENTER);
    text("REC", width - 135, 85);

    // 重点：将当前帧保存到 sketch文件夹下的 video_output 文件夹中
    // 命名格式为 frame_000001.png, frame_000002.png ...
    saveFrame("video_output/frame_######.png"); 
  }
}

// ===================== 展厅中心呼吸聚光灯 =====================
void drawSpotlight(float vol) {
  noStroke();
  for (int r = 800; r > 0; r -= 50) {
    float alpha = map(r, 0, 800, 5 + vol * 20, 0);
    fill(40, 50, 100, alpha); // 深邃的幽蓝色调
    ellipse(width/2, height/2, r, r);
  }
}

// ===================== 星空闪烁 =====================
void drawStars(float vol) {
  noStroke();
  float highFreq = spectrum[100] * 500; 
  
  for(int i = 0; i < numStars; i++){
    float twinkle = sin(frameCount * 0.05 + starPhase[i]);
    float currentAlpha = map(twinkle, -1, 1, 50, 255) + highFreq * 50;
    
    fill(255, currentAlpha);
    float sSize = starSize[i] + vol * 3; 
    ellipse(starX[i], starY[i], sSize, sSize);
    
    if(twinkle > 0.9) {
      stroke(255, currentAlpha * 0.5);
      strokeWeight(1);
      line(starX[i] - sSize*2, starY[i], starX[i] + sSize*2, starY[i]);
      line(starX[i], starY[i] - sSize*2, starX[i], starY[i] + sSize*2);
      noStroke();
    }
  }
}

// ===================== 粒子动力学 =====================
void renderParticles(float vol, float bass) {
  growthRadius = lerp(growthRadius, 3000, 0.02);

  for (int i = 0; i < N; i++) {
    float dToTarget = dist(ax[i], ay[i], width/2, height/2);
    if (dToTarget > growthRadius) continue;

    if (pType[i] == 1) { 
      if (bass > 0.05) {
        float ang = atan2(py[i] - height/2, px[i] - width/2);
        vx[i] += cos(ang) * bass * 50;
        vy[i] += sin(ang) * bass * 50;
      }
      vx[i] += random(-spectrum[i%bands]*100, spectrum[i%bands]*100);
    } else {
      vx[i] += random(-vol*2, vol*2);
      vy[i] += random(-vol*2, vol*2);
    }

    float currentElasticity = (pType[i] == 0) ? 0.6 : elasticity;
    
    vx[i] += (ax[i] - px[i]) * currentElasticity;
    vy[i] += (ay[i] - py[i]) * currentElasticity;
    vx[i] *= damping;
    vy[i] *= damping;
    px[i] += vx[i];
    py[i] += vy[i];

    stroke(pColors[i], 240);
    float sw = (pType[i] == 0) ? 1.5 : (2.0 + vol * 15);
    strokeWeight(sw);
    point(px[i], py[i]);
  }
}

// ===================== 采样：等比且锁定主体 =====================
void samplePrecisePixels() {
  img.loadPixels();
  float imgRatio = img.width / (float)img.height;
  float canvasRatio = width / (float)height;
  float dW, dH;
  if (imgRatio > canvasRatio) { dW = width * 0.92; dH = dW / imgRatio; } 
  else { dH = height * 0.92; dW = dH * imgRatio; }
  
  float startX = (width - dW) / 2;
  float startY = (height - dH) / 2;

  for (int i = 0; i < N; i++) {
    boolean found = false;
    int rx=0, ry=0; color c=0;
    while (!found) {
      rx = (int) random(img.width); ry = (int) random(img.height);
      c = img.pixels[ry * img.width + rx];
      if (brightness(c) > 45) found = true;
    }
    ax[i] = map(rx, 0, img.width, startX, startX + dW);
    ay[i] = map(ry, 0, img.height, startY, startY + dH);
    pColors[i] = c;
    
    float d = dist(rx, ry, img.width/2, img.height/2);
    pType[i] = (d < img.width * 0.35 || saturation(c) > 50) ? 0 : 1;
  }
}

// ===================== 海报 UI =====================
void drawPosterUI(float vol) {
  textFont(customFont);
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(55);
  String t = "RECONSTRUCTION";
  for (int i = 0; i < t.length(); i++) {
    text(t.charAt(i), 90 + i * 65, 90);
  }

  fill(255, 230);
  textAlign(LEFT, BOTTOM);
  textSize(100);
  text("一绣成祥", 95, height - 195);
  
  textAlign(RIGHT, BOTTOM); 
  textSize(125);
  text("壮锦 · 绣球", width / 2 + 150, height - 65); 

  noFill();
  stroke(255, 60 + vol * 150);
  strokeWeight(1);
  rect(45, 45, width - 90, height - 90);
  
  stroke(255, 200);
  strokeWeight(3);
  line(45, 45, 75, 45); line(45, 45, 45, 75);
  line(width-45, height-45, width-75, height-45); line(width-45, height-45, width-45, height-75);
}

// ===================== 键盘交互 =====================
void keyPressed() {
  if (key == 'r' || key == 'R') growthRadius = 0;
  if (key == 's' || key == 'S') saveFrame("Recon_Final_###.png"); // 单张截图
  
  // 按 1 键开始/停止录制
  if (key == '1') {
    isRecording = !isRecording;
    if (isRecording) {
      println("【录制开始】帧图片正保存在项目目录的 video_output 文件夹中...");
    } else {
      println("【录制停止】");
    }
  }
}
