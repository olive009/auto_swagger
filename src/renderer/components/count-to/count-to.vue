<template>
    <div class="iCountUp">
        <ICountUp :endVal="endVal" :options="options" @ready="onReady" />
    </div>
</template>

<script type="text/babel">
import ICountUp from './vue-count-up';
export default {
    name: 'CountTo',
    components: {
        ICountUp
    },
    data() {
        return {
            instance: null,
            endVal: 0,
            duration: 15,
            options: {
                duration: 1,
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ' seconds'
            }
        };
    },
    methods: {
        onReady: function(instance) {
            this.instance = instance;
            if (this.duration > 0) {
                this.duration -= 1;
                this.endVal = this.endVal + 1000;
                instance.update(this.endVal);
            } else {
                this.$emit('complete');
            }
        },
        reset() {
            this.endVal = 0;
            this.duration = 14;
            this.instance.reset();
            this.endVal = this.endVal + 1000;
            this.instance.update(this.endVal);
        }
    }
};
</script>

<style scoped>
.iCountUp {
    font-size: 24px;
    margin: 0;
}
</style>
