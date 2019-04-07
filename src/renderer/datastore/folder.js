import BaseDB from './base';
import Config from '@/util/config';
import { Notification } from 'element-ui';
import { consoleLogText, consoleLogSavingObject, showNotification } from '@/util/LogUtil';

export default class FolderDB extends BaseDB {
    createFolder(folder) {
        consoleLogSavingObject('saving folder:', folder);
        return this.db
            .get(Config.DB_NAME_FOLDER)
            .insert(folder)
            .write();
    }

    deleteFolder(folderId) {
        consoleLogText('deleting folder of id: ' + folderId);
        // delete all the requests under this folderId
        this.deleteRequestByFolderId(folderId);
        this.db
            .get(Config.DB_NAME_FOLDER)
            .removeById(folderId)
            .write();
        showNotification('folder deleted!');
    }

    updateFolder(folder) {
        consoleLogSavingObject('updating folder:', folder);
        this.db
            .get(Config.DB_NAME_FOLDER)
            .find({ id: folder.id })
            .assign(folder)
            .write();
        showNotification('folder [' + folder.name + '] updated!');
    }

    getFolderIdByRequestId(requestId) {
        let request = this.db
            .get(Config.DB_NAME_REQUEST)
            .find({
                id: requestId
            })
            .value();
        if (request) {
            return request.folderId;
        } else {
            return null;
        }
    }

    getFolderById(folderId) {
        return this.db
            .get(Config.DB_NAME_FOLDER)
            .find({
                id: folderId
            })
            .value();
    }

    copyFolder(folder) {
        let currentName = folder.name;
        let oldFolderId = folder.id;
        // copy folder
        let oldFolder = this.db
            .get(Config.DB_NAME_FOLDER)
            .find({ id: oldFolderId })
            .value();
        let newFolder = { ...folder };
        newFolder.id = null;
        if (oldFolder.name === currentName) {
            newFolder.name = currentName + '-copy';
        } else {
            newFolder.name = currentName;
        }
        let savedFolder = this.createFolder(newFolder);

        let newFolderId = savedFolder.id;

        // copy request list
        let requestList = this.getRequestListByFolderId(oldFolderId);
        requestList.forEach(request => {
            let newRequest = { ...request };
            newRequest.id = null;
            newRequest.folderId = newFolderId;
            this.createRequest(newRequest);
        });

        Notification.closeAll();
        showNotification('folder duplicated!');
        return savedFolder;
    }

    deleteRequestByFolderId(folderId) {
        this.db
            .get(Config.DB_NAME_REQUEST)
            .remove(request => folderId === request.folderId)
            .write();
    }

    getRequestListByFolderId(folderId) {
        return this.db
            .get(Config.DB_NAME_REQUEST)
            .filter({
                folderId: folderId
            })
            .sortBy('sort')
            .value();
    }

    getLastWorkspaceFolderList() {
        return this.db
            .get(Config.DB_NAME_FOLDER)
            .filter({
                workspaceId: this.store.state.GlobalData.lastState.lastWorkspaceId
            })
            .value();
    }
}
