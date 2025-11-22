<template>
  <div class="project-showcase">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="logo">
        <div class="wave-icon"></div>
        <h1>波动光学实验仿真平台</h1>
      </div>
      <p class="subtitle">第11届全国大学生物理实验竞赛(创新)决赛作品</p>
    </div>

    <!-- 项目介绍区域 -->
    <div class="intro-section">
      <div class="section-header">
        <h2>项目简介</h2>
        <div class="divider"></div>
      </div>
      
      <div class="intro-content">
        <div class="intro-text">
          <p>本平台是基于严格物理模型开发的波动光学仿真软件，突破传统实验成本高、操作难的限制，集成双点光源干涉、任意形状衍射等七类实验，通过"现象-机理"双视图和AI智能助手，实现高保真光学现象可视化与交互式探究。</p>
          <p>基于自主推导的公式原理与自主搭建的AI智能体，实现高自由度参数化仿真与实时机理分析，为光学教育提供低成本、高效率的探究平台。</p>
        </div>
        
        <div class="platform-features">
          <h3>平台特色</h3>
          <div class="features-list">
            <span class="feature-tag">全域干涉创新</span>
            <span class="feature-tag">手绘衍射自由</span>
            <span class="feature-tag">双视图联动</span>
            <span class="feature-tag">复色光仿真</span>
            <span class="feature-tag">AI智能辅导</span>
            <span class="feature-tag">参数高自由度</span>
            <span class="feature-tag">多模块集成</span>
          </div>
        </div>
      </div>
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
          preload="metadata"
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
          <img :src="posterThumbnail" alt="竞赛海报" class="poster-image" loading="lazy">
          <div class="zoom-overlay">
            <i class="fas fa-search-plus"></i>
            <p>点击查看大图</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 实验报告展示区域 -->
    <div class="report-section">
      <div class="section-header">
        <h2>实验报告</h2>
        <div class="divider"></div>
      </div>
      
      <div class="report-container">
        <div class="pdf-viewer">
          <div class="pdf-controls">
            <div class="control-group">
              <button @click="prevPage" :disabled="currentPage <= 1" class="control-btn">
                <i class="fas fa-chevron-left"></i>
                <span class="btn-text">上一页</span>
              </button>
              <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
              <button @click="nextPage" :disabled="currentPage >= totalPages" class="control-btn">
                <span class="btn-text">下一页</span>
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div class="control-group">
              <div class="zoom-controls">
                <button @click="zoomOut" :disabled="scale <= 0.5" class="control-btn">
                  <i class="fas fa-search-minus"></i>
                </button>
                <span class="scale-info">{{ Math.round(scale * 100) }}%</span>
                <button @click="zoomIn" :disabled="scale >= 3" class="control-btn">
                  <i class="fas fa-search-plus"></i>
                </button>
              </div>
              <button @click="downloadReport" class="download-btn control-btn">
                <i class="fas fa-download"></i>
                <span class="btn-text">下载报告</span>
              </button>
            </div>
          </div>
          
          <!-- PDF显示区域 - 使用pdfh5 -->
          <div class="pdf-content">
            <div v-if="pdfLoading" class="pdf-loading">
              <div class="loading-spinner"></div>
              <p>正在加载PDF文档...</p>
            </div>
            
            <div v-else-if="pdfError" class="pdf-error">
              <i class="fas fa-exclamation-triangle"></i>
              <h3>PDF加载失败</h3>
              <p>{{ pdfError }}</p>
              <div class="error-actions">
                <button @click="initPDFViewer" class="retry-btn">
                  <i class="fas fa-redo"></i> 重新加载
                </button>
                <button @click="downloadReport" class="download-btn">
                  <i class="fas fa-download"></i> 直接下载
                </button>
              </div>
            </div>
            
            <!-- pdfh5容器 -->
            <div v-else class="pdfh5-container">
              <div id="pdfh5-viewer" ref="pdfh5Viewer"></div>
            </div>
          </div>
        </div>
        
        <div class="report-summary">
          <h3>报告摘要</h3>
          <ul>
            <li>基于严格物理模型的光学仿真算法</li>
            <li>双点光源干涉与任意形状衍射实验</li>
            <li>AI智能体辅助实验参数优化</li>
            <li>高精度光谱演化模拟</li>
            <li>多维度参数调控与实时分析</li>
          </ul>
          <div class="report-meta">
            <div class="meta-item">
              <i class="fas fa-download"></i>
              <span>推荐下载阅读</span>
            </div>
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
        
        <div class="feature-card">
          <div class="feature-icon">🌈</div>
          <h3>复色光仿真</h3>
          <p>精确模拟混合光场的光谱演化过程</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>双视图联动</h3>
          <p>现象观察与机理分析同步展示</p>
        </div>
      </div>
    </div>

    <!-- 技术特色 -->
    <div class="tech-section">
      <div class="section-header">
        <h2>技术创新</h2>
        <div class="divider"></div>
      </div>
      
      <div class="tech-content">
        <div class="tech-item">
          <div class="tech-icon">
            <i class="fas fa-calculator"></i>
          </div>
          <div class="tech-text">
            <h3>精确物理建模</h3>
            <p>基于自主推导的波动光学公式，实现高精度仿真</p>
          </div>
        </div>
        
        <div class="tech-item">
          <div class="tech-icon">
            <i class="fas fa-robot"></i>
          </div>
          <div class="tech-text">
            <h3>AI智能体集成</h3>
            <p>集成智能辅导系统，提供个性化学习路径</p>
          </div>
        </div>
        
        <div class="tech-item">
          <div class="tech-icon">
            <i class="fas fa-tools"></i>
          </div>
          <div class="tech-text">
            <h3>教学工具创新</h3>
            <p>为光学教育提供低成本、高效率的探究平台</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <div class="action-area">
        <div class="qr-card">
          <h3>体验"光睿"智能助手</h3>
          <div class="qr-container">
            <img :src="qrCode2" alt="光睿智能助手二维码" class="qr-image" loading="lazy">
          </div>
          <button class="action-button" @click="getAI">立即体验</button>
        </div>
        
        <div class="qr-card">
          <h3>获取平台</h3>
          <div class="qr-container">
            <img :src="qrCode" alt="平台下载二维码" class="qr-image" loading="lazy">
          </div>
          <div class="download-info">
            <p>百度网盘永久分享</p>
            <p class="highlight">提取码: <span>1114</span></p>
          </div>
        </div>
      </div>
      
      <div class="copyright">
        <p>© 2025 波动光学实验仿真平台 | 第11届全国大学生物理实验竞赛(创新)决赛</p>
      </div>
    </div>

    <!-- 海报模态框 -->
    <div class="modal-overlay" v-if="showPosterModal" @click.self="closePosterModal">
      <div class="poster-modal">
        <button class="close-button" @click="closePosterModal">
          <i class="fas fa-times"></i>
        </button>
        <img :src="posterFull" alt="竞赛海报大图" class="modal-poster" loading="lazy">
        <div class="modal-actions">
          <button class="download-button" @click="downloadPoster">
            <i class="fas fa-download"></i> 下载海报图片
          </button>
          <button class="download-button" @click="downloadPosterPDF">
            <i class="fas fa-download"></i> 下载pdf版本
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端底部导航 -->
    <div class="mobile-nav" v-if="isMobile">
      <button class="nav-btn" @click="scrollToSection('intro')">
        <i class="fas fa-info-circle"></i>
        <span>简介</span>
      </button>
      <button class="nav-btn" @click="scrollToSection('video')">
        <i class="fas fa-play-circle"></i>
        <span>演示</span>
      </button>
      <button class="nav-btn" @click="scrollToSection('report')">
        <i class="fas fa-file-pdf"></i>
        <span>报告</span>
      </button>
      <button class="nav-btn" @click="scrollToSection('footer')">
        <i class="fas fa-qrcode"></i>
        <span>体验</span>
      </button>
    </div>
  </div>
