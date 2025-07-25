<template>
  <div class="dashboard-container">
    <div class="header-section">
      <h1><i class="icon-repair"></i> 宿舍报修系统数据看板</h1>
      <div class="info-card">
        <div class="info-item">
          <div class="info-value">{{ repairData.totalRepairs }}</div>
          <div class="info-label">总报修记录</div>
        </div>
        <div class="info-item">
          <div class="info-value">{{ repairData.pendingRepairs }}</div>
          <div class="info-label">待维修记录</div>
        </div>
        <div class="info-item">
          <div class="info-value">{{ repairData.totalWorkers }}</div>
          <div class="info-label">维修工人数</div>
        </div>
        <div class="info-item">
          <div class="info-value">{{ repairData.totalBuildings }}</div>
          <div class="info-label">楼栋数量</div>
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <!-- 第一行：两个图表 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2><i class="icon-category"></i> 报修类别分布</h2>
          <div class="chart-filter">
            <span>按苑区: </span>
            <select v-model="categoryFilter" class="filter-select">
              <option value="all">全部苑区</option>
              <option value="南苑">南苑</option>
              <option value="西苑">西苑</option>
              <option value="北苑">北苑</option>
            </select>
          </div>
        </div>
        <div ref="categoryChart" class="chart-content" style="height:300px"></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h2><i class="icon-status"></i> 报修状态统计</h2>
        </div>
        <div ref="statusChart" class="chart-content" style="height:300px"></div>
      </div>

      <!-- 第二行：两个图表 -->
      <div class="chart-card">
        <div class="chart-header">
          <h2><i class="icon-trend"></i> 报修趋势分析</h2>
          <div class="chart-filter">
            <select v-model="trendFilter" class="filter-select">
              <option value="7">近7天</option>
              <option value="15">近15天</option>
              <option value="30">近30天</option>
            </select>
          </div>
        </div>
        <div ref="trendChart" class="chart-content" style="height:300px"></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h2><i class="icon-area"></i> 苑区报修比例</h2>
        </div>
        <div ref="areaChart" class="chart-content" style="height:300px"></div>
      </div>

      <!-- 第三行：维修工热力图（单独一行） -->
      <div class="chart-card full-width">
        <div class="chart-header">
          <h2><i class="icon-worker"></i> 维修工工作统计</h2>
          <div class="chart-filter">
            <span>维修类别:</span>
            <select v-model="workerCategoryFilter" class="filter-select">
              <option value="all">全部类别</option>
              <option v-for="cat in workerCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <span class="info-text">点击图表查看详情</span>
          </div>
        </div>
        <div ref="workerHeatmap" class="chart-content" style="height:350px"></div>
      </div>
    </div>
    
    <div class="footer-note">
      <p>数据更新时间: {{ currentTime }} | 当前显示数据为模拟数据</p>
    </div>
    
    <!-- 维修工详情弹窗 -->
    <div v-if="workerDetail.visible" class="worker-detail-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ workerDetail.name }} 维修详情</h3>
          <button @click="closeDetail" class="close-btn">
            <i class="close-icon">×</i>
          </button>
        </div>
        <div class="modal-body">
          <div class="worker-stats">
            <div class="stat-card">
              <div class="stat-value">{{ workerDetail.total }}</div>
              <div class="stat-label">维修总量</div>
            </div>
            <!-- <div class="stat-card">
              <div class="stat-value">{{ workerDetail.efficiency }}</div>
              <div class="stat-label">维修效率</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ workerDetail.avgTime }}<span class="unit">小时</span></div>
              <div class="stat-label">平均处理时间</div>
            </div> -->
          </div>
          
          <div class="distribution-chart">
            <div class="chart-title">维修类别分布</div>
            <div ref="distributionChart" style="height: 220px; width: 100%;"></div>
          </div>
          
          <!-- <div class="recent-repairs">
            <div class="section-title">近期维修记录</div>
            <div class="repair-list">
              <div class="repair-item" v-for="(item, index) in workerDetail.repairs" :key="index">
                <div class="repair-info">
                  <span class="building">{{ item.building }}</span>
                  <span class="category" :style="{ backgroundColor: getCategoryColor(item.category) }">{{ item.category }}</span>
                  <span class="desc">{{ item.description }}</span>
                </div>
                <div class="repair-time">{{ item.time }}</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      duty: localStorage.getItem("dormitory_duty"),
      currentTime: this.formatTime(new Date()),
      categoryFilter: 'all',
      trendFilter: '7',
      workerCategoryFilter: 'all',
      workerCategories: ['空调', '热水', '网络', '其他'],
      statistics: {
        totalRepairs: 275,
        pending: 68,
        workers: 5,
        avgResponse: 3.2
      },
      workerDetail: {
        visible: false,
        name: '',
        total: 0,
        efficiency: '',
        avgTime: 0,
        repairs: []
      },
      // 模拟数据
      repairData: {
        totalWorkers:null,
        pendingRepairs:null,
        totalRepairs:null,
        totalBuildings:null,
        // 报修类别分布数据（按苑区过滤）
        categories: {
          all: [],
          南苑: [],
          西苑: [],
          北苑: []
        },
        statuses: [],
        trends: {
          7: [],
          15: [],
          30: []
        },
        areas: [],
        // 维修工工作情况（热力图）
        workers: []
      }
    };
  },
  mounted() {
    console.log(this.duty)
    if (this.duty==1) {
          this.$router.push('/manage/repair-records')
    }
    this.fetchDashboardData();
    this.initCharts();
    window.addEventListener('resize', this.handleResize);
    
    // 设置定时器更新时间
    this.timeInterval = setInterval(() => {
      this.currentTime = this.formatTime(new Date());
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.timeInterval) clearInterval(this.timeInterval);
  },
  watch: {
    categoryFilter() {
      this.updateCategoryChart();
    },
    trendFilter() {
      this.updateTrendChart();
    },
    workerCategoryFilter() {
      this.updateWorkerHeatmap();
    }
  },
  methods: {
    // 初始化所有图表
    initCharts() {
      this.initCategoryChart();
      this.initStatusChart();
      this.initTrendChart();
      this.initAreaChart();
      this.updateWorkerHeatmap();
    },
    
    // 格式化时间
    formatTime(date) {
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      return new Intl.DateTimeFormat('zh-CN', options).format(date);
    },
    
    // 报修类别柱状图
    initCategoryChart() {
      this.categoryChart = echarts.init(this.$refs.categoryChart);
      this.updateCategoryChart();
    },
    
    updateCategoryChart() {
      const data = this.repairData.categories[this.categoryFilter];
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: {
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '报修数量'
        },
        series: [{
          name: '报修数量',
          type: 'bar',
          barWidth: '40%',
          data: data.map(item => {
            return {
              value: item.value,
              itemStyle: {
                color: this.getCategoryColor(item.name)
              }
            };
          }),
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            borderWidth: 0
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 13,
            fontWeight: 'bold',
            formatter: '{c}'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        }]
      };
      
      this.categoryChart.setOption(option);
    },
    
    // 获取类别对应颜色
    getCategoryColor(category) {
      const colors = {
        '空调': '#5470c6',
        '热水': '#91cc75',
        '网络': '#fac858',
        '其他': '#ee6666'
      };
      return colors[category] || '#73c0de';
    },
    
    // 报修状态饼图
    initStatusChart() {
      this.statusChart = echarts.init(this.$refs.statusChart);
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: this.repairData.statuses.map(item => item.name)
        },
        series: [
          {
            name: '报修状态',
            type: 'pie',
            radius: ['30%', '65%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold',
                formatter: '{b}\n{c} ({d}%)'
              }
            },
            labelLine: {
              show: false
            },
            data: this.repairData.statuses.map(item => {
              return {
                name: item.name,
                value: item.value,
                itemStyle: {
                  color: this.getStatusColor(item.name)
                }
              };
            })
          }
        ]
      };
      
      this.statusChart.setOption(option);
      
      // 点击事件处理
      this.statusChart.on('click', params => {
        this.$message.success(`过滤状态为 [${params.name}] 的报修记录`);
      });
    },
    
    // 获取状态对应颜色
    getStatusColor(status) {
      const colors = {
        '待维修': '#ff7875',
        '已维修': '#5cdbd3',
        '已取消': '#b7eb8f',
        '已转接服务商': '#ffc53d'
      };
      return colors[status] || '#73c0de';
    },
    
    // 报修趋势曲线图
    initTrendChart() {
      this.trendChart = echarts.init(this.$refs.trendChart);
      this.updateTrendChart();
    },
    
    updateTrendChart() {
      const trendData = this.repairData.trends[this.trendFilter];
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: trendData.map(item => item.date)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '报修数量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: '#1890ff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: 'rgba(24, 144, 255, 0.5)'},
                {offset: 1, color: 'rgba(24, 144, 255, 0.1)'}
              ])
            },
            data: trendData.map(item => item.value),
            markPoint: {
              data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
              ]
            }
          }
        ]
      };
      
      this.trendChart.setOption(option);
    },
    
    // 苑区报修比例
    initAreaChart() {
      this.areaChart = echarts.init(this.$refs.areaChart);
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: 0,
          left: 'center',
          data: this.repairData.areas.map(item => item.name)
        },
        series: [
          {
            name: '苑区分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.repairData.areas.map(item => {
              return {
                name: item.name,
                value: item.value,
                itemStyle: {
                  color: this.getAreaColor(item.name)
                }
              };
            })
          }
        ]
      };
      
      this.areaChart.setOption(option);
    },
    
    // 维修工热力图（带筛选）
    updateWorkerHeatmap() {
  if (!this.$refs.workerHeatmap) return;
  
  // 检查是否有数据
  if (!this.repairData.workers || this.repairData.workers.length === 0) {
    console.warn('没有维修工数据');
    return;
  }
  
  // 销毁旧图表（如果需要）
  if (this.workerHeatmap) {
    this.workerHeatmap.dispose();
  }
  
  this.workerHeatmap = echarts.init(this.$refs.workerHeatmap);
  
  const workers = this.repairData.workers.map(worker => worker.name);
  let categories = this.workerCategories;
  const data = [];
  
  // 处理筛选条件
  if (this.workerCategoryFilter !== 'all') {
    categories = [this.workerCategoryFilter];
  }
  
  // 计算最大值
  let maxValue = 0;
  
  workers.forEach((workerName, workerIndex) => {
    const worker = this.repairData.workers.find(w => w.name === workerName);
    
    if (!worker || !worker.categories) {
      console.warn(`维修工 ${workerName} 数据不完整`, worker);
      return;
    }
    
    categories.forEach((category, catIndex) => {
      // 确保正确访问 categories 对象
      const value = worker.categories[category] || 0;
      
      // 更新最大值
      if (value > maxValue) maxValue = value;
      
      data.push([catIndex, workerIndex, value]);
    });
  });
  
  // 确保最大值至少为1（避免除以0）
  if (maxValue === 0) maxValue = 1;
  
  const option = {
    tooltip: {
      position: 'top',
      formatter: function(params) {
        return `${workers[params.value[1]]} - ${categories[params.value[0]]}<br/>报修数: ${params.value[2]}`;
      }
    },
    grid: {
      top: 50,
      left: 100,
      right: 60,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      data: categories,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: workers,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 1,
      inRange: {
        color: ['#d0f0c0', '#91cc75', '#5470c6']
      },
      textStyle: {
        fontSize: 12
      }
    },
    series: [{
      name: '维修工工作情况',
      type: 'heatmap',
      data: data,
      label: {
        show: true,
        // formatter: '{c}',
        color: '#333',
        fontSize: 12
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  
  this.workerHeatmap.setOption(option);
  
  // 添加点击事件查看维修工详情
  this.workerHeatmap.off('click');
  this.workerHeatmap.on('click', params => {
    const workerIndex = params.value[1];
    this.showWorkerDetail(workerIndex);
  });
},
    
    // 获取维修工最大值
    getWorkerMaxValue() {
      if (this.workerCategoryFilter === 'all') {
        return 45;
      }
      
      const values = this.repairData.workers.map(worker => 
        worker.categories[this.workerCategoryFilter] || 0
      );
      
      return Math.max(...values);
    },
    
    // 显示维修工详情
    showWorkerDetail(workerIndex) {
      const worker = this.repairData.workers[workerIndex];
      this.workerDetail = {
        visible: true,
        name: worker.name,
        total: Object.values(worker.categories).reduce((sum, val) => sum + val, 0),
        efficiency: worker.efficiency,
        avgTime: worker.avgTime,
        repairs: worker.repairs
      };
      
      this.$nextTick(() => {
        if (this.$refs.distributionChart) {
          this.initDistributionChart(worker.categories);
        }
      });
    },
    
    // 初始化类别分布图
    initDistributionChart(categories) {
      const chart = echarts.init(this.$refs.distributionChart);
      const data = Object.entries(categories).map(([name, value]) => ({
        name,
        value
      }));
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        series: [
          {
            name: '维修类别',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}'
            },
            data: data.map(item => ({
              name: item.name,
              value: item.value,
              itemStyle: {
                color: this.getCategoryColor(item.name)
              }
            }))
          }
        ]
      };
      
      chart.setOption(option);
    },
    
    // 关闭详情弹窗
    closeDetail() {
      this.workerDetail.visible = false;
    },
    
    // 获取苑区颜色
    getAreaColor(areaName) {
      const colors = {
        '南苑': '#1890ff',
        '西苑': '#52c41a',
        '北苑': '#faad14'
      };
      return colors[areaName] || '#73c0de';
    },
    
    // 处理窗口大小变化
    handleResize() {
      if (this.categoryChart) this.categoryChart.resize();
      if (this.statusChart) this.statusChart.resize();
      if (this.trendChart) this.trendChart.resize();
      if (this.areaChart) this.areaChart.resize();
      if (this.workerHeatmap) this.workerHeatmap.resize();
    },
    async fetchDashboardData() {
        try {
          const response = await this.$axios.get('/record/DashboardData');
          const dashboardData = response.data.dashboardData;
          // console.log( dashboardData.workers);
          // 维修工分类
           
          this.repairData.totalRepairs = dashboardData.totalRepairs;
          this.repairData.totalWorkers = dashboardData.totalWorkers;
          this.repairData.pendingRepairs = dashboardData.pendingRepairs;
          this.repairData.totalBuildings = dashboardData.totalBuildings;
          //报修类别分布
          this.repairData.categories.all = dashboardData.categories.all;
          this.repairData.categories.南苑 = dashboardData.categories.南苑;
          this.repairData.categories.西苑 = dashboardData.categories.西苑;
          this.repairData.categories.北苑 = dashboardData.categories.北苑;
          
          // 报修状态统计
          this.repairData.statuses = dashboardData.statuses;
          
          // 报修趋势数据
          this.repairData.trends['7'] = dashboardData.trends['7'];
          this.repairData.trends['15'] = dashboardData.trends['15'];
          this.repairData.trends['30'] = dashboardData.trends['30'];
          
          // 苑区报修比例
          this.repairData.areas = dashboardData.areas;
          
          // 维修工工作统计
         // 清洗维修工数据中的键名
        this.repairData.workers = dashboardData.workers.map(worker => {
            const cleanedCategories = {};
            
            // 清洗键名：移除转义双引号
            Object.entries(worker.categories).forEach(([key, value]) => {
                const cleanedKey = key.replace(/\\"/g, ''); // 移除转义双引号
                cleanedCategories[cleanedKey] = value;
            });
            
            return {
                ...worker,
                categories: cleanedCategories
            };
        });
          
          // 初始化图表...
          this.$nextTick(() => {
          this.initCharts();
        });
        } catch (error) {
          console.error('获取仪表盘数据失败:', error);
        }
      }
  }
};
</script>

