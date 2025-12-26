<template>
    <div class="index_page">
        <!-- 头部 -->
        <div class="page_header">
            管理员后台
        </div>
        
        <div class="main-container">
            <!-- 侧边栏 -->
            <div class="sidebar-container">
                <el-menu
                    router
                    :default-active="$route.path"
                    class="el-menu-vertical-demo"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <div class="user_block">
                        <div class="user-item">
                            <i class="el-icon-user-solid"></i>  
                        </div>
                        <div class="user-item">
                            <span class="user_name">{{ name }}</span>
                        </div>
                    </div>
                    <el-menu-item index="/Manage/repair-stats" v-if="duty==0">
                        <i class="el-icon-menu"></i>
                        <span slot="title">报修统计</span>
                    </el-menu-item>
                    <el-menu-item index="/Manage/repair-records">
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
                    <el-menu-item index="/Manage/set-password">
                        <i class="el-icon-setting"></i>
                        <span slot="title">修改密码</span>
                    </el-menu-item>
                    <el-menu-item index="/worker" v-if="duty!=0">
                        <i class="el-icon-mobile-phone"></i>
                        <span slot="title">进入手机端</span>
                    </el-menu-item>
                    <el-menu-item @click="exit">
                        <i class="el-icon-switch-button"></i>
                        <span slot="title">退出登录</span>
                    </el-menu-item>
                </el-menu>
            </div>
            
            <!-- 右侧内容区域 -->
            <div class="content-container">
                <router-view class="content-area"></router-view>
            </div>
        </div>
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
        // 检查用户信息完整性
        const token = localStorage.getItem('dormitory_token');
        const name = localStorage.getItem('dormitory_name');
        const duty = localStorage.getItem('dormitory_duty');
        const work_area = localStorage.getItem('dormitory_work_area');
        const workerId = localStorage.getItem('dormitory_workerId');
        const account = localStorage.getItem('dormitory_account'); 
        
        // 如果必要的用户信息不完整，跳转到登录页
        if (!token || !name || !duty || !work_area || !workerId || !account) {
            this.$router.push({ path: '/login' });
            return;
        }
        
        // 更新用户信息
        this.name = name;
        this.duty = duty;
    },
    methods: {
        exit() {
            localStorage.removeItem("dormitory_duty");
            localStorage.removeItem("dormitory_name");
            localStorage.removeItem("dormitory_token");
            localStorage.removeItem("dormitory_work_area");
            this.$router.push({ path: '/login' });
        }
    }
}
</script>

<style scoped>
.index_page {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    overflow: hidden;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
    /* max-height: calc(100vh - 60px); */
    overflow-y: auto;
}

.page_header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    color: white;
    background-color: rgb(107, 168, 204);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.main-container {
    display: flex;
    flex: 1;
    margin-top: 50px; /* 等于头部高度 */
    height: calc(100vh - 60px);
    background-color: rgb(244,246,249);
}

.sidebar-container {
    position: fixed;
    z-index: 1000;
    top:60px;
    left: 0;
    width: 240px; /* 固定侧边栏宽度 */
    height:93%;
    background-color: #545c64;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
     /* 隐藏滚动条 - 适用于Webkit浏览器（Chrome, Safari） */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
}
/* 隐藏Webkit浏览器的滚动条 */
.sidebar-container::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent; /* 可选：使滚动条背景透明 */
}

.content-container {
    flex: 1;
    height: auto;
    padding: 20px;
    background-color: rgb(244,246,249);
    box-shadow: -2px 0 5px rgba(0,0,0,0.05);
}

.user_block {
    padding: 20px 0;
    text-align: center;
    border-bottom: 1px solid #434a50;
}

.user_item {
    margin-bottom: 15px;
}

.el-icon-user-solid {
    font-size: 64px;
    color: #a0a6ac;
    background: #5c646b;
    border-radius: 50%;
    padding: 10px;
    margin-bottom: 15px;
}

.user_name {
    display: block;
    font-size: 16px;
    color: #eee;
    padding: 0 15px;
    word-break: break-all;
}

.el-menu {
    border-right: none;
}

.el-menu-item {
    height: 56px;
    line-height: 56px;
}

.el-menu-item i {
    margin-right: 10px;
    font-size: 18px;
    vertical-align: middle;
}
.content-area{
  width: 85%;
  margin-left: 13%;
  overflow-y: auto;

}

/* 响应式设计 */
@media (max-width: 992px) {
    .sidebar-container {
        width: 180px;
    }
}

@media (max-width: 768px) {
    .sidebar-container {
        width: 160px;
    }
}
</style>