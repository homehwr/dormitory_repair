<template>
  <div class="container">
    <!-- 头部区域优化 -->
    <div class="app-header">
      <div class="header-content">
        <h1>赣南师范大学学生公寓报修系统后台</h1>
      </div>
    </div>

    <!-- 轮播图区域优化 -->
    <div class="carousel-container">
      <el-carousel :interval="3000" arrow="always" height="50vw" indicator-position="outside">
        <el-carousel-item v-for="(item, index) in imgList" :key="index">
          <el-image
            class="carousel-image"
            :src="item"
            fit="cover"
          ></el-image>
          <div class="carousel-indicator">{{ index + 1 }}/{{ imgList.length }}</div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 功能卡片区域优化 -->
    <div class="function-cards">
      <el-row :gutter="15">
        <el-col :xs="12" :sm="12">
          <el-card 
            class="function-card repair-card" 
            shadow="hover" 
            @click.native="changePage(1)"
          >
            <div class="card-content">
              <i class="el-icon-edit card-icon"></i>
              <div class="card-title">修改密码</div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-card 
            class="function-card record-card" 
            shadow="hover" 
            @click.native="changePage(2)"
          >
            <div class="card-content">
              <i class="el-icon-document card-icon"></i>
              <div class="card-title">报修记录</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 底部区域优化 -->
    <div class="app-footer">
      <el-link 
        type="primary" 
        class="admin-link" 
        @click="exit"
      >
        退出登录
      </el-link>
      <div class="footer-info">
        <p>赣南师范大学鸿源数字思政创新研究中心</p>
        <p>© 2025 学生公寓报修系统</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        imgList: [require('@/assets/student/lunbo1.jpg'), require('@/assets/student/lunbo2.jpg')],
    }
  },
  mounted() {
    // 生成用户唯一标识
    let userId = localStorage.getItem('dormitory_repair_userId');
    if (!userId) {
      userId = this.generateUUID();
      localStorage.setItem('dormitory_repair_userId', userId);
    }
  },
  methods: {
     exit() {
        localStorage.removeItem("dormitory_duty");
        localStorage.removeItem("dormitory_name");
        localStorage.removeItem("dormitory_token");
        localStorage.removeItem("dormitory_work_area");
        this.$router.push({ path: '/login' });
    },
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    changePage(val) {
      if (val === 1) {
        this.$router.push({ path: '/worker/upPassword' });
      } else if (val === 2) {
        this.$router.push({ path: '/worker/record' });
      }
    },
    toManage() {
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  height: 100%;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f7fa;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 750px;
  margin: 0 auto;
  padding: 0 12px;
  background: #ffffff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

/* 头部样式 */
.app-header {
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  padding: 12px 0;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.app-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff9d2c, #ff3c5f, #409EFF);
}

.header-content {
  max-width: 100%;
  padding: 0 10px;
}

.header-content h1 {
  color: white;
  text-align: center;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.4;
  padding: 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 轮播图样式 */
.carousel-container {
  margin: 20px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.carousel-image {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 8px;
}

.carousel-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* 功能卡片区域 */
.function-cards {
  flex: 1;
  padding: 0 5px;
  margin-bottom: 20px;
}

.function-card {
  border-radius: 16px !important;
  border: none;
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.function-card:hover {
  transform: translateY(-5px);
}

.card-content {
  padding: 25px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 2.8rem !important;
  margin-bottom: 15px;
  transition: transform 0.3s;
}

.repair-card .card-icon {
  color: #409EFF;
}

.record-card .card-icon {
  color: #67C725;
}

.function-card:hover .card-icon {
  transform: scale(1.1);
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
}

.repair-card {
  background: linear-gradient(145deg, #e6f7ff, #ffffff);
  border-top: 3px solid #409EFF;
}

.record-card {
  background: linear-gradient(145deg, #f0f9eb, #ffffff);
  border-top: 3px solid #67C725;
}

/* 底部样式 */
.app-footer {
  padding: 20px 0;
  text-align: center;
  background: #f8f9fa;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
  margin-top: auto;
}

.admin-link {
  font-size: 0.95rem !important;
  font-weight: 500;
  margin-bottom: 15px;
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  background: #f0f7ff;
  transition: all 0.3s;
}

.admin-link:hover {
  background: #409EFF;
  color: white !important;
  transform: translateY(-2px);
}

.footer-info {
  font-size: 0.75rem;
  color: #7a7e8c;
  margin-top: 10px;
  line-height: 1.5;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1rem;
  }
  
  .card-content {
    padding: 20px 5px;
  }
  
  .card-icon {
    font-size: 2.5rem !important;
  }
  
  .card-title {
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  .header-content h1 {
    font-size: 0.9rem;
  }
  
  .card-icon {
    font-size: 2.2rem !important;
  }
  
  .card-title {
    font-size: 0.85rem;
  }
}
</style>