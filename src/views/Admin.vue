<template>
    <div class="row">
        <div class="col">
            <h1>Admin Portal</h1>
            <b-tabs>
                <b-tab title="New Form" lazy class="shadow">
                    <TheNewForm></TheNewForm>
                </b-tab>
                <b-tab title="Edit Form" lazy class="shadow">
                    <TheEditForm></TheEditForm>
                </b-tab>
                <b-tab title="View Response" lazy class="shadow">
                    <TheViewRegister></TheViewRegister>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
    import TheNewForm from "@/components/admin/TheNewForm";
    import TheEditForm from "@/components/admin/TheEditForm";
    import TheViewRegister from "@/components/admin/TheViewRegister";

    export default {
        name: "Admin",
        components: {
            TheNewForm,
            TheEditForm,
            TheViewRegister
        }
    }
</script>

<style scoped>

</style>