<template>
    <div class="top-div">
        <div class="h-div format-button-div">
            <el-button v-if="isEditable" class="format-button" size="small" @click="formatJson">{{
                formatLabel
            }}</el-button>
        </div>
        <div ref="jsonEditor" class="editor"></div>
    </div>
</template>

<script>
import JSONEditor from 'jsoneditor/dist/jsoneditor';

export default {
    name: 'json-editor',
    props: {
        mode: {
            type: String,
            default: 'code'
        },
        isEditable: {
            type: Boolean,
            default: true
        },
        formatLabel: {
            type: String,
            default: 'Format'
        },
        isInDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            editor: null
        };
    },
    mounted() {
        if (!this.isInDialog) {
            this.createEditor();
        }
    },
    methods: {
        createEditor() {
            if (this.editor === null) {
                let container = this.$refs.jsonEditor;
                let options = {
                    mode: this.mode,
                    onChange: () => {
                        this.$emit('onChange');
                    }
                };
                if (!this.isEditable) {
                    options.onEditable = () => false;
                }
                this.editor = new JSONEditor(container, options);
                this.$emit('ready');
            }
        },
        formatJson() {
            let jsonText = this.editor.get();
            this.editor.set(jsonText);
        }
    }
};
</script>

<style scoped>
.top-div {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
}
.editor {
    width: 100%;
    flex: 1;
    margin-top: -48px;
}
.format-button-div {
    justify-content: flex-end;
    padding: 8px;
}
.format-button {
    opacity: 0.5;
    z-index: 100;
}
.format-button:hover {
    opacity: 1;
}
/deep/ .ace_gutter-layer {
    background: #f5f7fa;
}
</style>
