<template>
    <div class="h-div">
        <!-- TODO: add export workspace functionality -->
        <el-dropdown-item disabled class="workspace-pane-dropdown-item" :command="Config.MENU_EXPORT_WORKSPACE">
            <Icon type="ios-redo" size="18" class="workspace-pane-dropdown-icon" color="#ff9900" />
            Export Workspace
        </el-dropdown-item>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Config from '@/util/config';

export default {
    name: 'export-workspace-menu',
    components: { Icon },
    data() {
        return {
            Config: Config
        };
    }
};
</script>

<style scoped></style>
