var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="phaser/phaser.d.ts"/>
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.velocidad = 2000;
        this.aceleracion = 1500;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('fondo', 'assets/fondo.png');
        this.load.image('barra', 'assets/paddleBlu.png');
        this.load.image('bola', 'assets/ballGrey.png');
        this.load.image('amarillo', 'assets/amarillo.png');
        this.load.image('azul', 'assets/azul.png');
        this.load.image('celeste', 'assets/celeste.png');
        this.load.image('verde', 'assets/verde.png');
        this.load.image('naranja', 'assets/naranja.png');
        this.load.image('lila', 'assets/lila.png');
        this.load.image('rosa', 'assets/rosa.png');
        this.load.image('violeta', 'assets/violeta.png');
        this.load.image('rojo', 'assets/rojo.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.createBricks = function () {
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
    };
    mainState.prototype.createBarra = function () {
        this.barra = this.add.sprite(this.world.centerX, 550, 'barra');
        this.barra.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.barra, Phaser.Physics.ARCADE);
        this.barra.body.collideWorldBounds = true;
        this.barra.body.bounce.set(0.0);
    };
    mainState.prototype.createBola = function () {
        this.bola = this.add.sprite(this.world.centerX, 527, 'bola');
        this.bola.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.bola, Phaser.Physics.ARCADE);
        this.bola.body.collideWorldBounds = true;
        this.bola.body.bounce.set(0.7);
        this.bola.events.onOutOfBounds.add(this.ballLost, this);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        var fondo;
        fondo = this.add.image(0, 0, 'fondo');
        this.game.physics.arcade.checkCollision.down = false; //no colisiona abajo.
        this.createBricks();
        this.createBarra();
        this.createBola();
    };
    mainState.prototype.update = function () {
        this.barra.x = this.game.input.x;
        this.game.physics.arcade.collide(this.bola, this.bricks, this.onBrickTouched, null, this);
    };
    mainState.prototype.onBrickTouched = function (bola, brick) {
        brick.kill();
        this.bola.body.acceleration.x = this.bola.body.acceleration.x + 8;
        this.bola.body.acceleration.y = this.bola.body.acceleration.y + 8;
    };
    mainState.prototype.ballLost = function () {
    };
    return mainState;
})(Phaser.State);
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
    return Brick;
})(Phaser.Sprite);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(960, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map