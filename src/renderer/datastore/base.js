export default class BaseDB {
    db = null;
    store = null;

    constructor(db, store) {
        this.db = db;
        this.store = store;
    }
}
