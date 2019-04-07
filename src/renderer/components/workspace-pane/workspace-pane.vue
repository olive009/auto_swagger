<template>
    <div class="v-div">
        <div class="h-div workspace-div">
            <el-select v-model="currentWorkspaceId" style="width: 100%;">
                <el-option
                    v-for="workspace in workspaceList"
                    :value="workspace.id"
                    :label="workspace.name"
                    :key="workspace.id"
                    >{{ workspace.name }}
                </el-option>
            </el-select>
            <div style="padding: 0 0 0 8px;">
                <el-dropdown trigger="click" @command="onDropdownItemClicked" placement="right">
                    <el-button size="small" circle icon="el-icon-plus"></el-button>
                    <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                        <create-workspace-menu ref="workspaceMenu" @saved="onWorkspaceSaved"></create-workspace-menu>
                        <create-folder-menu ref="folderMenu" @saved="onFolderSaved"></create-folder-menu>
                        <workspace-setting-menu ref="workspaceSettingMenu"></workspace-setting-menu>
                        <import-swagger-doc-menu
                            ref="importSwaggerDocMenu"
                            @saved="onWorkspaceSaved"
                        ></import-swagger-doc-menu>
                        <import-workspace-menu></import-workspace-menu>
                        <export-workspace-menu></export-workspace-menu>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- TODO: add env and cookie function-->
        <!--
        <div class="h-div" style="height: 60px;">
            <env-dropdown></env-dropdown>
            <cookies-button></cookies-button>
        </div>
        -->
        <div class="h-div" style="padding:10px 8px 10px;">
            <el-input
                clearable
                v-model="filterText"
                placeholder="filter"
                style="flex:1;margin-right:8px;"
                @input="filterRequestList"
            />
            <create-request-button @saved="onRequestSaved"></create-request-button>
        </div>
        <Divider></Divider>
        <filtered-request-list v-show="filterText" ref="filteredRequestListRef"></filtered-request-list>
        <request-list v-show="!filterText" ref="requestList"></request-list>
    </div>
</template>

<script>
import Divider from 'iview/src/components/divider/divider';
import Config from '@/util/config';
import CreateWorkspaceMenu from './components/dropdown-item/create-workspace-menu';
import CreateFolderMenu from './components/dropdown-item/create-folder-menu';
import ExportWorkspaceMenu from './components/dropdown-item/export-workspace-menu';
import ImportSwaggerDocMenu from './components/dropdown-item/import-swagger-doc-menu';
import ImportWorkspaceMenu from './components/dropdown-item/import-workspace-menu';
import WorkspaceSettingMenu from './components/dropdown-item/workspace-setting-menu';
import RequestList from './components/request-list';
import FilteredRequestList from './components/filtered-request-list';
import EnvDropdown from './components/dropdown/env-dropdown';
import CookiesButton from './components/cookies-button';
import CreateRequestButton from './components/create-request-button';
import dbUtil from '@/datastore/DBUtil';

export default {
    name: 'WorkspacePane',
    components: {
        RequestList,
        FilteredRequestList,
        CreateWorkspaceMenu,
        CreateFolderMenu,
        ExportWorkspaceMenu,
        ImportSwaggerDocMenu,
        ImportWorkspaceMenu,
        WorkspaceSettingMenu,
        EnvDropdown,
        CookiesButton,
        CreateRequestButton,
        Divider
    },
    data() {
        return {
            Config: Config,
            workspaceList: [],
            currentWorkspaceId: this.$store.state.GlobalData.lastState.lastWorkspaceId,
            filterText: ''
        };
    },
    watch: {
        currentWorkspaceId(newWorkspaceId) {
            // clear filterText
            this.filterText = '';
            // update store
            const lastState = {
                ...this.$store.state.GlobalData.lastState,
                lastWorkspaceId: newWorkspaceId
            };
            dbUtil.saveLastState(lastState);
        }
    },
    mounted() {
        this.$bus.$on(Config.EVENT_BUS_LOAD_NEW_WORKSPACE, workspaceId => {
            this.currentWorkspaceId = workspaceId;
        });
        this.workspaceList = dbUtil.getWorkspaceList();
    },
    methods: {
        onDropdownItemClicked(command) {
            if (command === Config.MENU_NEW_WORKSPACE) {
                this.$refs.workspaceMenu.showDialog();
            } else if (command === Config.MENU_NEW_FOLDER) {
                this.$refs.folderMenu.showDialog();
            } else if (command === Config.MENU_WORKSPACE_SETTING) {
                this.$refs.workspaceSettingMenu.showDialog();
            } else if (command === Config.MENU_IMPORT_SWAGGER_DOC) {
                this.$refs.importSwaggerDocMenu.showDialog();
            }
        },
        onWorkspaceSaved(newWorkspace) {
            // refresh workspace list
            this.workspaceList = dbUtil.getWorkspaceList();
            // set to current workspace
            if (newWorkspace) {
                this.currentWorkspaceId = newWorkspace.id;
            }
        },
        onFolderSaved(folder) {
            this.$refs.requestList.refreshRequestList();
        },
        onRequestSaved(request) {
            this.$refs.requestList.onRequestSaved(request);
        },
        filterRequestList() {
            this.$refs.filteredRequestListRef.filter(this.filterText);
        }
    }
};
</script>

<style scoped>
.workspace-div {
    width: 100%;
    padding: 10px 8px;
    background-color: #19be6b;
}
.dropdown-menu {
    top: 0 !important;
}
</style>
