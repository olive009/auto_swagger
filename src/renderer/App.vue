<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import dbUtil from '@/datastore/DBUtil';

export default {
    name: 'auto_swagger',
    created() {
        dbUtil.init(this.$db, this.$store);
        dbUtil.getLastState();
    }
};
</script>

<style>
/* CSS */
</style>
