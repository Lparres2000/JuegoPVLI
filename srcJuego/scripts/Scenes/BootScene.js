export default class BootScene extends Phaser.Scene{
    constructor(){
        super({key:"boot"})
    }

    init(){

    }
    preload(){
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);


        this.load.on('progress', function (value) {
            console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
                    
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
        this.load.on('complete', () => {
            console.log('complete');
            this.scene.run('level');
            this.scene.sleep('boot');
        });


        //imagenes de la UI
        this.load.atlas('ui', 'srcJuego/ui/AtlasTexturas.png', 'srcJuego/ui/AtlasUI.json');
        this.load.image('heart', 'srcJuego/ui/Corazon.png');
        this.load.image('furiaEureka', 'srcJuego/ui/FuriaEureka2.png');
        this.load.image('estadisticas', 'srcJuego/ui/estadisticas.png');
        this.load.image('statsInGame', 'srcJuego/ui/statsInGame.png');
        this.load.image('waveInfo', 'srcJuego/ui/WaveInfo.png');
        this.load.image('nextWave', 'srcJuego/ui/NextWave.png');
        this.load.image('map', 'srcJuego/ui/Mapa.png');
        this.load.image('mas', 'srcJuego/img/simbolo_mas.png');
        this.load.image('marcoDial', 'srcJuego/ui/ImagenDial_3.png');
        this.load.image('marcoReloj', 'srcJuego/ui/MarcoReloj.png');
        this.load.image('marcoDialBG', 'srcJuego/ui/MarcoDialBG.png');
        this.load.image('marcoDialFrame', 'srcJuego/ui/MarcoDialFrame.png');
        this.load.image('fondoDicotomias', 'srcJuego/ui/FondoDicotomias.png');

        let srcJuego = 'srcJuego';

        this.load.image('kirby', srcJuego + '/img/kirby.png');
        this.load.image('polvos', srcJuego + '/img/dust.png');


       //sprite sheets
        this.load.spritesheet('player', srcJuego + '/sprites/Character/with_hands/SpriteSheets/walkSheet.png',
            { frameWidth: 204, frameHeight: 204});

        this.load.spritesheet('idlePlayer', srcJuego + '/sprites/Character/with_hands/SpriteSheets/idleSheet.png',
            { frameWidth: 204, frameHeight: 204 });

        this.load.spritesheet('enemy1', srcJuego + '/sprites/Enemy1/SpriteSheets/walkSheet.png',
        { frameWidth: 204, frameHeight:204})

        this.load.spritesheet('enemy2', srcJuego + '/sprites/Enemy2/SpriteSheets/walk-Sheet.png',
        { frameWidth: 204, frameHeight:204})

        this.load.spritesheet('enemy3', srcJuego + '/sprites/Enemy3/SpriteSheets/fly-Sheet.png',
            { frameWidth: 204, frameHeight:204});

        this.load.spritesheet('enemy4', srcJuego + '/sprites/Enemy4/SpriteSheets/walk-Sheet.png',
        { frameWidth: 204, frameHeight:204});

        //carga del tilemap
        this.load.tilemapTiledJSON('tilemap', srcJuego + '/tiled/prueba2.json');

        //carga del tileset
        this.load.image('patronesTilemap', srcJuego + '/tiled/arte/Dungeon_Tileset.png');


        /**carga de json de datos de los distintos enemigos
         * 
         * tanto este como el siguente creo que necesitan una vuelta de tuerca para que nos sean todavia mas utiles
         * por ejemplo guardando la clave de animacion de ese tipo de enemigo entre otras cosas 
         * 
         * Por otra parte creo que es util ser conscientes que todos los objetos que tenemos en el juego tienen como mucho animaciones de
         * andar y de recibir danio (del feedback del danio creo que hace falta hablarlo)
         */
        this.load.json('data', 'srcJuego/scripts/JSON/data.json');


        /**Explicacion del formato de las oleadas
         * Cada oleada está compuesta por, un waveStartTime(en segundos) y un array de spawnsData.
         * El waveStartTime, indica el segundo en el que empezará la oleada, cuando el reloj global llegue
         * a ese tiempo, se lanzará esa oleada. 
         * 
         * El array de spawnsData contiene la informacion de cada spawn,
         * la posicion de cada spawn se recalcula cada X tiempo(actualmente cada 5 segundos) y detetermina el
         * punto exacto del mapa en el que salen los enemigos
         * 
         * La informacion que contiene cada spawn es(de momento):
         * -type: range o melee, para saber el tipo de enemigo
         * -size: el numero de enemigos que hay en ese spawn point
         * -frecuency: cada cuantos segundos sale un enemigo en dicho spawn point
         * -timer: contador de tiempo, para ir sabiendo cuando toca spawnear y cuando no
         *
         * 
         */
        this.load.json('waves', 'srcJuego/scripts/JSON/waves.json');

        this.load.audio('music','srcJuego/audio/musica.mp3');

    }
    create(){

    }
}