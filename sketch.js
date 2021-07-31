var START=0;
var PLAY=1;
var OVER=2;
var gameState=START;

var path,mainCyclist,gameOver,restart;
var pathImg,mainCyclist_cycling,mainCyclist_collided,gameOverImg,restartImg;
var obstacle1,obstacle2,obstacle3;
var obstacle1Img,obstacle2Img,obstacle3Img;
var opponent1,opponent2,opponent3;
var opponent1_cycling,opponent2_cycling,opponent3_cycling;
var opponent1_collided,opponent2_collided,opponent3_collided;
var bellSound,checkPointSound,dieSound;
var distance=0;

function preload(){
//Load all the images & Animations here,  
  pathImg = loadImage("1/Road.png");
  mainCyclist_cycling = loadAnimation("1/mainPlayer1.png","1/mainPlayer2.png");
  mainCyclist_collided= loadAnimation("1/mainPlayer3.png");
  gameOverImg= loadImage("1/gameOver.png");
  restartImg=loadImage("2/restart.png");
  obstacle1Img= loadImage("1/obstacle1.png");
  obstacle2Img= loadImage("1/obstacle2.png");
  obstacle3Img= loadImage("1/obstacle3.png");
  opponent1_cycling= loadAnimation("2/opponent1.png","2/opponent2.png");
  opponent2_cycling= loadAnimation("2/opponent4.png","2/opponent5.png");
  opponent3_cycling= loadAnimation("2/opponent7.png","2/opponent8.png");
  opponent1_collided= loadAnimation("2/opponent3.png");
  opponent2_collided= loadAnimation("2/opponent6.png");
  opponent3_collided= loadAnimation("2/opponent9.png");  
  bellSound= loadSound("3/bell.mp3");
  checkPointSound = loadSound("3/checkPoint.mp3");
  dieSound = loadSound("3/die.mp3");
}

function setup(){
createCanvas(1000,300);
  
// Moving background
path=createSprite(500,200);
path.addImage(pathImg);
path.velocityX = -5;
path.x=path.width /2;  
  
//creating boy running
mainCyclist=createSprite(50,200,20,20);
mainCyclist.addAnimation("Running",mainCyclist_cycling);
mainCyclist.scale=0.07;
mainCyclist.debug = false; 
mainCyclist.setCollider("circle",0,0,700);
  
gameOver=createSprite(500,80,10,10);
gameOver.addImage(gameOverImg);
gameOver.scale=0.9;
gameOver.visible=false;
restart=createSprite(500,230,10,10);
restart.addImage(restartImg); 
restart.scale=0.8;  
restart.visible=false;   
  
obstacle1Group=new Group();
obstacle2Group=new Group();
obstacle3Group=new Group();
opponent1Group=new Group();
opponent2Group=new Group();
opponent3Group=new Group();
}

function draw() {
  background("black");
    
  if(gameState===START){
    path.y=1800;
    mainCyclist.visible=false;
    gameOver.visible=false;
    restart.visible=false;
    fill("red");
    textSize(30);
    text("PRESS  'SPACE'  TO  START",320,150);
  if(keyDown("space")){
    gameState = PLAY;
  }
  }
  
  if(gameState===PLAY){
    mainCyclist.visible=true;
    gameOver.visible=false;
    restart.visible=false;
    path.y=150;
    if(keyDown("b")){
      bellSound.play();
    }
    
  //code to reset the background
  if(path.x < 0 ){
    path.x = width/2;
  }
    
   mainCyclist.y = World.mouseY;
   distance=distance+Math.round(getFrameRate()/50); 
    
  if(distance>0 && distance%300 === 0){
       checkPointSound.play() 
  }
   edges=createEdgeSprites();
   mainCyclist.collide(edges);
    
  var select_sprites=Math.round(random(1,6));  
  if(World.frameCount%150==0){  
  if(select_sprites==1){
  createOpponent1();
  }if(select_sprites==2){
  createOpponent2();
  }if(select_sprites==3){
  createOpponent3();
  }if(select_sprites==4){
  createObstacle1();
  }if(select_sprites==5){
  createObstacle2();
  }if(select_sprites==6){
  createObstacle3();
  }
  }  
    
    path.velocityX=-(6+2*distance/150);
    
    if(obstacle1Group.isTouching(mainCyclist)){
      gameState=OVER;
      dieSound.play();
    }if(obstacle2Group.isTouching(mainCyclist)){
      gameState=OVER;
      dieSound.play();
    }if(obstacle3Group.isTouching(mainCyclist)){
      gameState=OVER;
      dieSound.play();
    }if(opponent1Group.isTouching(mainCyclist)){
      gameState=OVER;
      dieSound.play();
      opponent1.addAnimation("Running1",opponent1_collided);
    }if(opponent2Group.isTouching(mainCyclist)){
      gameState=OVER;
      dieSound.play();
      opponent2.addAnimation("Running2",opponent2_collided);
    }if(opponent3Group.isTouching(mainCyclist)){
      gameState=OVER;
      dieSound.play();
      opponent3.addAnimation("Running3",opponent3_collided);
    }
    
    }
    
    if(gameState===OVER){
      mainCyclist.addAnimation("Running",mainCyclist_collided);
      path.velocityX=0;
      gameOver.visible=true;
      restart.visible=true;
      obstacle1Group.setLifetimeEach(-1);
      obstacle2Group.setLifetimeEach(-1);
      obstacle3Group.setLifetimeEach(-1);
      opponent1Group.setLifetimeEach(-1);
      opponent2Group.setLifetimeEach(-1);
      opponent3Group.setLifetimeEach(-1);
      obstacle1Group.setVelocityXEach(0);
      obstacle2Group.setVelocityXEach(0);
      obstacle3Group.setVelocityXEach(0);
      opponent1Group.setVelocityXEach(0);
      opponent2Group.setVelocityXEach(0);
      opponent3Group.setVelocityXEach(0);
      if(mousePressedOver(restart)){
        mainCyclist.addAnimation("Running",mainCyclist_cycling);
        gameState=PLAY;
        distance=0;
        obstacle1Group.destroyEach();
        obstacle2Group.destroyEach();
        obstacle3Group.destroyEach();
        opponent1Group.destroyEach();
        opponent2Group.destroyEach();
        opponent3Group.destroyEach();
      }
      
    }
 
  drawSprites();
  textSize(20);
  fill(255);
  text("Distance : "+ distance,840,30);
}


