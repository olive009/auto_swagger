<template>
    <div class="h-div">
        <el-dropdown-item class="workspace-pane-dropdown-item" :command="Config.MENU_NEW_FOLDER">
            <Icon type="md-folder" size="18" class="workspace-pane-dropdown-icon" color="#2db7f5" />
            Create Folder
        </el-dropdown-item>

        <folder-edit-dialog ref="folderEditDialog" @saved="onFolderSaved"></folder-edit-dialog>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Config from '@/util/config';
import FolderEditDialog from '../dialog/folder-edit-dialog';

export default {
    name: 'create-folder-menu',
    components: { Icon, FolderEditDialog },
    data() {
        return {
            Config: Config
        };
    },
    methods: {
        showDialog() {
            this.$refs.folderEditDialog.showDialog({});
        },
        onFolderSaved(newFolder) {
            this.$emit('saved', newFolder);
        }
    }
};
</script>

<style scoped></style>
