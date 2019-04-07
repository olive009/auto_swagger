<template>
    <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        :visible.sync="isShowDialog"
        :append-to-body="true"
        :title="isEditMode ? 'Request Setting' : 'Create Request'"
    >
        <Divider></Divider>
        <el-form ref="form" :model="currentRequest" :rules="rules">
            <el-form-item prop="name" label="Request Name">
                <el-input
                    clearable
                    :autofocus="true"
                    style="width:100%;"
                    placeholder="Please input request name"
                    v-model="currentRequest.name"
                ></el-input>
            </el-form-item>
            <el-form-item label="Request URL">
                <div class="h-div">
                    <el-input clearable placeholder="Please input request URL" v-model="currentRequest.url"></el-input>
                    <http-method-dropdown
                        style="margin-left: 8px;"
                        v-model="currentRequest.method"
                    ></http-method-dropdown>
                </div>
            </el-form-item>
            <el-form-item label="under which folder">
                <el-select v-model="currentRequest.folderId" style="width: 100%;" placeholder="Please choose a folder">
                    <el-option v-for="folder in folderMenuList" :value="folder.id" :key="folder.id" :label="folder.name"
                        >{{ folder.name }}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="under which workspace">
                <el-select
                    v-model="currentRequest.workspaceId"
                    style="width: 100%;"
                    placeholder="Please choose a workspace"
                >
                    <el-option
                        v-for="workspace in workspaceList"
                        :value="workspace.id"
                        :key="workspace.id"
                        :label="workspace.name"
                        >{{ workspace.name }}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Request Description">
                <markdown-editor v-model="currentRequest.desc"></markdown-editor>
            </el-form-item>
        </el-form>

        <div slot="footer">
            <el-button size="small" type="plain" @click="isShowDialog = false">Cancel</el-button>
            <template v-if="isEditMode">
                <el-button size="small" type="danger" @click="deleteRequest">Delete</el-button>
                <el-button size="small" type="success" @click="copyRequest">Duplicate</el-button>
                <el-button size="small" type="primary" @click="updateRequest">Save</el-button>
            </template>
            <el-button v-else size="small" type="primary" @click="createRequest">Confirm</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Divider from 'iview/src/components/divider/divider';
import HttpMethodDropdown from '@/components/http-method-dropdown';
import dbUtil from '@/datastore/DBUtil';
import elDragDialog from '@/directive/el-dragDialog';
import MarkdownEditor from '@/components/editor/markdown-editor';
export default {
    name: 'request-edit-dialog',
    directives: { elDragDialog },
    components: {
        HttpMethodDropdown,
        Divider,
        MarkdownEditor
    },
    props: ['isEditMode'],
    data() {
        return {
            currentRequest: {},
            oldName: '',
            isShowDialog: false,
            workspaceList: [],
            folderMenuList: [],
            rules: {
                name: [{ required: true, message: 'Please input request name', trigger: 'blur' }]
            }
        };
    },
    methods: {
        showDialog(request) {
            this.workspaceList = dbUtil.getWorkspaceList();
            this.folderMenuList = this.$store.state.GlobalData.currentFolderList;
            this.isShowDialog = true;
            // should use the request, not the mouseOverItem
            this.currentRequest = { ...request };
            this.oldName = request.name;
        },
        createRequest() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let savedRequest = dbUtil.createRequest(this.currentRequest);
                    this.isShowDialog = false;
                    this.$emit('saved', savedRequest);
                }
            });
        },
        updateRequest() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    dbUtil.updateRequest(this.currentRequest);
                    this.isShowDialog = false;
                    this.$emit('refresh');
                }
            });
        },
        copyRequest() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.currentRequest.id = null;
                    if (this.oldName === this.currentRequest.name) {
                        this.currentRequest.name = this.currentRequest.name + '-copy';
                    }
                    dbUtil.createRequest(this.currentRequest);
                    this.isShowDialog = false;
                    this.$emit('refresh');
                }
            });
        },
        deleteRequest() {
            dbUtil.deleteRequest(this.currentRequest.id);
            this.isShowDialog = false;
            this.$emit('refresh');
        }
    }
};
</script>

<style scoped></style>
