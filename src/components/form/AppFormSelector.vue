<template>
    <b-input-group prepend="Target Form: ">
        <b-form-select :options="options" :value="value" @input="updateValue"></b-form-select>
    </b-input-group>
</template>

<script>
    export default {
        name: "AppFormSelector",
        props: ['value'],
        data() {
            return {
                basics: [],
                selected: null
            };
        },
        computed: {
            options() {
                const formatted = [];
                for (let [key, value] of Object.entries(this.basics)) {
                    formatted.push({
                        text: value.title,
                        value: key
                    });
                }
                return [
                    {text: 'Select Form', value: null},
                    ...formatted
                ]
            }
        },
        methods: {
            updateValue(val) {
                this.$emit('input', val);
            }
        },
        created() {
            // fetch data from server
            const basicsRef = this.$store.state.db.ref('basics');
            basicsRef.on('value', (data) => {
                this.basics = data.val();
            });
        }
    }
</script>

<style scoped>

</style>