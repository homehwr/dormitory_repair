<template>
  <div class="repair-detail-container" v-loading="loading">
    <!-- 顶部导航栏 -->
    <div class="app-header">
      <div class="header-content">
        <div class="return-button" @click="back">
          <i class="el-icon-arrow-left"></i>
        </div>
        <h1 class="page-title">报修详情</h1>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 状态卡片 -->
      <div class="status-card">
        <div class="status-label">当前状态：</div>
        <div class="status-value" :class="statusClass">{{ status }}</div>
        <div class="status-icon">
          <i :class="statusIcon" :style="{color: statusColor}"></i>
        </div>
      </div>

      <!-- 基本信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <i class="el-icon-user-solid card-icon"></i>
          <h2>基本信息</h2>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-user icon"></i>
            <span>报修人</span>
          </div>
          <div class="info-content">{{ repair_info.name }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-phone icon"></i>
            <span>手机号</span>
          </div>
          <div class="info-content">{{ repair_info.phone }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-location icon"></i>
            <span>报修地址</span>
          </div>
          <div class="info-content">{{ repair_info.address }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-house icon"></i>
            <span>报修寝室</span>
          </div>
          <div class="info-content">{{ repair_info.address3 }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-time icon"></i>
            <span>报修时间</span>
          </div>
          <div class="info-content">{{ repair_info.start_time }}</div>
        </div>
      </div>

      <!-- 详情卡片 -->
      <div class="info-card">
        <div class="card-header">
          <i class="el-icon-tickets card-icon"></i>
          <h2>报修详情</h2>
        </div>
        
        <div class="detail-content">
          {{ repair_info.info }}
        </div>
      </div>

      <!-- 图片区域 -->
      <div class="info-card">
        <div class="card-header">
          <i class="el-icon-picture card-icon"></i>
          <h2>报修图片</h2>
        </div>
        
        <div v-if="img_list.length === 0" class="empty-images">
          <i class="el-icon-picture-outline empty-icon"></i>
          <p>暂无图片</p>
        </div>
        
        <div v-else class="image-grid">
          <div v-for="(item, index) in img_list" :key="index" class="image-item">
            <el-image
              class="preview-image"
              :src="item"
              :preview-src-list="img_list"
              fit="cover"
            >
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </div>
      </div>

      <!-- 维修信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <i class="el-icon-s-tools card-icon"></i>
          <h2>维修信息</h2>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-user icon"></i>
            <span>维修师傅</span>
          </div>
          <div class="info-content">{{ repair_info.workerName || '待分配' }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-phone icon"></i>
            <span>联系方式</span>
          </div>
          <div class="info-content">
            {{ repair_info.workerPhone || '待分配' }}
            <el-button 
              v-if="repair_info.workerPhone"
              type="text" 
              icon="el-icon-phone-outline"
              class="call-button"
              @click="callWorker(repair_info.workerPhone)"
            >
              拨打
            </el-button>
          </div>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <i class="el-icon-star-off icon"></i>
            <span>服务评分</span>
          </div>
          <div class="info-content">
            <el-rate 
              v-model="value1"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              :disabled="(repair_info.status != 1 && repair_info.status != 3) || rateDisabled"
            ></el-rate>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div v-if="repair_info.status == 0 || repair_info.status == 2" class="action-button">
        <!-- 取消报修按钮（待维修或已转服务商状态） -->
        <el-button 
          v-if="repair_info.status == 0"
          type="danger" 
          icon="el-icon-close" 
          class="cancel-button"
          @click="cancel"
        >
          取消报修
        </el-button>
        
        <!-- 删除记录按钮（已取消状态） -->
        <el-button 
          v-if="repair_info.status == 2"
          type="danger" 
          icon="el-icon-delete" 
          class="delete-button"
          @click="removeRecord"
        >
          删除记录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      repair_info: {},
      img_list: [],
      value1: 0,
      status: '',
      loading: true,
      statusColor: '',
      statusIcon: '',
      statusClass: '',
      rateDisabled: false
    }
  },
  async mounted() {
    if (!this.$route.params.id) {
      return;
    }
    
    await this.$axios.get(`/student/getRecordById`, {
      params: { // 使用 `params` 对象来传递参数
        id: this.$route.params.id,
        uuid: localStorage.getItem('dormitory_repair_userId'),
      },
      headers: {
        'X-Client-Type': 'student'
      }
    })
    .then((res) => {
      this.repair_info = res.data.data;
      this.repair_info.start_time = this.repair_info.start_time.substring(0,10) + ' ' + 
                                   this.repair_info.start_time.substring(11,19);
      
      if (this.repair_info.info_img && this.repair_info.info_img !== '') {
        this.img_list = this.repair_info.info_img.split(',');
      }
      
      // 设置状态信息
      if (this.repair_info.status === 0) {
        this.status = '待维修';
        this.statusColor = '#FF9800';
        this.statusIcon = 'el-icon-time';
        this.statusClass = 'status-pending';
      } else if (this.repair_info.status === 1) {
        this.status = '已维修';
        this.statusColor = '#67C23A';
        this.statusIcon = 'el-icon-circle-check';
        this.statusClass = 'status-completed';
      } else if (this.repair_info.status === 2) { 
        this.status = '已取消';
        this.statusColor = '#909399';
        this.statusIcon = 'el-icon-circle-close';
        this.statusClass = 'status-cancelled';
      } else if (this.repair_info.status === 3) {
        this.status = '已转服务商';
        this.statusColor = '#6A11CB';
        this.statusIcon = 'el-icon-refresh-right';
        this.statusClass = 'status-transferred';
      }

      if (this.repair_info.rate){
        this.value1 = this.repair_info.rate;
        this.rateDisabled = true;
      }
    })
    .finally(() => {
      this.loading = false;
    });
  },
  watch:{
    value1(newVal){
      if (newVal != this.repair_info.rate){
        this.$axios.post(`/record/postRate?score=${newVal}&id=${this.repair_info.id}`).then((res) => {
          if (res.data.code == 200){
            this.$message.success("评分成功！");
            this.rateDisabled = true;
          }
        })
      }

    }
  },
  methods: {
    back() {
      this.$router.push({ path: '/stu/record' });
    },
    cancel() {
      this.$confirm('确定要取消此报修单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'cancel-confirm'
      }).then(() => {
        this.$axios.post(`/student/updateStatus`,{
      params: { // 使用 `params` 对象来传递参数
        id: this.repair_info.id,
        status:2,
        uuid: localStorage.getItem('dormitory_repair_userId'),
      },
      headers: {
        'X-Client-Type': 'student'
      }
    })
        .then(() => {
          this.$message({
            message: '取消成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              // 更新状态为已取消
              this.status = '已取消';
              this.statusColor = '#909399';
              this.statusIcon = 'el-icon-circle-close';
              this.statusClass = 'status-cancelled';
              this.repair_info.status = 2; // 更新状态，使按钮变为删除记录
            }
          });
        });
      }).catch(() => {});
    },
    // 删除记录方法
    removeRecord() {
      this.$confirm('确定要删除此报修记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm'
      }).then(() => {
        this.$axios.post(`/record/removeRecord`,{
          params: { // 使用 `params` 对象来传递参数
            id: this.repair_info.id,
            uuid: localStorage.getItem('dormitory_repair_userId')
          },
          headers: {
            'X-Client-Type': 'student'
          }
        })
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.$router.push({ path: '/stu/record' });
            }
          });
        });
      }).catch(() => {});
    },
    callWorker(phone) {
      if (phone) {
        window.open(`tel:${phone}`);
      }
    }
  }
}
</script>

