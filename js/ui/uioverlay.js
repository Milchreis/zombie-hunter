class UIOverlay {

    constructor(x, y, text, game, font, size, time, easingIn, easingOut, xOffset, yOffset) {
        // Position
        this.x = x;
        this.y = y;

        this.liveTime = time || 300;
        this.inTime = 75;
        this.outTime = 250;
        this.easingIn = easingIn || Phaser.Easing.Back.In;
        this.easingOut = easingOut || Phaser.Easing.Back.Out;

        this.size = size || 16;
        this.yOffset = yOffset || 30;
        this.xOffset = xOffset || 0;

        this.game = game;

        this.text = this.game.add.bitmapText(
            x, y,
            font, 
            text,
            size);

        this.text.anchor.setTo(0.5, 0.5);
        this.text.alpha = 0.0;
        this.finished = false;
    }
    
    start(inMillis) {
        inMillis = inMillis || 0;
        
        this.game.time.events.add(inMillis, this.playInTween, this);

        if(this.liveTime && this.liveTime >= 0) {
            this.game.time.events.add(inMillis + this.liveTime , this.playOutTween, this);
        }
        
        return this;
    }

    playOutTween() {
        let tween = this.game.add.tween(this.text)
            .to({
                alpha: 0, 
                y: this.text.y + this.yOffset, 
                x: this.text.x + this.xOffset
            }, this.outTime, this.easing, true);

        tween.onComplete.add(() => this.finished = true);
    }
    
    playInTween() {
        this.game.add.tween(this.text)
            .to({ alpha: 1, 
                x: this.text.x - this.xOffset,  
                y: this.text.y - this.yOffset
            }, this.inTime, this.easing, true);
    }

}