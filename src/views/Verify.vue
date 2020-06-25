<template>
    <div v-if="isLoaded" class="row">
        <div class="col text-center">
            <h1 class="display-4">{{ verifyTitle }}</h1>
            <p class="lead">{{ verifyDetail }}</p>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "Verify",
        data() {
            return {
                eventId: this.$route.params.eventId,
                recId: this.$route.params.recId,
                hasRecord: false,
                isSuccess: false,
                record: null,
                isLoaded: false
            };
        },
        computed: {
            verifyTitle() {
                if (this.hasRecord) {
                    if (this.isSuccess) {
                        return 'Verification Success !';
                    } else {
                        return 'Verification Expired !';
                    }
                } else {
                    return 'Verification Failed !';
                }
            },
            verifyDetail() {
                if (this.hasRecord) {
                    if (this.isSuccess) {
                        return 'Welcome !';
                    } else {
                        return `Account already checked in at ${moment(this.record.isCheckedIn).format('LLL')}.`;
                    }
                } else {
                    return 'No registration record was found.'
                }
            }
        },
        methods: {
            checkInRecord() {
                this.$store.state.db.ref('/records').child(this.eventId).child(this.recId).update({
                    isCheckedIn: moment().format()
                });
            }
        },
        created() {
            const recRef = this.$store.state.db.ref('/records').child(this.eventId).child(this.recId);
            recRef.once('value', (data) => {
                this.record = data.val();
                this.hasRecord = this.record !== null;
                if (this.hasRecord) {
                    console.log('has record');
                    if (!this.record.isCheckedIn) {
                        // verification success, check in
                        this.checkInRecord();
                        this.isSuccess = true;
                    } else {
                        // verification expired
                        console.log('expired');
                        this.isSuccess = false;
                    }
                } else {
                    // verification failed
                    console.log('no record');
                }
                this.isLoaded = true;
            });
        }
    }
</script>

<style scoped>

</style>