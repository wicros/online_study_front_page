<template>
    <div class="captcha" ref="captcha"></div>
</template>

<script>
    import {captchaId} from "../../config/env.js";
    export default {
        props: ["captchaStyle"],
        data() {
            return {
                captcha: null,
                captchaId: captchaId
            }
        },
        methods: {
            reload() {
                this.captcha.reload();
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.captcha = _dx.Captcha(this.$refs.captcha, {
                    appId: this.captchaId,
                    style: this.captchaStyle,
                    success: function (token) {
                        this.$emit('handleRecaptchaVerify', token)
                    }.bind(this)
                })
            })
        }
    }
</script>

<style lang="less" scoped>
    .captcha {
        padding: 10px 0px;
        margin: 0 auto;
    }
</style>