import { CountUp } from 'countup.js/dist/countUp';
import _isFunction from 'lodash/isFunction';

let ICountUp = {
    __countup__: CountUp,
    name: 'ICountUp',
    props: {
        endVal: {
            type: Number,
            required: true
        },
        options: {
            type: Object,
            required: false
        }
    },
    data: function data() {
        return {
            instance: null
        };
    },
    // computed: {},
    watch: {
        endVal: {
            handler: function handler(value) {
                let that = this;

                if (that.instance && _isFunction(that.instance.update)) {
                    that.instance.update(value);
                }
            },
            deep: false
        }
    },
    methods: {
        init: function init() {
            let that = this;

            if (that.instance) {
                return;
            }

            let dom = that.$el;
            let instance = new CountUp(dom, that.endVal, that.options);

            if (!instance.error) {
                instance.start(function() {
                    return that.$emit('ready', instance, CountUp);
                });
                that.instance = instance;
            }
        },
        uninit: function uninit() {
            let that = this;
            that.instance = null;
        },
        printValue: function printValue(value) {
            let that = this;

            if (that.instance && _isFunction(that.instance.printValue)) {
                return that.instance.printValue(value);
            }
        },
        start: function start(callback) {
            let that = this;

            if (that.instance && _isFunction(that.instance.start) && _isFunction(callback)) {
                return that.instance.start(callback);
            }
        },
        pauseResume: function pauseResume() {
            let that = this;

            if (that.instance && _isFunction(that.instance.pauseResume)) {
                return that.instance.pauseResume();
            }
        },
        reset: function reset() {
            let that = this;

            if (that.instance && _isFunction(that.instance.reset)) {
                return that.instance.reset();
            }
        },
        update: function update(newEndVal) {
            let that = this;

            if (that.instance && _isFunction(that.instance.update)) {
                return that.instance.update(newEndVal);
            }
        }
    },
    // beforeCreate() {
    // const that = this;
    // console.log('beforeCreate');
    // },
    // created() {
    // const that = this;
    // console.log('created');
    // },
    // beforeMount() {
    // const that = this;
    // console.log('beforeMount');
    // },
    mounted: function mounted() {
        let that = this; // console.log('mounted');

        that.init();
    },
    // beforeUpdate() {
    // const that = this;
    // console.log('beforeUpdate');
    // },
    // updated() {
    // const that = this;
    // console.log('updated');
    // },
    // activated() {
    // const that = this;
    // console.log('activated');
    // },
    // deactivated() {
    // const that = this;
    // console.log('deactivated');
    // },
    beforeDestroy: function beforeDestroy() {
        let that = this; // console.log('beforeDestroy');

        that.uninit();
    },
    // destroyed() {
    // const that = this;
    // console.log('destroyed');
    // },
    render: function render(h) {
        // const that = this;
        return h('span', {});
    }
};

export default ICountUp;
