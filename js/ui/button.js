class Button {
    constructor(game, x, y, iconTag, text, fontTag, xPadding, textSize, onClickCallback) {
        
        this.xPadding = xPadding || 3;
        this.textSize = textSize || 16;

        this.game = game;

        if(iconTag) {
            this.icon = this.game.add.sprite(x, y, iconTag);
        }

        this.text = this.game.add.bitmapText(
            x + (this.icon ? this.icon.width : 0) + this.xPadding,
            y,
            fontTag,
            text,
            textSize);

        this.setOnClick(onClickCallback);
    }

    setText(text) {
        this.text.text = text;
    }

    getText() {
        return this.text.text;
    }
    
    setOnClick(onClickCallback) {
        this.onClickCallback = onClickCallback;

        if(onClickCallback) {
            if(this.icon) {
                this.icon.inputEnabled = true;
                this.icon.events.onInputDown.add(onClickCallback, this);
            }

            this.text.inputEnabled = true;
            this.text.events.onInputDown.add(onClickCallback, this);
        }
    }
}