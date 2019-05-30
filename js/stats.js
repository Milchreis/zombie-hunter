class Stats {

    constructor(game) {
        this.game = game;
        this.killedZombies = 0;
        this.interKillTime = Infinity;
        this.__lastkill = 0;
        this.shots = 0;
        this.hits = 0;
    }

    getAccuracy() {
        if(this.shots === 0) {
            return 0;
        }
        return ((this.hits / this.shots) * 100).toFixed(2);
    }
    
    increaseHits() {
        this.hits++;
    }
    
    increaseShots() {
        this.shots++;
    }

    increaseKilledZombies(zombie, callback) {
        this.killedZombies++;
        this.interKillTime = this.game.time.now - this.__lastkill;
        this.__lastkill = this.game.time.now;

        if(callback) {
            callback(zombie, this.killedZombies, this.interKillTime);
        }
    }

}