class Keyboard {

    constructor(game, x, y, rows, columns, maxWidth, maxHeight, fontTag, fontSize, onKeyClickCallback) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.columns = columns;
        this.xGap = 10;
        this.yGap = 10;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.onClickCallback = onKeyClickCallback;
        this.fontTag = fontTag;
        this.fontSize = fontSize;
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<'.split('');
        this.keys = [];

        this._constructKeyboard();
    }

    _constructKeyboard() {
        let keyWidth = this.maxWidth / (this.columns);
        let keyHeight = this.maxHeight / (this.rows);
        let index = 0;

        for(let y = 0; y < this.rows; y++) {
            for(let x = 0; x < this.columns; x++) {
                if(index < this.alphabet.length) {
                    let key = new Button(this.game, this.x + (x*keyWidth), this.y + (y*keyHeight), null, this.alphabet[index], this.fontTag, 0, this.fontSize);
                    
                    key.setOnClick(() => {
                        this._onClick(key.getText())
                    });

                    this.keys.push(key);
                }
                index++
            }
        }
    }

    _onClick(key) {
        if(this.onClickCallback) {
            this.onClickCallback(key);
        }
    }

    setVisible(isVisible) {
        this.keys.forEach(item => {
            item.text.visible = isVisible
        });
    }

}