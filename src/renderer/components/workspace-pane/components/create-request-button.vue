<template>
    <div class="v-div">
        <el-button size="small" type="success" @click="showDialog">New Request</el-button>
        <request-edit-dialog ref="requestEditDialog" @saved="requestSavedHandler"></request-edit-dialog>
    </div>
</template>

<script>
import HttpMethodDropdown from '../../http-method-dropdown';
import RequestEditDialog from './dialog/request-edit-dialog';

export default {
    name: 'new-request-button',
    components: {
        HttpMethodDropdown,
        RequestEditDialog
    },
    data() {
        return {
            isShowDialog: false,
            request: {}
        };
    },
    methods: {
        showDialog() {
            let defaultRequest = {
                name: 'new-request',
                method: 'GET',
                workspaceId: this.$store.state.GlobalData.lastState.lastWorkspaceId,
                folderId: this.getLastFolderId()
            };
            this.$refs.requestEditDialog.showDialog(defaultRequest);
        },
        getLastFolderId() {
            let folderId = this.$store.state.GlobalData.lastState.lastFolderId;
            let folderMenuList = this.$store.state.GlobalData.currentFolderList;
            if (folderId && folderMenuList) {
                for (let i = 0; i < folderMenuList.length; i++) {
                    if (folderMenuList[i].id === folderId) {
                        return folderId;
                    }
                }
                return null;
            } else {
                return null;
            }
        },
        requestSavedHandler(request) {
            this.$emit('saved', request);
        }
    }
};
</script>

<style scoped></style>
