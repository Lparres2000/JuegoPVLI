import Bullet from "./Bullet.js";
export default class Player extends Phaser.GameObjects.Sprite
{
    /*
    *Las variable con barra baja son las de la clase, sin barra baja son las variables de la sobrecarga
    *Scene es la escena a la que pertenecen los enemigos
    *x es la coordenada x del sprite
    *y es la coordenada y del sprite
    *life es la vida inicial del jugador
    *AtkCD es el CoolDown entre ataques
    *Velocity es la velocidad de movimiento
    *daño es el daño de cada ataque
    *range es el rango de los ataques del player
    *armor es la armadura del jugador
    *Rage es el cargador de rabia
    *eureka es el cargador de eureka
    */

//Propuesta, Meter en un objeto los bloques de estadisticas. (LUIS.C)
/**
 * Consturctor del player
 * @param {Scene} scene 
 * @param {number} x
 * @param {number} y
 * @param {number} playerConfig Objeto que guarda la informacion del player{life, velocity, damage,range,armor,minCooldown,maxCooldown}
 * */
//life, damage, velocity, range, armor, rage
    constructor(scene,x, y, key, playerConfig)
    {
        //llamada al constructor del super
        super(scene, x ,y, key ) // hay que cargar la imagen con su id

        //atributos del player
        this._life = playerConfig.life;
        this._velocity = playerConfig.velocity;
        this._damage = playerConfig.damage;
        this._range = playerConfig.range;
        this._armor = playerConfig.armor;

        //min y max cooldown
        this._minCD = playerConfig._minCooldown;
        this._maxCD = playerConfig._maxCooldown;

        //Genera un Cool Down aleatorio ente los dos, los números están puestos a vole0
        //van en  milisegundos
        this._atkCD = Phaser.Math.Between(this._minCD,this._maxCD); //por algun motivo no funciona
        
        //console.log(this._atkCD);


        this._elapsedTime = 0;

        //dicotomias
        this._rage = 0;
        this._eureka = 0;

        //vector de movimiento
        this._moveVector = new Phaser.Math.Vector2(0,0);
        
        //escala y añadir a la escena
        this.setScale(0.5);
        this.scene.add.existing(this);
    }

    //métodos

    preUpdate(t,dt){

        this.Move();
             
        this._elapsedTime += dt;
      
        if(this._elapsedTime >= 500){
            new Bullet(this.scene,this.x,this.y,'kirby',true,0,5);
            this._atkCD = Phaser.Math.Between(this._minCD, this._maxCD);//esto no funciona
            this._atkCD = 500;
            this._elapsedTime = 0;

        }
               
    }

    // Método para setear el vector de movimiento
    setMoveVector = function(inputVector){
        this._moveVector = inputVector.normalize();
    }

    //método para moverte
    Move = function(){

        this.x += this._moveVector.x * this._velocity;
        this.y += this._moveVector.y * this._velocity;
        
    }

    //método para disparar
    disparar = function(){
        //vacío de momento
    }

    // La dicotomía cambia el rango de ataque
    cambiaRange = function(damageOffset){
        //vacío de momento
    }

}