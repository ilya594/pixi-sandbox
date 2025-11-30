import { Assets, Sprite } from "pixi.js";
import { GameConfig } from "../../config/Config";
import { FieldUtils } from "../../utils/FieldUtils";
import { IGridCellType } from "../../../common";


export class Field extends Sprite {

    private data: FieldUtils;
    constructor(data: FieldUtils) {
        super();
        this.interactive = true;
        this.data = data;
        this.redraw();
    }

    public redraw = () => {
        const visited = new Set<string>();

        for (let i = 0; i < GameConfig.FIELD_HEIGHT; i++) {
            for (let j = 0; j < GameConfig.FIELD_WIDTH; j++) {                
                const coordKey = `${i},${j}`;
                if (!visited.has(coordKey) &&
                    this.data.getLocationType(i, j) === IGridCellType.OBSTACLE) {
                    const sprite: Sprite = new Sprite(Assets.get(Math.random() < 0.2 ? 'obstacle_tag' : 'obstacle_big'));

                    sprite.x = j * GameConfig.CELL_SIZE;
                    sprite.y = i * GameConfig.CELL_SIZE;
                    this.addChild(sprite);

                    for (let di = 0; di < 5; di++) {
                        for (let dj = 0; dj < 5; dj++) {
                            const visitedRow = i + di;
                            const visitedCol = j + dj;
                            if (visitedRow < GameConfig.FIELD_HEIGHT && visitedCol < GameConfig.FIELD_WIDTH) {
                                visited.add(`${visitedRow},${visitedCol}`);
                            }
                        }
                    }
                }
            }
        }
    }
}