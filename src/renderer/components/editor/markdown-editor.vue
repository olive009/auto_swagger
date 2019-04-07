<template>
    <div class="h-div">
        <el-tabs type="border-card" style="width:100%;">
            <el-tab-pane v-if="!readonly" label="Text">
                <mavon-editor
                    v-model="text"
                    defaultOpen="edit"
                    :toolbarsFlag="false"
                    @change="textChangedHandler"
                    placeholder="Please input description, markdown format is supported."
                ></mavon-editor
            ></el-tab-pane>
            <el-tab-pane label="Preview">
                <mavon-editor
                    v-model="text"
                    :editable="false"
                    defaultOpen="preview"
                    :toolbarsFlag="false"
                    :subfield="false"
                ></mavon-editor>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
export default {
    name: 'markdown-editor',
    components: {
        mavonEditor
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            text: this.value
        };
    },
    watch: {
        value(newVal) {
            this.text = newVal;
        }
    },
    methods: {
        textChangedHandler(value) {
            this.$emit('input', value);
        }
    }
};
</script>

<style scoped>
/deep/ .v-note-wrapper {
    width: 100%;
    min-height: 60px;
    max-height: 400px;
}
/deep/ .content-input-wrapper {
    background-color: #f9f9f9;
    padding: 8px !important;
}
/deep/ .auto-textarea-input {
    background-color: #f9f9f9;
}
/deep/ .el-tabs__content {
    padding: 8px;
}
/deep/ textarea::placeholder {
    color: #bdbdbd;
}
</style>
