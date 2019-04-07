import Config from '@/util/config';
import BaseDB from './base';
import { consoleLogSavingObject } from '@/util/LogUtil';

export default class LastStoreDB extends BaseDB {
    getLastState() {
        let lastState = this.db.get(Config.DB_NAME_LAST_STATE).value();
        this.store.dispatch(Config.ACTION_UPDATE_LAST_STATE, lastState);
        return lastState;
    }

    saveLastState(lastState) {
        consoleLogSavingObject('saving lastSate:', lastState);
        this.store.dispatch(Config.ACTION_UPDATE_LAST_STATE, lastState);
        return this.db.set(Config.DB_NAME_LAST_STATE, lastState).write();
    }
}
