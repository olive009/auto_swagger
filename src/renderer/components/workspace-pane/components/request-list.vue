<template>
    <div class="v-div top-div">
        <el-menu
            class="menu"
            :default-openeds="openedSubmenuList"
            @open="addOpenedSubmenuList"
            @close="removeOpenedSubmenuList"
            @select="menuSelectHandler"
        >
            <el-submenu v-for="(folder, index) in folderMenuList" :key="folder.id" :index="folder.id">
                <template slot="title">
                    <Icon
                        v-if="$store.state.GlobalData.lastState.openedSubmenuList.indexOf(folder.id) !== -1"
                        type="ios-folder-open"
                        size="18"
                    />
                    <Icon v-else type="md-folder" size="18" />
                    <folder-dropdown
                        :ref="'folder-dropdown-' + folder.id"
                        :folder="folder"
                        @update-last-dropdown="onFolderUpdateLastDropdown('folder-dropdown-' + folder.id, $event)"
                        @saved="refreshRequestList"
                        @config="showFolderConfigDialog"
                        @click.native="clickInterceptor"
                    ></folder-dropdown>
                </template>
                <Container @drop="onDrop(folder, index, $event)" :drop-placeholder="dropPlaceholderOptions">
                    <Draggable
                        tag="el-menu-item"
                        v-for="request in folder.requestList"
                        :key="request.id"
                        :index="request.id"
                        class="request-item"
                        :class="{ 'selected-request': selectedRequest.id === request.id }"
                        @click.native="updateSelectedRequest(request)"
                    >
                        <request-dropdown
                            :ref="'request-dropdown-' + request.id"
                            :request="request"
                            @update-mouse-over-item="onUpdateMouseOverItem('request-dropdown-' + request.id, $event)"
                            @update-last-dropdown="
                                onRequestUpdateLastDropdown('request-dropdown-' + request.id, $event)
                            "
                            @saved="refreshRequestList"
                            @config="showRequestConfigDialog"
                        ></request-dropdown>
                    </Draggable>
                </Container>
            </el-submenu>
            <Container @drop="onTopRequestDrop" :drop-placeholder="dropPlaceholderOptions">
                <Draggable
                    tag="el-menu-item"
                    v-for="topRequest in topRequestList"
                    :key="topRequest.id"
                    :index="topRequest.id"
                    class="request-item"
                    :class="{ 'selected-request': selectedRequest.id === topRequest.id }"
                    @click.native="updateSelectedRequest(topRequest)"
                >
                    <request-dropdown
                        :ref="'request-dropdown-' + topRequest.id"
                        :request="topRequest"
                        @update-mouse-over-item="onUpdateMouseOverItem('request-dropdown-' + topRequest.id, $event)"
                        @update-last-dropdown="onRequestUpdateLastDropdown('request-dropdown-' + topRequest.id, $event)"
                        @saved="refreshRequestList"
                        @config="showRequestConfigDialog"
                    ></request-dropdown>
                </Draggable>
            </Container>
        </el-menu>
        <request-edit-dialog
            ref="requestEditDialog"
            @refresh="refreshRequestList"
            :isEditMode="true"
        ></request-edit-dialog>

        <folder-edit-dialog
            ref="folderEditDialog"
            @refresh="refreshRequestList"
            :isEditMode="true"
        ></folder-edit-dialog>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import { Container, Draggable } from 'vue-smooth-dnd';
import Config from '@/util/config';
import dbUtil from '@/datastore/DBUtil';
import { Notification } from 'element-ui';
import RequestEditDialog from './dialog/request-edit-dialog';
import FolderEditDialog from './dialog/folder-edit-dialog';
import FolderDropdown from './dropdown/folder-dropdown';
import RequestDropdown from './dropdown/request-dropdown';