function createObstacle1(){
  obstacle1=createSprite(1050,10,10);
  obstacle1.addImage(obstacle1Img);
  obstacle1.scale=0.15;
  obstacle1.velocityX=-(4+2*distance/120);
  obstacle1.lifetime=280;
  obstacle1Group.add(obstacle1)
  obstacle1.depth = mainCyclist.depth;
  mainCyclist.depth = obstacle1.depth + 1;
  var select_obstcles=Math.round(random(1,2));             
  if(select_obstcles==1){
  obstacle1.y=235;
  }else if (select_obstcles==2){
  obstacle1.y=75;
  }
  obstacle1.debug=false;
  obstacle1.setCollider("rectangle",0,0,360,480);
  }

function createObstacle2(){
  obstacle2=createSprite(1050,10,10);
  obstacle2.addImage(obstacle2Img);
  obstacle2.scale=0.15;
  obstacle2.velocityX=-(4+2*distance/120);
  obstacle2.lifetime=280;
  obstacle2Group.add(obstacle2);
  obstacle2.depth = mainCyclist.depth;
  mainCyclist.depth = obstacle2.depth + 1;
  var select_obstcles=Math.round(random(1,2));             
  if(select_obstcles==1){
  obstacle2.y=235;
  }else if (select_obstcles==2){
  obstacle2.y=75;
  }
  obstacle2.debug=false;
  obstacle2.setCollider("rectangle",0,0,580,320);
}

function createObstacle3(){
  obstacle3=createSprite(1050,10,10);
  obstacle3.addImage(obstacle3Img);
  obstacle3.scale=0.15;
  obstacle3.velocityX=-(4+2*distance/120);
  obstacle3.lifetime=280;
  obstacle3Group.add(obstacle3);
  obstacle3.depth = mainCyclist.depth;
  mainCyclist.depth = obstacle3.depth + 1;
  var select_obstacle3=Math.round(random(1,2));         
  if(select_obstacle3===1){
  obstacle3.y=380;
  }else if (select_obstacle3===2){
  obstacle3.y=80;
  }
  obstacle3.debug=false;
  obstacle3.setCollider("rectangle",0,0,420,300);
}

function createOpponent1(){
  opponent1=createSprite(1050,10,10);
  opponent1.addAnimation("Running1",opponent1_cycling);
  opponent1.scale=0.07;
  opponent1.velocityX=-(4+2*distance/120);
  opponent1.lifetime=280;
  opponent1Group.add(opponent1);
  var select_opponent1=Math.round(random(1,2));         
  if(select_opponent1===1){
  opponent1.y=235;
  }else if (select_opponent1===2){
  opponent1.y=75;
  }
  opponent1.debug=false;
  opponent1.setCollider("circle",0,0,700);
}

function createOpponent2(){
  opponent2=createSprite(1050,10,10);
  opponent2.addAnimation("Running2",opponent2_cycling);
  opponent2.scale=0.07;
  opponent2.velocityX=-(4+2*distance/120);
  opponent2.lifetime=280;
  opponent2Group.add(opponent2);
  var select_opponent2=Math.round(random(1,2));         
  if(select_opponent2===1){
  opponent2.y=235;
  }else if (select_opponent2===2){
  opponent2.y=75;
  }
  opponent2.debug=false;
  opponent2.setCollider("circle",0,0,700);
}

function createOpponent3(){
  opponent3=createSprite(1050,10,10);
  opponent3.addAnimation("Running3",opponent3_cycling);
  opponent3.scale=0.07;
  opponent3.velocityX=-(4+2*distance/120);
  opponent3.lifetime=280;
  opponent3Group.add(opponent3);
  var select_opponent3=Math.round(random(1,2));         
  if(select_opponent3===1){
  opponent3.y=235;
  }else if (select_opponent3===2){
  opponent3.y=75;
  }
  opponent3.debug=false;
  opponent3.setCollider("circle",0,0,700);
}