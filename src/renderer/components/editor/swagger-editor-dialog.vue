<template>
    <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        :visible.sync="isShowDialog"
        :append-to-body="true"
        title="Import Swagger Document"
        @opened="createEditor"
    >
        <Divider></Divider>
        <div class="v-div">
            <div class="h-div" style="padding: 8px;">
                <el-autocomplete
                    class="inline-input"
                    v-model="swaggerUrl"
                    style="flex: 1;"
                    :fetch-suggestions="querySearch"
                    placeholder="Input the swagger URL here or input the document in the editor"
                ></el-autocomplete>
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 8px;"
                    @click="getSwaggerDoc"
                    :loading="isLoading"
                    >Get Doc</el-button
                ><el-button v-if="isLoading" size="small" type="plain" style="margin-left: 8px;" @click="cancelRequest"
                    >Cancel</el-button
                >
            </div>
            <json-editor
                ref="jsonEditor"
                @onChange="onEditorChanged"
                :is-in-dialog="true"
                class="json-editor"
            ></json-editor>

            <Divider></Divider>
            <div class="h-div" style="padding: 8px;">
                <template v-if="isValid">
                    <i class="el-icon-success" style="font-size: 24px;color: #67C23A;margin-right: 8px;"></i>
                    <span style="flex: 1;">{{ validText }}</span>
                </template>
                <template v-else>
                    <i class="el-icon-error" style="font-size: 24px;color: #F56C6C;margin-right: 8px;"></i>
                    <span style="flex: 1;"
                        >Document seems not valid. validate more at
                        <a target="_blank" href="https://editor.swagger.io">https://editor.swagger.io</a>
                    </span>
                </template>
                <el-button size="small" type="success" @click="importAsWorkspace">Import</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import Divider from 'iview/src/components/divider/divider';
import elDragDialog from '@/directive/el-dragDialog';
import { convertToWorkspace } from '@/util/SwaggerDocUtil';
import JsonEditor from '@/components/editor/json-editor';
import got from 'got';
import SwaggerParser from 'swagger-parser';
import _includes from 'lodash/includes';

export default {
    name: 'swagger-editor-dialog',
    components: { Divider, JsonEditor },
    directives: { elDragDialog },
    data() {
        return {
            isShowDialog: false,
            swaggerUrl: 'https://petstore.swagger.io/v2/swagger.json',
            isValid: false,
            validText: '',
            isLoading: false,
            urlHistory: [],
            gotRequest: {}
        };
    },
    methods: {
        showDialog() {
            this.isShowDialog = true;
        },
        createEditor() {
            this.$refs.jsonEditor.createEditor();
        },
        onEditorChanged() {
            try {
                let jsonText = this.$refs.jsonEditor.editor.get();
                this.validate(jsonText);
            } catch (e) {
                this.isValid = false;
                // if editor's text is not valid, there will be error
            }
        },
        async getSwaggerDoc() {
            if (this.swaggerUrl) {
                if (!_includes(this.urlHistory, this.swaggerUrl)) {
                    this.urlHistory.push(this.swaggerUrl);
                }
                this.isLoading = true;
                try {
                    this.gotRequest = got(this.swaggerUrl);
                    let resp = await this.gotRequest;
                    let doc = JSON.parse(resp.body);
                    this.$refs.jsonEditor.editor.set(doc);
                    this.validate(doc);
                } catch (error) {
                    this.$refs.jsonEditor.editor.set({});
                    if (this.gotRequest.isCanceled) {
                        let errorText = 'Got document action canceled.';
                        this.$message({
                            showClose: true,
                            message: errorText,
                            type: 'warning'
                        });
                    } else {
                        console.log(error);
                        this.$message({
                            showClose: true,
                            message: error,
                            duration: 0,
                            type: 'error'
                        });
                    }
                }
                this.isLoading = false;
            }
        },
        cancelRequest() {
            this.gotRequest.cancel();
        },
        validate(doc) {
            let that = this;
            SwaggerParser.validate(doc, function(err, api) {
                if (err) {
                    that.isValid = false;
                } else {
                    that.isValid = true;
                    that.validText = 'API name: ' + api.info.title + ', Version: ' + api.info.version;
                }
            });
        },
        querySearch(queryString, cb) {
            let urlHistory = this.urlHistory;
            let results = queryString ? urlHistory.filter(this.createFilter(queryString)) : urlHistory;
            let objList = results.map(result => {
                return { value: result };
            });
            cb(objList);
        },
        createFilter(queryString) {
            return str => {
                return str.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
            };
        },
        importAsWorkspace() {
            let newWorkspace = convertToWorkspace(this.$refs.jsonEditor.editor.get());
            this.$message({
                showClose: true,
                message: 'Import swagger document successfully!',
                type: 'success'
            });
            this.$emit('saved', newWorkspace);
        }
    }
};
</script>

<style scoped>
/deep/ .ace-jsoneditor {
    min-height: 600px;
}
/deep/ .format-button-div {
    padding-right: 32px;
}
</style>
