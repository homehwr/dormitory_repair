<!-- 暂时用一下这个路由，写一个页面，请勿删除，谢谢！ -->
<template>
  <div class="video-showcase">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="logo">
        <div class="wave-icon"></div>
        <h1>波动光学实验仿真平台</h1>
      </div>
      <p class="subtitle">江西省大学生物理创新竞赛参赛作品</p>
    </div>

    <!-- 视频展示区域 -->
    <div class="video-section">
      <div class="section-header">
        <h2>平台功能演示</h2>
        <div class="divider"></div>
      </div>
      
      <div class="video-container">
        <video 
          ref="videoPlayer"
          :src="videoSource"
          controls
          class="video-player"
          @play="isPlaying = true"
        ></video>
        
        <div v-if="!isPlaying" class="video-overlay" @click="playVideo">
          <div class="play-button">
            <i class="fas fa-play"></i>
          </div>
          <p>点击播放视频</p>
        </div>
      </div>
    </div>

    <!-- 海报展示区域 -->
    <div class="poster-section">
      <div class="section-header">
        <h2>海报展示</h2>
        <div class="divider"></div>
      </div>
      
      <div class="poster-container">
        <div class="poster-thumbnail" @click="openPosterModal">
          <img :src="posterThumbnail" alt="竞赛海报" class="poster-image">
          <div class="zoom-overlay">
            <i class="fas fa-search-plus"></i>
            <p>点击查看大图</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 平台亮点 -->
    <div class="features-section">
      <div class="section-header">
        <h2>平台亮点</h2>
        <div class="divider"></div>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🌊</div>
          <h3>全域干涉技术</h3>
          <p>四维旋转角调控，实时生成复杂光学条纹</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h3>AI智能辅助</h3>
          <p>腾讯混元基座驱动的实验参数优化建议</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">💡</div>
          <h3>智能衍射系统</h3>
          <p>支持手绘/导入图像生成实时衍射图样</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔬</div>
          <h3>精细参数控制</h3>
          <p>波长400-700nm连续调谐，缝宽6-80μm精准控制</p>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <div class="action-area">
        <div class="qr-card">
          <h3>体验“光睿”智能助手</h3>
          <div class="qr-container">
            <img :src="qrCode2" alt="光睿智能助手二维码" class="qr-image">
          </div>
          <button class="action-button" @click="getAI">立即体验</button>
        </div>
        
        <div class="qr-card">
          <h3>获取平台</h3>
          <div class="qr-container">
            <img :src="qrCode" alt="平台下载二维码" class="qr-image">
          </div>
          <div class="download-info">
            <p>百度网盘永久分享</p>
            <p class="highlight">提取码: <span>1114</span></p>
          </div>
        </div>
      </div>
      
      <div class="copyright">
        <p>© 2025 波动光学实验仿真平台 | 江西省大学生物理创新竞赛</p>
        <!-- <p>基于腾讯混元基座开发</p> -->
      </div>
    </div>

    <!-- 海报模态框 -->
    <div class="modal-overlay" v-if="showPosterModal" @click.self="closePosterModal">
      <div class="poster-modal">
        <button class="close-button" @click="closePosterModal">
          <i class="fas fa-times"></i>
        </button>
        <img :src="posterFull" alt="竞赛海报大图" class="modal-poster">
        <div class="modal-actions">
          <button class="download-button" @click="downloadPoster">
            <i class="fas fa-download"></i> 下载海报
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoShowcase',
  data() {
    return {
      videoSource: 'http://parliy.com:83/api/image/%E6%B3%A2%E5%8A%A8%E5%85%89%E5%AD%A6%E5%AE%9E%E9%AA%8C%E4%BB%BF%E7%9C%9F%E5%B9%B3%E5%8F%B0%E4%BB%8B%E7%BB%8D%E8%A7%86%E9%A2%91.mp4',
      isPlaying: false,
      qrCode: 'http://parliy.com:83/api/image/bodongqrcode.png',
      qrCode2: 'http://parliy.com:83/api/image/bodongAIqrcode.jpg',
      posterThumbnail: 'http://parliy.com:83/api/image/bodonghaibao.png',
      posterFull: 'http://parliy.com:83/api/image/bodonghaibao.png',
      showPosterModal: false
    }
  },
  mounted() {
    document.title = "波动光学实验仿真平台 - 功能介绍视频";
    // 添加键盘事件监听
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    // 移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    playVideo() {
      this.$refs.videoPlayer.play();
      this.isPlaying = true;
    },
    getAI(){
      window.location.href = 'weixin://dl/business/?appid=wxd5201eb08d2fa15c&path=pages/agentChat/index&query=showAuthDirectly%3D1%26id%3DZ08Z4nS6aU7T'
    },
    openPosterModal() {
      this.showPosterModal = true;
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    },
    closePosterModal() {
      this.showPosterModal = false;
      document.body.style.overflow = ''; // 恢复背景滚动
    },
    downloadPoster() {
      const link = document.createElement('a');
      link.href = this.posterFull;
      link.download = '波动光学实验仿真平台海报.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handleKeyDown(event) {
      // 按ESC键关闭模态框
      if (this.showPosterModal && event.key === 'Escape') {
        this.closePosterModal();
      }
    }
  }
}
</script>

