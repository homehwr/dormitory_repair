<template>
    <div class="index_page">
        <div class="page_header">管理员后台</div>
    <el-col :span="4">
    <el-menu
     router
     :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <div class="user_block">
                    <!-- <div v-if="$store.state.User.userHeadImgUrl" class="user-item">
                        <img :src="$store.state.User.userHeadImgUrl" alt="" class="head-img">
                    </div> -->
                    <div  class="user-item">
                        <i class="el-icon-user-solid" style="margin-top: 30px;"></i>  
                    </div>
                    <div class="user-item">
                        <span class="user_name"> {{ name }} 
                          <!-- <span v-if="job">[老师]</span>  -->
                        </span>
                    </div>
        </div>
      <el-menu-item index="/Manage/repair-stats" v-if="duty==0">
        <i class="el-icon-menu"></i>
        <span slot="title">报修统计</span>
      </el-menu-item>
      <el-menu-item index="/Manage/repair-records" v-if="duty==0 || duty == 1">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">报修记录</span>
      </el-menu-item>
      <el-menu-item index="/Manage/workers" v-if="duty==0">
        <i class="el-icon-user"></i>
        <span slot="title">维修工信息</span>
      </el-menu-item>
      <el-menu-item index="/Manage/area-management" v-if="duty==0">
        <i class="el-icon-office-building"></i>
        <span slot="title">区域管理</span>
      </el-menu-item>
      <el-menu-item @click="exit">
        <i class="el-icon-office-building"></i>
        <span slot="title">退出登录</span>
      </el-menu-item>
    </el-menu>
  </el-col>

   <!-- 右侧内容区域 -->
   <el-col :span="19">
      <router-view class="content-area"></router-view>
    </el-col>

 </div>
</template>



<script>

export default {
  data() {
    return {
      name: localStorage.getItem("dormitory_name"),
      duty: localStorage.getItem("dormitory_duty")
    }
  },
  mounted() {
  },
  methods: {
    handleSelect(key) {
      // 可以在这里处理选中事件
      console.log('Selected:', key)
    },
    exit() {
      localStorage.removeItem("dormitory_duty");
      localStorage.removeItem("dormitory_name");
      localStorage.removeItem("dormitory_token");
      localStorage.removeItem("dormitory_work_area");
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style scoped>
.page_header{
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: white;
    background-color: rgb(107, 168, 204);
    height: 60px;
    line-height: 60px;
}
.row-content {
  height: calc(100vh - 60px); /* 减去头部高度 */
  overflow: hidden;
}
.user-item{

}
.el-icon-user-solid{
    margin: 10% 46%;
    font-size: 2vw;
    color: white;
}
.user_name{
  display:block;
  text-align: center;
  margin-bottom: 10px;
  color: white;
}
.el-menu{
    height: calc(100dvh - 68px);
    align-items: start;
    width: 14vw;
}
.content-area {
  margin-top: 5%;
}
</style>