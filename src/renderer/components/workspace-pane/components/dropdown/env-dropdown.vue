<template>
    <div class="h-div" style="padding: 8px;">
        <el-dropdown
            class="env-dropdown"
            trigger="click"
            @command="onDropdownItemClicked"
            @visible-change="onVisibleChanged"
        >
            <el-button size="small" class="env-button">
                <label v-if="currentEnv">{{ currentEnv.name }}</label>
                <label v-else>Environments</label>
                <Icon type="ios-arrow-down"></Icon>
            </el-button>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <div class="h-div no-env-div" v-if="envList.length === 0">NO Environment Exist</div>
                <template v-else>
                    <el-dropdown-item v-for="env in envList" :key="env.id" :command="env.id"
                        >{{ env.name }}
                    </el-dropdown-item>
                </template>
                <el-dropdown-item divided :command="Config.MENU_CONFIG_ENV">
                    <Icon type="md-settings" size="18" color="#19be6b" class="workspace-pane-dropdown-icon" />
                    Environment Management
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <env-manage-dialog ref="envManageDialog"></env-manage-dialog>
    </div>
</template>

<script>
import Icon from 'iview/src/components/icon/icon.vue';
import Config from '@/util/config';
import EnvManageDialog from '@/components/workspace-pane/components/dialog/env-manage-dialog';
import dbUtil from '@/datastore/DBUtil';

export default {
    name: 'env-dropdown',
    components: { Icon, EnvManageDialog },
    data() {
        return {
            Config: Config,
            currentEnv: null,
            envList: []
        };
    },
    mounted() {
        this.$bus.$on(Config.EVENT_BUS_UPDATE_ENV_NAME, env => {
            if (this.currentEnv && env.id === this.currentEnv.id) this.currentEnv = env;
        });
    },
    methods: {
        onVisibleChanged(visible) {
            if (visible) {
                this.envList = dbUtil.getAllEnv();
            }
        },
        onDropdownItemClicked(command) {
            if (command === Config.MENU_CONFIG_ENV) {
                this.$refs.envManageDialog.showDialog();
            } else {
                // command is env.id
                this.loadCurrentEnv(command);
            }
        },
        loadCurrentEnv(envId) {
            this.currentEnv = dbUtil.getEnvById(envId);
        }
    }
};
</script>

<style scoped>
.env-button {
    border-radius: 40px;
    color: #fff;
    background-color: #808695;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
}

.env-dropdown {
    overflow: hidden;
}

.dropdown-menu {
    margin-top: 4px;
}

.no-env-div {
    line-height: 36px;
    font-size: 14px;
}
</style>
