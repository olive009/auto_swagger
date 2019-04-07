import LastStoreDB from './laststore';
import WorkspaceDB from './workspace';
import { consoleLogText } from '@/util/LogUtil';
import FolderDB from './folder';
import RequestDB from './request';
import ResponseDB from './response';
import EnvironmentDB from './environment';

class DBUtil {
    db = null;
    store = null;
    lastStoreDB;
    workspaceDB;
    folderDB;
    requestDB;
    responseDB;
    envDB;

    /**
     * init with db and store
     * @param db
     * @param store
     */
    init(db, store) {
        this.db = db;
        this.store = store;
        consoleLogText('dbUtil initialized.');
        this.lastStoreDB = new LastStoreDB(db, store);
        this.workspaceDB = new WorkspaceDB(db, store);
        this.folderDB = new FolderDB(db, store);
        this.requestDB = new RequestDB(db, store);
        this.responseDB = new ResponseDB(db, store);
        this.envDB = new EnvironmentDB(db, store);

        this.copyFunctions(LastStoreDB, this.lastStoreDB);
        this.copyFunctions(WorkspaceDB, this.workspaceDB);
        this.copyFunctions(FolderDB, this.folderDB);
        this.copyFunctions(RequestDB, this.requestDB);
        this.copyFunctions(ResponseDB, this.responseDB);
        this.copyFunctions(EnvironmentDB, this.envDB);
    }

    /**
     * copy functions from dbInstance,then we can call those methods directly from dbUtil instance
     * @param DBClass
     * @param dbInstance
     */
    copyFunctions(DBClass, dbInstance) {
        let functionList = Object.getOwnPropertyNames(DBClass.prototype).filter(f => f !== 'constructor');
        functionList.forEach(f => {
            this[f] = dbInstance[f];
        });
    }
}

const dbUtil = new DBUtil();

export default dbUtil;
