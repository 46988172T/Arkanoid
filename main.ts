/// <reference path="phaser/phaser.d.ts"/>
import Point = Phaser.Point;

class mainState extends Phaser.State {

    private cursor:Phaser.CursorKeys;
    private barra:Phaser.Sprite;
    private bola:Phaser.Sprite;
    private bricks:Phaser.Group;
    private bolaEnBarra = true;

    private scoreText = Phaser.Text;
    private score = 0;
    private livesText = Phaser.Text;
    private lives = 3;
    private textoInicio = Phaser.Text;

    preload():void {
        super.preload();
        this.load.image('fondo', 'assets/fondo.png');
        this.load.image('barra', 'assets/paddleBlu.png');
        this.load.image('bola', 'assets/ballGrey.png');
        this.load.image('amarillo','assets/amarillo.png');
        this.load.image('azul','assets/azul.png');
        this.load.image('celeste','assets/celeste.png');
        this.load.image('verde','assets/verde.png');
        this.load.image('naranja','assets/naranja.png');
        this.load.image('lila','assets/lila.png');
        this.load.image('rosa','assets/rosa.png');
        this.load.image('violeta','assets/violeta.png');
        this.load.image('rojo','assets/rojo.png');

        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    createBricks() {

        this.bricks = this.add.group();
        this.bricks.enableBody = true;

        var horizontal = 10;
        var vertical = 8;

        var ancho = 57;
        var alto = 28;

        var colores = [
            'rojo',
            'naranja',
            'amarillo',
            'verde',
            'azul',
            'violeta',
            'lila',
            'rosa'
        ];

        for (var posFila = 0; posFila < vertical; posFila++) {
            for (var posColumna = 0; posColumna < horizontal; posColumna++) {
                var x = (ancho + 1) * posColumna;
                var y = posFila * (alto + 1);

                var brick = new Brick(this.game, x + 190, y + 50, colores[posFila % colores.length], 0);

                this.add.existing(brick);
                this.bricks.add(brick);
            }
        }
    }

    createBarra(){
        this.barra = this.add.sprite(this.world.centerX, 550, 'barra');
        this.barra.anchor.setTo(0.5, 0.5);

        this.physics.enable(this.barra, Phaser.Physics.ARCADE);
        this.barra.body.collideWorldBounds = true;
        this.barra.body.bounce.set(0.0);
        this.barra.body.immovable = true;

    }

    createBola(){
        this.bola = this.add.sprite(this.world.centerX, this.barra.y-23, 'bola');
        this.bola.anchor.setTo(0.5, 0.5);

        this.physics.enable(this.bola, Phaser.Physics.ARCADE);
        this.bola.body.collideWorldBounds = true;
        this.bola.body.bounce.set(1);
        this.bola.checkWorldBounds = true;
        this.bola.events.onOutOfBounds.add(this.ballLost, this);
    }

    create():void {
        super.create();
        var fondo;
        fondo = this.add.image(0,0,'fondo');
        this.game.physics.arcade.checkCollision.down = false; //no colisiona abajo.

        this.createBricks();
        this.createBarra();
        this.createBola();
        this.game.input.onTap.addOnce(this.primeraBola,this);


        this.textoInicio = this.game.add.text(200, 275,  'clic para empezar!', { font: "70px Arial", fill: "#ffffff", align: 'center'});
        this.scoreText = this.game.add.text(32, 550, 'puntuación: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
        this.livesText = this.game.add.text(850, 550, 'vidas: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });

    }

    update():void {

        this.barra.x = this.game.input.x;

        if (this.bolaEnBarra) {
            this.bola.body.x = this.barra.x;
        }else{
            this.game.physics.arcade.collide(this.bola, this.bricks, this.bolaTocaBrick, null, this);
            this.game.physics.arcade.collide(this.bola, this.barra, this.bolaTocaBarra, null, this);
        }

    }

    bolaTocaBarra(bola:Phaser.Sprite, barra:Phaser.Sprite){
        var aux = 0;

        if (this.bola.x < this.barra.x){
            //bola en la izquierda de la barra
            aux = this.barra.x - this.bola.x;
            this.bola.body.velocity.x = (-10 * aux);
        }else if(this.bola.x > this.barra.x){
            //bola en la derecha de la barra
            aux = this.bola.x -this.barra.x;
            this.bola.body.velocity.x = (10 * aux);
        }else{
            this.bola.body.velocity.x = 2 + Math.random() * 8;
        }
    }

    bolaTocaBrick(bola:Phaser.Sprite, brick:Phaser.Sprite){
        brick.kill();
        this.score += 10;
        this.scoreText.setText('puntuación: '+this.score);
        this.bola.body.acceleration.y = this.bola.body.acceleration.y + 8;
    }

    ballLost(){

        if (this.lives > 1){
            this.lives -= 1;
            this.livesText.setText('vidas: '+this.lives);
            this.bolaEnBarra = true;
            this.bola.reset(this.world.centerX, this.barra.y-23);
            this.game.input.onTap.addOnce(this.primeraBola,this);
        }else{
            this.gameOver();
        }
    }

    gameOver(){
        this.livesText.setText('vidas: 0');
        this.textoInicio.setText('palmaste!');
        this.textoInicio.visible = true;
        this.game.input.onTap.addOnce(this.restart,this);
    }

    restart(){
        this.bolaEnBarra = true;
        this.score = 0;
        this.lives = 3;
        this.game.state.restart();
    }

    primeraBola(){
        if (this.bolaEnBarra){
            this.textoInicio.visible = false;
            this.bolaEnBarra = false;
            this.bola.body.velocity.y = -300;
            this.bola.body.velocity.x = -300;
        }
    }
}

class Brick extends Phaser.Sprite{

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(960, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};