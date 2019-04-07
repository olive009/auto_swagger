<template>
    <div class="v-div" style="margin-left: 4px;">
        <div class="h-div method-class">
            <http-method-dropdown v-model="currentRequest.method" @input="saveRequest"></http-method-dropdown>
            <div class="h-div" style="margin: 0 8px;">
                <el-input
                    clearable
                    placeholder="Please input the url of API"
                    v-model="currentRequest.url"
                    @change="saveRequest"
                >
                    <el-select v-model="currentRequest.scheme" slot="prepend" placeholder="http://">
                        <el-option label="http://" value="http://"></el-option>
                        <el-option label="https://" value="https://"></el-option>
                    </el-select>
                </el-input>
            </div>
            <el-button size="small" type="primary" @click="onSendButtonClicked">Send</el-button>
        </div>
        <Divider></Divider>
        <parameter-table v-if="currentRequest.parameters" :current-request="currentRequest"></parameter-table>
        <Divider></Divider>
        <json-editor ref="jsonEditor" style="margin-top: -1px;" @onChange="onDataChanged"></json-editor>
    </div>
</template>

<script>
import HttpMethodDropdown from '../http-method-dropdown';
import Divider from 'iview/src/components/divider/divider';
import JsonEditor from '@/components/editor/json-editor';
import Config from '@/util/config';
import dbUtil from '@/datastore/DBUtil';
import { Notification } from 'element-ui';
import ParameterTable from './parameter-table';

export default {
    name: 'request-pane',
    components: {
        JsonEditor,
        HttpMethodDropdown,
        Divider,
        ParameterTable
    },
    data() {
        return {
            currentRequest: {}
        };
    },
    mounted() {
        this.$bus.$on(Config.EVENT_BUS_UPDATE_SELECTED_REQUEST, request => {
            this.onCurrentRequestChanged(request);
        });
    },
    methods: {
        onCurrentRequestChanged(request) {
            if (!request.scheme) {
                request.scheme = 'http://';
            }
            this.currentRequest = request;
            if (this.$refs.jsonEditor && this.$refs.jsonEditor.editor) {
                let data = request.data ? request.data : {};
                this.$refs.jsonEditor.editor.set(data);
            }
            // fix scrollbar issue
            this.$nextTick(function() {
                this.$refs.jsonEditor.editor.focus();
            });
        },
        onDataChanged() {
            try {
                let jsonText = this.$refs.jsonEditor.editor.get();
                this.currentRequest.data = jsonText;
                this.saveRequest();
                Notification.closeAll();
            } catch (e) {
                // if editor's text is not valid, there will be error
            }
        },
        saveRequest() {
            if (this.currentRequest.id) {
                dbUtil.updateRequest(this.currentRequest);
            }
        },
        onSendButtonClicked() {
            this.$bus.$emit(Config.EVENT_BUS_SEND_BUTTON_CLICKED, this.currentRequest);
        }
    }
};
</script>

<style scoped>
.method-class {
    padding: 8px;
    justify-content: flex-start;
}
/deep/ .el-select .el-input {
    width: 100px;
}
</style>
