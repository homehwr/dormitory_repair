<template>
    <div>
        <div style="background-color: #409EFF; padding: 10px 0;margin: 0%;position: relative;">
            <div class="return" @click="back">
              <img src="../../assets/student/返回.png" width="100%">
            </div>
            <h2 style="text-align: center; color: white;margin: 0;">报修记录</h2>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        back() {
            this.$router.push({
                path: '/stu/index'
            })
        }
    }
}
</script>

<style scoped>
.return {
  height: 30px;
  width: 30px;
  position: absolute;
  top: calc(50% - 15px);
  left: 2%;
}
</style>