<style scoped>
.repair-detail-container {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  padding-bottom: 30px;
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

/* 状态卡片样式 */
.status-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-left: 5px solid;
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-3px);
}

.status-pending {
  border-left-color: #FF9800;
}

.status-completed {
  border-left-color: #67C23A;
}

.status-cancelled {
  border-left-color: #909399;
}

.status-transferred {
  border-left-color: #6A11CB;
}

.status-label {
  font-size: 1.1rem;
  color: #606266;
  font-weight: 500;
  margin-right: 10px;
}

.status-value {
  font-size: 1.3rem;
  font-weight: 700;
  flex: 1;
}

.status-pending .status-value {
  color: #FF9800;
}

.status-completed .status-value {
  color: #67C23A;
}

.status-cancelled .status-value {
  color: #909399;
}

.status-transferred .status-value {
  color: #6A11CB;
}

.status-icon {
  font-size: 36px;
}

/* 信息卡片样式 */
.info-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f2f5;
}

.card-icon {
  font-size: 24px;
  color: #409EFF;
  margin-right: 12px;
}

.card-header h2 {
  font-size: 1.2rem;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

/* 信息项样式 */
.info-item {
  display: flex;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px dashed #ebeef5;
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  width: 100px;
  display: flex;
  align-items: center;
  color: #606266;
  font-weight: 500;
}

.info-label .icon {
  font-size: 18px;
  margin-right: 8px;
  color: #909399;
}

.info-content {
  flex: 1;
  color: #303133;
  font-weight: 500;
  word-break: break-all;
  line-height: 1.5;
}

/* 详情内容样式 */
.detail-content {
  background: #f8fafc;
  border-radius: 10px;
  padding: 15px;
  color: #303133;
  line-height: 1.6;
  border-left: 3px solid #409EFF;
}

/* 图片区域样式 */
.empty-images {
  text-align: center;
  padding: 30px 0;
}

.empty-icon {
  font-size: 60px;
  color: #dcdfe6;
  margin-bottom: 15px;
}

.empty-images p {
  color: #909399;
  margin: 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.image-item {
  aspect-ratio: 1/1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 100%;
  display: block;
}

.image-error {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dcdfe6;
  font-size: 30px;
}

/* 操作按钮样式 */
.action-button {
  margin-top: 20px;
  text-align: center;
}

.cancel-button, .delete-button {
  width: 100%;
  max-width: 300px;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cancel-button {
  background: linear-gradient(to right, #ff4d4d, #ff0000);
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.2);
}

.delete-button {
  background: linear-gradient(to right, #ff9900, #ff6600);
  box-shadow: 0 4px 15px rgba(255, 102, 0, 0.2);
}

.cancel-button:hover, .delete-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3);
}

.cancel-button:hover {
  box-shadow: 0 7px 20px rgba(255, 0, 0, 0.3);
}

.delete-button:hover {
  box-shadow: 0 7px 20px rgba(255, 102, 0, 0.3);
}

/* 响应式调整 */
@media (max-width: 600px) {
  .page-title {
    font-size: 1.2rem;
  }
  
  .status-value {
    font-size: 1.2rem;
  }
  
  .card-header h2 {
    font-size: 1.1rem;
  }
  
  .info-label {
    width: 85px;
    font-size: 0.95rem;
  }
  
  .info-content {
    font-size: 0.95rem;
  }
  
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cancel-button, .delete-button {
    height: 46px;
    font-size: 1rem;
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
  
  .status-card {
    padding: 15px;
  }
  
  .status-label {
    font-size: 1rem;
  }
  
  .status-value {
    font-size: 1.1rem;
  }
  
  .info-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .info-label {
    width: 100%;
  }
}
</style>

<style>
/* 全局样式调整 - 移动端适配 */
.cancel-confirm .el-message-box__header,
.delete-confirm .el-message-box__header {
  background: linear-gradient(to right, #ff4d4d, #ff0000);
  border-radius: 16px 16px 0 0 !important;
  padding: 15px 20px;
}

.delete-confirm .el-message-box__header {
  background: linear-gradient(to right, #ff9900, #ff6600);
}

.cancel-confirm .el-message-box__title,
.delete-confirm .el-message-box__title {
  color: white;
  font-weight: 600;
}

.cancel-confirm .el-message-box__content,
.delete-confirm .el-message-box__content {
  padding: 25px 20px;
  font-size: 1.05rem;
  color: #555;
}

.cancel-confirm .el-button,
.delete-confirm .el-button {
  border-radius: 10px;
  padding: 10px 25px;
}

.cancel-confirm .el-button--primary {
  background: linear-gradient(to right, #ff4d4d, #ff0000);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s;
}

.delete-confirm .el-button--primary {
  background: linear-gradient(to right, #ff9900, #ff6600);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s;
}

.cancel-confirm .el-button--primary:hover,
.delete-confirm .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* 移动端弹窗适配 */
@media (max-width: 768px) {
  .el-message-box {
    width: 85% !important;
    max-width: 350px;
    border-radius: 16px !important;
  }
  
  .cancel-confirm .el-message-box__content,
  .delete-confirm .el-message-box__content {
    padding: 20px 15px;
    font-size: 1rem;
  }
  
  .cancel-confirm .el-button,
  .delete-confirm .el-button {
    padding: 10px 20px;
    margin: 0 5px;
  }
  
  .el-message-box__btns {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .el-message-box {
    width: 90% !important;
    max-width: none;
  }
  
  .cancel-confirm .el-message-box__header,
  .delete-confirm .el-message-box__header {
    padding: 12px 15px;
  }
  
  .cancel-confirm .el-message-box__content,
  .delete-confirm .el-message-box__content {
    padding: 15px 12px;
    font-size: 0.95rem;
  }
  
  .cancel-confirm .el-button,
  .delete-confirm .el-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

.call-button {
  margin-left: 10px;
  padding: 0;
  color: #409EFF;
  font-size: 0.9em;
}

.call-button:hover {
  color: #66b1ff;
}

.call-button i {
  margin-right: 3px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .call-button {
    margin-left: 5px;
    font-size: 0.8em;
  }
}
</style>