
import GameController from './core/GameController';


export class Game {

    private controller: GameController;

    constructor() {
        this.initialize();
    }

    public initialize = async () => {        
        this.controller = new GameController();    
    }
}

export default new Game();