export class GameEvents {

    public readonly GAMEOBJECT_AROUND_POSITION_SPOTTED = 'gameobject_around_position_spotted';
    public readonly PATHFINDER_DEFAULT_FAILED = 'pathfinder_find_returned_null';
    public readonly RENDERER_ENTER_CYCLE_EVENT = 'renderer_enter_cycle_event';
    public readonly GAMEFIELD_POINTER_DOWN_EVENT = 'gamefield_pointer_down_event';
    public readonly GAMEOBJECT_REACHED_EXIT_EVENT = 'gameobject_reached_exit_event';

    //public readonly DUDE_DISLOCATION_REPORT = ''

    private readonly events:any = {};
   
    public addEventListener = (eventName: string, handler: Function): void => {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      return this.events[eventName].push(handler);
    }
  
    public removeEventListener = (eventName: string): any => {
      return delete this.events[eventName];
    }
  
    public dispatchEvent = (eventName: string, data: any = null): void => {
      const event = this.events[eventName];
      if (event) {
        event.forEach((handler:Function) => {
          handler.call(null, data);
        });
      }
    }
  }

  export default new GameEvents();

