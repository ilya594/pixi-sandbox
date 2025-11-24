
import { Application, Assets, Container, Graphics, Sprite } from 'pixi.js';
import { GameConfig, replaceConfig } from '../config/Config';
import { Minion } from './components/Minion';
import GameEvents from '../data/GameEvents';
import GameObjects from '../data/GameObjects';


interface IRendererConfig {
    FIELD_WIDTH: number;
    FIELD_HEIGHT: number;
    FRAME_INTERVAL: number;
    CANVAS: HTMLCanvasElement | HTMLElement;
    TILE_SIZE: number;
    COLORS: {
        MINION: string;
        DUDE: string;
        GRID: string;
        BACKGROUND: string;
        PATH: string;
        TARGET: string;
        TEXT: string;
    };
    ENDPOINT: any;
    OBSTACLES: any;
    DUDE: any;
    MINION: any;
}

class WebGLRenderer {

    private canvas: HTMLCanvasElement | HTMLElement;

    private container: Container;

    private application: Application;

    private entities: Map<string, any>;

    public get proxy() {
        return this.application;
    }

    constructor() { }

    public initialize = async () => {

        this.application = new Application();

        await this.application.init({ background: GameConfig.COLORS.BACKGROUND, resizeTo: window });

        this.canvas = document.getElementById("canvas");
        this.canvas.appendChild(this.application.canvas);
        this.canvas.onpointerdown = (event) => this.handleCanvasClick(event);

        this.container = new Container({ isRenderGroup: true, eventMode: 'static' });
        this.application.stage.addChild(this.container);

        GameConfig.updateSize(
            Math.floor(this.application.screen.width / GameConfig.CELL_SIZE),
            Math.floor(this.application.screen.height / GameConfig.CELL_SIZE));

        replaceConfig(GameConfig);

        await Assets.load(GameConfig.ALL_TEXTURES);

        return this;
    }

    public onEnterRenderCycle = (/*time: any*/) => {

        //GameObjects.dude.update();
        //GameObjects.minions.forEach((minion: Minion) => minion.update());
        GameObjects.pointer.update();
    }

    public displayEntities = (): void => {

        this.container.addChild(GameObjects.field);
        this.container.addChild(GameObjects.exit);

        this.container.addChild(GameObjects.pointer);
        this.container.addChild(GameObjects.dude);
        GameObjects.minions.forEach((minion: any) => this.container.addChild(minion));

        this.container.addChild(GameObjects.dialog);
        this.container.addChild(GameObjects.score);

        this.application.ticker.add(this.onEnterRenderCycle);
    }

    public removeEntities = (entities: Array<Container>) => {
        return entities.forEach((entity: Container) => this.container.removeChild(entity));
    }

    private handleCanvasClick = (event: MouseEvent | PointerEvent): void => {

        const rectangle: DOMRect = this.canvas.getBoundingClientRect();
        const x: number = event.clientX - rectangle.left;
        const y: number = event.clientY - rectangle.top;

        GameEvents.dispatchEvent(GameEvents.GAMEFIELD_POINTER_DOWN_EVENT, { x, y });
    }
}

export default new WebGLRenderer();