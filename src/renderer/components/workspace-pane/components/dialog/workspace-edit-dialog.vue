<template>
    <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        :visible.sync="isShowDialog"
        :append-to-body="true"
        :title="isEditMode ? 'Workspace Management' : 'Create New Workspace'"
    >
        <Divider></Divider>
        <el-form ref="form" :model="workspace" :rules="rules">
            <el-form-item label="Workspace Name" prop="name">
                <el-input
                    ref="nameInput"
                    clearable
                    :autofocus="true"
                    style="width:100%;"
                    placeholder="Please input workspace name"
                    v-model="workspace.name"
                ></el-input>
            </el-form-item>

            <el-form-item label="Workspace Description">
                <markdown-editor v-model="workspace.desc"></markdown-editor>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="small" type="plain" @click="cancelCreate">Cancel</el-button>
            <template v-if="isEditMode">
                <el-button
                    size="small"
                    type="danger"
                    @click="isShowDeleteDialog = true"
                    :disabled="workspace.id === Config.DB_DEFAULT_ID"
                    >Delete</el-button
                >
                <el-button size="small" type="success" @click="copyWorkspace">Duplicate</el-button>
                <el-button size="small" type="primary" @click="updateWorkspace">Save</el-button>
            </template>
            <el-button v-else size="small" type="primary" @click="saveWorkspace">Confirm</el-button>
        </div>
        <el-dialog
            v-el-drag-dialog
            :close-on-click-modal="false"
            :visible.sync="isShowDeleteDialog"
            :append-to-body="true"
            title="Warning"
            width="450px"
        >
            <Divider></Divider>
            <el-form>
                <el-form-item>
                    <span style="color:red;"
                        >Deleting the workspace would delete all the folders and all the requests under this
                        workspace!</span
                    >
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" type="plain" @click="isShowDeleteDialog = false">Cancel</el-button>
                <el-button size="small" type="danger" @click="deleteWorkspace">Delete</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
import dbUtil from '@/datastore/DBUtil';
import Divider from 'iview/src/components/divider/divider';
import elDragDialog from '@/directive/el-dragDialog';
import MarkdownEditor from '@/components/editor/markdown-editor';
import Config from '@/util/config';
export default {
    name: 'workspace-edit-dialog',
    components: { Divider, MarkdownEditor },
    directives: { elDragDialog },
    props: ['isEditMode'],
    data() {
        return {
            Config: Config,
            isShowDialog: false,
            isShowDeleteDialog: false,
            workspace: {},
            rules: {
                name: [{ required: true, message: 'Please input workspace name', trigger: 'blur' }]
            }
        };
    },
    methods: {
        showDialog(workspace) {
            this.workspace = { ...workspace };
            this.isShowDialog = true;
            // fix the second focus issue
            this.$nextTick(function() {
                this.$refs.form.clearValidate();
                this.$refs.nameInput.focus();
            });
        },
        saveWorkspace() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // save to DB
                    let newWorkspace = dbUtil.createWorkspace(this.workspace);
                    this.$emit('saved', newWorkspace);
                    this.isShowDialog = false;
                }
            });
        },
        updateWorkspace() {
            dbUtil.updateWorkspace(this.workspace);
            this.isShowDialog = false;
        },
        deleteWorkspace() {
            this.isShowDeleteDialog = false;
            this.isShowDialog = false;
            dbUtil.deleteWorkspace(this.workspace.id);
            this.$bus.$emit(Config.EVENT_BUS_LOAD_NEW_WORKSPACE, Config.DB_DEFAULT_ID);
            /*
      const lastState = {
        ...this.$store.state.GlobalData.lastState,
        lastWorkspaceId: Config.DB_DEFAULT_ID
      }
      dbUtil.saveLastState(lastState) */
        },
        copyWorkspace() {
            let newWorkspace = dbUtil.copyWorkspace(this.workspace);
            this.isShowDialog = false;
            this.$bus.$emit(Config.EVENT_BUS_LOAD_NEW_WORKSPACE, newWorkspace.id);
        },
        cancelCreate() {
            this.isShowDialog = false;
        }
    }
};
</script>

<style scoped></style>
