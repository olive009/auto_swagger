import BaseDB from './base';
import Config from '@/util/config';
import { consoleLogSavingObject, showNotification } from '@/util/LogUtil';

export default class EnvironmentDB extends BaseDB {
    createEnv(env) {
        consoleLogSavingObject('saving environment:', env);
        showNotification('environment [' + env.name + '] created!');
        let newEnv = this.db
            .get(Config.DB_NAME_ENV)
            .insert(env)
            .write();
        return { ...newEnv };
    }

    updateEnv(env) {
        consoleLogSavingObject('updating environment:', env);
        showNotification('environment [' + env.name + '] updated!');
        return this.db
            .get(Config.DB_NAME_ENV)
            .find({ id: env.id })
            .assign(env)
            .write();
    }

    deleteEnv(envId) {
        this.db
            .get(Config.DB_NAME_ENV)
            .removeById(envId)
            .write();
        showNotification('environment deleted!');
    }

    getEnvById(envId) {
        let env = this.db
            .get(Config.DB_NAME_ENV)
            .find({
                id: envId
            })
            .value();
        return { ...env };
    }

    getAllEnv() {
        return this.db
            .get(Config.DB_NAME_ENV)
            .filter(env => Config.DB_DEFAULT_ID !== env.id)
            .value();
    }
}
