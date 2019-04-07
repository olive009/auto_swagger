<template>
    <div class="h-div">
        <el-popover
            placement="bottom"
            title="Note"
            trigger="click"
            content="This functionality is not finished yet!"
            v-model="visible"
        >
            <el-button slot="reference" size="small" class="cookies-button">
                Cookies
            </el-button>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'cookies-button',
    data() {
        return {
            visible: false
        };
    }
};
</script>

<style scoped>
.cookies-button {
    border-radius: 40px;
    color: #fff;
    background-color: #808695;
}
</style>
