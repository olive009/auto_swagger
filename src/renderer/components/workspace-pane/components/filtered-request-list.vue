<template>
    <div class="v-div top-div">
        <el-menu class="menu">
            <el-menu-item
                v-for="request in requestList"
                :key="request.id"
                :index="request.id"
                class="request-item"
                :class="{ 'selected-request': selectedRequest.id === request.id }"
                @click.native="updateSelectedRequest(request)"
            >
                <request-dropdown
                    :ref="'request-dropdown-' + request.id"
                    :request="request"
                    @update-mouse-over-item="onUpdateMouseOverItem('request-dropdown-' + request.id, $event)"
                    @update-last-dropdown="onRequestUpdateLastDropdown('request-dropdown-' + request.id, $event)"
                    @saved="refreshRequest"
                    @config="showRequestConfigDialog"
                ></request-dropdown>
            </el-menu-item>
        </el-menu>
        <request-edit-dialog ref="requestEditDialog" @refresh="refreshRequest" :isEditMode="true"></request-edit-dialog>
    </div>
</template>

<script>
import Config from '@/util/config';
import dbUtil from '@/datastore/DBUtil';
import RequestEditDialog from './dialog/request-edit-dialog';
import RequestDropdown from './dropdown/request-dropdown';

export default {
    name: 'filtered-request-list',
    components: { RequestEditDialog, RequestDropdown },
    data() {
        return {
            requestList: [],
            selectedRequest: {}
        };
    },
    methods: {
        filter(filterText) {
            this.requestList = dbUtil.getRequestListLike(filterText);
        },
        refreshRequest() {
            // refresh selectedRequest
            if (this.selectedRequest.id) {
                this.updateSelectedRequest(this.selectedRequest);
            }
        },
        onUpdateMouseOverItem(dropdownRef, requestId) {
            // call onMouseOverItem() on <request-dropdown>
            this.$refs[dropdownRef][0].onMouseOverItem(requestId);
        },
        onRequestUpdateLastDropdown(dropdownRef, { refType, requestId }) {
            if (this.lastDropDown && this.lastDropDown !== this.$refs[dropdownRef][0].$refs[refType]) {
                // should close the previous dropdown
                // if lastDropDown is current showing,don't close it
                this.lastDropDown.currentVisible = false;
            }
            this.lastDropDown = this.$refs[dropdownRef][0].$refs[refType];
        },
        updateSelectedRequest(request) {
            this.selectedRequest = request;
            this.$bus.$emit(Config.EVENT_BUS_UPDATE_SELECTED_REQUEST, { ...request });
        },
        showRequestConfigDialog(request) {
            this.$refs.requestEditDialog.showDialog({ ...request });
        }
    }
};
</script>

<style scoped>
.top-div {
    width: 100%;
    justify-content: flex-start;
}

.menu {
    width: 100% !important;
    height: 100%;
    z-index: 800;
    margin-right: -1px;
}
.request-item {
    padding-left: 36px;
    background-color: white;
}
.selected-request {
    color: #0070c0;
    background-color: #c8ebfa;
}
</style>
