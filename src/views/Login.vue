<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <b-card @submit="login" class="text-center">
                    <img src="../assets/logo.png" alt="Logo Image" class="mt-3">
                    <b-card-body>
                        <b-card-title>Admin Login</b-card-title>
                        <b-form>
                            <b-form-group
                                    label="Username"
                                    label-for="inputUsername">
                                <b-form-input
                                        id="inputUsername"
                                        v-model="form.email"
                                        type="email"
                                        required>
                                </b-form-input>
                            </b-form-group>
                            <b-form-group
                                    label="Password"
                                    label-for="inputPassword">
                                <b-form-input
                                        id="inputPassword"
                                        v-model="form.password"
                                        type="password"
                                        required>
                                </b-form-input>
                            </b-form-group>
                            <b-button block type="submit" variant="primary">Login</b-button>
                        </b-form>
                    </b-card-body>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                form: {
                    email: '',
                    password: ''
                },
            };
        },
        methods: {
            async login(evt) {
                evt.preventDefault();
                const res = await this.$store.dispatch('login', this.form);
                if (!res) {
                    this.makeToast('Login Failed !', 'Invalid username or password.', 'danger');
                }
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.state.isLoggedIn;
            }
        },
        watch: {
            isLoggedIn(val) {
                if (val) {
                    this.$router.go(-1);
                }
            }
        }
    }
</script>

<style scoped>
    img {
        max-height: 128px;
        max-width: 128px;
    }
</style>