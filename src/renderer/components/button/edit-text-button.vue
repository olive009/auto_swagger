<template>
    <div class="top-div">
        <el-button
            v-show="!isEditing"
            type="text"
            class="text-button"
            @click="$emit('click')"
            @dblclick.native="startEdit"
            >{{ text }}
        </el-button>
        <input
            ref="input"
            class="text-input"
            v-show="isEditing"
            v-model="text"
            v-on:blur="stopEdit"
            @keyup.enter="isEditing = false"
        />
    </div>
</template>

<script>
export default {
    name: 'edit-text-button',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isEditing: false,
            text: this.value
        };
    },
    watch: {
        value(newVal) {
            this.text = newVal;
        }
    },
    methods: {
        startEdit() {
            this.isEditing = true;
            this.$nextTick(function() {
                this.$refs.input.focus();
                this.$refs.input.select();
            });
        },
        stopEdit() {
            this.isEditing = false;
            this.$emit('input', this.text);
        }
    }
};
</script>

<style scoped>
.top-div {
    width: 100%;
}

.text-button {
    color: #606266;
    width: 100%;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-input {
    padding: 7px 0;
    border-width: 1px;
}
</style>
