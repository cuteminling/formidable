export default {
    methods: {
        makeModal(title, msg) {
            return this.$bvModal.msgBoxConfirm(msg , {
                title: title,
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: 'Confirm',
                cancelVariant: 'danger',
                cancelTitle: 'Return',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            });
        }
    }
}