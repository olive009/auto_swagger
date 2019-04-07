<template>
    <div id="wrapper">
        <Split v-model="firstSplit">
            <div slot="left" style="height: 100%;">
                <workspace-pane></workspace-pane>
            </div>
            <div slot="right" style="height: 100%;">
                <Split v-model="secondSplit">
                    <div slot="left" class="pane">
                        <request-pane></request-pane>
                    </div>
                    <div slot="right" class="pane">
                        <response-pane></response-pane>
                    </div>
                </Split>
            </div>
        </Split>
    </div>
</template>

<script>
import WorkspacePane from './workspace-pane/workspace-pane';
import RequestPane from './request-pane/request-pane';
import ResponsePane from './response-pane/response-pane';
import Split from 'iview/src/components/split/split';

export default {
    name: 'landing-page',
    components: { WorkspacePane, RequestPane, ResponsePane, Split },
    data() {
        return {
            firstSplit: 0.2,
            secondSplit: 0.5
        };
    },
    methods: {
        open(link) {
            this.$electron.shell.openExternal(link);
        }
    }
};
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
}

#wrapper {
    height: 100vh;
    width: 100vw;
}

.pane {
    width: 100%;
    height: 100%;
}
</style>
