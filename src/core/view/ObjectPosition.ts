import { PointData } from "pixi.js";
import { IFieldPosition, IGlobalPosition } from "../../common";
import { GameConfig } from "../config/Config";

export class ObjectPosition {
    public x: number;
    public y: number;
    public i: number;
    public j: number;
    
    public gameObject: any = null;
    public readonly id: string = crypto.randomUUID();
    public isOccupied: boolean = false;
    public isWalkable: boolean = true;

    constructor(x: number = 0, y: number = 0, type: 'pixels' | 'field' = 'pixels') {
        if (type === 'pixels') {
            this.setFromPixels(x, y);
        } else {
            this.setFromField(x, y);
        }
    }

    public setFromPixels(x: number, y: number): this {
        this.x = x;
        this.y = y;
        this.i = Math.floor(x / GameConfig.CELL_SIZE);
        this.j = Math.floor(y / GameConfig.CELL_SIZE);
        return this;
    }

    public setFromField(i: number, j: number): this {
        this.i = i;
        this.j = j;
        this.x = i * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
        this.y = j * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2;
        return this;
    }

    public setGameObject(obj: any): this {
        if (this.gameObject && obj) {
            console.warn(`Position ${this.toString()} already occupied by ${this.gameObject.uuid}`);
        }
        this.gameObject = obj;
        this.isOccupied = !!obj;
        return this;
    }

    public clearGameObject(): this {
        this.gameObject = null;
        this.isOccupied = false;
        return this;
    }

    public toFieldCoords(): IFieldPosition {
        return { x: this.i, y: this.j, type: 'field' };
    }

    public toGlobalCoords(): IGlobalPosition {
        return { x: this.x, y: this.y, type: 'global' };
    }

    public equals(other: ObjectPosition): boolean {
        return this.i === other.i && this.j === other.j;
    }

    public distanceTo(other: ObjectPosition): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    public gridDistanceTo(other: ObjectPosition): number {
        return Math.abs(this.i - other.i) + Math.abs(this.j - other.j);
    }

    public clone(): ObjectPosition {
        const clone = new ObjectPosition(this.x, this.y, 'pixels');
        clone.gameObject = this.gameObject;
        clone.isOccupied = this.isOccupied;
        clone.isWalkable = this.isWalkable;
        return clone;
    }

    public toString(): string {
        return `[${this.i},${this.j}] -> (${this.x},${this.y}) ${this.gameObject ? `-> ${this.gameObject.constructor.name}` : ''}`;
    }

    public static fromPixels(x: number, y: number): ObjectPosition {
        return new ObjectPosition(x, y, 'pixels');
    }

    public static fromField(i: number, j: number): ObjectPosition {
        return new ObjectPosition(i, j, 'field');
    }

    public static fromPoint(point: PointData, type: 'pixels' | 'field' = 'pixels'): ObjectPosition {
        return new ObjectPosition(point.x, point.y, type);
    }
}