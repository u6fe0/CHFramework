import { Observable, Command, PropertyChanged } from '../../CHFramework/Framework';
import { PlayerModel } from './PlayerModel';
export class PlayerViewModel extends PropertyChanged {
    name: Observable<string>;
    hp: Observable<number>;
    damageCommand: Command;

    constructor(model: PlayerModel) {
        super();
        this.name = new Observable(model.name);
        this.hp = new Observable(model.hp);

        this.damageCommand = new Command(() => {
            this.hp.value = Math.max(0, this.hp.value - 10);
            this.notifyPropertyChanged("hp", this.hp.value);
        });
    }
}