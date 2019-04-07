<template>
    <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        :visible.sync="isShowDialog"
        :append-to-body="true"
        title="Environment Management"
        width="750px"
        @opened="createEditor"
    >
        <div class="top-div">
            <Divider></Divider>
            <div class="split-div">
                <split-pane :min-percent="30" :default-percent="30" split="vertical">
                    <template slot="paneL">
                        <div class="base-env-div">
                            <el-button type="text" @click="updateSelectedEnv(Config.DB_DEFAULT_ID)" class="text-button"
                                >Base Environment
                            </el-button>
                        </div>
                        <div class="sub-env-div">
                            <span style="flex:1;">Sub Environments</span>
                            <el-button size="small" circle icon="el-icon-plus" @click="onAdded"></el-button>
                        </div>
                        <ul class="sub-env-list">
                            <li v-for="item in envList" :key="item.id" class="sub-env-item">
                                <edit-text-button
                                    v-model="item.name"
                                    @click="updateSelectedEnv(item.id)"
                                    @input="onNameChanged(item)"
                                ></edit-text-button>
                            </li>
                        </ul>
                    </template>
                    <template slot="paneR">
                        <div class="v-div" style="justify-content: flex-start;">
                            <div class="h-div action-div">
                                <span class="name-span">{{ selectedEnv.name }}</span>
                                <div style="flex:1;"></div>

                                <el-button
                                    :disabled="Config.DB_DEFAULT_ID === selectedEnv.id || !selectedEnv.id"
                                    size="small"
                                    type="danger"
                                    @click="onDeleted"
                                    >Delete
                                </el-button>
                                <el-button size="small" type="success" @click="onSaved">Save</el-button>
                            </div>
                            <markdown-editor class="markdown-editor" v-model="selectedEnv.desc"></markdown-editor>
                            <json-editor ref="jsonEditor" :is-in-dialog="true" class="json-editor"></json-editor>
                        </div>
                    </template>
                </split-pane>
            </div>
            <Divider></Divider>
        </div>
        <div slot="footer">
            <el-button size="small" type="plain" @click="isShowDialog = false">Close</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Button from 'iview/src/components/button/button';
import Icon from 'iview/src/components/icon/icon.vue';
import Dropdown from 'iview/src/components/dropdown/dropdown';
import Divider from 'iview/src/components/divider/divider';
import elDragDialog from '@/directive/el-dragDialog';
import splitPane from 'vue-splitpane';
import JsonEditor from '@/components/editor/json-editor';
import MarkdownEditor from '@/components/editor/markdown-editor';
import dbUtil from '@/datastore/DBUtil';
import Config from '@/util/config';
import EditTextButton from '@/components/button/edit-text-button';

export default {
    name: 'env-manage-dialog',
    components: { Button, Icon, Dropdown, Divider, MarkdownEditor, JsonEditor, splitPane, EditTextButton },
    directives: { elDragDialog },
    data() {
        return {
            Config: Config,
            isShowDialog: false,
            splitModel: 0.3,
            selectedEnv: {},
            envList: []
        };
    },
    watch: {
        selectedEnv(newVal) {
            if (newVal && newVal.data && this.$refs.jsonEditor.editor) {
                this.$refs.jsonEditor.editor.set(newVal.data);
            }
        }
    },
    methods: {
        showDialog() {
            this.isShowDialog = true;
        },
        createEditor() {
            this.$refs.jsonEditor.createEditor();
            this.updateSelectedEnv(Config.DB_DEFAULT_ID);
            this.$refs.jsonEditor.editor.set(this.selectedEnv.data);
            this.refreshList();
        },
        onAdded() {
            let newEnv = { name: 'new subEnvironment', desc: '', data: {}};
            this.selectedEnv = dbUtil.createEnv(newEnv);
            this.refreshList();
        },
        onSaved() {
            this.$refs.jsonEditor.formatJson();
            let jsonText = this.$refs.jsonEditor.editor.get();
            this.selectedEnv.data = jsonText;
            if (this.selectedEnv.id) {
                this.onUpdated(this.selectedEnv);
            } else {
                dbUtil.createEnv(this.selectedEnv);
            }
        },
        onUpdated(env) {
            this.selectedEnv = dbUtil.updateEnv(env);
            // update env-dropdown if env's id is currentEnvId
            this.$bus.$emit(Config.EVENT_BUS_UPDATE_ENV_NAME, this.selectedEnv);
        },
        onDeleted() {
            dbUtil.deleteEnv(this.selectedEnv.id);
            this.refreshList();
            this.updateSelectedEnv(Config.DB_DEFAULT_ID);
        },
        updateSelectedEnv(envId) {
            this.selectedEnv = dbUtil.getEnvById(envId);
        },
        onNameChanged(env) {
            this.onUpdated(env);
        },
        refreshList() {
            this.envList = dbUtil.getAllEnv();
        }
    }
};
</script>

<style scoped>
.top-div {
    display: flex;
    flex-direction: column;
}

.split-div {
    width: 750px;
    height: 450px;
    margin-top: -1px;
}

.base-env-div {
    padding: 8px;
    font-weight: bold;
    border-bottom: 1px solid #e8eaec;
    margin-right: -4px;
}

.sub-env-div {
    padding: 8px;
    display: flex;
    align-items: center;
}

.sub-env-list {
    padding: 0 8px 8px 8px;
}

.sub-env-item {
    margin-left: 26px;
    list-style-type: none;
}

.action-div {
    padding: 12px;
}

.name-span {
    color: #409eff;
    font-weight: bold;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-button {
    color: #606266;
}

/deep/ .splitter-pane-resizer.vertical {
    width: 1px;
    margin-left: 0;
    border-left: 0;
    border-right: 0;
}

/deep/ .splitter-pane-resizer {
    background-color: #e8eaec;
    opacity: 1;
}

.markdown-editor {
    padding-right: 12px;
    padding-bottom: 12px;
}

.json-editor {
    border-top: 1px solid #e8eaec;
}

/deep/ .auto-textarea-input {
    font-size: 14px !important;
}

/deep/ .v-note-wrapper {
    height: 80px;
}
</style>
