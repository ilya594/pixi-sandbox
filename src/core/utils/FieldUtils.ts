import { Ticker } from "pixi.js";
import { DynamicGameObjectState, IGridCellType, IGlobalPosition } from "../../common";
import { GameConfig } from "../config/Config";
import GameEvents from "../data/GameEvents";
import { getRandomWithin, P } from "./Utils";
import PathFinder from "./PathUtils";
import GameObjects from "../data/GameObjects";
import { Minion } from "../view/components/Minion";
import { MinionFabric } from "../data/MinionFabric";
import { DynamicGameObject } from "../view/DynamicGameObject";
import { PositionGrid } from "../view/PositionGrid";
import { ObjectPosition } from "../view/ObjectPosition";

export class FieldUtils {
    private pathFinder: PathFinder;
    public positionGrid: PositionGrid;
    private gridData: Array<Uint8Array>;

    constructor() {
        this.positionGrid = new PositionGrid(GameConfig.FIELD_WIDTH, GameConfig.FIELD_HEIGHT);
        this.createGridData();
        this.setDude();
        this.setExit();
        this.setObstacles();
        this.setMinions();
    }

    public initialize = () => {
        this.pathFinder = new PathFinder();

        const dudeObserverDisposer = this.createPositionObserver(GameObjects.dude, GameConfig.CELL_SIZE, (object: DynamicGameObject, x: number, y: number) => {
            const previous: ObjectPosition = ObjectPosition.fromPixels(x, y);
            const current: ObjectPosition = object.location;

            this.updateGridData(previous, current, IGridCellType.DUDE);
            this.positionGrid.updateObjectPosition(object, current);

            const minions: Array<Minion> = this.getMinionsAround(current, 2);
            if (minions?.length) {
                GameEvents.dispatchEvent(GameEvents.GAMEOBJECT_AROUND_POSITION_SPOTTED, minions);
            }
        });
    }

    private updateGridData = (previous: ObjectPosition, current: ObjectPosition, type: IGridCellType): void => {
        this.gridData[previous.j][previous.i] = IGridCellType.EMPTY;
        this.gridData[current.j][current.i] = type as IGridCellType;
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
        currentPosition: ObjectPosition,
        newPosition: ObjectPosition,
        smoothPath: boolean = true): Array<IGlobalPosition> => {
        const path = this.pathFinder.findPath(
            this.gridData, 
            currentPosition.toFieldCoords(), 
            newPosition.toFieldCoords(), 
            smoothPath
        );
        return path?.map(p => this.positionGrid.getPosition(p.x, p.y)?.toGlobalCoords()) || null;
    }

    public getLocationType = (i: number, j: number): IGridCellType => {
        return this.gridData[i][j] as IGridCellType;
    }

    public getMinionsAround = (position: ObjectPosition, radius: number = 2): Minion[] => {
        const neighbors = this.positionGrid.getNeighbors(position, radius);
        return neighbors
            .map((position: any) => position.gameObject)
            .filter((object: any) => object instanceof Minion && object.state === DynamicGameObjectState.FRUSTRATING) as Minion[];
    }

    private createGridData = () => {
        this.gridData = new Array();
        for (let j = 0; j < GameConfig.FIELD_HEIGHT; j++) {
            const chunk = new Uint8Array(GameConfig.FIELD_WIDTH);
            for (let i = 0; i < GameConfig.FIELD_WIDTH; i++) {
                chunk[i] = IGridCellType.EMPTY;
            }
            this.gridData.push(chunk);
        }
    }

    private setDude = () => {
        this.gridData[0][0] = IGridCellType.DUDE;
        const dudePosition = this.positionGrid.getPosition(0, 0);
        if (dudePosition && GameObjects.dude) {
            GameObjects.dude.location = dudePosition;
            this.positionGrid.updateObjectPosition(GameObjects.dude, dudePosition);
        }
    }

