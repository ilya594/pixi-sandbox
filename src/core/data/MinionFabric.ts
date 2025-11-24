import { Assets } from "pixi.js";
import { Minion } from "../view/components/Minion";
import { GameConfig } from "../config/Config";
import { IGridCellType, IFieldPosition } from "../../common";
import { FieldUtils } from "../utils/FieldUtils";
import { getRandomWithin, positionToPixels } from "../utils/Utils";


export class MinionFabric {

    public static getMinionByGridtag = (minions: Array<Minion>, tag: string): Minion =>  {
        return minions.find(({gridtag}) => gridtag === tag);
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
                        minion.gridtag = JSON.stringify(position);
                        return minion;
        });
    }
}