<style scoped>
.dashboard-container {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  position: relative;
}

.header-section {
  background: linear-gradient(135deg, #1a56db 0%, #3b82f6 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 6px 18px rgba(26, 86, 219, 0.3);
}

.header-section h1 {
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-repair {
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.info-card {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.info-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 15px 25px;
  flex: 1;
  transition: transform 0.3s ease;
  text-align: center;
}

.info-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
}

.info-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
}

.unit {
  font-size: 18px;
  margin-left: 3px;
}

.info-label {
  font-size: 15px;
  opacity: 0.9;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #edf2f7;
}

.chart-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-select {
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 13px;
  color: #4a5568;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.info-text {
  font-size: 12px;
  color: #666;
  background: #f0f5ff;
  padding: 3px 8px;
  border-radius: 4px;
  margin-left: 5px;
}

.chart-content {
  padding: 10px;
}

.full-width {
  grid-column: span 2;
}

.footer-note {
  text-align: center;
  color: #718096;
  font-size: 13px;
  padding: 10px;
  margin-top: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* 详情弹窗样式 */
.worker-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 85%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: linear-gradient(135deg, #1a56db 0%, #3b82f6 100%);
  color: white;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 22px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-icon {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.worker-stats {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.stat-card {
  text-align: center;
  background: #f8fafc;
  padding: 15px 20px;
  border-radius: 10px;
  width: 140px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a56db;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 15px;
  color: #718096;
}

.distribution-chart {
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2d3748;
}

.recent-repairs .section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2d3748;
}

.repair-list {
  max-height: 300px;
  overflow-y: auto;
}

.repair-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f9fbfd;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s;
}

.repair-item:hover {
  background: #eef5ff;
  transform: translateX(3px);
}

.repair-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.building {
  background: #f0f5ff;
  color: #1a56db;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.category {
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}

.desc {
  font-size: 14px;
  color: #4a5568;
}

.repair-time {
  font-size: 13px;
  color: #718096;
}

/* 图标样式 */
.icon-repair:before {
  content: "🔧";
  font-size: 18px;
}

.icon-category:before {
  content: "📊";
  font-size: 18px;
}

.icon-status:before {
  content: "✅";
  font-size: 18px;
}

.icon-trend:before {
  content: "📈";
  font-size: 18px;
}

.icon-area:before {
  content: "📍";
  font-size: 18px;
}

.icon-worker:before {
  content: "👷";
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
  
  .info-card {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
  }
}

@media (max-width: 576px) {
  .header-section {
    padding: 15px;
  }
  
  .header-section h1 {
    font-size: 22px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .chart-filter {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .worker-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .repair-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>