import Datastore from 'lowdb';
import LodashId from 'lodash-id';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs-extra';
import { remote, app } from 'electron';
import Config from '@/util/config';

if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}
if (process.env.DEBUG_ENV === 'debug') {
    global.__static = path.join(__dirname, '../../static').replace(/\\/g, '\\\\');
}

const APP = process.type === 'renderer' ? remote.app : app;
const STORE_PATH = APP.getPath('userData');
console.log('data folder path: ' + STORE_PATH);
if (process.type !== 'renderer') {
    if (!fs.pathExistsSync(STORE_PATH)) {
        fs.mkdirpSync(STORE_PATH);
    }
}

const adapter = new FileSync(path.join(STORE_PATH, '/' + Config.DB_FILE_NAME));

const db = Datastore(adapter);
db._.mixin(LodashId);

if (!db.has(Config.DB_NAME_WORKSPACE).value()) {
    let workspace = {
        id: Config.DB_DEFAULT_ID,
        name: 'Default Workspace',
        desc: ''
    };
    db.set(Config.DB_NAME_WORKSPACE, [workspace]).write();
}

if (!db.has(Config.DB_NAME_FOLDER).value()) {
    db.set(Config.DB_NAME_FOLDER, []).write();
}

if (!db.has(Config.DB_NAME_REQUEST).value()) {
    let request = {
        id: Config.DB_DEFAULT_ID,
        workspaceId: Config.DB_DEFAULT_ID,
        folderId: null,
        name: 'new-request',
        method: 'GET'
    };
    db.set(Config.DB_NAME_REQUEST, [request]).write();
}

if (!db.has(Config.DB_NAME_RESPONSE).value()) {
    db.set(Config.DB_NAME_RESPONSE, []).write();
}

if (!db.has(Config.DB_NAME_LAST_STATE).value()) {
    let lastState = {
        id: Config.DB_DEFAULT_ID,
        lastWorkspaceId: Config.DB_DEFAULT_ID,
        lastFolderId: Config.DB_DEFAULT_ID,
        lastRequestId: Config.DB_DEFAULT_ID,
        openedSubmenuList: []
    };
    db.set(Config.DB_NAME_LAST_STATE, lastState).write();
}

if (!db.has(Config.DB_NAME_ENV).value()) {
    let env = {
        id: Config.DB_DEFAULT_ID,
        name: 'Base Environment',
        desc: '* properties defined in Base Environment would override those defined in Sub Environments',
        data: {}
    };
    db.set(Config.DB_NAME_ENV, [env]).write();
}

if (!db.has(Config.DB_NAME_COOKIES).value()) {
    db.set(Config.DB_NAME_COOKIES, []).write();
}

export default db;
