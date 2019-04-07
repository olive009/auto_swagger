import BaseDB from './base';
import Config from '@/util/config';
import { consoleLogSavingObject } from '@/util/LogUtil';

export default class ResponseDB extends BaseDB {
    createResponse(response) {
        consoleLogSavingObject('saving response:', response);
        this.db
            .get(Config.DB_NAME_RESPONSE)
            .insert(response)
            .write();
    }

    updateResponse(response) {
        consoleLogSavingObject('updating response:', response);
        this.db
            .get(Config.DB_NAME_RESPONSE)
            .find({ id: response.id })
            .assign(response)
            .write();
    }

    saveResponse(response) {
        if (response.requestId) {
            let dbResponse = this.getResponseByRequestId(response.requestId);
            if (dbResponse && dbResponse.id) {
                this.updateResponse(dbResponse);
            } else {
                this.createResponse(response);
            }
        } else {
            this.createResponse(response);
        }
    }

    getResponseByRequestId(requestId) {
        return this.db
            .get(Config.DB_NAME_RESPONSE)
            .find({ requestId: requestId })
            .value();
    }
}
