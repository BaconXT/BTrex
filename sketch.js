//Declaração de variaveis

var PLAY = 1;  //O começo do jogo = Execução do codigo
var END = 0;  //Onde o jogo termina
var gameState = PLAY;  //O jogo inicia no play, ja começa executando

var trex, trex_running, trex_collided;   //variavel dinossauro correndo e colidindo no chao
var ground, invisibleGround, groundImage; //chao, chao invisivel e a imagen do chao

var cloudsGroup, cloudImage;  //grupo de nuvens e a imagen da nuvem
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;          
//obstaclos e os grupos dos obstaclos
var score; //pontuação

var gameOverImg,restartImg //Quando voce perdeu e quando voce recomeça
var jumpSound , checkPointSound, dieSound //O som do pulo o som quando 100 pontos marcados e o barulho quando voce perde


function preload(){                   //função para carregr as imagens e sons
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png"); //quando o dinossauro corre
  trex_collided = loadAnimation("trex_collided.png"); // quando ele colide no e obstaclo
  
  groundImage = loadImage("ground2.png"); //A imagem do chao
  
  cloudImage = loadImage("cloud.png"); //imagem da nuvenzinha
  
  obstacle1 = loadImage("obstacle1.png"); //imagen do obstaclo 1
  obstacle2 = loadImage("obstacle2.png"); //imagen do obstaclo 2
  obstacle3 = loadImage("obstacle3.png"); //imagen do obstaclo 3
  obstacle4 = loadImage("obstacle4.png"); //imagen do obstaclo 4
  obstacle5 = loadImage("obstacle5.png"); //imagen do obstaclo 5
  obstacle6 = loadImage("obstacle6.png"); //imagen do obstaclo 6
  
   restartImg = loadImage("restart.png") //imagen de quando voce perde para recomeçar
  gameOverImg = loadImage("gameOver.png") //imagen de quando voce perde
  
  jumpSound = loadSound("jump.mp3") //som do pulo do dinossauro
  dieSound = loadSound("die.mp3") //som de quando o dinossauro morre
  checkPointSound = loadSound("checkPoint.mp3")  //o som quando voce bate 100, 200, 300, 400, 500, 600, 700, 800, 900 e 1000 pontos
}

function setup() { //função de configuração do jogo
  createCanvas(600, 200); //uma area criada
  
  trex = createSprite(50,180,20,50); //para criar um sprite do dinossauro
  trex.addAnimation("running", trex_running); //adicionar imagens de quando o trex o dinossauro esta correndo
  trex.addAnimation("collided" ,trex_collided); //de quando ele colide no obstaclo
  trex.scale = 0.5; //o tamanho do dinossauro
  
  ground = createSprite(200,180,400,20); //criar um sprite ao chao
  ground.addImage("ground",groundImage); //adicionar uma animação ao chao para que ele nao seja so um bloco
  ground.x = ground.width /2; //Dividir a imagem do chão para que quando a primeira imagem acabar, a segunda entre no seu lugar e assim sucessivamente, fazendo com que o chão fique INFINITO
  
   gameOver = createSprite(300,100); //criar um sprite ao jogo terminado
  gameOver.addImage(gameOverImg); //adicionar uma animação ao jogo terminado
  
  restart = createSprite(300,140); //criar um sprite ao quando voce perdeu para depois recomeçar
  restart.addImage(restartImg); //adicionar uma imagen ao perder 
  
  gameOver.scale = 0.5; //o tamanho do game over
  restart.scale = 0.5;  // o tamanho do botão de recomeçar
  invisibleGround = createSprite(200,190,400,10); //o sprite do chao invisivel
  invisibleGround.visible = false; //ele na vai ser visivel
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();  //grupo de obstaclos
  cloudsGroup = createGroup(); //para criar um grupo de nuvens
  
  console.log("Olá" + 5); //esse é um codigo para a palavra ser escrita no console mais de 5 vezes
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height); //se o circulo ao redor do dinossauro seja tocado por um obstaclo voce perde
  trex.debug = false; //fazer aparecer o circulo ao redor do dinossauro
  
  score = 0; //pontuação no começo
  
}

