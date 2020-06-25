<template>
    <div class="row">
        <div class="col text-center">
            <h1 class="display-4">Registration Success !</h1>
            <h3 class="lead">
                An e-ticket has been sent to your mail address. Please present the e-ticket for identity verification upon your arrival.
            </h3>
            <b-link to="/events">Return</b-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Submitted"
    }
</script>

<style scoped>
    h1 {
        max-font-size: 10vw;
    }
</style>