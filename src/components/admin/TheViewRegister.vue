<template>
    <div class="container bg-white py-3 border border-top-0">
        <div class="row">
            <div class="col">
                <h3>View Response</h3>
                <AppFormSelector v-model="formSelected"></AppFormSelector>
                <hr>
            </div>
        </div>
        <div v-if="form" class="row">
            <div class="col">
                <h3>{{ form.title }}</h3>
                <p>{{ form.desc }}</p>
            </div>
        </div>
        <div v-if="records" class="row">
            <div class="col-sm">
                <b-form-group
                        label="Filter" label-for="filterInput">
                    <b-form-input id="filterInput" type="search" placeholder="Type to filter"
                                  v-model="filterKeyword"></b-form-input>
                </b-form-group>
            </div>
            <div class="col-sm">
                <b-form-group
                        label="Filter by" label-for="filterByInput">
                    <b-form-select id="filterByInput" v-model="filterBy" :options="sortFields" value-field="key"
                                   text-field="label"></b-form-select>
                </b-form-group>
            </div>
        </div>
        <div v-if="records" class="row">
            <div class="col-sm">
                <b-form-group
                        label="Filter time" label-for="filterTimeInput">
                    <b-form-select id="filterTimeInput" v-model="filterTime" :options="timeOptions"></b-form-select>
                </b-form-group>
            </div>
            <div class="col-sm">
                <b-form-group
                        label="Per page" label-for="perPageInput">
                    <b-form-select id="perPageInput" :options="pageOptions" v-model="perPage"></b-form-select>
                </b-form-group>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-if="form">
                    <!-- show records -->
                    <b-table :fields="fields"
                             show-empty
                             striped
                             hover
                             head-variant="dark"
                             :items="options"
                             :bordered="true"
                             :responsive="true"
                             :current-page="currentPage"
                             :per-page="perPage"
                             :filter="filterKeyword"
                             :filter-included-fields="filterBy"
                             @filtered="onFiltered">
                        <template v-slot:cell(timeslot)="row">
                            {{ row.value.datetime | moment('LLL') }} {{ `, for ${row.value.duration} min` }}
                        </template>
                        <template v-slot:cell(createdAt)="row">
                            {{ row.value | moment('LLL') }}
                        </template>
                        <template v-slot:cell(isCheckedIn)="row">
                            {{ row.value? row.value : 'unchecked' | moment('LLL') }}
                        </template>
                        <template v-slot:cell(actions)="row">
                            <b-button size="sm" @click="removeRecord(row.item.key)">Remove</b-button>
                        </template>
                    </b-table>
                </div>
                <h3 v-else class="text-center font-italic font-weight-light">
                    Select a Form to Start...
                </h3>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-if="records" class="text-center">
                    <b-pagination
                            v-model="currentPage"
                            :total-rows="totalRows"
                            :per-page="perPage"
                            align="center">
                    </b-pagination>
                    <i>{{ Object.values(records).length }} people have signed up for the event</i>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <b-card class="mt-3" header="Form Data Result">
                    <h3>{{ formSelected }}</h3>
                    <h6>form</h6>
                    <pre>{{ form }}</pre>
                    <h6>fields</h6>
                    <pre>{{ fields }}</pre>
                    <h6>options</h6>
                    <pre class="m-0">{{ options }}</pre>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    import AppFormSelector from "@/components/form/AppFormSelector";
    import moment from 'moment';

    export default {
        name: "TheViewRegister",
        components: {
            AppFormSelector
        },
        data() {
            return {
                form: null,
                formSelected: null,
                records: null,
                currentPage: 1,
                totalRows: 1,
                perPage: 5,
                pageOptions: [5, 10, 20, 30, 40, 50],
                filterKeyword: '',
                filterBy: null,
                filterTime: null
            };
        },
        methods: {
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            async removeRecord(key) {
                try {
                    const confirm = await this.makeModal('Remove Record', 'Are you sure you want to remove the selected record? This process will be irreversible.');
                    if (confirm) {
                        console.log('deleting record ' + key);
                        const recRef = this.$store.state.db.ref('/records').child(this.formSelected).child(key);
                        await recRef.remove();
                        this.makeToast('Record Removed!', 'Successfully removed record.', 'success');
                    }
                } catch (e) {
                    console.log(e);
                    this.makeToast('Failed to Remove Record!', 'An error occurred while removing record. Contact the admins for further support.', 'danger');
                }
            }
        },
        computed: {
            options() {
                // flatten records for table use
                if (this.records) {
                    const formatted = [];
                    for (let [key, value] of Object.entries(this.records)) {
                        // filter timeslot
                        if (this.filterTime) {
                            if (value.timeslot.datetime !== this.filterTime.datetime || value.timeslot.duration !== this.filterTime.duration) {
                                continue;
                            }
                        }
                        // flatten fields
                        let newField = {
                            createdAt: value.createdAt,
                            timeslot: value.timeslot,
                            isCheckedIn: value.isCheckedIn,
                            key
                        };
                        for (let [i, value] of value.fields.entries()) {
                            newField[`$field${i}`] = value;
                        }
                        formatted.push(newField);
                    }
                    return formatted;
                } else {
                    return [];
                }
            },
            timeOptions() {
                const formatted = [
                    {text: 'Select a timeslot', value: null}
                ];
                for (let {datetime, duration} of this.form.timeslots) {
                    formatted.push({
                        text: `${moment(datetime).format('LLL')}, for ${duration} min`,
                        value: {
                            datetime,
                            duration
                        }
                    });
                }
                return formatted
            },
            fields() {
                if (this.form) {
                    // custom fields
                    const extracted = [];
                    for (let [i, field] of this.form.fields.entries()) {
                        extracted.push({
                            key: `$field${i}`,
                            label: field.title,
                            sortable: true
                        });
                    }
                    // basic info
                    extracted.push({
                            key: 'timeslot',
                            label: 'Time',
                            sortable: true
                        }, {
                            key: 'createdAt',
                            label: 'Submit Time',
                            sortable: true
                        }, {
                            key: 'isCheckedIn',
                            label: 'Checked In',
                            sortable: true
                        },
                        {
                            key: 'actions',
                            label: 'Actions'
                        });
                    return extracted;
                } else {
                    return [];
                }
            },
            sortFields() {
                // custom fields
                const extracted = [];
                for (let [i, field] of this.form.fields.entries()) {
                    extracted.push({
                        key: `$field${i}`,
                        label: field.title,
                        sortable: true
                    });
                }
                return [
                    {label: 'Select a field', key: null},
                    ...extracted
                ];
            }
        },
        watch: {
            async formSelected() {
                if (this.formSelected) {
                    // fetch form data
                    const formRef = this.$store.state.db.ref('forms');
                    formRef.child(this.formSelected).once('value', (data) => {
                        console.log(data.val());
                        this.form = data.val();
                        this.makeToast('Form Loaded !', 'You can now view the selected form.', 'info');
                    });
                    // listen to records
                    const recRef = this.$store.state.db.ref('records');
                    recRef.child(this.formSelected).on('value', (data) => {
                        this.records = data.val();
                        this.totalRows = this.options.length;
                    });
                } else {
                    this.form = null;
                }
            },
            filterBy() {
                this.filterKeyword = '';
            },
            filterTime() {
                this.onFiltered(this.options);
            }
        }
    }
</script>

<style scoped>

</style>