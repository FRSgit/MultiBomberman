var Bomberman = Bomberman || {};

Bomberman.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "player": Bomberman.Player.prototype.constructor,
        "enemy": Bomberman.Enemy.prototype.constructor,
        "target": Bomberman.Target.prototype.constructor,
        "life_item": Bomberman.LifeItem.prototype.constructor,
        "bomb_item": Bomberman.BombItem.prototype.constructor
    };
    
    // define available items
    this.items = {
        life_item: {probability: 0.1, properties: {texture: "life_item_image", group: "items"}},
        bomb_item: {probability: 0.3, properties: {texture: "bomb_item_image", group: "items"}}
    };
};

Bomberman.TiledState.prototype = Object.create(Phaser.State.prototype);
Bomberman.TiledState.prototype.constructor = Bomberman.TiledState;

Bomberman.TiledState.prototype.init = function (level_data) {
    "use strict";
    var tileset_index;
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;
    
    // create map and set tileset
    this.map = this.game.add.tilemap(level_data.map.key);
    tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
    
    if (this.level_data.first_level) {
        localStorage.clear();
    }
};

Bomberman.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;
    
    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setCollision(collision_tiles, true, layer.name);
        }
    }, this);
    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    this.prefabs = {};
    
    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }
    
    this.game.user_input = this.game.plugins.add(Bomberman.UserInput, this, JSON.parse(this.game.cache.getText("user_input")));
    
    this.init_hud();
};

Bomberman.TiledState.prototype.create_object = function (object) {
    "use strict";
    var object_y, position, prefab;
    // tiled coordinates starts in the bottom left corner
    object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(object.type)) {
        prefab = new this.prefab_classes[object.type](this, object.name, position, object.properties);
    }
    console.log(object.name);
    this.prefabs[object.name] = prefab;
};

Bomberman.TiledState.prototype.init_hud = function () {
    "use strict";
};

Bomberman.TiledState.prototype.show_game_over = function () {
    "use strict";
    var game_over_panel, game_over_position, game_over_bitmap, panel_text_style;
    // create a bitmap do show the game over panel
    game_over_position = new Phaser.Point(0, this.game.world.height);
    game_over_bitmap = this.add.bitmapData(this.game.world.width, this.game.world.height);
    game_over_bitmap.ctx.fillStyle = "#000";
    game_over_bitmap.ctx.fillRect(0, 0, this.game.world.width, this.game.world.height);
    panel_text_style = {game_over: {font: "32px Arial", fill: "#FFF"},
                       winner: {font: "20px Arial", fill: "#FFF"}};
    // create the game over panel
    game_over_panel = this.create_game_over_panel(game_over_position, game_over_bitmap, panel_text_style);
    this.groups.hud.add(game_over_panel);
};

Bomberman.TiledState.prototype.create_game_over_panel = function (position, texture, text_style) {
    "use strict";
    var game_over_panel_properties, game_over_panel;
    game_over_panel_properties = {texture: texture, group: "hud", text_style: text_style, animation_time: 500};
    game_over_panel = new Bomberman.GameOverPanel(this, "game_over_panel", position, game_over_panel_properties);
    return game_over_panel;
};
