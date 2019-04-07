<template>
    <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        :visible.sync="isShowDialog"
        :append-to-body="true"
        :title="isEditMode ? 'Folder Management' : 'Create New Folder'"
    >
        <Divider></Divider>
        <el-form ref="form" :model="folder" :rules="rules">
            <el-form-item label="Folder Name" prop="name">
                <el-input
                    ref="nameInput"
                    clearable
                    :autofocus="true"
                    style="width:100%;"
                    placeholder="Please input folder name"
                    v-model="folder.name"
                ></el-input>
            </el-form-item>

            <el-form-item label="Folder Description">
                <markdown-editor v-model="folder.desc"></markdown-editor>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="small" type="plain" @click="cancelCreate">Cancel</el-button>
            <template v-if="isEditMode">
                <el-button size="small" type="danger" @click="isShowDeleteDialog = true">Delete</el-button>
                <el-button size="small" type="success" @click="copyFolder">Duplicate</el-button>
                <el-button size="small" type="primary" @click="updateFolder">Save</el-button>
            </template>
            <el-button v-else size="small" type="primary" @click="saveFolder">Confirm</el-button>
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
                    <span style="color:red;">Deleting the folder would delete all the requests under this folder!</span>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" type="plain" @click="isShowDeleteDialog = false">Cancel</el-button>
                <el-button size="small" type="danger" @click="deleteFolder">Delete</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
import dbUtil from '@/datastore/DBUtil';
import Divider from 'iview/src/components/divider/divider';
import elDragDialog from '@/directive/el-dragDialog';
import MarkdownEditor from '@/components/editor/markdown-editor';
export default {
    name: 'folder-edit-dialog',
    components: { Divider, MarkdownEditor },
    directives: { elDragDialog },
    props: ['isEditMode'],
    data() {
        return {
            isShowDialog: false,
            isShowDeleteDialog: false,
            folder: {},
            rules: {
                name: [{ required: true, message: 'Please input folder name!', trigger: 'blur' }]
            }
        };
    },
    methods: {
        showDialog(folder) {
            this.folder = { ...folder };
            this.isShowDialog = true;
            // fix second focus issue
            this.$nextTick(function() {
                this.$refs.form.clearValidate();
                this.$refs.nameInput.focus();
            });
        },
        saveFolder() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // save to DB
                    this.folder.workspaceId = this.$store.state.GlobalData.lastState.lastWorkspaceId;
                    let newFolder = dbUtil.createFolder(this.folder);
                    this.$emit('saved', newFolder);
                    this.isShowDialog = false;
                }
            });
        },
        updateFolder() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    dbUtil.updateFolder(this.folder);
                    this.isShowDialog = false;
                    this.$emit('refresh');
                }
            });
        },
        deleteFolder() {
            this.isShowDeleteDialog = false;
            this.isShowDialog = false;
            dbUtil.deleteFolder(this.folder.id);
            this.$emit('refresh');
        },
        copyFolder() {
            dbUtil.copyFolder(this.folder);
            this.isShowDialog = false;
            this.$emit('refresh');
        },
        cancelCreate() {
            this.isShowDialog = false;
        }
    }
};
</script>

<style scoped></style>
