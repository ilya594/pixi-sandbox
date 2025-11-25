import { Assets } from "pixi.js";
import { Minion } from "../view/components/Minion";
import { GameConfig } from "../config/Config";
import { IGridCellType, IFieldPosition } from "../../common";
import { FieldUtils } from "../utils/FieldUtils";
import { getRandomWithin, positionToPixels } from "../utils/Utils";
import GameObjects from "./GameObjects";


export class MinionFabric {

    public static getMinionByPosition = (position: IFieldPosition): Minion =>  {
        return GameObjects.minions.find((minion: Minion) => minion.position.equals(positionToPixels(position)));
    }

    private fieldData: FieldUtils;

    constructor(fieldData: FieldUtils) {

        this.fieldData = fieldData;
    }

    public getMinion = (): Minion => {
        const random: number = getRandomWithin(GameConfig.MINION.TEXTURES.length - 1, 1);      
        return (random > 1) ? new Minion(Assets.get('animal_00' + random)) : new Minion(Assets.get('animal_001'), true);
    }

    public getMinions = (): Array<Minion> => {
        const positions: Array<IFieldPosition> = this.fieldData.getTypedFieldPositions(IGridCellType.MINION);
        return positions.map((position: IFieldPosition) => {
                        const minion: Minion = this.getMinion();
                        minion.position = positionToPixels(position);
                        return minion;
        });
    }
}

/*

*/
