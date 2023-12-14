import Mob  from './Mob.js'
// clase de la que heredan los demás scripts de los enemigos
export default class Enemy extends Mob
{
    /*
    *Las variable con barra baja son las de la clase, si barra baja son las variables de la sobrecarga
    *AtkCD es el CoolDown entre ataques
    */

    /**
 * Constructor del enemigo
 * @param {Scene} scene escena a la que pertenecen los enemigos
 * @param {number} x coordenada x del sprite
 * @param {number} y coordenada y del sprite
 * @param {string} key clave de la imagen 
 * @param {number} enemyConfig Objeto que guarda la informacion del enemy{life, velocity, damage,minCooldown,maxCooldown}
 * */
    constructor(scene, x, y, key, pool)
    {
        //constructor del padre
        super(scene, x ,y, key,1,1,1,pool);

        this._meleeAttackCD = 0;
        this._CDMeleeTimer = 0;

        this._moveVector = new Phaser.Math.Vector2(0,0);

        //añadir a la escena
        this.scene.add.existing(this);

        //cambiar magic number por cte

        //ajustar el tamaño del colider
        this.body.setSize(45,70,false);
        //ajustar el offset del colider
        this.body.setOffset(82,106);

        //margen para flipear el sprite
        this.flipMargin = 30;

    }

    preUpdate(t,dt){

        //si no estamos parados, comportamiento normal
        if(!this.scene.stopEnemy){

            //para la animación
            super.preUpdate(t,dt);

            let dirDest = new Phaser.Math.Vector2(this.scene.player.x,this.scene.player.y);
            this.SetDirection(new Phaser.Math.Vector2(dirDest.x - this.x ,dirDest.y - this.y));
            
            //flipear en relacion al jugador
            this.flipX = this.scene.player.x <= this.x - this.flipMargin ? true 
                        :this.scene.player.x >= this.x + this.flipMargin ? false : this.flipX;

            this.Move();        
            this.UpdateMeleeCooldown(dt);
        }
        else{
            //si estamos parados, setteamos la velocidad a 0
            this.body.setVelocity(0,0);
        }

    }

    

    Hit(damage){
        this.ReciveDamage(damage);
        if(this.health < 0){
            let dustConfig ={
                amount:50,
            }
            
            this.scene.dustPool.spawn(this.x,this.y, ' ', dustConfig);
        }
    }

    UpdateMeleeCooldown(dt){
        if (this._CDMeleeTimer > 0){
            this._CDMeleeTimer -= dt;
        }
    }
    /**
    * @param {SettingObject} seting necesita: {idParent, damage, speed}
    */
    setUp(seting,animKey){

        this.health = seting.life;
        this.damage = seting.damage;
        this.speed = seting.velocity;
        this._meleeAttackCD = seting.meleeAttackCD;
        this._CDMeleeTimer = 0;

        let dirDest = new Phaser.Math.Vector2(this.scene.player.x,this.scene.player.y);
        this.SetDirection(new Phaser.Math.Vector2(dirDest.x - this.x ,dirDest.y - this.y))


        //para la animacion de movimiento
        this.key[0] = '';
        this.key[1] = animKey;
    }

}