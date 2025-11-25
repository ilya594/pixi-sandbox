import { Assets, Container, Ticker } from "pixi.js";
import { IGridCellType, IFieldPosition, IGameRenderer, IGlobalPosition } from "../common";
import { GameConfig } from "./config/Config";
import UIComponents from "./view/UIComponents";
import { Dude } from "./view/components/Dude";
import { Pointer } from "./view/components/Pointer";
import Field from "./view/components/Field";
import GameEvents from "./data/GameEvents";
import { FieldUtils } from "./utils/FieldUtils";
import { MinionFabric } from "./data/MinionFabric";
import PathFinder from "./utils/PathUtils";
import { pixelsToPosition, positionToPixels } from "./utils/Utils";
import { WarningType } from "../common";
import WebGLRenderer from "./view/WebGLRenderer";
import { Minion } from "./view/components/Minion";
import GameObjects from "./data/GameObjects";
import { Textholder } from "./view/components/Textholder";
import { Exit } from "./view/components/Exit";
import { DynamicGameObject } from "./view/DynamicGameObject";
import Game from "../Game";
import { Score } from "./view/components/Score";

export class GameController {

    private renderer: IGameRenderer;
    private fieldUtils: FieldUtils;


    constructor() {
        this.initialize();
    }

    private initialize = async () => {

        UIComponents.matrixEffect();

        this.renderer = await WebGLRenderer.initialize();

        this.fieldUtils = new FieldUtils();

        this.initializeEntities();

        this.renderer.displayEntities();

        this.fieldUtils.initialize();

        GameEvents.addEventListener(GameEvents.GAMEFIELD_POINTER_DOWN_EVENT, this.onFieldPointerDown);
        GameEvents.addEventListener(GameEvents.GAMEOBJECT_AROUND_POSITION_SPOTTED, this.onObjectsEngaged);
        GameEvents.addEventListener(GameEvents.GAMEOBJECT_REACHED_EXIT_EVENT, this.onObjectExiting);
    }

    private initializeEntities = async () => {

        GameObjects.exit = new Exit(Assets.get(GameConfig.EXIT.TEXTURE_DEFAULT), this.fieldUtils.getFirstTypedPosition(IGridCellType.EXIT, true));
        GameObjects.dude = new Dude(Assets.get(GameConfig.DUDE.TEXTURE_DEFAULT));
        GameObjects.minions = (new MinionFabric(this.fieldUtils)).getMinions();
        GameObjects.pointer = new Pointer(Assets.get(GameConfig.ENDPOINT.TEXTURE_DEFAULT));
        GameObjects.field = new Field(this.fieldUtils);
        GameObjects.dialog = new Textholder(Assets.get(GameConfig.DIALOG.TEXTURE_DEFAULT));
        GameObjects.score = new Score(Assets.get(GameConfig.SCORE.TEXTURE_DEFAULT));
    }

    private onFieldPointerDown = (event: any): void => {

        GameObjects.pointer.place({ x: event.x, y: event.y });

        const newPosition: IFieldPosition = pixelsToPosition({ x: event.x, y: event.y });
        const currentPosition: IFieldPosition = pixelsToPosition(GameObjects.dude.position);

        const path: Array<any> = this.fieldUtils.findPath(currentPosition, newPosition, true);

        path ? GameObjects.dude.setPath(path) : UIComponents.showWarning(WarningType.LOCATION_UNAVAILABLE);
    }

    private onObjectsEngaged = (objects: Array<DynamicGameObject>): void => {

        const target: IGlobalPosition = GameObjects.dude.getTarget();

        // TODO get rid of this global-to-local position mess around
        const positions: Array<IFieldPosition> = this.fieldUtils.getPositionsListAround(pixelsToPosition(target), IGridCellType.EMPTY, 5);

        /*
        let halfTimeout: any;
        let fullTimeout: any;

        //TODO refactor this shit
        const processDialogStuff = (minion: Minion) => {
              GameObjects.dialog.showText(minion);
              Ticker.shared.stop();

                clearTimeout(halfTimeout);
                
                halfTimeout = setTimeout(() => {
                    GameObjects.dialog.showText(GameObjects.dude, 'ㄨМM...੦ഠ〇K !');
                }, GameConfig.DIALOG.DISPLAY_TIME / 2);

                clearTimeout(fullTimeout);

                fullTimeout = setTimeout(() => {
                    GameObjects.dialog.hide();
                    Ticker.shared.start();
                }, GameConfig.DIALOG.DISPLAY_TIME);
        }
                */

        objects.forEach((minion: Minion) => {
            if (GameObjects.dude.addToGroup(minion)) {
                //processDialogStuff(minion);      
                minion.setPath(this.fieldUtils.findPath(
                    pixelsToPosition(minion.position), pixelsToPosition(target), true));
            }
        });

        GameObjects.minions.forEach((minion: Minion) => {
            if (minion.isGrouped) {
                minion.appendPath([positionToPixels(positions.pop())]);
            }
        });
    }

    private onObjectExiting = (object: Minion) => {
        GameObjects.score.adjustAmount(object.getPrice());
        GameObjects.minions.splice(GameObjects.minions.findIndex(({ uuid }) => object.uuid === uuid), 1)
            && GameObjects.dude.removeFromGroup(object) && object.destroyObject() && WebGLRenderer.removeEntities([object]);
    }
}

export default GameController;