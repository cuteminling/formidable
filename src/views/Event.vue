<template>
    <div>
        <div class="row">
            <div class="col">
                <h1>Events</h1>
                <b-form class="shadow">
                    <b-input-group prepend="Search">
                        <b-input placeholder="Search Events" v-model="search"></b-input>
                    </b-input-group>
                </b-form>
            </div>
        </div>
        <div v-if="formatted.length > 0" class="row">
            <div class="col">
                <b-card-group columns class="mt-3">
                    <div v-for="(evt, i) in formatted" :key="i">
                        <b-card v-if="evt.isAvailable" class="shadow grow" bg-variant="white" v-show="searchFilter(evt)">
                            <b-card-title>{{ evt.title }}</b-card-title>
                            <blockquote class="card-blockquote">
                                <p>{{ evt.desc }}</p>
                                <footer>
                                    <small>Posted on {{ evt.createdAt | moment('LLL') }}</small>
                                </footer>
                            </blockquote>
                            <b-button variant="primary" :to="getURL(evt.key)">Register</b-button>
                        </b-card>
                    </div>
                </b-card-group>
            </div>
        </div>
        <div v-else class="row">
            <div class="col text-center">
                <h3 class="display-4 mt-3">Wow, such empty...</h3>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Event",
        data() {
            return {
                search: '',
                events: []
            };
        },
        methods: {
            searchFilter(evt) {
                return evt.title.toLowerCase().includes(this.search.toLowerCase());
            },
            getURL(id) {
                return '/events/' + id;
            }
        },
        computed: {
            formatted() {
                const formatted = [];
                for (let [key, value] of Object.entries(this.events)) {
                    formatted.push({
                        ...value,
                        key: key
                    });
                }
                return formatted;
            }
        },
        created() {
            // update events
            const basicsRef = this.$store.state.db.ref('basics');
            basicsRef.on('value', (data) => {
                this.events = data.val();
            });
        }
    }
</script>

<style scoped>
    .grow {
        transition: all .2s ease-in-out;
    }

    .grow:hover {
        transform: scale(1.05);
        z-index: 10;
    }
</style>