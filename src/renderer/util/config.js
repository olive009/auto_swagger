import ColorConfig from './ColorConfig';

const Config = {
    DB_FILE_NAME: 'data.json',
    DB_DEFAULT_ID: '0',
    DB_NAME_WORKSPACE: 'workspace',
    DB_NAME_FOLDER: 'folder',
    DB_NAME_REQUEST: 'request',
    DB_NAME_RESPONSE: 'response',
    DB_NAME_LAST_STATE: 'lastState',
    DB_NAME_ENV: 'env',
    DB_NAME_COOKIES: 'cookies',

    EVENT_BUS_LOAD_NEW_WORKSPACE: 'load-new-workspace',
    EVENT_BUS_UPDATE_ENV_NAME: 'update-env-name',
    EVENT_BUS_UPDATE_SELECTED_REQUEST: 'update-selected-request',
    EVENT_BUS_SEND_BUTTON_CLICKED: 'send-button-clicked',

    ACTION_UPDATE_DB: 'updateDB',
    ACTION_UPDATE_LAST_STATE: 'updateLastState',
    ACTION_UPDATE_CURRENT_FOLDER_LIST: 'updateCurrentFolderList',

    MENU_NEW_WORKSPACE: 'newWorkspace',
    MENU_NEW_FOLDER: 'newFolder',
    MENU_WORKSPACE_SETTING: 'workspaceSetting',
    MENU_IMPORT_SWAGGER_DOC: 'importSwaggerDoc',
    MENU_IMPORT_WORKSPACE: 'importWorkspace',
    MENU_EXPORT_WORKSPACE: 'exportWorkspace',

    MENU_COPY_REQUEST: 'copyRequest',
    MENU_DELETE_REQUEST: 'deleteRequest',
    MENU_CONFIG_REQUEST: 'configRequest',

    MENU_COPY_FOLDER: 'copyFolder',
    MENU_DELETE_FOLDER: 'deleteFolder',
    MENU_CONFIG_FOLDER: 'configFolder',

    MENU_CONFIG_ENV: 'configEnv',

    HTTP_METHOD_LIST: [
        { name: 'GET', color: ColorConfig.COLOR_GET },
        { name: 'POST', color: ColorConfig.COLOR_POST },
        { name: 'PUT', color: ColorConfig.COLOR_PUT },
        { name: 'PATCH', color: ColorConfig.COLOR_PATCH },
        { name: 'DELETE', color: ColorConfig.COLOR_DELETE },
        { name: 'OPTIONS', color: ColorConfig.COLOR_OPTIONS },
        { name: 'HEAD', color: ColorConfig.COLOR_HEAD }
    ],

    HTTP_METHOD_COLOR_MAPPING: {
        GET: ColorConfig.COLOR_GET,
        POST: ColorConfig.COLOR_POST,
        PUT: ColorConfig.COLOR_PUT,
        PATCH: ColorConfig.COLOR_PATCH,
        DELETE: ColorConfig.COLOR_DELETE,
        OPTIONS: ColorConfig.COLOR_OPTIONS,
        HEAD: ColorConfig.COLOR_HEAD
    }
};
export default Config;
