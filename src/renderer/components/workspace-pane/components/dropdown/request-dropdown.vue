<template>
    <Dropdown
        ref="dropdown"
        trigger="contextMenu"
        @on-click="onRequestDropdownItemClicked($event, request)"
        placement="bottom"
        style="width: 100%;"
    >
        <div
            class="menu-item-div"
            @mouseenter="updateMouseOverItem(request.id)"
            @mouseleave="updateMouseOverItem(null)"
            @contextmenu="onContextMenu(request.id)"
        >
            <div style="width: 100%;display: flex;align-items: center;">
                <span
                    :style="
                        'min-width: 52px;margin-right: 8px;color:' + Config.HTTP_METHOD_COLOR_MAPPING[request.method]
                    "
                    >{{ request.method }}</span
                >
                <span class="name-div">{{ request.name }}</span>
            </div>
            <Dropdown
                ref="inner-dropdown"
                v-if="mouseOverRequestId === request.id"
                trigger="click"
                @on-visible-change="onInnerDropdownVisible(request.id, $event)"
                @on-click="onRequestDropdownItemClicked($event, request)"
                placement="right"
                style="width:auto;margin-right: 20px;"
            >
                <Icon type="md-arrow-dropdown" size="20"></Icon>
                <request-dropdown-menu slot="list"></request-dropdown-menu>
            </Dropdown>
        </div>
        <request-dropdown-menu slot="list"></request-dropdown-menu>
    </Dropdown>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Dropdown from 'iview/src/components/dropdown/dropdown';
import dbUtil from '@/datastore/DBUtil';
import Config from '@/util/config';
import RequestDropdownMenu from '../dropdown-menu/request-dropdown-menu';

export default {
    name: 'request-dropdown',
    components: {
        Icon,
        Dropdown,
        RequestDropdownMenu
    },
    props: ['request'],
    data() {
        return {
            Config: Config,
            mouseOverRequestId: null
        };
    },
    methods: {
        updateMouseOverItem(requestId) {
            this.$emit('update-mouse-over-item', requestId);
        },
        onMouseOverItem(mouseOverRequestId) {
            this.mouseOverRequestId = mouseOverRequestId;
        },
        onRequestDropdownItemClicked(menuName, currentRequest) {
            if (Config.MENU_COPY_REQUEST === menuName) {
                let copyRequest = { ...currentRequest };
                copyRequest.id = null;
                copyRequest.name = currentRequest.name + '-copy';
                dbUtil.createRequest(copyRequest);
                this.$emit('saved');
            } else if (Config.MENU_DELETE_REQUEST === menuName) {
                dbUtil.deleteRequest(currentRequest.id);
                this.$emit('saved');
            } else {
                this.$emit('config', this.request);
            }
        },
        onContextMenu(requestId) {
            this.$emit('update-last-dropdown', {
                refType: 'dropdown',
                requestId: requestId
            });
        },

        onInnerDropdownVisible(requestId, visible) {
            // only update when visible
            if (visible) {
                this.$emit('update-last-dropdown', {
                    refType: 'inner-dropdown',
                    requestId: requestId
                });
            }
        }
    }
};
</script>

<style scoped>
.menu-item-div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.name-div {
    text-overflow: ellipsis;
    overflow: hidden;
}

/deep/ .ivu-select-dropdown {
    width: 100px;
}
</style>
