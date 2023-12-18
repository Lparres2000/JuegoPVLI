export default class Waves extends Phaser.GameObjects.GameObject{


    constructor(scene,type){
        super(scene,type);

        this.waveJson =  this.scene.scene.get("level").waveJson;

        this.data = this.scene.scene.get("level").data;

        this.meleeEnemiesPool = this.scene.scene.get("level").meleeEnemiesPool;

        this.rangeEnemiesPool = this.scene.scene.get("level").rangeEnemiesPool;

        this.player   = this.scene.scene.get("level").player;

        this.spawnPoints = this.scene.scene.get("level").spawnPoints;

        this.currentWave = 0;

        this.spawnPositions = [];

        this.minSpawnRange = 400;
        this.maxSpawnRange = 750;

        this.sortSpawnPointsFrecuency = 5000;
        this.sortSpawnPointsTimer = 9999;

        //para calcular cuando sale la nueva oleada
        this.globalTime = 0;
    }

    update(dt){

        this.oleadasLogic(dt);

        this.masillasLogic(dt);  
               
    }

    //oleadas
    oleadasLogic(dt) {

        this.globalTime = (this.scene.scene.get("UIScene").minuteCount * 60) + this.scene.scene.get("UIScene").secondsCount;

        //si ha llegado el tiempo de la siguiente oleada, cambiar de oleada,y actualizar spawnPoints
        if (this.globalTime >= this.waveJson.NewWaves[this.currentWave + 1].waveStartTime) {
            this.currentWave = this.currentWave + 1;
            this.sortSpawnPoints();
            this.sortSpawnPointsTimer = 0;

            //actualizar la info de la UI
            this.scene.get("UIScene").updateWaveData();
        }


        //actualizar la posicion de los spawnPoints, cuando toque
        this.sortSpawnPointsTimer += dt;

        if (this.sortSpawnPointsTimer >= this.sortSpawnPointsFrecuency) {
            this.sortSpawnPoints();
            this.sortSpawnPointsTimer = 0;
        }


        //para cada uno de los spawns de la oleada actual
        for (let i = 0; i < this.waveJson.NewWaves[this.currentWave].spawnsData.length; i++) {

            //info de este spawn
            let spawnData = this.waveJson.NewWaves[this.currentWave].spawnsData[i];

            //posicion en la que vamos a spawnear
            let spawnPos = this.spawnPositions[i];

            this.spawnDataUpdate(spawnData, spawnPos, dt, false, false);
        }

        //SPAWN DEL TOTEM ENEMY

        //info del spawn del totem
        let totemData = this.waveJson.NewWaves[this.currentWave].totemEnemy[0];

        //posicion en la que vamos a spawnear
        let spawnPos = this.spawnPositions[Phaser.Math.Between(0, this.spawnPositions.length - 1)];

        this.spawnDataUpdate(totemData, spawnPos, dt, false, true);

    }

    //masillas, falta ir actualizando los config de los enemies
    masillasLogic(dt) {

        //para cada uno de los spawns de las masillas
        for (let i = 0; i < this.waveJson.Masillas[0].spawnsData.length; i++) {

            //info de este spawn
            let spawnData = this.waveJson.Masillas[0].spawnsData[i];

            //posicion en la que vamos a spawnear
            let spawnPos = this.spawnPositions[spawnData.spawnIndex];

            this.spawnDataUpdate(spawnData, spawnPos, dt, true, false);
        }

    };


    spawnDataUpdate(spawnData, spawnPos, dt, masillas, totem) {

        //actualizar el contador de tiempo
        spawnData.timer += dt;

        //si toca spawnear y quedan enemigos en este spawn point
        if (spawnData.timer >= spawnData.frecuency && (masillas || spawnData.size > 0)) {


            //si es una masilla hay que cambiar el indice del spawn para el proximo
            if (masillas) {
                spawnData.spawnIndex = (spawnData.spawnIndex + 1) % this.spawnPositions.length;

                //posicion en la que vamos a spawnear
                spawnPos = this.spawnPositions[spawnData.spawnIndex];
            }

            let configIndex = 0;

            if (totem) {
                //esto tiene que estar ligado al data
                configIndex = 3;
            }



            //spawnear segun el tipo, solo cambia la pool y el config
            if (spawnData.type == "melee") {
                this.meleeEnemiesPool.spawn(spawnPos.x, spawnPos.y, spawnData.animKey, this.data.EnemyConfigs[configIndex]);
            }
            else if (spawnData.type == "range") {
                this.rangeEnemiesPool.spawn(spawnPos.x, spawnPos.y, spawnData.animKey, this.data.RangeConfigs[configIndex]);
            }




            //si no es masilla, reducimos el size
            if (!masillas) {
                spawnData.size--;
            }
            //resetear el timer
            spawnData.timer = 0;
        }
    }


    //busca los spawnPoints mas cercanos
    sortSpawnPoints() {

        //array de posiciones final, lo reseteamos
        this.spawnPositions = [];

        //posicion del jugador
        let playerPos = new Phaser.Math.Vector2(this.player.x, this.player.y);

        //contador para recorrer los spawnPoint del array en el que estan todos
        let spawnIndex = 0;

        //recorremos todos los spawnPoints
        while (spawnIndex < this.spawnPoints.length) {

            //si cumple la condicion y no estaba antes, añadirlo
            let point = new Phaser.Math.Vector2(this.spawnPoints[spawnIndex].x, this.spawnPoints[spawnIndex].y);
            let distance = playerPos.distance(point);

            //si está en el rango
            if (distance >= this.minSpawnRange && distance <= this.maxSpawnRange) {

                //si la lista no está llena añadirlo
                if (this.spawnPositions.length < this.waveJson.NewWaves[this.currentWave].spawnsData.length) {
                    this.spawnPositions.push(point);
                }
                else {
                    /**Si la lista está llena, buscar el punto mas lejano del player, comparar si el que estamos buscando es mas cercano
                     * que ese, si lo es, lo intercambiamos
                     */

                    let k = 0;

                    //indice del mas lejano
                    let indexMax = 0;

                    //buscar el mas lejano
                    while (k < this.spawnPositions.length) {

                        if (playerPos.distance(this.spawnPositions[indexMax]) < playerPos.distance(this.spawnPositions[k])) {
                            indexMax = k;
                        }
                        k++;
                    }

                    //si es mas cercano que el mas lejano,intercambiarlo
                    if (distance < playerPos.distance(this.spawnPositions[indexMax])) {
                        this.spawnPositions[indexMax] = point;
                    }
                }

            }

            spawnIndex++;
        }

    }


}