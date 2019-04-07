import BaseDB from './base';
import Config from '@/util/config';
import { Notification } from 'element-ui';
import { showNotification, consoleLogSavingObject } from '@/util/LogUtil';

export default class WorkspaceDB extends BaseDB {
    getWorkspaceList() {
        return this.db.get(Config.DB_NAME_WORKSPACE).value();
    }

    createWorkspace(workspace) {
        consoleLogSavingObject('saving workspace:', workspace);
        return this.db
            .get(Config.DB_NAME_WORKSPACE)
            .insert(workspace)
            .write();
    }

    deleteWorkspace(workspaceId) {
        // delete request list
        this.deleteRequestByWorkspaceId(workspaceId);

        // delete folder list
        this.deleteFolderByWorkspaceId(workspaceId);

        // delete workspace
        this.db
            .get(Config.DB_NAME_WORKSPACE)
            .removeById(workspaceId)
            .write();

        showNotification('workspace deleted!');
    }

    copyWorkspace(oldWorkspace) {
        let currentName = oldWorkspace.name;
        let oldWorkspaceId = oldWorkspace.id;
        // copy workspace
        let workspace = this.db
            .get(Config.DB_NAME_WORKSPACE)
            .find({ id: oldWorkspaceId })
            .value();
        let newWorkspace = { ...workspace };
        newWorkspace.id = null;
        if (newWorkspace.name === currentName) {
            newWorkspace.name = currentName + '-copy';
        } else {
            newWorkspace.name = currentName;
        }
        let savedWorkspace = this.createWorkspace(newWorkspace);

        let newWorkspaceId = savedWorkspace.id;
        // copy folder list
        this.copyFolderByWorkspaceId(newWorkspaceId, oldWorkspaceId);

        // copy request list
        this.copyRequestByWorkspaceId(newWorkspaceId, oldWorkspaceId);

        Notification.closeAll();
        showNotification('workspace duplicated!');
        return savedWorkspace;
    }

    updateWorkspace(workspace) {
        consoleLogSavingObject('updating workspace:', workspace);
        this.db
            .get(Config.DB_NAME_WORKSPACE)
            .find({ id: workspace.id })
            .assign(workspace)
            .write();
        showNotification('workspace[' + workspace.name + '] updated!');
    }

    findWorkspaceById(id) {
        return this.db
            .get(Config.DB_NAME_WORKSPACE)
            .find({ id: id })
            .value();
    }

    getWorkspaceFolderByName(name) {
        return this.db
            .get(Config.DB_NAME_FOLDER)
            .find({
                workspaceId: this.store.state.GlobalData.lastState.lastWorkspaceId,
                name: name
            })
            .value();
    }

    deleteRequestByWorkspaceId(workspaceId) {
        this.db
            .get(Config.DB_NAME_REQUEST)
            .remove(request => workspaceId === request.workspaceId)
            .write();
    }

    deleteFolderByWorkspaceId(workspaceId) {
        this.db
            .get(Config.DB_NAME_FOLDER)
            .remove(folder => workspaceId === folder.workspaceId)
            .write();
    }

    copyFolderByWorkspaceId(newWorkspaceId, oldWorkspaceId) {
        let folderList = this.db
            .get(Config.DB_NAME_FOLDER)
            .filter({
                workspaceId: oldWorkspaceId
            })
            .value();
        folderList.forEach(folder => {
            let newFolder = { ...folder };
            newFolder.id = null;
            newFolder.workspaceId = newWorkspaceId;
            this.createFolder(newFolder);
        });
    }

    copyRequestByWorkspaceId(newWorkspaceId, oldWorkspaceId) {
        let requestList = this.db
            .get(Config.DB_NAME_REQUEST)
            .filter({
                workspaceId: oldWorkspaceId
            })
            .value();
        requestList.forEach(request => {
            let newRequest = { ...request };
            newRequest.id = null;
            newRequest.workspaceId = newWorkspaceId;
            // if has folderId
            if (newRequest.folderId) {
                let folderName = this.getFolderNameById(newRequest.folderId);
                newRequest.folderId = this.getFolderIdByFolderNameAndWorkspaceId(folderName, newWorkspaceId);
            }
            this.createRequest(newRequest);
        });
    }
}
