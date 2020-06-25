<template>
    <b-form-group :label="title">
        <b-form-input v-if="type === 'String'" @input="updateValue" :value="value" type="text" :placeholder="title" :required="required"></b-form-input>
        <b-form-input v-else-if="type === 'Email'" @input="updateValue" :value="value" type="email" :placeholder="title"
                      :required="required"></b-form-input>
        <b-form-input v-else-if="type === 'Number'" @input="updateValue" :value="value" type="number" :placeholder="title"
                      :required="required"></b-form-input>
        <b-form-select v-else-if="type === 'Options'" @input="updateValue" :value="value" :options="getOptions"></b-form-select>
        <b-form-checkbox v-else-if="type === 'Boolean'" switch @input="updateValue" :checked="value">
            <b>({{ value ? 'Yes' : 'No' }})</b>
        </b-form-checkbox>
        <p v-else>Unsupported Type '{{ type }}'</p>
    </b-form-group>
</template>

<script>
    export default {
        name: "AppFormInput",
        props: {
            title: String,
            type: String,
            required: Boolean,
            options: {
                type: Array,
                required: false
            },
            value: {
                required: false
            }
        },
        computed: {
            getOptions() {
                return [
                    {text: 'Select an option', value: null},
                    ...this.options
                ];
            }
        },
        methods: {
            updateValue(val) {
                this.$emit('input', val);
            }
        }
    }
</script>

<style scoped>

</style>