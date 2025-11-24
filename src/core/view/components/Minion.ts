
import { Rectangle, Sprite } from "pixi.js";
import { IGridCellType, IFieldPosition, IGlobalPosition } from "../../../common";

import { GameConfig } from "../../config/Config";
import { DynamicGameObject } from "../DynamicGameObject";
import GameObjects from "../../data/GameObjects";
import { checkRectanglesIntersection, getRandomWithin } from "../../utils/Utils";
import GameEvents from "../../data/GameEvents";

export class Minion extends DynamicGameObject {

    public uuid: string = crypto.randomUUID();

    public gridtag: string;

    public isGrouped: boolean = false;

    public isLazy: boolean = false;

    private price: number = getRandomWithin(404);

    public override get type() {
        return IGridCellType.MINION;
    }

    public override get delta() {
        return GameConfig.MINION.DELTA;
    }

    public getPrice() {
        return this.price;
    }

    constructor(texture: any, isLazy: boolean = false) {
        super(texture);

        this.isLazy = isLazy;
        this.redraw();
    }

    public redraw = () => {
        this.x += this.size / 2;
        this.y += this.size / 2;
        this.anchor.set(0.5, 0.5);
        this.scale.set(0.25, 0.25);
        this.eventMode = 'static'; // Enable interactivity
        this.hitArea = new Rectangle(this.x, this.y, this.texture.width, this.texture.height);
    }

    public override setPath(path: Array<IFieldPosition> = []): void {
        super.setPath(path);
    }

    protected override move(dx: number, dy: number, distance: number): void {
        super.move(dx, dy, distance);
        
        if  (checkRectanglesIntersection(this as Sprite, GameObjects.exit)) {
            GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_REACHED_EXIT_EVENT, this);
        }
    }



}