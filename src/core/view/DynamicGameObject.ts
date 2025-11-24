import { Sprite, Texture, Ticker } from "pixi.js";
import { IGlobalPosition, IFieldPosition, DynamicGameObjectState, IGridCellType } from "../../common";
import { GameConfig } from "../config/Config";
import { positionToPixels } from "../utils/Utils";
import GameEvents from "../data/GameEvents";


export class DynamicGameObject extends Sprite {

    public readonly uuid: string = this.constructor.name + '_' + crypto.randomUUID();

    protected path: Array<IGlobalPosition> = [];

    private _state: DynamicGameObjectState = DynamicGameObjectState.FRUSTRATING;

    private setState = (state: DynamicGameObjectState) => {
        this._state = state;
    }

    public get state(): DynamicGameObjectState {
        return this._state;
    }

    public get size(): number {
        return GameConfig.CELL_SIZE;
    }

    public get delta() {
        return 0;
    }

    public get type() {
        return IGridCellType.EMPTY;
    }

    public target: IGlobalPosition;

    constructor(texture: Texture, position: IGlobalPosition = null) {
        super(texture);
        if (position) {
            this.position = position;
        }
        this.redraw();
        Ticker.shared.add(this.update);
    }

    public redraw = () => {/* obsolete? */ }

    public setTarget = (position: IGlobalPosition): void => {

        if (!position) return this.setState(DynamicGameObjectState.PENDING);

        this.target = position;

        this.setState(DynamicGameObjectState.MOVING);
    }

    protected move(dx: number, dy: number, distance: number) {
        this.x += (dx / distance) * this.delta;
        this.y += (dy / distance) * this.delta;
    }

    protected stop() {
        this.x = this.target.x;
        this.y = this.target.y;
        this.setTarget(this.path.shift());
    }

    public update = () => {
        if (this._state !== DynamicGameObjectState.MOVING) return;

        const dx: number = this.target.x - this.x;
        const dy: number = this.target.y - this.y;
        const distance: number = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.delta) {
            this.stop();
        } else {
            this.move(dx, dy, distance)
        }
    }

    public setPath(path: Array<IGlobalPosition> = []): void {
        this.path = path;
        this.setTarget(this.path.shift());
    }

    public getPath = (): Array<IGlobalPosition> => {
        return [...this.path];
    }

    public destroyObject() {
        return Ticker.shared.remove(this.update);
    }
}



