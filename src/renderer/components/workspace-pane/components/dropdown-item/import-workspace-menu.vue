<template>
    <div class="h-div">
        <!-- TODO: add import workspace functionality -->
        <el-dropdown-item disabled class="workspace-pane-dropdown-item" :command="Config.MENU_IMPORT_WORKSPACE">
            <Icon
                type="ios-redo"
                style="transform:rotateY(180deg)"
                size="18"
                class="workspace-pane-dropdown-icon"
                color="#909399"
            />
            Import Workspace
        </el-dropdown-item>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Config from '@/util/config';

export default {
    name: 'import-workspace-menu',
    components: { Icon },
    data() {
        return {
            Config: Config
        };
    }
};
</script>

<style scoped></style>