</template>

<script>
// 引入pdfh5
import Pdfh5 from "pdfh5";

export default {
  name: 'ProjectShowcase',
  data() {
    return {
      videoSource: 'http://parliy.com:83/api/image/%E6%B3%A2%E5%8A%A8%E5%85%89%E5%AD%A6%E5%AE%9E%E9%AA%8C%E4%BB%BF%E7%9C%9F%E5%B9%B3%E5%8F%B0%E5%86%B3%E8%B5%9B%E8%A7%86%E9%A2%91.mp4',
      isPlaying: false,
      qrCode: 'http://parliy.com:83/api/image/bodongqrcode.png',
      qrCode2: 'http://parliy.com:83/api/image/bodongAIqrcode.jpg',
      posterThumbnail: 'http://parliy.com:83/api/image/%E5%AE%9E%E9%AA%8C%E7%AB%9E%E8%B5%9B%E5%9B%BD%E8%B5%9B%E6%B5%B7%E6%8A%A5.jpg',
      posterFull: 'http://parliy.com:83/api/image/%E5%AE%9E%E9%AA%8C%E7%AB%9E%E8%B5%9B%E5%9B%BD%E8%B5%9B%E6%B5%B7%E6%8A%A5.jpg',
      showPosterModal: false,
      reportPdf: 'http://parliy.com:83/api/image/波动光学实验仿真平台——研究报告.pdf',
      
      // PDF显示相关
      currentPage: 1,
      totalPages: 0,
      scale: 1.0,
      pdfLoading: false,
      pdfError: null,
      pdfh5: null,
      isMobile: false,
      
      fileSize: '约2.5MB'
    }
  },
  mounted() {
    document.title = "波动光学实验仿真平台 - 功能详细介绍";
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    document.addEventListener('keydown', this.handleKeyDown);
    
    // 初始化PDF显示
    this.initPDFViewer();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // 清理pdfh5实例
    if (this.pdfh5) {
      this.pdfh5.destroy();
    }
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    
    scrollToSection(section) {
      const sections = {
        intro: '.intro-section',
        video: '.video-section',
        report: '.report-section',
        footer: '.footer'
      };
      
      const element = document.querySelector(sections[section]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    
    async initPDFViewer() {
      this.pdfLoading = true;
      this.pdfError = null;
      
      try {
        // 确保容器存在
        if (!this.$refs.pdfh5Viewer) {
          throw new Error('PDF容器未找到');
        }
        
        // 初始化pdfh5
        this.pdfh5 = new Pdfh5(this.$refs.pdfh5Viewer, {
          pdfurl: this.reportPdf,
          zoom: {
            min: 0.5,
            max: 3,
            step: 0.1
          },
          scrollEnable: true,
          lazy: false,
          renderType: 'canvas'
        });
        
        // 监听事件
        this.pdfh5.on('complete', (status, msg, time) => {
          console.log('PDF加载完成:', status, msg, time);
          this.pdfLoading = false;
          this.totalPages = this.pdfh5.totalNum;
          this.currentPage = 1;
        });
        
        this.pdfh5.on('success', (msg, time) => {
          console.log('PDF加载成功:', msg, time);
        });
        
        this.pdfh5.on('error', (err) => {
          console.error('PDF加载错误:', err);
          this.pdfLoading = false;
          this.pdfError = this.getErrorMessage(err);
        });
        
        this.pdfh5.on('pageChange', (page, total) => {
          console.log('页面变更:', page, total);
          this.currentPage = page;
          this.totalPages = total;
        });
        
        this.pdfh5.on('zoom', (zoom) => {
          this.scale = zoom;
        });
        
      } catch (error) {
        console.error('PDF初始化失败:', error);
        this.pdfLoading = false;
        this.pdfError = this.getErrorMessage(error);
      }
    },
    
    getErrorMessage(error) {
      if (error.message.includes('CORS') || error.message.includes('跨域')) {
        return '跨域访问限制，请确保PDF文件服务器已配置CORS';
      } else if (error.message.includes('404') || error.message.includes('不存在')) {
        return 'PDF文件不存在或路径错误';
      } else if (error.message.includes('Network Error')) {
        return '网络连接失败，请检查网络连接';
      } else {
        return 'PDF加载失败: ' + (error.message || '未知错误');
      }
    },
    
    playVideo() {
      this.$refs.videoPlayer.play();
      this.isPlaying = true;
    },
    
    getAI(){
      window.location.href = 'weixin://dl/business/?appid=wxd5201eb08d2fa15c&path=pages/agentChat/index&query=showAuthDirectly%3D1%26id%3DZ08Z4nS6aU7T'
    },
    
    openPosterModal() {
      this.showPosterModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closePosterModal() {
      this.showPosterModal = false;
      document.body.style.overflow = '';
    },
    
    downloadPoster() {
      this.downloadFile(this.posterFull, '波动光学实验仿真平台海报.png');
    },
    
    handleKeyDown(event) {
      if (this.showPosterModal && event.key === 'Escape') {
        this.closePosterModal();
      }
    },
    
    prevPage() {
      if (this.pdfh5 && this.currentPage > 1) {
        this.pdfh5.prev();
      }
    },
    
    nextPage() {
      if (this.pdfh5 && this.currentPage < this.totalPages) {
        this.pdfh5.next();
      }
    },
    
    zoomIn() {
      if (this.pdfh5 && this.scale < 3) {
        this.pdfh5.zoomIn();
      }
    },
    
    zoomOut() {
      if (this.pdfh5 && this.scale > 0.5) {
        this.pdfh5.zoomOut();
      }
    },
    
    downloadReport() {
      this.downloadFile(this.reportPdf, '波动光学实验报告.pdf');
    },

    downloadPosterPDF() {
      this.downloadFile('http://parliy.com:83/api/image/实验竞赛国赛海报.pdf', '波动光学实验海报.pdf');
    },
    
    downloadFile(url, filename) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

.project-showcase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
  padding-bottom: 70px; /* 为移动端导航留出空间 */
}

/* 头部样式 - 移动端优化 */
.header {
  text-align: center;
  margin-bottom: 25px;
  padding-top: 10px;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.wave-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.wave-icon::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -12px;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 45%;
  animation: wave 5s infinite linear;
}

@keyframes wave {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2b2d42;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 6px;
  font-weight: 500;
}

/* 公共区域样式 */
.section-header {
  text-align: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.4rem;
  color: #3a0ca3;
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
}

.divider {
  height: 3px;
  width: 50px;
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  margin: 0 auto;
  border-radius: 2px;
}

/* 项目介绍区域 */
.intro-section {
  margin-bottom: 30px;
  background: white;
  border-radius: 12px;
  padding: 20px 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.intro-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.intro-text p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 10px;
  text-align: justify;
}

.platform-features h3 {
  font-size: 1.1rem;
  color: #3a0ca3;
  margin-bottom: 10px;
  text-align: center;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.feature-tag {
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  color: white;
  padding: 5px 10px;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 海报展示区域 */
.poster-section {
  margin-bottom: 30px;
}

.poster-container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.poster-thumbnail {
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.poster-thumbnail:hover {
  transform: translateY(-3px);
}

.poster-image {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
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
  font-size: 2rem;
  margin-bottom: 8px;
}

.zoom-overlay p {
  font-size: 1rem;
  font-weight: 500;
}

/* 视频区域 */
.video-section {
  margin-bottom: 30px;
}

.video-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  background: #000;
  max-height: 60vh;
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
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.play-button i {
  font-size: 1.8rem;
  margin-left: 4px;
}

.video-overlay:hover .play-button {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* 实验报告区域 - 移动端优化 */
.report-section {
  margin-bottom: 30px;
}

.report-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.pdf-viewer {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.pdf-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.control-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.control-btn {
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  justify-content: center;
}

.control-btn:disabled {
  background: #a8b1c7;
  cursor: not-allowed;
}

.control-btn:not(:disabled):hover {
  background: #3a0ca3;
}

.page-info {
  font-weight: 600;
  color: #3a0ca3;
  font-size: 0.85rem;
  text-align: center;
  min-width: 120px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  justify-content: center;
}

.scale-info {
  font-weight: 600;
  color: #3a0ca3;
  min-width: 45px;
  text-align: center;
  font-size: 0.85rem;
}

.download-btn {
  background: #28a745 !important;
  flex: 1;
}

.download-btn:hover {
  background: #218838 !important;
}

.btn-text {
  display: inline;
}

/* PDF内容区域 */
.pdf-content {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-loading, .pdf-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  width: 100%;
  padding: 20px;
  text-align: center;
}

.loading-spinner {
  width: 35px;
  height: 35px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pdf-error {
  color: #dc3545;
}

.pdf-error i {
  font-size: 2rem;
  margin-bottom: 12px;
}

.pdf-error h3 {
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.pdf-error p {
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.error-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.retry-btn {
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.85rem;
}

/* pdfh5容器样式 */
.pdfh5-container {
  width: 100%;
  height: 500px;
  background: #f8f9fa;
  overflow: auto;
}

#pdfh5-viewer {
  width: 100%;
  height: 100%;
}

/* pdfh5自定义样式 */
:deep(.pdfh5 .pdfh5-page) {
  margin: 10px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

:deep(.pdfh5 .pdfh5-toolbar) {
  background: #4361ee;
  color: white;
}

:deep(.pdfh5 .pdfh5-toolbar .pdfh5-pagenum) {
  color: white;
}

:deep(.pdfh5 .pdfh5-toolbar .pdfh5-zoom) {
  color: white;
}

.report-summary {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.report-summary h3 {
  font-size: 1.1rem;
  color: #3a0ca3;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f3f9;
}

.report-summary ul {
  list-style-type: none;
}

.report-summary li {
  padding: 6px 0;
  border-bottom: 1px solid #f1f3f9;
  position: relative;
  padding-left: 20px;
  font-size: 0.9rem;
}

.report-summary li:before {
  content: "•";
  color: #4361ee;
  font-size: 1.2rem;
  position: absolute;
  left: 0;
  top: 3px;
}

/* 功能亮点区域 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 20px 12px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 50px;
  height: 50px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.feature-card h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #2b2d42;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* 技术特色区域 */
.tech-section {
  margin-bottom: 30px;
}

.tech-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  max-width: 1000px;
  margin: 0 auto;
}

.tech-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.tech-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.tech-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.tech-text h3 {
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: #2b2d42;
}

.tech-text p {
  color: #6c757d;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* 底部样式优化 */
.footer {
  margin-top: 40px;
  padding: 20px 12px;
  text-align: center;
}

.action-area {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.qr-card {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 280px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.qr-card h3 {
  font-size: 1.2rem;
  color: #3a0ca3;
  margin-bottom: 12px;
  font-weight: 600;
}

.qr-container {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 8px;
}

.qr-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
}

.action-button {
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 8px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  width: 100%;
  max-width: 160px;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 12, 163, 0.3);
}

.download-info {
  text-align: center;
  width: 100%;
  margin-top: 8px;
}

.download-info p {
  margin-bottom: 4px;
  color: #6c757d;
  font-size: 0.9rem;
}

.highlight {
  font-weight: 700;
  color: #3a0ca3;
  font-size: 1rem;
  margin-top: 4px;
}

.highlight span {
  background: #f1f3f9;
  padding: 2px 8px;
  border-radius: 14px;
}

.copyright {
  margin-top: 25px;
  color: #6c757d;
  font-size: 0.85rem;
}

.copyright p {
  margin-bottom: 4px;
}

/* 海报模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 10px;
}

.poster-modal {
  background: white;
  border-radius: 10px;
  padding: 12px;
  max-width: 95%;
  max-height: 95vh;
  position: relative;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.3);
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
  background: rgba(0, 0, 0, 0.5);
  transform: rotate(90deg);
}

.modal-poster {
  max-width: 100%;
  max-height: 75vh;
  display: block;
  border-radius: 6px;
  object-fit: contain;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  gap: 8px;
  flex-wrap: wrap;
}

.download-button {
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 6px 15px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 12, 163, 0.3);
}

/* 移动端底部导航 */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-top: 1px solid #e9ecef;
}

.nav-btn {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 80px;
}

.nav-btn i {
  font-size: 1.2rem;
}

.nav-btn span {
  font-size: 0.7rem;
  font-weight: 500;
}

.nav-btn.active,
.nav-btn:hover {
  color: #4361ee;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .project-showcase {
    padding: 20px;
    padding-bottom: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.6rem;
  }
  
  .intro-section {
    padding: 25px 20px;
  }
  
  .intro-text p {
    font-size: 1rem;
  }
  
  .report-container {
    grid-template-columns: 2fr 1fr;
    gap: 25px;
  }
  
  .pdf-controls {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .control-group {
    flex: 1;
  }
  
  .pdf-content {
    min-height: 500px;
  }
  
  .pdfh5-container {
    height: 600px;
  }
  
  .pdf-loading, .pdf-error {
    height: 500px;
  }
  
  .features-grid {
    gap: 20px;
  }
  
  .tech-content {
    gap: 20px;
  }
  
  .action-area {
    gap: 30px;
  }
  
  .qr-card {
    width: 300px;
    padding: 20px;
  }
  
  .mobile-nav {
    display: none;
  }
}

@media (min-width: 992px) {
  .header h1 {
    font-size: 2.2rem;
  }
  
  .section-header h2 {
    font-size: 1.7rem;
  }
  
  .intro-content {
    flex-direction: row;
    gap: 35px;
  }
  
  .intro-text {
    flex: 2;
  }
  
  .platform-features {
    flex: 1;
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .btn-text {
    display: inline;
  }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
  .project-showcase {
    padding: 8px;
    padding-bottom: 60px;
  }
  
  .header h1 {
    font-size: 1.3rem;
  }
  
  .section-header h2 {
    font-size: 1.2rem;
  }
  
  .feature-tag {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .btn-text {
    display: none;
  }
  
  .control-btn {
    padding: 6px 8px;
  }
  
  .page-info {
    font-size: 0.8rem;
    min-width: 100px;
  }
}

/* 打印样式 */
@media print {
  .action-area,
  .footer,
  .video-overlay,
  .mobile-nav {
    display: none !important;
  }
  
  .project-showcase {
    max-width: none;
    box-shadow: none;
    padding: 0;
  }
}

.report-meta {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f1f3f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #6c757d;
  font-size: 0.9rem;
}

.meta-item i {
  color: #4361ee;
  width: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pdfh5-container {
    height: 400px;
  }
}
</style>