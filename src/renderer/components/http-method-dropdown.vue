<template>
    <el-dropdown @command="methodChangeHandler" trigger="click" placement="bottom">
        <el-button
            size="small"
            class="method-button-class"
            :style="'color:white;background-color:' + Config.HTTP_METHOD_COLOR_MAPPING[selectedMethod]"
        >
            {{ selectedMethod }}
            <Icon type="ios-arrow-down"></Icon>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
                :style="'color:' + item.color"
                v-for="item in methodList"
                :command="item.name"
                :key="item.name"
                >{{ item.name }}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import Config from '@/util/config';
import Icon from 'iview/src/components/icon/icon.vue';

export default {
    name: 'http-method-dropdown',
    components: { Icon },
    props: {
        value: {
            type: String,
            default: 'GET'
        }
    },
    data() {
        return {
            Config: Config,
            selectedMethod: this.value,
            methodList: Config.HTTP_METHOD_LIST
        };
    },
    watch: {
        value(newVal) {
            this.selectedMethod = newVal;
        }
    },
    methods: {
        methodChangeHandler(name) {
            this.selectedMethod = this.methodList.filter(method => {
                return method.name === name;
            })[0].name;
            this.$emit('input', this.selectedMethod);
        }
    }
};
</script>

<style scoped></style>
