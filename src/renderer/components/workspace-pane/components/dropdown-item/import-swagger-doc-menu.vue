<template>
    <div class="h-div">
        <el-dropdown-item class="workspace-pane-dropdown-item" :command="Config.MENU_IMPORT_SWAGGER_DOC">
            <Icon
                type="ios-redo"
                style="transform:rotateY(180deg)"
                size="18"
                class="workspace-pane-dropdown-icon"
                color="#19be6b"
            />
            Import Swagger Document
        </el-dropdown-item>
        <swagger-editor-dialog ref="swaggerEditorDialog"></swagger-editor-dialog>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Config from '@/util/config';
import SwaggerEditorDialog from '@/components/editor/swagger-editor-dialog';

export default {
    name: 'import-swagger-doc-menu',
    components: { Icon, SwaggerEditorDialog },
    data() {
        return {
            Config: Config
        };
    },
    methods: {
        showDialog() {
            this.$refs.swaggerEditorDialog.showDialog();
        }
    }
};
</script>

<style scoped></style>