export default {
    name: 'request-list',
    components: {
        FolderDropdown,
        RequestDropdown,
        Container,
        Draggable,
        RequestEditDialog,
        FolderEditDialog,
        Icon
    },
    data() {
        return {
            Config: Config,
            folderMenuList: [],
            topRequestList: [],
            openedSubmenuList: [...this.$store.state.GlobalData.lastState.openedSubmenuList],
            // it could be dropdown or inner-dropdown
            lastDropDown: null,
            selectedRequest: {},
            dropPlaceholderOptions: {
                className: 'drop-preview',
                animationDuration: '150',
                showOnTop: true
            }
        };
    },
    computed: {
        currentWorkspaceId() {
            return this.$store.state.GlobalData.lastState.lastWorkspaceId;
        }
    },
    watch: {
        currentWorkspaceId(newVal) {
            if (newVal) {
                this.refreshRequestList();
            } else {
                this.folderMenuList = [];
            }
        }
    },
    created() {
        this.refreshRequestList();
    },
    methods: {
        refreshRequestList() {
            console.log('refreshing folder list');
            let folderList = dbUtil.getLastWorkspaceFolderList();
            this.folderMenuList = [];
            folderList.forEach(folder => {
                // get requests under folders
                let requestList = dbUtil.getRequestListByFolderId(folder.id);
                this.folderMenuList.push({
                    name: folder.name,
                    id: folder.id,
                    requestList: requestList
                });
                this.$store.dispatch(Config.ACTION_UPDATE_CURRENT_FOLDER_LIST, [...this.folderMenuList]);
            });

            // get requests not under any folders
            this.topRequestList = dbUtil.getNoFolderRequestList();

            // refresh selectedRequest
            if (this.selectedRequest.id) {
                this.updateSelectedRequest(this.selectedRequest);
            }
        },
        onRequestSaved(request) {
            // if current folder is not open, then open it
            if (request.folderId) {
                this.openedSubmenuList = [...this.$store.state.GlobalData.lastState.openedSubmenuList];
                this.openedSubmenuList.push(request.folderId);
                let set = new Set(this.openedSubmenuList);
                let list = Array.from(set);
                this.updateOpenedSubmenuList(list);
            }
            this.refreshRequestList();
        },
        updateOpenedSubmenuList(list) {
            let lastState = { ...this.$store.state.GlobalData.lastState };
            // only update if not the same
            if (lastState.openedSubmenuList !== list) {
                lastState.openedSubmenuList = list;
                dbUtil.saveLastState(lastState);
            }
        },
        addOpenedSubmenuList(currentFolder) {
            let list = [...this.$store.state.GlobalData.lastState.openedSubmenuList, currentFolder];
            this.updateOpenedSubmenuList(list);
        },
        removeOpenedSubmenuList(currentFolder) {
            let list = this.$store.state.GlobalData.lastState.openedSubmenuList.filter(menu => menu !== currentFolder);
            this.updateOpenedSubmenuList(list);
        },
        getFolderNameById(id) {
            let menuName = '';
            for (let i = 0; i < this.folderMenuList.length; i++) {
                if (this.folderMenuList[i].id === id) {
                    menuName = this.folderMenuList[i].name;
                    break;
                }
            }
            return menuName;
        },
        onUpdateMouseOverItem(dropdownRef, requestId) {
            // call onMouseOverItem() on <request-dropdown>
            this.$refs[dropdownRef][0].onMouseOverItem(requestId);
        },
        onRequestUpdateLastDropdown(dropdownRef, { refType, requestId }) {
            if (this.lastDropDown && this.lastDropDown !== this.$refs[dropdownRef][0].$refs[refType]) {
                // should close the previous dropdown
                // if lastDropDown is current showing,don't close it
                this.lastDropDown.currentVisible = false;
            }
            this.lastDropDown = this.$refs[dropdownRef][0].$refs[refType];
        },
        onFolderUpdateLastDropdown(dropdownRef, { refType, folderId }) {
            if (this.lastDropDown) {
                // should close the previous dropdown
                this.lastDropDown.currentVisible = false;
            }
            this.lastDropDown = this.$refs[dropdownRef][0].$refs[refType];
        },
        showRequestConfigDialog(request) {
            this.$refs.requestEditDialog.showDialog({ ...request });
        },
        showFolderConfigDialog(folderId) {
            let folder = dbUtil.getFolderById(folderId);
            this.$refs.folderEditDialog.showDialog({ ...folder });
        },
        menuSelectHandler(index) {
            let folderId = dbUtil.getFolderIdByRequestId(index);
            let lastState = { ...this.$store.state.GlobalData.lastState };
            if (lastState.lastFolderId !== folderId) {
                lastState.lastFolderId = folderId;
                dbUtil.saveLastState(lastState);
            }
        },
        clickInterceptor(e) {
            // intercept the click event from the menu-dropdown item clicked which caused the el-submenu closed
            if (e.target && e.target.nodeName && e.target.nodeName.toUpperCase() === 'LI') {
                e.stopPropagation();
            }
        },
        onDrop(folder, index, dropResult) {
            let folderMenuList = this.folderMenuList;
            let requestList = folder.requestList;
            const { removedIndex, addedIndex } = dropResult;

            requestList = this.reIndexRequest(requestList, removedIndex, addedIndex);
            folder.requestList = this.updateRequestSort(requestList);
            folderMenuList[index] = folder;
            this.folderMenuList = [...folderMenuList];
        },
        onTopRequestDrop(dropResult) {
            const { removedIndex, addedIndex } = dropResult;
            let requestList = this.reIndexRequest(this.topRequestList, removedIndex, addedIndex);
            this.topRequestList = this.updateRequestSort(requestList);
        },
        reIndexRequest(requestList, removedIndex, addedIndex) {
            let newArray = [...requestList];
            let removedValue = requestList[removedIndex];
            newArray.splice(removedIndex, 1); // remove drag value
            newArray.splice(addedIndex, 0, removedValue); // add drag value
            return newArray;
        },
        updateRequestSort(requestList) {
            for (let i = 0; i < requestList.length; i++) {
                let request = requestList[i];
                request.sort = i;
                dbUtil.updateRequest(request);
                Notification.closeAll();
            }
            return requestList;
        },
        updateSelectedRequest(request) {
            this.selectedRequest = request;
            this.$bus.$emit(Config.EVENT_BUS_UPDATE_SELECTED_REQUEST, { ...request });
        }
    }
};
</script>

<style scoped>
.top-div {
    width: 100%;
    justify-content: flex-start;
}

.menu {
    width: 100% !important;
    height: 100%;
    z-index: 800;
    margin-right: -1px;
}
.request-item {
    padding-left: 36px;
    background-color: white;
}
.selected-request {
    color: #0070c0;
    background-color: #c8ebfa;
}
.drop-preview {
    background-color: rgba(150, 150, 200, 0.1);
    border: 1px dashed #abc;
    margin: 5px;
}
/deep/ .smooth-dnd-draggable-wrapper {
    overflow: visible !important;
}
</style>
