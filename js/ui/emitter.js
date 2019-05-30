class BloodEmitter {

    constructor(game, fastMode) {

        this.game = game;
        this.fastMode = fastMode || false;

        if (this.fastMode) {
            this.initFastMode();
        
        } else {
            this.emitter = this.game.add.emitter(0, 0, 100);
            this.emitter.makeParticles('zombieBlood');
            this.emitter.gravity.set(0, 500);
        }
    }
    
    switchToFastMode() {
        if(!this.fastMode) {
            this.initFastMode();
        }
    }
    
    initFastMode() {
        this.fastMode = true;
        this.emitter = this.game.add.group();
        this.emitter.createMultiple(4, 'emitter');
        this.game.physics.enable(this.emitter, Phaser.Physics.ARCADE);
        this.emitter.setAll('outOfBoundsKill', true);
        this.emitter.setAll('y', -100);
    }

    emit(x, y) {
        if(this.emitter == null) {
            return;
        }

        if (this.fastMode) {
            let emit = this.emitter.getFirstDead();

            if (emit) {
                let animation = emit.animations.add(
                    'emitZombieBlood', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 20, false);

                emit.reset(x - emit.width * 0.5, y);
                emit.animations.play('emitZombieBlood', 25, false, true);
            }

        } else {
            this.emitter.x = x;
            this.emitter.y = y;
            this.emitter.start(true, 2000, null, 50);
        }
    }
}