function draw() { //funçao para desenhar
  
  background(180); //a cor de fundo
  //exibir pontuação
  text("Pontuação: "+ score, 500,50); //pontuação na tela
  
  console.log("isto é ",gameState) //estado de jogo
  
  
  if(gameState === PLAY){ //se o estado de jogo = a começar o game over nao é visivel e o restart nao é visivel e a velocidade X do chao é -4
    gameOver.visible = false 
    restart.visible = false
    //mover o solo
    ground.velocityX = -(4 + 3 * score/100);
    //pontuação
    score = score + Math.round(frameCount/60); //A cada 60 frames conta alguns pontos e nao ser um numero quebrado
    if(score>0 && score%100 === 0){
      checkPointSound.play();
    }
    
    
    
    
    if (ground.x < 0){ //Se a posição do chão é menor que 0
      ground.x = ground.width/2; //O chão é dividido em duas partes pra vir outro
    }
    
    //pular quando a tecla de espaço for pressionada
    if(keyDown("space")&& trex.y >= 100) { //quando a tecla de espaço for apertada e o trex estiver na posiçao Y 100
        trex.velocityY = -12; //Ele deve voltar
      jumpSound.play();
      }
    if(keyDown("UP_ARROW")&& trex.y >= 100) { 
      trex.velocityY = -12; 
      jumpSound.play();
    }
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8 //a gravidade do trex
  
    //gerar as nuvens
    spawnClouds(); //o gerador de nuvens
  
    //gerar obstáculos no solo
    spawnObstacles(); //o gerador de obstaclos
    
    if(obstaclesGroup.isTouching(trex)){ //se o trex  tocar em um grupo de obstaclos
        gameState = END; //ele perde
        dieSound.play();
      }
  }
   else if (gameState === END) { //se não o estado de jogo = END (fim)
     console.log("hey") //ele vai falar "Hey"
      gameOver.visible = true; //o jogador perdeu e aparece a imagem de game over
      restart.visible = true; //e a imagem de recomeçar
     
      ground.velocityX = 0; //se o jogador perdeu o chao nao se move
      trex.velocityY = 0 //e o dinossauro tambem nao se move
     
      //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided); //quando ele colide com um obstaclo ele vai mudar a animação
     
      //definir a vida útil dos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1); //para que a life time dos obstaclos sejam infinito
    cloudsGroup.setLifetimeEach(-1); //para que a life time das nuvens sejam infinita
     //                                 --//--
     obstaclesGroup.setVelocityXEach(0); //todos iram parar
     cloudsGroup.setVelocityXEach(0);   //todos iram parar
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround); //pra que ele colida no chao invisivel
  
  
  if(mousePressedOver(restart)) {
    reset(); 

  }
  drawSprites(); //para desenhar os sprites
}
function reset(){  
  gameState = PLAY; 
  gameOver.visible = false; 
  restart.visible = false; 
  obstaclesGroup.destroyEach(); 
  cloudsGroup.destroyEach(); 
  trex.changeAnimation("running",trex_running); 
  score = 0; }
function spawnObstacles(){ //funçao gerador de obstaclos
 if (frameCount % 60 === 0){ //o resuntado de uma divisao 60 por 60 o resuntado sera 0
   var obstacle = createSprite(400,165,10,40); //onde os obstaclos seram gerados
   obstacle.velocityX = -6; //a velocidade dos obstaclos para esquerda
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6)); //numeros aleatorios de 1 a 6
    switch(rand) {                       //obstaclos diferentes
      case 1: obstacle.addImage(obstacle1); //caso   de 1 a 6 = Ifs organizados
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = 134; //o tempo de vida da nuvem
    
    //ajustar a profundidade
    cloud.depth = trex.depth; //para que o dinossauro fique na frente da nuvem
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);  //grupo de nuvens
    }
}

