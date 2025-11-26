import { Sprite, Texture, Ticker } from "pixi.js";
import { IGlobalPosition, IFieldPosition, IGridCellType } from "../../../common";
import { GameConfig } from "../../config/Config";
import { DynamicGameObject } from "../DynamicGameObject";
import { Minion } from "./Minion";

export class Dude extends DynamicGameObject {

    public readonly uuid: string = this.constructor.name + '_' + crypto.randomUUID();

    private readonly crew: Array<Minion> = [];

    public addToGroup = (minion: Minion) => {
        if (this.crew.length >= 5) return null;
        minion.setEngaged(true);
        this.crew.push(minion);
        return minion;
    }

    public removeFromGroup = (minion: Minion) => { 
        return this.crew.splice(this.crew.findIndex(({ uuid }) => minion.uuid === uuid), 1);
    }

    public override get type() {
        return IGridCellType.DUDE;
    }

    public override get delta() {
        return GameConfig.DUDE.DELTA;
    }

    constructor(texture: Texture, position: IGlobalPosition = null) {
        super(texture, position);
        this.redraw();
    }

    public redraw = () => {
        this.x += this.size / 2;
        this.y += this.size / 2;
        this.anchor.set(0.5, 0.5);
    }

    protected override move(dx: number, dy: number, distance: number): void {
        super.move(dx, dy, distance);
        this.angle += (Math.sign(dx) * this.delta * this.delta);
    }

    public override setPath(path: Array<IGlobalPosition> = []): void {
        super.setPath(path);
        this.crew.forEach((minion: Minion) => minion.setPath(this.getPath()));
    }

    public getTarget = (): IGlobalPosition => {
        return this.target;
    }
}

