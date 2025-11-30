import { IGridCellType } from "../../common";
import { GameConfig } from "../config/Config";
import { ObjectPosition } from "./ObjectPosition";

export class PositionGrid {
    private grid: ObjectPosition[][];
    private objectPositionMap: Map<string, ObjectPosition> = new Map();

    constructor(width: number, height: number) {
        this.grid = [];
        this.initializeGrid(width, height);
    }

    private initializeGrid(width: number, height: number): void {
        for (let j = 0; j < height; j++) {
            const row: ObjectPosition[] = [];
            for (let i = 0; i < width; i++) {
                const position = ObjectPosition.fromField(i, j);
                row.push(position);
            }
            this.grid.push(row);
        }
    }

    public getPosition(i: number, j: number): ObjectPosition | null {
        if (this.isValidPosition(i, j)) {
            return this.grid[j][i];
        }
        return null;
    }

    public getPositionFromPixels(x: number, y: number): ObjectPosition | null {
        const i = Math.floor(x / GameConfig.CELL_SIZE);
        const j = Math.floor(y / GameConfig.CELL_SIZE);
        return this.getPosition(i, j);
    }

    public findObjectPosition(uuid: string): ObjectPosition | null {
        return this.objectPositionMap.get(uuid) || null;
    }

    public findObjectsByType(type: IGridCellType): ObjectPosition[] {
        const results: ObjectPosition[] = [];
        for (let j = 0; j < this.grid.length; j++) {
            for (let i = 0; i < this.grid[j].length; i++) {
                const position = this.grid[j][i];
                if (position.gameObject && position.gameObject.type === type) {
                    results.push(position);
                }
            }
        }
        return results;
    }

    public updateObjectPosition(obj: any, newPosition: ObjectPosition): void {
        const oldPosition = this.findObjectPosition(obj.uuid);
        if (oldPosition) {
            oldPosition.clearGameObject();
            this.objectPositionMap.delete(obj.uuid);
        }

        newPosition.setGameObject(obj);
        this.objectPositionMap.set(obj.uuid, newPosition);
    }

    public getNeighbors(position: ObjectPosition, radius: number = 1, includeDiagonals: boolean = false): ObjectPosition[] {
        const neighbors: ObjectPosition[] = [];
        
        for (let dj = -radius; dj <= radius; dj++) {
            for (let di = -radius; di <= radius; di++) {
                if (di === 0 && dj === 0) continue;
                if (!includeDiagonals && di !== 0 && dj !== 0) continue;
                
                const neighbor = this.getPosition(position.i + di, position.j + dj);
                if (neighbor && neighbor.isWalkable) {
                    neighbors.push(neighbor);
                }
            }
        }
        return neighbors;
    }

    public findClosestEmptyPosition(target: ObjectPosition, maxRadius: number = 5): ObjectPosition | null {
        for (let radius = 1; radius <= maxRadius; radius++) {
            const neighbors = this.getNeighbors(target, radius, true);
            const empty = neighbors.filter(pos => !pos.isOccupied && pos.isWalkable);
            if (empty.length > 0) {
                return empty.reduce((closest, current) => 
                    current.gridDistanceTo(target) < closest.gridDistanceTo(target) ? current : closest
                );
            }
        }
        return null;
    }

    private isValidPosition(i: number, j: number): boolean {
        return j >= 0 && j < this.grid.length && i >= 0 && i < this.grid[j].length;
    }

    public getAllPositions(): ObjectPosition[] {
        return this.grid.flat();
    }

    public getOccupiedPositions(): ObjectPosition[] {
        return this.getAllPositions().filter(pos => pos.isOccupied);
    }
}