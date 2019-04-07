<template>
    <DropdownMenu>
        <DropdownItem class="workspace-pane-dropdown-item" :name="Config.MENU_COPY_FOLDER">
            <Icon type="md-copy" size="18" color="#2DB7F5" class="workspace-pane-dropdown-icon" />
            Duplicate Folder
        </DropdownItem>
        <DropdownItem class="workspace-pane-dropdown-item" :name="Config.MENU_DELETE_FOLDER">
            <Icon type="md-trash" size="18" color="#ed4014" class="workspace-pane-dropdown-icon" />
            Delete Folder
        </DropdownItem>
        <DropdownItem class="workspace-pane-dropdown-item" :divided="true" :name="Config.MENU_CONFIG_FOLDER">
            <Icon type="md-settings" size="18" color="#19be6b" class="workspace-pane-dropdown-icon" />
            Folder Management
        </DropdownItem>
    </DropdownMenu>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import DropdownMenu from 'iview/src/components/dropdown-menu';
import DropdownItem from 'iview/src/components/dropdown-item';
import Config from '@/util/config';

export default {
    name: 'request-dropdown-menu',
    components: {
        Icon,
        DropdownMenu,
        DropdownItem
    },
    data() {
        return {
            Config: Config
        };
    }
};
</script>

<style scoped></style>
