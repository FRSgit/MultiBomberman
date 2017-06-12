var Bomberman = Bomberman || {};

Bomberman.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

Bomberman.LoadingState.prototype = Object.create(Phaser.State.prototype);
Bomberman.LoadingState.prototype.constructor = Bomberman.LoadingState;

Bomberman.LoadingState.prototype.init = function (level_data, next_state) {
    "use strict";
    this.level_data = level_data;
    this.next_state = next_state;
};

Bomberman.LoadingState.prototype.preload = function () {
    "use strict";
    var assets, asset_loader, asset_key, asset;

    this.preloadScreen = this.add.sprite(0, 0, 'preloadScreen');

    assets = this.level_data.assets;
    for (asset_key in assets) { // load assets according to asset key
        if (assets.hasOwnProperty(asset_key)) {
            asset = assets[asset_key];
            switch (asset.type) {
            case "image":
                this.load.image(asset_key, asset.source);
                break;
            case "spritesheet":
                this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                break;
            case "tilemap":
                this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
                break;
            }
        }
    }
    // load user input file
    if (this.level_data.user_input) {
        this.load.text("user_input", this.level_data.user_input);
    }
};

Bomberman.LoadingState.prototype.create = function () {
    "use strict";
    var self = this;


    var key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key.onDown.addOnce(function () {
        self.game.state.start(self.next_state, true, false, self.level_data);
    }, this);
};