<template>
    <div class="block">
        <div style="background-color: #409EFF; padding: 10px 0;">
            <h2 style="text-align: center; color: white;">赣南师范大学学生公寓报修系统</h2>
        </div>
        <div style="height: 300px;">
            <el-carousel :interval="3000">
                <el-carousel-item v-for="item in imgList" :key="item">
                        <el-image
                        style="width: 100%"
                        :src="item"
                        fit="cover"></el-image>
                </el-carousel-item>
            </el-carousel>
        </div>

        <el-row>
            <el-col :span="12">
                <el-card class="box-card" style="text-align: center;" @click.native="changePage(1)">
                    <i class="el-icon-edit" style="font-size: 50px;color: #409EFF;"></i>
                    <div style="font-size: 20px; margin-top: 10px">我要报修</div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card" style="text-align: center;" @click.native="changePage(2)">
                    <i class="el-icon-document" style="font-size: 50px; color: rgb(67, 201, 37);"></i>
                    <div style="font-size: 20px; margin-top: 10px">报修记录</div>
                </el-card>
            </el-col>
        </el-row>

    <div style="position: fixed; bottom: 5%; width: 100%; text-align: center;">
        <el-link type="primary" style="font-size: 16px;" @click="toManage">进入后台管理</el-link>
    </div>
  </div> 
</template>


<script>
import _ from 'lodash';

export default {
    data() {
        return {
            imgList: [require('@/assets/student/lunbo1.jpg'), require('@/assets/student/lunbo2.jpg')],
            
        }
    },
    created() {

    },
    mounted(){
        
        // 给用户生成唯一标识，并存在localStorage中,localStorage除非手动清除，否则会一直存在浏览器中，后续可以根据这个uuid进行保存和查找
        // 检查是否已有用户标识符
        let userId = localStorage.getItem('dormitory_repair_userId');
        if (!userId) {
            userId = this.generateUUID(); // 生成新的标识符
            localStorage.setItem('dormitory_repair_userId', userId); // 存储标识符
        }
    },
    destroyed() {

    },
    watch:{
    },
    methods: {
        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        changePage(val) {
            if (val === 1) {
                this.$router.push({
                    path: '/stu/repair'
                })
            }
            else if (val === 2) {
                this.$router.push({
                    path: '/stu/record'
                })
            }
        },
        toManage(){
            this.$router.push("/login");
        }
    },
}

</script>


<style>
*{
    margin: 0;
    box-sizing: border-box;
    list-style: none;
}
.block{
    height: 100dvh;
}
.box-card{
    width: 90%;
    margin: 10px auto;
}
</style>