<template>
    <div class="system-container">
        <Account />
    </div>
</template>

<script>
    import Account from '../Modules/Account/view.vue';
export default {
     data() {
            return {
                
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init(){
                this.$store.commit('changePersonState',false)
            },
            getUserAccount(){
                if (this.$store.state.loginuser){
                    this.userAccount = this.$store.state.loginuser;
                    // this.userAccount = 'T001';
                }else{
                    this.userAccount = 'T001';
                }
                return this.userAccount;
            },
        },
        components: {
            Account,
        }
    };
</script>

<style lang='scss' scoped>
    @import '../../../static/css/base.scss';

    .system-container{
        // position: absolute;
        left: 0;
        top: 50px;
        width: 100%;
        height: 100%;
        // min-width: 1700px;
        font-size: 15px;
    }
</style>