    private setExit = () => {
        const w: number = this.gridData.length - 3;
        const h: number = this.gridData[0].length - 3;
        const ry: number = getRandomWithin(w, Math.ceil(w / Math.LOG2E));
        const rx: number = getRandomWithin(h, Math.ceil(h / Math.LOG2E));
        this.gridData[ry][rx] = IGridCellType.EXIT;
    }

    public getFirstTypedPosition = (type: IGridCellType): ObjectPosition => {
        const positions = this.getTypedFieldPositions(type);
        return positions.length > 0 ? positions[0] : ObjectPosition.fromField(0, 0);
    }

    public getTypedFieldPositions = (type: IGridCellType): Array<ObjectPosition> => {
        const result: ObjectPosition[] = [];
        for (let j = 0; j < this.gridData.length; j++) {
            for (let i = 0; i < this.gridData[j].length; i++) {
                if (this.gridData[j][i] === type) {
                    const position = this.positionGrid.getPosition(i, j);
                    if (position) result.push(position);
                }
            }
        }
        return result;
    }

    public getPositionsListAround = (position: ObjectPosition, type: number, minCount: number): ObjectPosition[] => {
        return this.positionGrid.getNeighbors(position, 5, true)
            .filter((position: any) => !position.isOccupied && position.isWalkable)
            .slice(0, minCount);
    }

    private setMinions = (gap: number = 3): void => {
        for (let j = gap; j < this.gridData.length; j++) {
            for (let i = gap; i < this.gridData[j].length; i++) {
                if (this.gridData[j][i] === IGridCellType.EMPTY) {
                    if (Math.random() > +atob("MC45ODc2NTQzMjE=".replace('𓃦', '𓃥'))) {
                        this.gridData[j][i] = IGridCellType.MINION;
                    }
                }
            }
        }
    }

    private setObstacles = (): void => {
        const obstacles: Array<Array<{ x: number, y: number }>> = [];
        const gridSize = 16;
        const blockSize = 5;

        for (let j = 0; j < this.gridData.length - gridSize; j += gridSize) {
            for (let i = 0; i < this.gridData[j].length - gridSize; i += gridSize) {
                if (Math.random() < 0.5) {
                    const baseX = getRandomWithin(i, Math.min(i + gridSize - blockSize * 2, this.gridData[0].length - blockSize * 2));
                    const baseY = getRandomWithin(j, Math.min(j + gridSize - blockSize * 2, this.gridData.length - blockSize * 2));
                    const randomType = Math.random();
                    let blocks: Array<{ x: number, y: number }> = [];

                    if (randomType < 0.33) {
                        blocks.push({ x: baseX, y: baseY });
                    } else if (randomType < 0.66) {
                        const shape = Math.floor(Math.random() * 4);
                        switch (shape) {
                            case 0:
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX + blockSize, y: baseY });
                                break;
                            case 1:
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX, y: baseY + blockSize });
                                break;
                            case 2:
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX + blockSize, y: baseY });
                                blocks.push({ x: baseX, y: baseY + blockSize });
                                break;
                            case 3:
                                blocks.push({ x: baseX, y: baseY });
                                blocks.push({ x: baseX, y: baseY + blockSize });
                                blocks.push({ x: baseX + blockSize, y: baseY + blockSize });
                                break;
                        }
                    } else {
                        blocks.push({ x: baseX, y: baseY });
                        blocks.push({ x: baseX + blockSize, y: baseY });
                        blocks.push({ x: baseX, y: baseY + blockSize });
                        blocks.push({ x: baseX + blockSize, y: baseY + blockSize });
                    }

                    obstacles.push(blocks);
                }
            }
        }

        obstacles.forEach((blocks) => {
            blocks.forEach((block) => {
                for (let dy = 0; dy < blockSize; dy++) {
                    for (let dx = 0; dx < blockSize; dx++) {
                        const x = block.x + dx;
                        const y = block.y + dy;
                        if (y < this.gridData.length && x < this.gridData[0].length) {
                            this.gridData[y][x] = IGridCellType.OBSTACLE;
                            const position = this.positionGrid.getPosition(x, y);
                            if (position) {
                                position.isWalkable = false;
                            }
                        }
                    }
                }
            });
        });
    }
}