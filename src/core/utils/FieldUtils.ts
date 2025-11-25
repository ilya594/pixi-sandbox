import { ObservablePoint, Polygon, Ticker } from "pixi.js";
import { DynamicGameObjectState, IGridCellType, IFieldPosition, IGlobalPosition } from "../../common";
import { GameConfig } from "../config/Config";
import GameEvents from "../data/GameEvents";
import { getRandomWithin, pixelsToPosition, positionToPixels } from "./Utils";
import PathFinder from "./PathUtils";
import GameObjects from "../data/GameObjects";
import { Minion } from "../view/components/Minion";
import { MinionFabric } from "../data/MinionFabric";
import { DynamicGameObject } from "../view/DynamicGameObject";

export class FieldUtils {

    private pathFinder: PathFinder;
    private gridData: Array<Uint8Array>;

    private observers: Array<Function>;

    constructor() {
        this.createGridData();

        this.setDude();
        this.setExit();
        this.setObstacles();
        this.setMinions();
    }

    public initialize = () => {

        this.pathFinder = new PathFinder();

        const dudeObserverDisposer = 
            this.createPositionObserver(GameObjects.dude, GameConfig.CELL_SIZE, (object: DynamicGameObject, x: number, y: number) => {

            const previous: IFieldPosition = pixelsToPosition({ x, y });
            const current: IFieldPosition = pixelsToPosition(object.position);

            this.updateGridData(previous, current, IGridCellType.DUDE);

            const positions: Array<any> = this.getPositionsNearby(current, IGridCellType.MINION, 2) || [];

            const minions: Array<Minion> = positions.map((position: IFieldPosition) => {
                //const minion = MinionFabric.getMinionByGridtag(GameObjects.minions, JSON.stringify(position));
                const minion: Minion = MinionFabric.getMinionByPosition(position);
                if (minion && minion.state === DynamicGameObjectState.FRUSTRATING) {
                    const minionObserverDisposer = this.createPositionObserver(GameObjects.dude, GameConfig.CELL_SIZE, (object: DynamicGameObject, x: number, y: number) => {
                        const previous: IFieldPosition = pixelsToPosition({ x, y });
                        const current: IFieldPosition = pixelsToPosition(object.position);

                        this.updateGridData(previous, current, IGridCellType.MINION);

                    });
                    return minion;
                }
            }).filter(Boolean);

            if (minions?.length) {
                GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_AROUND_POSITION_SPOTTED, minions);
            }
        });
    }

    private updateGridData = (previous: IFieldPosition, current: IFieldPosition, type: IGridCellType): void => {
        this.gridData[previous.y][previous.x] = IGridCellType.EMPTY;
        this.gridData[current.y][current.x] = type as IGridCellType;
    }

    private createPositionObserver(sprite: any, threshold: number, callback: Function) {
        let lastX = sprite.x;
        let lastY = sprite.y;

        const ticker = () => {
            const deltaX = Math.abs(sprite.x - lastX);
            const deltaY = Math.abs(sprite.y - lastY);
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance >= threshold) {
                callback(sprite, lastX, lastY);
                lastX = sprite.x;
                lastY = sprite.y;
            }
        };
        Ticker.shared.add(ticker);
        return () => Ticker.shared.remove(ticker);
    }

    public findPath = (
        currentPosition: IFieldPosition,
        newPosition: IFieldPosition,
        smoothPath: boolean = true,
        toPixels: boolean = true): Array<IFieldPosition> => {
        let result = this.pathFinder.findPath(this.gridData, currentPosition, newPosition, smoothPath);
        return toPixels ? result?.map((point: IFieldPosition) => positionToPixels(point)) : result;
    }

    public getLocationType = (i: number, j: number): IGridCellType => {
        return this.gridData[i][j] as IGridCellType;
    }

    private createGridData = () => {
        this.gridData = new Array();
        for (let i = 0; i < GameConfig.FIELD_HEIGHT; i++) {
            const chunk = new Uint8Array(GameConfig.FIELD_WIDTH);
            for (let j = 0; j < GameConfig.FIELD_WIDTH; j++) {
                chunk[j] = IGridCellType.EMPTY;
            }
            this.gridData.push(chunk);
        }
    }

    private setDude = () => {
        this.gridData[0][0] = IGridCellType.DUDE;
    }

    private setExit = () => {
        const w: number = this.gridData.length - 3;
        const h: number = this.gridData[w].length - 3;
        const ry: number = getRandomWithin(w, Math.ceil(w / Math.LOG2E));
        const rx: number = getRandomWithin(h, Math.ceil(h / Math.LOG2E));
        this.gridData[ry][rx] = IGridCellType.EXIT;
    }

    public getFirstTypedPosition = (type: IGridCellType, toGlobal: boolean = false): IFieldPosition | IGlobalPosition => {
        const position: IFieldPosition = this.getTypedFieldPositions(type).shift();
        return toGlobal ? positionToPixels(position) : position;
    }

    public getTypedFieldPositions = (type: IGridCellType): Array<IFieldPosition> => {
        const result = [];
        for (let i = 0; i < this.gridData.length; i++) {
            for (let j = 0; j < this.gridData[i].length; j++) {
                if (this.gridData[i][j] === type) {
                    result.push({ x: j, y: i });
                }
            }
        }
        return result;
    }

    private getPositionsNearby(position: IFieldPosition, type: number, radius: number): IFieldPosition[] {
        const result: IFieldPosition[] = [];
        const radiusSquared = radius * radius;

        for (let dy = -radius; dy <= radius; dy++) {
            const y = position.y + dy;
            if (y < 0 || y >= this.gridData.length) continue;

            for (let dx = -radius; dx <= radius; dx++) {
                const x = position.x + dx;
                if (x < 0 || x >= this.gridData[0].length) continue;

                if (dx * dx + dy * dy <= radiusSquared &&
                    this.gridData[y][x] === type) {
                    result.push({ x, y });
                }
            }
        }
        return result;
    }