<style scoped>
/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background-color: #f7f9fc;
  overflow-x: hidden;
}

.video-showcase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.wave-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  position: relative;
  overflow: hidden;
}

.wave-icon::before {
  content: '';
  position: absolute;
  top: -25px;
  left: -15px;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 45%;
  animation: wave 5s infinite linear;
}

@keyframes wave {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.header h1 {
  font-size: 2.3rem;
  font-weight: 700;
  color: #2b2d42;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin-top: 10px;
  font-weight: 500;
}

/* 公共区域样式 */
.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #3a0ca3;
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.divider {
  height: 4px;
  width: 60px;
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  margin: 0 auto;
  border-radius: 2px;
}

/* 海报展示区域 */
.poster-section {
  margin-bottom: 40px;
}

.poster-container {
  display: flex;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;
}

.poster-thumbnail {
  position: relative;
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.poster-thumbnail:hover {
  transform: translateY(-5px);
}

.poster-image {
  width: 100%;
  display: block;
}

.zoom-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.poster-thumbnail:hover .zoom-overlay {
  opacity: 1;
}

.zoom-overlay i {
  font-size: 3rem;
  margin-bottom: 15px;
}

.zoom-overlay p {
  font-size: 1.2rem;
  font-weight: 500;
}

/* 视频区域 */
.video-section {
  margin-bottom: 40px;
}

.video-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  margin: 0 auto;
  background: #000;
  max-height: 75vh;
}

.video-player {
  width: 100%;
  display: block;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}

.video-overlay:hover {
  background: rgba(0, 0, 0, 0.4);
}

.play-button {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.play-button i {
  font-size: 2.5rem;
  margin-left: 8px;
}

.video-overlay:hover .play-button {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* 功能亮点区域 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1100px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 70px;
  height: 70px;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #2b2d42;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
}

/* 底部样式优化 */
.footer {
  margin-top: 60px;
  padding: 30px 20px;
  text-align: center;
}

.action-area {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.qr-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 320px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.qr-card h3 {
  font-size: 1.4rem;
  color: #3a0ca3;
  margin-bottom: 20px;
  font-weight: 600;
}

.qr-container {
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 10px;
}

.qr-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

.action-button {
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  width: 100%;
  max-width: 200px;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(58, 12, 163, 0.3);
}

.download-info {
  text-align: center;
  width: 100%;
  margin-top: 10px;
}

.download-info p {
  margin-bottom: 5px;
  color: #6c757d;
}

.highlight {
  font-weight: 700;
  color: #3a0ca3;
  font-size: 1.2rem;
  margin-top: 5px;
}

.highlight span {
  background: #f1f3f9;
  padding: 3px 12px;
  border-radius: 20px;
}

.copyright {
  margin-top: 40px;
  color: #6c757d;
  font-size: 0.95rem;
}

.copyright p {
  margin-bottom: 5px;
}

/* 海报模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.poster-modal {
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 90%;
  max-height: 90vh;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: rotate(90deg);
}

.modal-poster {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.download-button {
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(58, 12, 163, 0.3);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .features-grid {
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }
  
  .section-header h2 {
    font-size: 1.6rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }
  
  .action-area {
    gap: 30px;
    flex-direction: column;
    align-items: center;
  }
  
  .qr-card {
    width: 100%;
    max-width: 350px;
  }
  
  .poster-thumbnail {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.6rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.4rem;
  }
  
  .video-overlay p {
    font-size: 0.9rem;
  }
  
  .play-button {
    width: 60px;
    height: 60px;
  }
  
  .play-button i {
    font-size: 1.8rem;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .feature-card h3 {
    font-size: 1.2rem;
  }
  
  .copyright {
    font-size: 0.85rem;
  }
  
  .qr-container {
    width: 200px;
    height: 200px;
  }
  
  .zoom-overlay i {
    font-size: 2rem;
  }
  
  .zoom-overlay p {
    font-size: 1rem;
  }
}
</style>