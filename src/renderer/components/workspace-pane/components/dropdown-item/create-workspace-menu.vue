<template>
    <div class="h-div">
        <el-dropdown-item class="workspace-pane-dropdown-item" :command="Config.MENU_NEW_WORKSPACE">
            <Icon type="md-add-circle" size="18" class="workspace-pane-dropdown-icon" color="#ed4014" />
            Create Workspace
        </el-dropdown-item>
        <workspace-edit-dialog ref="workspaceEditDialog" @saved="onWorkspaceSaved"></workspace-edit-dialog>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Config from '@/util/config';
import WorkspaceEditDialog from '../dialog/workspace-edit-dialog';

export default {
    name: 'create-workspace-menu',
    components: { Icon, WorkspaceEditDialog },
    data() {
        return {
            Config: Config
        };
    },
    methods: {
        showDialog() {
            this.$refs.workspaceEditDialog.showDialog({});
        },
        onWorkspaceSaved(newWorkspace) {
            this.$emit('saved', newWorkspace);
        }
    }
};
</script>

<style scoped>
.v-note-wrapper {
    width: 100%;
    min-height: 20px;
}
</style>
