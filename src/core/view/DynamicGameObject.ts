import { Sprite, Texture, Ticker } from "pixi.js";
import { IGlobalPosition, IFieldPosition, DynamicGameObjectState, IGridCellType } from "../../common";
import { GameConfig } from "../config/Config";
import { ObjectPosition } from "./ObjectPosition";

export class DynamicGameObject extends Sprite {
    public readonly uuid: string = this.constructor.name + '_' + crypto.randomUUID();
    protected path: Array<IGlobalPosition> = [];
    #state: DynamicGameObjectState = DynamicGameObjectState.FRUSTRATING;
    
    // Enhanced position management
    protected _location: ObjectPosition = ObjectPosition.fromPixels(0, 0);

    public get location(): ObjectPosition {
        return this._location;
    }

    public set location(value: ObjectPosition) {
        this._location = value;
        this.x = value.x;
        this.y = value.y;
    }

    private setState = (state: DynamicGameObjectState) => {
        this.#state = state;
    }

    public get state(): DynamicGameObjectState {
        return this.#state;
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

    constructor(texture: Texture, position: ObjectPosition | IGlobalPosition = null) {
        super(texture);
        if (position) {
            if (position instanceof ObjectPosition) {
                this.location = position;
            } else {
                this.location = ObjectPosition.fromPixels(position.x, position.y);
            }
        }
        this.redraw();
        Ticker.shared.add(this.update);
    }

    public redraw = () => { /* obsolete? */ }

    public setTarget = (position: IGlobalPosition): void => {
        if (!position) return this.setState(DynamicGameObjectState.PENDING);
        this.target = position;
        this.setState(DynamicGameObjectState.MOVING);
    }

    protected move(dx: number, dy: number, distance: number) {
        this.x += (dx / distance) * this.delta;
        this.y += (dy / distance) * this.delta;
        // Update internal position
        this._location.setFromPixels(this.x, this.y);
    }

    protected stop() {
        this.x = this.target.x;
        this.y = this.target.y;
        this._location.setFromPixels(this.x, this.y);
        this.setTarget(this.path.shift());
    }

    public update = () => {
        if (this.#state !== DynamicGameObjectState.MOVING) return;

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