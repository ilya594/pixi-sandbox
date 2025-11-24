import { IFieldPosition, GameConfig } from "../../common";

class GameConfigClass extends GameConfig {

    public FIELD_WIDTH: number = 100;
    public FIELD_HEIGHT: number = 100;
    public FRAME_INTERVAL: number = 30;
    public readonly CELL_SIZE: number = 20;
    public CANVAS: HTMLCanvasElement;

    public readonly COLORS: any = {
        BACKGROUND: '#9EB8A0',
        GRID: 'green',
        DUDE: 'red',
        MINION: 'string',
        PATH: 'string',
        TARGET: 'yellow',
        TEXT: 'string',
    };

    public readonly OBSTACLES: any = {
        COLOR: 'blue',
        TEXTURES: [
            { alias: 'obstacle_big', src: './images/obstacle_big.png' },
            { alias: 'obstacle_tag', src: './images/obstacle_tag.png' },
        ]
    };

    public readonly ENDPOINT: any = {
        SIZE: this.CELL_SIZE,
        COLOR: 'gold',
        DELTA: Math.PI ** Math.E,
        TEXTURE_DEFAULT: 'destination_marker',
        TEXTURES: [
            { alias: 'destination_marker', src: './images/destination_marker.png' }
        ]
    };

    public readonly DUDE: any = {
        SPAWN: { x: 0, y: 0 } as IFieldPosition,
        SIZE: this.CELL_SIZE,
        COLOR: 'green',
        DELTA: Math.PI,
        TEXTURES: [
            { alias: 'dude_default', src: './images/dude_default.png' },
        ],
        TEXTURE_DEFAULT: 'dude_default',
    };

    public readonly MINION: any = {
        DELTA: Math.E,
        SIZE: this.CELL_SIZE,
        COLOR: 'yellow',
        COLOR_SECONDARY: 'orange',
        TEXTURES: [
            { alias: 'animal_001', src: './images/animal_001.png' },
            { alias: 'animal_002', src: './images/animal_002.png' },
            { alias: 'animal_003', src: './images/animal_003.png' },
            { alias: 'animal_004', src: './images/animal_004.png' },
            { alias: 'animal_005', src: './images/animal_005.png' },
            { alias: 'animal_006', src: './images/animal_006.png' },
            { alias: 'animal_007', src: './images/animal_007.png' },

        ],
        DENSITY: Math.LOG10E ** Math.LOG10E,
    };

    public readonly DIALOG: any = {
        TEXTURE_DEFAULT: 'textholder',
        TEXTURES: [
            { alias: 'textholder', src: './images/textholder.png' }
        ],
        DISPLAY_TIME: Math.PI**Math.PI*111,
    }

    public readonly EXIT: any = {

        TEXTURE_DEFAULT: 'exit',
        TEXTURES: [
            { alias: 'exit', src: './images/exit_default.png' }
        ]
    }

    public readonly SCORE: any = {
        TEXT_STYLE: {
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 72,
            fontWeight: "bold"
        },
        INITIAL_AMOUNT: 5,
        DEFAULT: 'гри',
        SUFFIXES: [
            'вень', 'вня', 'вні', 'вні', 'вні', 'вень', 'вень', 'вень', 'вень', 'вень', 'вень'
        ],
        SUFFIXES_DECIMAL: [
            'вень', 'вень', 'вень', 'вень', 'вень', 'вень', 'вень', 'вень', 'вень', 'вень', 'вня'
        ],
        TEXTURES: [
            { alias: 'score', src: './images/score_big.png' }
        ],
        
        PHRASE_OVERTURE: 'В мене ',
        PHRASE_FINALE: '. Хва?',
        TEXTURE_DEFAULT: 'score'
    }

    public readonly ALL_TEXTURES: Array<any> = this.DUDE.TEXTURES
        .concat(this.MINION.TEXTURES)
        .concat(this.OBSTACLES.TEXTURES)
        .concat(this.DIALOG.TEXTURES)
        .concat(this.ENDPOINT.TEXTURES)
        .concat(this.EXIT.TEXTURES)
        .concat(this.SCORE.TEXTURES);


    public readonly updateSize = (w: number, h: number) => {
        this.FIELD_WIDTH = w;
        this.FIELD_HEIGHT = h;
    }
}

let gameConfig: GameConfig = new GameConfigClass();

export const replaceConfig = (config: GameConfig) => {
    if (config instanceof GameConfig) {
        gameConfig = config;
    }
}


export { gameConfig as GameConfig };
