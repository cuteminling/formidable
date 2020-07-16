<template>
    <div class="container bg-white py-3 border border-top-0">
        <div class="row">
            <div class="col">
                <h3>Create New Form</h3>
                <hr class="mt-0">
                <b-form @submit="createForm">
                    <b-form-group
                            label="Title:"
                            label-for="inputTitle">
                        <b-form-input
                                id="inputTitle"
                                v-model="form.title"
                                type="text"
                                required
                                placeholder="Enter title"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group label="Description:" label-for="inputDesc">
                        <b-form-textarea
                                id="inputDesc"
                                v-model="form.desc"
                                rows="3"
                                max-rows="6"
                                required
                                placeholder="Enter description"
                        ></b-form-textarea>
                    </b-form-group>

                    <hr>
                    <b-form-group label="Custom Fields:" label-for="inputFields">
                        <div class="row">
                            <div class="col-sm">
                                <b-form @submit="addField">
                                    <b-form-input
                                            id="inputFields"
                                            v-model="fieldBuilder.title"
                                            placeholder="Enter field name"
                                            required
                                            class="mb-2"
                                    ></b-form-input>
                                    <b-form-select
                                            v-model="fieldBuilder.type"
                                            :options="fieldTypes"
                                            required
                                            class="mb-2"
                                    ></b-form-select>
                                    <b-form-tags
                                            v-if="isOptions"
                                            v-model="fieldBuilder.options"
                                            class="mb-2"
                                            placeholder="Add option"
                                            duplicate-tag-text="duplicate option(s)"
                                            remove-on-delete
                                    ></b-form-tags>
                                    <b-form-checkbox
                                            v-model="fieldBuilder.isRequired"
                                            class="mb-2"
                                    >Required
                                    </b-form-checkbox>
                                    <b-button block type="submit" variant="secondary" class="mb-2">Add</b-button>
                                </b-form>
                            </div>
                            <div class="col-sm">
                                <b-table
                                        striped hover
                                        :items="form.fields"
                                        :fields="fieldHeader"
                                        :bordered="true"
                                        head-variant="dark"
                                        :responsive="true"
                                >
                                    <template v-slot:cell(action)="row">
                                        <b-button size="sm" @click="removeField(row.item)"
                                                  :disabled="row.item.status === 'default'">
                                            Delete
                                        </b-button>
                                    </template>
                                </b-table>
                            </div>
                        </div>
                        <hr class="mt-0">
                    </b-form-group>

                    <b-form-group label="Time Slots:" label-for="inputTimeSlot">
                        <div class="row">
                            <div class="col-sm">
                                <b-form @submit="addTimeslot">
                                    <b-form-datepicker
                                            id="inputTimeSlot"
                                            v-model="timeBuilder.date"
                                            class="mb-2"
                                            required
                                    ></b-form-datepicker>
                                    <b-form-timepicker
                                            v-model="timeBuilder.time"
                                            locale="en"
                                            :show-seconds="false"
                                            :minutes-step="5"
                                            required
                                            class="mb-2"
                                    ></b-form-timepicker>
                                    <b-form-input
                                            type="number"
                                            v-model="timeBuilder.duration"
                                            placeholder="Duration (min)"
                                            class="mb-2"
                                            required
                                    ></b-form-input>
                                    <b-form-checkbox
                                            v-model="timeBuilder.isUnlimited"
                                            class="mb-2"
                                    >Unlimited attendees
                                    </b-form-checkbox>
                                    <b-form-input
                                            v-if="!timeBuilder.isUnlimited"
                                            type="number"
                                            v-model="timeBuilder.max"
                                            placeholder="Max Attendees"
                                            class="mb-2"
                                            required
                                    ></b-form-input>
                                    <b-button block type="submit" variant="secondary" class="mb-2">Add</b-button>
                                </b-form>
                            </div>
                            <div class="col-sm">
                                <b-table
                                        striped hover
                                        :items="form.timeslots"
                                        :fields="timeHeader"
                                        :bordered="true"
                                        head-variant="dark"
                                        :responsive="true"
                                        empty-text="Empty Time Slots"
                                        show-empty
                                >
                                    <template v-slot:cell(datetime)="row">
                                        {{ getDuration(row.item.datetime, row.item.duration) }}
                                    </template>
                                    <template v-slot:cell(max)="row">
                                        {{ row.item.max === -1 ? 'unlimited' : row.item.max }}
                                    </template>
                                    <template v-slot:cell(action)="row">
                                        <b-button size="sm" @click="removeTime(row.item)">
                                            Delete
                                        </b-button>
                                    </template>
                                </b-table>
                            </div>
                        </div>
                        <hr>
                    </b-form-group>

                    <b-form-group>
                        <b-form-checkbox
                                v-model="form.isAvailable"
                                class="mb-2"
                                switch
                        >{{ form.isAvailable ? 'Form Available' : 'Form Disabled' }}
                        </b-form-checkbox>
                    </b-form-group>

                    <b-button block type="submit" variant="primary">Submit</b-button>
                </b-form>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "TheNewForm",
        data() {
            return {
                form: {
                    title: '',
                    desc: '',
                    fields: [
                        {
                            title: 'Email',
                            type: 'Email',
                            status: 'default',
                            index: 0
                        }
                    ],
                    timeslots: [],
                    isAvailable: true,
                    createdAt: null
                },
                fieldTypes: [{text: 'Select Field Type', value: null}, 'String', 'Number', 'Email', 'Boolean', 'Options'],
                fieldHeader: ['title', 'type', 'status', 'action'],
                fieldBuilder: {
                    title: '',
                    type: null,
                    isRequired: true,
                    options: []
                },
                timeHeader: ['datetime', 'duration', 'max', 'action'],
                timeBuilder: {
                    date: moment().format('YYYY-MM-DD'),
                    time: moment().format('HH:mm:ss'),
                    duration: '',
                    isUnlimited: true,
                    max: ''
                }
            }
        },
        computed: {
            isOptions() {
                return this.fieldBuilder.type === 'Options';
            },
            isAvailable() {
                return this.form.isAvailable
            }
        },
        methods: {
            getDuration(start, dur) {
                const startMoment = moment(start);
                const endMoment = startMoment.clone().add(dur, 'm');
                if (startMoment.isSame(endMoment, 'day')) {
                    return startMoment.format('LLL') + ' ~ ' + endMoment.format('h:mm A');
                } else {
                    return startMoment.format('LLL') + ' ~ ' + endMoment.format('LLL');
                }
            },
            getFieldIndex() {
                return this.form.fields.length;
            },
            addField(evt) {
                evt.preventDefault();
                let newField = {
                    title: this.fieldBuilder.title,
                    type: this.fieldBuilder.type,
                    status: this.fieldBuilder.isRequired ? 'required' : 'optional',
                    index: this.getFieldIndex()
                };
                if (this.fieldBuilder.type === 'Options') {
                    newField.options = this.fieldBuilder.options;
                }
                this.form.fields.push(newField);
                this.makeToast('Updated !', `Custom Field "${this.fieldBuilder.title}" created.`, 'info');
                this.fieldBuilder = {
                    title: '',
                    type: null,
                    isRequired: true,
                    options: []
                }
            },
            addTimeslot(evt) {
                evt.preventDefault();
                let newTime = {
                    datetime: this.timeBuilder.date + 'T' + this.timeBuilder.time,
                    duration: this.timeBuilder.duration,
                    max: this.timeBuilder.max ? this.timeBuilder.max : -1,
                };
                // track registered count
                if (this.timeBuilder.max) {
                    newTime.count = 0
                }
                this.form.timeslots.push(newTime);
                this.makeToast('Updated !', `Timeslot "${moment(newTime.datetime).format('LLL')}" created.`, 'info');
                this.timeBuilder = {
                    date: moment().format('YYYY-MM-DD'),
                    time: moment().format('HH:mm:ss'),
                    duration: '',
                    isUnlimited: true,
                    max: ''
                }
            },
            removeField(item) {
                let removeIndex = this.form.fields.indexOf(item);
                if (removeIndex !== -1) {
                    this.form.fields.splice(removeIndex, 1);
                    this.makeToast('Updated !', `Custom Field "${item.title}" removed.`, 'warning');
                }
            },
            removeTime(item) {
                let removeIndex = this.form.timeslots.indexOf(item);
                if (removeIndex !== -1) {
                    this.form.timeslots.splice(removeIndex, 1);
                }
            },
            async pushNewForm(payload) {
                // firebase
                try {
                    // get key ref
                    const newFormRef = this.$store.state.db.ref('forms').push();
                    // push to form db
                    await newFormRef.set(payload);
                    // push to summary db
                    await this.$store.state.db.ref('basics').child(newFormRef.key).set({
                        title: payload.title,
                        desc: payload.desc,
                        isAvailable: payload.isAvailable,
                        createdAt: payload.createdAt
                    });
                    this.makeToast('Publication Success !', 'The new event is now live for all visitors.', 'success');
                } catch (e) {
                    this.makeToast('Publication Failed !', 'An error occurred during submission. Contact the admins for further supports.','danger');
                }
            },
            async createForm(evt) {
                evt.preventDefault();
                const isConfirm = await this.makeModal('Confirm New Form', 'You can no longer edit the fields of the form after it is created. Do you wish to proceed?');
                if (isConfirm) {
                    // warn empty timeslots
                    if (this.form.timeslots.length === 0) {
                        this.makeToast('Warning !', 'There is no available timeslots for this event, user will be unable to register until a timeslot is created.', 'warning');
                    }
                    // add timestamp
                    this.form.createdAt = moment().format();
                    // push form
                    this.pushNewForm(this.form);
                    // clear form
                    this.form = {
                        title: '',
                        desc: '',
                        fields: [
                            {
                                title: 'Name',
                                type: 'String',
                                status: 'default',
                                index: 0
                            },
                            {
                                title: 'Email',
                                type: 'String',
                                status: 'default',
                                index: 1
                            },
                            {
                                title: 'Phone',
                                type: 'String',
                                status: 'default',
                                index: 2
                            }
                        ],
                        timeslots: [],
                        isAvailable: true
                    }
                }
            }
        },
        watch: {
            isAvailable(val) {
                if (!val) {
                    // warn disable form
                    this.makeToast('Warning !', 'Form is disabled. User will be unable to register for the event.', 'warning');
                }
            }
        }
    }
</script>

<style scoped>

</style>