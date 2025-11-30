/**
 * Facade as singletone class, providing access to game objects 
 */

import { Dude } from "../view/components/Dude";
import { Exit } from "../view/components/Exit";
import { Field } from "../view/components/Field";
import { Minion } from "../view/components/Minion";
import { Pointer } from "../view/components/Pointer";
import { Score } from "../view/components/Score";
import { Textholder } from "../view/components/Textholder";


export class GameObjects {

    public dude: Dude;
    public minions: Array<Minion>;
    public pointer: Pointer;
    public exit: Exit;
    public field: Field;
    public dialog: Textholder;
    public score: Score;
    
}

export default new GameObjects();