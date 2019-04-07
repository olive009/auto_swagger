<template>
    <el-table :data="data" border style="width: 100%;">
        <el-table-column prop="name" label="Properties" width="150">
            <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
                <span v-if="scope.row.required" style="color: red;font-size: 12px;"> * required</span>
            </template>
        </el-table-column>
        <el-table-column prop="value" label="Type">
            <template slot-scope="scope">
                <p v-if="scope.row.value.type">
                    <span>{{ scope.row.value.type }}</span>
                    <span v-if="scope.row.value.format">({{ scope.row.value.format }})</span>
                    <span v-if="scope.row.value.items">[{{ scope.row.value.items.type }}]</span>
                    <el-tag
                        v-if="scope.row.value.items && scope.row.value.items.$ref"
                        size="medium"
                        @click="showInnerTableByRef(scope.row.value.items.$ref)"
                        >show</el-tag
                    >
                </p>
                <p v-if="scope.row.value.$ref">
                    <span>{{ getRefName(scope.row.value.$ref) }}</span>
                    <el-tag size="medium" @click="showInnerTable(scope.row.name)">show</el-tag>
                </p>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'properties-table',
    props: ['data'],
    methods: {
        getRefName(ref) {
            if (ref) {
                let refArray = ref.split('/');
                let refName = refArray[refArray.length - 1];
                return refName.charAt(0).toUpperCase() + refName.slice(1);
            }
        },
        showInnerTable(name) {
            this.$emit('show-inner-object', name.charAt(0).toUpperCase() + name.slice(1));
        },
        showInnerTableByRef(ref) {
            let refArray = ref.split('/');
            let name = refArray[refArray.length - 1];
            this.showInnerTable(name);
        }
    }
};
</script>

<style scoped>
.el-tag {
    cursor: pointer;
}
</style>
