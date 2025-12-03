<template>
  <div>
    <!-- 系统维护提示 -->
    <div v-if="underMaintenance" class="maintenance-overlay">
      <div class="maintenance-container">
        <div class="maintenance-icon">🔧</div>
        <h1>系统维护中</h1>
        <p>维护时间：2025年12月3日 00:00 - 2025年12月9日 23:59</p>
        <p>接学校要求，护网期间如有维修，请在门卫值班台登记，谢谢！</p>
        <div class="countdown" v-if="showCountdown">
          预计恢复时间：<span class="countdown-time">{{ countdownTime }}</span>
        </div>

        <div style="font-size: smaller;">
            <p>赣南师范大学鸿源数字思政创新研究中心</p>
        </div>
      </div>

    </div>
    
    <!-- 正常内容 -->
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StuMainshow',
  data() {
    return {
      underMaintenance: false,
      showCountdown: true,
      countdownTime: '2025年12月9日 23:59',
      // 维护时间段
      maintenanceStart: new Date('2025-12-03T00:00:00'),
      maintenanceEnd: new Date('2025-12-09T23:59:59')
    };
  },
  mounted() {
    this.checkMaintenanceStatus();
    // 每分钟检查一次状态
    this.maintenanceCheckInterval = setInterval(() => {
      this.checkMaintenanceStatus();
    }, 60000);
  },
  beforeDestroy() {
    // 清除定时器
    if (this.maintenanceCheckInterval) {
      clearInterval(this.maintenanceCheckInterval);
    }
  },
  methods: {
    checkMaintenanceStatus() {
      const now = new Date();
      // 检查当前时间是否在维护时间段内
      this.underMaintenance = now >= this.maintenanceStart && now <= this.maintenanceEnd;
      
      // 如果已经过了维护结束时间，隐藏倒计时
      if (now > this.maintenanceEnd) {
        this.showCountdown = false;
      }
    }
  }
};
</script>

// 这里不能加scoped，因为body是为了代替掉浏览器默认的用户代理样式表，加上scoped只能作用于这个组件，无法影响到组件外的样式，也就无法影响到浏览器默认样式
<style>
body {
    margin: 0;
}

/* 维护提示样式 */
.maintenance-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: white;
  text-align: center;
}

.maintenance-container {
  max-width: 600px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.maintenance-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.maintenance-container h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.maintenance-container p {
  font-size: 1.2rem;
  margin-bottom: 15px;
  line-height: 1.6;
}

.countdown {
  margin-top: 25px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1.1rem;
}

.countdown-time {
  font-weight: bold;
  color: #ffd700;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .maintenance-container {
    margin: 20px;
    padding: 25px;
  }
  
  .maintenance-container h1 {
    font-size: 2rem;
  }
  
  .maintenance-container p {
    font-size: 1rem;
  }
}
</style>