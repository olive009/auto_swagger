<template>
    <div class="top-div">
        <span style="font-weight: bold;">Parameters</span>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="Name" width="150">
                <template slot-scope="scope">
                    <p>
                        <span>{{ scope.row.name }}</span>
                        <span v-if="scope.row.required" style="color: red;font-size: 12px;"> * required</span>
                    </p>
                    <p v-if="scope.row.type">
                        <span>{{ scope.row.type }}</span>
                        <span v-if="scope.row.format">({{ scope.row.format }})</span>
                        <span v-if="scope.row.items">[{{ scope.row.items.type }}]</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="Description">
                <template slot-scope="scope">
                    <p>
                        <span>{{ scope.row.description }}</span>
                    </p>
                    <p v-if="scope.row.enum || (scope.row.items && scope.row.items.enum)">
                        <span>Available values: </span>
                        <span>{{ scope.row.enum || scope.row.items.enum }}</span>
                    </p>
                    <p v-if="scope.row.in === 'body'">
                        <properties-table
                            :data="getPropertiesData(scope.row)"
                            @show-inner-object="showInnerObject"
                        ></properties-table>
                    </p>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            v-el-drag-dialog
            :close-on-click-modal="false"
            :append-to-body="true"
            :visible.sync="isShowDialog"
            :title="dialogTitle"
        >
            <properties-table :data="dialogTableData"></properties-table>
        </el-dialog>
    </div>
</template>

<script>
import dbUtil from '@/datastore/DBUtil';
import PropertiesTable from './properties-table';
import elDragDialog from '@/directive/el-dragDialog';
import _includes from 'lodash/includes';

export default {
    name: 'parameter-table',
    directives: { elDragDialog },
    components: { PropertiesTable },
    props: ['currentRequest'],
    data() {
        return {
            tableData: [],
            definitionList: [],
            isShowDialog: false,
            dialogTitle: '',
            dialogTableData: []
        };
    },
    watch: {
        currentRequest() {
            this.updateTableData();
        }
    },
    mounted() {
        this.updateTableData();
    },
    methods: {
        updateTableData() {
            if (this.currentRequest && this.currentRequest.parameters) {
                this.tableData = this.currentRequest.parameters;
                // get definitionList from current workspace
                if (this.currentRequest.workspaceId) {
                    let workspace = dbUtil.findWorkspaceById(this.currentRequest.workspaceId);
                    this.definitionList = workspace.data.definitions;
                }
            } else {
                this.tableData = [];
            }
        },
        getPropertiesData(row) {
            let model;
            if (row.schema && row.schema.items && row.schema.items.$ref) {
                model = this.getDefinition(row.schema.items.$ref);
            } else {
                model = this.getDefinition(row.schema.$ref);
            }
            return this.convertObjectToList(model.properties, model.required);
        },
        convertObjectToList(object, requiredList) {
            let keys = Object.keys(object);
            let dataList = [];
            keys.forEach(key => {
                let obj = {};
                obj.name = key;
                obj.value = object[key];
                obj.required = _includes(requiredList, key);
                dataList.push(obj);
            });
            return dataList;
        },

        getModelNameFromRef(ref) {
            let refArray = ref.split('/');
            return refArray[refArray.length - 1];
        },

        getDefinition(ref) {
            let name = this.getModelNameFromRef(ref);
            return { ...this.definitionList[name] };
        },
        showInnerObject(name) {
            this.isShowDialog = true;
            this.dialogTitle = name + ' Definition';
            let properties = this.getDefinition(name).properties;
            this.dialogTableData = this.convertObjectToList(properties);
        }
    }
};
</script>

<style scoped>
.top-div {
    width: 100%;
    padding: 8px;
    font-size: 14px;
}
/deep/ .el-dialog__body {
    padding: 16px;
}
</style>
