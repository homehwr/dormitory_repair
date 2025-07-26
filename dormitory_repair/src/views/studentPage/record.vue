<template>
  <div class="repair-record-container" v-loading="loading">
    <!-- 顶部导航栏 -->
    <div class="app-header">
      <div class="header-content">
        <div class="return-button" @click="back">
          <i class="el-icon-arrow-left"></i>
        </div>
        <h1 class="page-title">报修记录</h1>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 空状态提示 -->
      <div v-if="data_list.length === 0 && !loading" class="empty-state">
        <i class="el-icon-document-remove empty-icon"></i>
        <p>暂无报修记录</p>
        <el-button type="primary" class="report-button" @click="goToRepair">
          我要报修
        </el-button>
      </div>

      <!-- 报修记录列表 -->
      <div v-else>
        <div v-for="(item, index) in data_list" :key="index" class="record-card" @click="toDetail(item.id)">
          <div class="card-header">
            <div class="repair-info">
              <i class="el-icon-tickets info-icon"></i>
              <div class="info-text">{{ item.info }}</div>
            </div>
            <div class="status-tag" :class="getStatusClass(item.status)">
              {{ item.status }}
            </div>
          </div>
          
          <div class="card-body">
            <div class="info-item">
              <i class="el-icon-time icon"></i>
              <span class="label">报修时间：</span>
              <span class="value">{{ item.start_time }}</span>
            </div>
            
            <div class="info-item">
              <i class="el-icon-user-solid icon"></i>
              <span class="label">维修师傅：</span>
              <span class="value">{{ item.workerName || '待分配' }}</span>
            </div>
            
            <div class="info-item" v-if="item.workerName">
              <i class="el-icon-phone icon"></i>
              <span class="label">联系方式：</span>
              <span class="value">{{ item.phone || '12345678910' }}</span>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="footer-text">点击查看详情</div>
            <i class="el-icon-arrow-right arrow-icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data_list: [],
      loading: true
    }
  },
  async mounted() {
    await this.$axios.get(`/student/getRecord?UUID=${localStorage.getItem('dormitory_repair_userId')}`)
    .then((res) => {
      this.data_list = res.data.data;
      for (let i = 0; i < this.data_list.length; i++) {
        if (this.data_list[i].status === 0) {
          this.data_list[i].status = '待维修';
        } else if (this.data_list[i].status === 1) {
          this.data_list[i].status = '已维修';
        } else if (this.data_list[i].status === 2) {
          this.data_list[i].status = '已取消';
        } else if (this.data_list[i].status === 3) {
          this.data_list[i].status = '已转服务商';
        }
        
        // 格式化时间
        const timeStr = this.data_list[i].start_time;
        if (timeStr && timeStr.length >= 19) {
          this.data_list[i].start_time = timeStr.substring(0, 10) + ' ' + timeStr.substring(11, 19);
        }
      }
    }).catch(error => {
      console.error("获取报修记录失败:", error);
      this.$message.error("获取报修记录失败，请稍后重试");
    });
    
    this.loading = false;
  },
  methods: {
    getStatusClass(status) {
      switch(status) {
        case '待维修': return 'status-pending';
        case '已维修': return 'status-completed';
        case '已取消': return 'status-cancelled';
        case '已转服务商': return 'status-transferred';
        default: return '';
      }
    },
    back() {
      this.$router.push({ path: '/stu/index' });
    },
    toDetail(id) {
      this.$router.push({
        name: 'stuDetail',
        params: { id: id }
      });
    },
    goToRepair() {
      this.$router.push({ path: '/stu/repair' });
    }
  }
}
</script>

<style scoped>
.repair-record-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  padding-bottom: 20px;
}

/* 顶部导航栏样式 */
.app-header {
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  padding: 15px 0;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

.return-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.return-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.return-button i {
  font-size: 22px;
  color: white;
  font-weight: bold;
}

.page-title {
  flex: 1;
  text-align: center;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  padding-right: 40px; /* 平衡返回按钮位置 */
}

/* 内容区域样式 */
.content-wrapper {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
}

/* 报修记录卡片样式 */
.record-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #ebeef5;
}

.record-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(64, 158, 255, 0.15);
  border-color: #409EFF;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(to right, #f0f7ff, #ffffff);
  border-bottom: 1px solid #f0f2f5;
}

.repair-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.info-icon {
  font-size: 20px;
  color: #409EFF;
  margin-right: 12px;
  min-width: 24px;
}

.info-text {
  font-size: 1.05rem;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 10px;
  white-space: nowrap;
}

.status-pending {
  background: rgba(255, 152, 0, 0.12);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.status-completed {
  background: rgba(103, 199, 37, 0.12);
  color: #67c723;
  border: 1px solid rgba(103, 199, 37, 0.2);
}

.status-cancelled {
  background: rgba(158, 158, 158, 0.12);
  color: #9e9e9e;
  border: 1px solid rgba(158, 158, 158, 0.2);
}

.status-transferred {
  background: rgba(106, 17, 203, 0.1);
  color: #6a11cb;
  border: 1px solid rgba(106, 17, 203, 0.2);
}

.card-body {
  padding: 18px 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.icon {
  font-size: 18px;
  color: #909399;
  min-width: 24px;
  margin-right: 10px;
  text-align: center;
}

.label {
  font-size: 0.95rem;
  color: #606266;
  min-width: 75px;
}

.value {
  font-size: 0.95rem;
  color: #303133;
  font-weight: 500;
  word-break: break-all;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f8fafc;
  border-top: 1px solid #f0f2f5;
}

.footer-text {
  font-size: 0.9rem;
  color: #909399;
}

.arrow-icon {
  font-size: 16px;
  color: #c0c4cc;
  transition: transform 0.3s;
}

.record-card:hover .arrow-icon {
  color: #409EFF;
  transform: translateX(3px);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
}

.empty-icon {
  font-size: 80px;
  color: #dcdfe6;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 1.1rem;
  color: #909399;
  margin-bottom: 25px;
}

.report-button {
  padding: 12px 35px;
  font-size: 1.05rem;
  font-weight: 500;
  border-radius: 12px;
  background: linear-gradient(to right, #409EFF, #6a11cb);
  border: none;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

.report-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(64, 158, 255, 0.4);
}

/* 响应式调整 */
@media (max-width: 600px) {
  .page-title {
    font-size: 1.2rem;
  }
  
  .info-text {
    font-size: 1rem;
  }
  
  .status-tag {
    font-size: 0.8rem;
    padding: 3px 10px;
  }
  
  .label {
    min-width: 70px;
    font-size: 0.9rem;
  }
  
  .value {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 15px;
  }
  
  .return-button {
    width: 36px;
    height: 36px;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .status-tag {
    align-self: flex-start;
  }
}
</style>