<template>
    <Dropdown
        ref="dropdown"
        trigger="contextMenu"
        @on-click="onRequestDropdownItemClicked"
        placement="bottom"
        style="width: 100%;"
    >
        <div class="menu-item-div" @contextmenu="onContextMenu(folder.id)">
            {{ folder.name }}
        </div>
        <folder-dropdown-menu slot="list"></folder-dropdown-menu>

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
                    <span style="color:red;">Deleting the folder would delete all the request under this folder!</span>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" type="plain" @click="isShowDeleteDialog = false">Cancel</el-button>
                <el-button size="small" type="danger" @click="confirmDelete">Delete</el-button>
            </div>
        </el-dialog>
    </Dropdown>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Dropdown from 'iview/src/components/dropdown/dropdown';
import Divider from 'iview/src/components/divider/divider';
import dbUtil from '@/datastore/DBUtil';
import Config from '@/util/config';
import FolderDropdownMenu from '../dropdown-menu/folder-dropdown-menu';
import elDragDialog from '@/directive/el-dragDialog';

export default {
    name: 'folder-dropdown',
    components: { Icon, Dropdown, Divider, FolderDropdownMenu },
    directives: { elDragDialog },
    props: ['folder'],
    data() {
        return { Config: Config, isShowDeleteDialog: false };
    },
    methods: {
        onRequestDropdownItemClicked(menuName) {
            if (Config.MENU_COPY_FOLDER === menuName) {
                let currentFolder = dbUtil.getFolderById(this.folder.id);
                dbUtil.copyFolder({ ...currentFolder });
                this.$emit('saved');
            } else if (Config.MENU_DELETE_FOLDER === menuName) {
                this.isShowDeleteDialog = true;
            } else {
                this.$emit('config', this.folder.id);
            }
        },
        onContextMenu(folderId) {
            this.$emit('update-last-dropdown', {
                refType: 'dropdown',
                folderId: folderId
            });
        },
        confirmDelete() {
            dbUtil.deleteFolder(this.folder.id);
            this.$emit('saved');
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

.el-menu-item.is-active {
    color: #0070c0 !important;
    background: #c8ebfa !important;
}

/deep/ .ivu-select-dropdown {
    width: 120px;
}
</style>
