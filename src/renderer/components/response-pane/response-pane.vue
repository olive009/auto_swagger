<template>
    <div class="v-div" style="margin-left: 6px;">
        <div v-if="!isLoading" class="v-div response-div">
            <div class="h-div" style="margin:8px;" :style="lastResponse.statusCode ? 'opacity:1' : 'opacity:0'">
                <el-button size="small" class="status-button" :class="{ 'error-button': isError }">{{
                    lastResponse.statusCode
                }}</el-button>
                <el-button size="small" class="info-button">Time：{{ time }} s</el-button>
                <el-button size="small" class="info-button">Size：{{ size }} B</el-button>
                <span style="margin-left: 20px;">{{ lastResponse.createdDate | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                <div style="flex:1;"></div>

                <!-- TODO: add history records -->
                <!--<div style="margin-right: 8px;">
                    <el-dropdown>
                        <el-button size="small" class="last-result-button-class">
                            history
                            <Icon type="ios-arrow-down"></Icon>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>test env</el-dropdown-item>
                            <el-dropdown-item>dev env</el-dropdown-item>
                            <el-dropdown-item>pro env</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>-->
            </div>
            <Divider></Divider>
            <el-tabs type="border-card" class="tab">
                <el-tab-pane label="Response" style="padding: 0;">
                    <div class="v-div">
                        <json-editor
                            :is-editable="false"
                            v-show="responseType === 'json'"
                            ref="jsonEditor"
                            @ready="updateEditor"
                            class="json-editor"
                        ></json-editor>
                        <iframe v-show="responseType === 'html'" ref="responseFrame" class="response-iframe"></iframe>
                        <div
                            v-show="responseType === 'text'"
                            class="v-div"
                            style="justify-content: flex-start;padding: 16px;"
                        >
                            {{ lastResponse.body }}
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Header">
                    <el-table
                        :data="headerList"
                        :default-sort="{ prop: 'name', order: 'ascending' }"
                        stripe
                        style="width: 100%"
                    >
                        <el-table-column sortable prop="name" label="NAME" width="180"> </el-table-column>
                        <el-table-column prop="value" label="VALUE"> </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div v-else class="v-div">
            <template v-if="!isComplete">
                <el-button type="text" :loading="isLoading" class="loading-button"></el-button>
            </template>
            <template v-else>
                <el-button type="text" class="loading-button"
                    ><i class="el-icon-error" style="font-size: 40px;color: #F56C6C;"></i>
                </el-button>
            </template>
            <count-to ref="countTo" @complete="isComplete = true"></count-to>
            <template v-if="isComplete">
                <span style="font-size: 16px;">timeout, either server is down or has a network issue!</span>
                <el-button type="plain" class="loading-button" style="margin-top: 10px;" @click="retry"
                    >retry
                </el-button>
            </template>
        </div>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Divider from 'iview/src/components/divider/divider';
import Config from '@/util/config';
import { sendHttpRequest } from '@/util/HttpGotUtil';
import dbUtil from '@/datastore/DBUtil';
import CountTo from '@/components/count-to/count-to';
import JsonEditor from '@/components/editor/json-editor';

export default {
    name: 'ResponsePane',
    components: { Icon, Divider, JsonEditor, CountTo },
    data() {
        return {
            isLoading: false,
            isComplete: false,
            isError: false,
            currentRequest: {},
            lastResponse: { statusCode: 0 },
            responseType: 'json'
        };
    },
    computed: {
        time() {
            let t = 0;
            if (this.lastResponse && this.lastResponse.timings) {
                t = this.lastResponse.timings.end - this.lastResponse.timings.start;
                if (t < 1000) {
                    return '0.' + t;
                }
            }
            return t.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        },
        size() {
            let b = 0;
            if (this.lastResponse && this.lastResponse.connection) {
                b = this.lastResponse.connection.bytesRead;
            }
            return b.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        },
        headerList() {
            let list = [];
            if (this.lastResponse && this.lastResponse.headers) {
                let headers = this.lastResponse.headers;
                let keys = Object.keys(headers);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    list.push({ name: key, value: headers[key] });
                }
            }
            return list;
        }
    },
    mounted() {
        this.$bus.$on(Config.EVENT_BUS_UPDATE_SELECTED_REQUEST, request => {
            this.updateCurrentRequest(request);
        });
        this.$bus.$on(Config.EVENT_BUS_SEND_BUTTON_CLICKED, request => {
            this.updateCurrentRequest(request);
            this.sendRequest();
        });
    },
    methods: {
        updateCurrentRequest(request) {
            this.currentRequest = request;
            let response = dbUtil.getResponseByRequestId(request.id);
            if (response) {
                this.lastResponse = response;
            } else {
                this.lastResponse = { statusCode: 0 };
            }
            if (this.$refs.jsonEditor) {
                this.updateEditor();
            }
        },
        async sendRequest() {
            this.isComplete = false;
            if (this.$refs.countTo) {
                this.$refs.countTo.reset();
            }
            if (this.currentRequest && this.currentRequest.url) {
                this.isLoading = true;
                try {
                    let response = await sendHttpRequest(this.currentRequest);
                    if (response) {
                        // save response
                        this.lastResponse = this.convertToCustomResponse(response);
                        dbUtil.saveResponse(this.lastResponse);
                    } else {
                        this.isError = true;
                        this.lastResponse = {};
                    }
                    this.isError = false;
                } catch (error) {
                    console.log(error);
                    this.isError = true;
                    if (error && error.response) {
                        this.lastResponse = error.response;
                    } else {
                        this.lastResponse = {};
                    }
                }
                this.isLoading = false;
            }
            if (this.isError) {
                this.$message({
                    showClose: true,
                    message: 'Request finished with error.',
                    type: 'error'
                });
            }
        },
        convertToCustomResponse(response) {
            // fix: <TypeError: Converting circular structure to JSON>
            // only save needed properties
            let timings = { start: response.timings.start, end: response.timings.end };
            let connection = { bytesRead: response.connection.bytesRead };
            let convertedResponse = {
                statusCode: response.statusCode,
                body: response.body,
                timings: timings,
                connection: connection,
                headers: response.headers
            };
            // update requestId
            convertedResponse.requestId = this.currentRequest.id;
            // add create date
            convertedResponse.createdDate = new Date();
            return convertedResponse;
        },
        retry() {
            this.sendRequest();
        },
        updateEditor() {
            let body = this.lastResponse.body;
            if (body) {
                if (typeof body === 'string' && body.includes('<title>') && body.includes('<body>')) {
                    this.responseType = 'html';
                    this.$refs.responseFrame.srcdoc = body;
                } else {
                    this.responseType = 'json';
                    try {
                        let json = body;
                        if (typeof body !== 'object') {
                            json = JSON.parse(body);
                        }
                        this.$refs.jsonEditor.editor.set(json);
                    } catch (e) {
                        // not json
                        console.log(e);
                        this.responseType = 'text';
                    }
                }
            } else {
                this.$refs.jsonEditor.editor.set({});
            }
        }
    }
};
</script>

<style scoped>
.response-div {
    justify-content: flex-start;
    width: 100%;
    background: radial-gradient(ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, 0.9) 100%);
}
.error-button {
    background-color: #f56c6c !important;
}
.status-button {
    margin-left: 14px;
    background-color: #67c23a;
    color: white;
}
.info-button {
    color: white;
    margin-left: 20px;
    background-color: #515a6e;
}

.last-result-button-class {
    margin-left: 8px;
    border-radius: 4px;
    border-width: 1px;
    border-color: #c5c8ce;
}

.tab {
    width: 100%;
    height: 100%;
    margin-top: -1px;
}

.loading-button {
    background-color: transparent;
}

/deep/ .el-icon-loading {
    font-size: 60px;
}

/deep/ .count-text {
    font-size: 20px;
}
/deep/ .el-tabs__content {
    padding: 0;
    height: calc(100vh - 90px);
}
/deep/ .el-tab-pane {
    height: 100%;
}

.response-iframe {
    width: 100%;
    height: 100%;
    border-width: 0;
}
.json-editor /deep/ .editor {
    margin-top: -16px;
}
</style>
