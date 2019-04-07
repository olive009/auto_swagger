import dbUtil from '@/datastore/DBUtil';

function convertToWorkspace(doc) {
    let host = doc.host;
    let basePath = doc.basePath;

    let workspaceName = doc.info.title;
    let desc = doc;
    let workspace = dbUtil.createWorkspace({ name: workspaceName, data: desc });

    let folderList = [];
    if (doc.tags && doc.tags.length > 0) {
        doc.tags.forEach(tag => {
            let folder = {};
            folder.name = tag.name;
            folder.desc = tag.description;
            if (tag.externalDocs) {
                folder.desc += '\n ' + tag.externalDocs.toString();
            }
            // set workspaceId
            folder.workspaceId = workspace.id;
            let savedFolder = dbUtil.createFolder(folder);
            folderList.push(savedFolder);
        });
    }

    if (doc.paths) {
        let pathObjList = extractAsNewProperty(doc.paths, 'path');
        pathObjList.forEach(pathObj => {
            let obj = pathObj.value;
            let methodObjList = extractAsNewProperty(obj, 'method');
            methodObjList.forEach(methodObj => {
                let request = {};
                request.method = methodObj.method.toUpperCase();
                request.name = methodObj.value.operationId ? methodObj.value.operationId : methodObj.value.summary;
                if (methodObj.value.deprecated) {
                    request.deprecated = true;
                }
                request.parameters = methodObj.value.parameters;
                request.responses = methodObj.value.responses;
                if (methodObj.value.tags && methodObj.value.tags.length > 0) {
                    // request in swagger might has more than one tag
                    let folderName = methodObj.value.tags[0];
                    // getFolderIdByFolderName
                    request.folderId = getFolderIdByFolderName(folderList, folderName);
                }
                request.workspaceId = workspace.id;

                request.url = host + basePath + pathObj.path;
                dbUtil.createRequest(request);
            });
        });
    }

    return workspace;
}

function extractAsNewProperty(obj, newProperty) {
    let properties = Object.keys(obj);
    let objList = [];
    for (let i = 0; i < properties.length; i++) {
        let property = properties[i];
        let value = obj[property];
        let newObj = {};
        newObj[newProperty] = property;
        newObj['value'] = value;
        objList.push(newObj);
    }
    return objList;
}

function getFolderIdByFolderName(folderList, folderName) {
    for (let i = 0; i < folderList.length; i++) {
        let folder = folderList[i];
        if (folder.name === folderName) {
            return folder.id;
        }
    }
}

export { convertToWorkspace };
