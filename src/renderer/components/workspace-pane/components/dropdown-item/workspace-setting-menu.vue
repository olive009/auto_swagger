<template>
    <div class="h-div">
        <el-dropdown-item class="workspace-pane-dropdown-item" :command="Config.MENU_WORKSPACE_SETTING">
            <Icon type="md-settings" size="18" class="workspace-pane-dropdown-icon" color="#2d8cf0" />
            Workspace Management
        </el-dropdown-item>
        <workspace-edit-dialog
            ref="workspaceEditDialog"
            :isEditMode="true"
            @saved="onWorkspaceSaved"
        ></workspace-edit-dialog>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Config from '@/util/config';
import WorkspaceEditDialog from '../dialog/workspace-edit-dialog';
import dbUtil from '@/datastore/DBUtil';

export default {
    name: 'workspace-setting-menu',
    components: { Icon, WorkspaceEditDialog },
    data() {
        return {
            Config: Config
        };
    },
    methods: {
        showDialog() {
            let currentWorkspace = dbUtil.findWorkspaceById(this.$store.state.GlobalData.lastState.lastWorkspaceId);
            this.$refs.workspaceEditDialog.showDialog(currentWorkspace);
        },
        onWorkspaceSaved(newWorkspace) {
            this.$emit('saved', newWorkspace);
        }
    }
};
</script>

<style scoped></style>