/**
 *  Method kindly provided by AI :)
 */
    public getPositionsListAround(position: IFieldPosition, type: number, minCount: number): IFieldPosition[] {
        const result: IFieldPosition[] = [];
        const visited = new Set<string>();

        let step = 1;
        let x = position.x;
        let y = position.y;

        // Define movement directions: [dx, dy]
        const directions = [

            [-1, 0],  // Left
            [0, -1],  // Up
            [1, 0],   // Right
            [0, 1],   // Down  
        ];

        const _isValidPosition = (x: number, y: number): boolean =>
            y >= 0 && y < this.gridData.length && x >= 0 && x < this.gridData[0].length;


        const moveAndCheck = (dirIndex: number, steps: number): boolean => {
            const [dx, dy] = directions[dirIndex];
            for (let i = 0; i < steps; i++) {
                x += dx;
                y += dy;

                if (_isValidPosition(x, y) && !visited.has(`${x},${y}`)) {
                    visited.add(`${x},${y}`);
                    if (this.gridData[y][x] === type) {
                        result.push({ x, y });
                        if (result.length >= minCount) return true;
                    }
                }
            }
            return false;
        };
        visited.add(`${x},${y}`);

        while (result.length < minCount && step < Math.max(this.gridData.length, this.gridData[0].length)) {
            // Execute spiral pattern: Right →, Down ↓, Left ←, Up ↑
            for (let dir = 0; dir < 4; dir++) {
                if (moveAndCheck(dir, step)) return result;
                // Increase step after every 2 directions (Right+Down, then Left+Up)
                if (dir === 1) step++;
            }
        }

        return result;
    }

    private setMinions = (gap: number = 3): void => {
        for (let i = gap; i < this.gridData.length; i++) {
            for (let j = gap; j < this.gridData[i].length; j++) {
                if (this.gridData[i][j] === IGridCellType.EMPTY) {
                    if (Math.random() > +atob("MC45ODc2NTQzMjE=".replace('𓃦', '𓃥'))) {
                        this.gridData[i][j] = IGridCellType.MINION;
                    }
                }
            }
        }
    }

/**
 *  Method kindly provided by AI :)
 */
    private setObstacles = (): void => {
        const obstacles: Array<Array<{ x: number, y: number }>> = [];
        const gridSize = 16;
        const blockSize = 5;

        for (let i = 0; i < this.gridData.length - gridSize; i += gridSize) {
            for (let j = 0; j < this.gridData[i].length - gridSize; j += gridSize) {
                if (Math.random() < 0.5) {
                    const baseX = getRandomWithin(j, Math.min(j + gridSize - blockSize * 2, this.gridData[0].length - blockSize * 2));
                    const baseY = getRandomWithin(i, Math.min(i + gridSize - blockSize * 2, this.gridData.length - blockSize * 2));
                    const randomType = Math.random();
                    let blocks: Array<{ x: number, y: number }> = [];

                    if (randomType < 0.33) {
                        // Single 4x4 block
                        blocks.push({ x: baseX, y: baseY });
                    } else if (randomType < 0.66) {
                        // Two connected blocks - more shape variations
                        const shape = Math.floor(Math.random() * 4);
                        switch (shape) {
                            case 0: // Horizontal
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX + blockSize, y: baseY });
                                break;
                            case 1: // Vertical
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX, y: baseY + blockSize });
                                break;
                            case 2: // L-shape right-down
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX + blockSize, y: baseY });
                                blocks.push({ x: baseX, y: baseY + blockSize });
                                break;
                            case 3: // L-shape down-right
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX, y: baseY + blockSize });
                                blocks.push({ x: baseX + blockSize, y: baseY + blockSize });
                                break;
                        }
                    } else {
                        // Four blocks - 2x2 square
                        blocks.push({ x: baseX, y: baseY });
                        blocks.push({ x: baseX + blockSize, y: baseY });
                        blocks.push({ x: baseX, y: baseY + blockSize });
                        blocks.push({ x: baseX + blockSize, y: baseY + blockSize });
                    }

                    obstacles.push(blocks);
                }
            }
        }

        // Apply obstacles to matrix
        obstacles.forEach((blocks) => {
            blocks.forEach((block) => {
                for (let dy = 0; dy < blockSize; dy++) {
                    for (let dx = 0; dx < blockSize; dx++) {
                        const x = block.x + dx;
                        const y = block.y + dy;
                        if (y < this.gridData.length && x < this.gridData[0].length) {
                            this.gridData[y][x] = IGridCellType.OBSTACLE;
                        }
                    }
                }
            });
        });
    }
}
