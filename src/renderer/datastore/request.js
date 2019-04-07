import BaseDB from './base';
import Config from '@/util/config';
import { showNotification, consoleLogSavingObject, consoleLogText } from '@/util/LogUtil';

export default class RequestDB extends BaseDB {
    setRequestDefaultFields(request) {
        if (!request.method) {
            request.method = 'GET';
        }
        if (!request.folderId) {
            request.folderId = null;
        }
        if (!request.sort) {
            request.sort = 0;
        }
        return request;
    }

    createRequest(request) {
        let updatedRequest = this.setRequestDefaultFields(request);
        consoleLogSavingObject('saving request:', updatedRequest);
        showNotification('request[' + updatedRequest.name + '] created!');
        return this.db
            .get(Config.DB_NAME_REQUEST)
            .insert(updatedRequest)
            .write();
    }

    updateRequest(request) {
        let updatedRequest = this.setRequestDefaultFields(request);
        consoleLogSavingObject('updating request:', updatedRequest);
        showNotification('request[' + updatedRequest.name + ' updated!');
        this.db
            .get(Config.DB_NAME_REQUEST)
            .find({ id: updatedRequest.id })
            .assign(updatedRequest)
            .write();
    }

    deleteRequest(requestId) {
        // also delete the corresponding response
        this.deleteResponse(requestId);
        this.db
            .get(Config.DB_NAME_REQUEST)
            .removeById(requestId)
            .write();
        showNotification('request deleted!');
    }

    deleteResponse(requestId) {
        let response = this.db
            .get(Config.DB_NAME_RESPONSE)
            .find({ requestId: requestId })
            .value();
        if (response && response.id) {
            consoleLogText('deleting response of id: ' + response.id);
            this.db
                .get(Config.DB_NAME_RESPONSE)
                .removeById(response.id)
                .write();
        }
    }

    getNoFolderRequestList() {
        return this.db
            .get(Config.DB_NAME_REQUEST)
            .filter({
                workspaceId: this.store.state.GlobalData.lastState.lastWorkspaceId,
                folderId: null
            })
            .sortBy('sort')
            .value();
    }

    getRequestListLike(text) {
        let allList = this.db
            .get(Config.DB_NAME_REQUEST)
            .filter({
                workspaceId: this.store.state.GlobalData.lastState.lastWorkspaceId
            })
            .sortBy('sort')
            .value();
        if (allList) {
            return allList.filter(request => {
                return request.name && request.name.toUpperCase().includes(text.toUpperCase());
            });
        } else {
            return allList;
        }
    }

    getFolderNameById(folderId) {
        let folder = this.db
            .get(Config.DB_NAME_FOLDER)
            .find({
                id: folderId
            })
            .value();
        if (folder) {
            return folder.name;
        } else {
            consoleLogText("warning: can't get folder.name of id[" + folderId + ']', 'red');
            return null;
        }
    }

    getFolderIdByFolderNameAndWorkspaceId(folderName, workspaceId) {
        let folder = this.db
            .get(Config.DB_NAME_FOLDER)
            .find({
                name: folderName,
                workspaceId: workspaceId
            })
            .value();
        if (folder) {
            return folder.id;
        } else {
            consoleLogText(
                "warning: can't get folder.id of name[" + folderName + '],workspaceId[' + workspaceId + ']',
                'red'
            );
            return null;
        }
    }
}
