// clase de la que heredan los demás scripts de los enemigos
export default class Enemy extends Phaser.GameObjects.Sprite
{
    /*
    *Las variable con barra baja son las de la clase, si barra baja son las variables de la sobrecarga
    *AtkCD es el CoolDown entre ataques
    */

    /**
 * Consturctor del player
 * @param {Scene} scene escena a la que pertenecen los enemigos
 * @param {number} x coordenada x del sprite
 * @param {number} y coordenada y del sprite
 * @param {number} enemyConfig Objeto que guarda la informacion del enemy{life, velocity, damage,minCooldown,maxCooldown}
 * */
    constructor(scene, x, y, key, enemyConfig)
    {
        //constructor del padre
        super(scene, x ,y, key); 

        //atributos del enemigo
        this._vida = enemyConfig.life;
        this._damage = enemyConfig.damage;
        this._velocity = enemyConfig.velocity;

        //cooldowns de ataque
        this._minCD = enemyConfig.minCooldown;
        this._maxCD = enemyConfig.maxCooldown;
        
        //Genera un Cool Down aleatorio ente los dos (distinto para cada enemigo), los números están puestos a vole
        //Aún no se si van milisegundos o segundos
        this._atkCD = Phaser.Math.FloatBetween( this._minCD,this._maxCD);

        this._moveVector = new Phaser.Math.Vector2(0,0);

        //asignar escala
        this.setScale(0.3);
        //añadir a la escena
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this);

        this.scene.enemys.add(this);

    }

    preUpdate(t,dt){

        this.Move();                    
               
    }

    
    // métodos

    //método para moverte
    //la x y la y que se pasan a la funcion mover son la x y la y del player
    Move = function(){
       
        this._moveVector.x = this.scene.player.x- this.x;
        this._moveVector.y = this.scene.player.y- this.y;

        this._moveVector.normalize();   
        
        this.x += this._moveVector.x * this._velocity;
        this.y += this._moveVector.y * this._velocity;
    }

    //método para disparar
    Disparar = function(){
        //vacío de momento
    }
    Hit = function(damage){
        this._vida -= damage;
        if(this._vida <= 0){
            this.destroy();
        }
    }
}