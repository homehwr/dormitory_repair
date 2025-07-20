<template>
  <div class="dashboard-container">
    <!-- 头部标题 -->
    <div class="header">
      <h1><i class="el-icon-s-platform"></i> 宿舍报修系统 - 可视化分析平台</h1>
      <div class="date-selector">
        <el-date-picker
          v-model="selectedDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="updateCharts"
        ></el-date-picker>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filters">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="filter-item">
            <label>报修类别：</label>
            <el-select v-model="selectedCategory" multiple placeholder="全部类别" @change="updateCharts">
              <el-option
                v-for="category in categories"
                :key="category"
                :label="category"
                :value="category"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="filter-item">
            <label>维修状态：</label>
            <el-select v-model="selectedStatus" multiple placeholder="全部状态" @change="updateCharts">
              <el-option
                v-for="status in statuses"
                :key="status"
                :label="status"
                :value="status"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="filter-item">
            <label>宿舍楼栋：</label>
            <el-select v-model="selectedBuilding" multiple placeholder="全部楼栋" @change="updateCharts">
              <el-option
                v-for="building in buildings"
                :key="building"
                :label="building"
                :value="building"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="filter-item">
            <label>维修工：</label>
            <el-select v-model="selectedWorker" multiple placeholder="全部维修工" @change="updateCharts">
              <el-option
                v-for="worker in workers"
                :key="worker.name"
                :label="worker.name"
                :value="worker.name"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 数据概览卡片 -->
    <!-- <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card total">
            <div class="icon"><i class="el-icon-document"></i></div>
            <div class="content">
              <div class="value">{{ filteredRepairs.length }}</div>
              <div class="label">总报修数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card pending">
            <div class="icon"><i class="el-icon-time"></i></div>
            <div class="content">
              <div class="value">{{ pendingCount }}</div>
              <div class="label">待维修数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card completed">
            <div class="icon"><i class="el-icon-success"></i></div>
            <div class="content">
              <div class="value">{{ completedCount }}</div>
              <div class="label">已维修数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card worker">
            <div class="icon"><i class="el-icon-user"></i></div>
            <div class="content">
              <div class="value">{{ workers.length }}</div>
              <div class="label">维修工数量</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div> -->

    <!-- 图表区域 -->
    <div class="charts-container">
      <el-row :gutter="20">
        <!-- 报修类别分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3><i class="el-icon-s-marketing"></i> 报修类别分布</h3>
              <el-radio-group v-model="categoryChartType" size="mini" @change="updateCategoryChart">
                 <el-radio-button label="bar">柱状图</el-radio-button>
                <el-radio-button label="pie">饼图</el-radio-button>
              </el-radio-group>
            </div>
            <div class="chart-wrapper">
              <div ref="categoryChart" class="chart"></div>
            </div>
          </div>
        </el-col>
        
        <!-- 维修状态分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3><i class="el-icon-s-opportunity"></i> 维修状态分布</h3>
            </div>
            <div class="chart-wrapper">
              <div ref="statusChart" class="chart"></div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 楼栋报修情况 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">   
          <div class="chart-card">
            <div class="chart-header">
              <h3><i class="el-icon-office-building"></i> 各楼栋报修情况</h3>
            </div>
            <div class="chart-wrapper">
              <div ref="buildingChart" class="chart"></div>
            </div>
          </div>
        </el-col>
        
        <!-- 报修时间趋势 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3><i class="el-icon-timer"></i> 报修时间趋势</h3>
              <el-select v-model="timeUnit" size="mini" @change="updateTrendChart">
                <el-option label="按日" value="day"></el-option>
                <el-option label="按周" value="week"></el-option>
                <el-option label="按月" value="month"></el-option>
              </el-select>
            </div>
            <div class="chart-wrapper">
              <div ref="trendChart" class="chart"></div>
            </div>
          </div>
        </el-col>
      </el-row>
      
      <el-row style="margin-top: 20px;">
        <el-col :span="24">
          <div class="chart-card">
            <div class="chart-header">
              <h3><i class="el-icon-user-solid"></i> 维修工工作情况</h3>
            </div>
            <div class="chart-wrapper">
              <div ref="workerChart" class="chart"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'RepairDashboard',
  data() {
    return {
      // 筛选条件
      selectedCategory: [],
      selectedStatus: [],
      selectedBuilding: [],
      selectedWorker: [],
      selectedDateRange: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
      
      // 图表类型选项
      categoryChartType: 'bar',
      timeUnit: 'day',
      
      // 数据选项
      categories: ['空调', '热水', '网络', '其他维修'],
      statuses: ['待维修', '已维修', '已取消', '已转接服务商'],
      buildings: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼'],
      workers: [
        { name: '张师傅', phone: '13800138001', buildings: ['1号楼', '2号楼'] },
        { name: '李师傅', phone: '13800138002', buildings: ['3号楼', '4号楼'] },
        { name: '王师傅', phone: '13800138003', buildings: ['5号楼', '6号楼'] },
        { name: '赵师傅', phone: '13800138004', buildings: ['7号楼', '8号楼'] },
        { name: '刘师傅', phone: '13800138005', buildings: ['1号楼', '3号楼'] },
        { name: '陈师傅', phone: '13800138006', buildings: ['2号楼', '4号楼'] }
      ],
      
      // 报修记录数据
      repairs: [],
      
      // ECharts实例
      categoryChart: null,
      statusChart: null,
      buildingChart: null,
      trendChart: null,
      workerChart: null,
    };
  },
  computed: {
    // 过滤后的报修数据
    filteredRepairs() {
      return this.repairs.filter(repair => {
        // 类别筛选
        if (this.selectedCategory.length > 0 && !this.selectedCategory.includes(repair.category)) {
          return false;
        }
        // 状态筛选
        if (this.selectedStatus.length > 0 && !this.selectedStatus.includes(repair.status)) {
          return false;
        }
        // 楼栋筛选
        if (this.selectedBuilding.length > 0 && !this.selectedBuilding.includes(repair.building)) {
          return false;
        }
        // 维修工筛选
        if (this.selectedWorker.length > 0 && !this.selectedWorker.includes(repair.worker)) {
          return false;
        }
        // 日期筛选
        const startDate = this.selectedDateRange[0];
        const endDate = this.selectedDateRange[1];
        const repairDate = new Date(repair.date);
        if (startDate && endDate && (repairDate < startDate || repairDate > endDate)) {
          return false;
        }
        return true;
      });
    },
    
    // 待维修数量
    pendingCount() {
      return this.filteredRepairs.filter(repair => repair.status === '待维修').length;
    },
    
    // 已维修数量
    completedCount() {
      return this.filteredRepairs.filter(repair => repair.status === '已维修').length;
    }
  },
  mounted() {
    this.generateMockData();
    this.initCharts();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
    if (this.categoryChart) this.categoryChart.dispose();
    if (this.statusChart) this.statusChart.dispose();
    if (this.buildingChart) this.buildingChart.dispose();
    if (this.trendChart) this.trendChart.dispose();
    if (this.workerChart) this.workerChart.dispose();
  },
  methods: {
    // 生成模拟数据
    generateMockData() {
      const mockRepairs = [];
      const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60天前
      
      for (let i = 0; i < 200; i++) {
        const randomDays = Math.floor(Math.random() * 60);
        const randomDate = new Date(startDate);
        randomDate.setDate(startDate.getDate() + randomDays);
        
        mockRepairs.push({
          id: i + 1,
          category: this.categories[Math.floor(Math.random() * this.categories.length)],
          status: this.statuses[Math.floor(Math.random() * this.statuses.length)],
          building: this.buildings[Math.floor(Math.random() * this.buildings.length)],
          date: randomDate.toISOString().split('T')[0],
          description: '报修问题描述' + (i + 1),
          worker: this.workers[Math.floor(Math.random() * this.workers.length)].name,
          reporter: '学生' + (Math.floor(Math.random() * 1000) + 1)
        });
      }
      
      this.repairs = mockRepairs;
    },
    
    // 初始化图表
    initCharts() {
      this.categoryChart = echarts.init(this.$refs.categoryChart);
      this.statusChart = echarts.init(this.$refs.statusChart);
      this.buildingChart = echarts.init(this.$refs.buildingChart);
      this.trendChart = echarts.init(this.$refs.trendChart);
      this.workerChart = echarts.init(this.$refs.workerChart);
      
      this.updateCategoryChart();
      this.updateStatusChart();
      this.updateBuildingChart();
      this.updateTrendChart();
      this.updateWorkerChart();
    },
    
    // 调整图表大小
    resizeCharts() {
      if (this.categoryChart) this.categoryChart.resize();
      if (this.statusChart) this.statusChart.resize();
      if (this.buildingChart) this.buildingChart.resize();
      if (this.trendChart) this.trendChart.resize();
      if (this.workerChart) this.workerChart.resize();
    },
    
    // 更新所有图表
    updateCharts() {
      this.updateCategoryChart();
      this.updateStatusChart();
      this.updateBuildingChart();
      this.updateTrendChart();
      this.updateWorkerChart();
    },
    
    // 更新报修类别分布图
    updateCategoryChart() {
      const categoryCount = {};
      this.categories.forEach(cat => {
        categoryCount[cat] = this.filteredRepairs.filter(r => r.category === cat).length;
      });
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: this.categories
        },
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
        series: [
          {
            name: '报修类别',
            type: this.categoryChartType,
            radius: ['40%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: this.categories.map(cat => ({
              value: categoryCount[cat],
              name: cat
            }))
          }
        ]
      };
      
      if (this.categoryChartType === 'bar') {
        option.series[0].type = 'bar';
        option.series[0].radius = null;
        option.series[0].center = null;
        option.xAxis = {
          type: 'category',
          data: this.categories
        };
        option.yAxis = {
          type: 'value'
        };
        delete option.series[0].radius;
        delete option.series[0].center;
      }
      
      this.categoryChart.setOption(option);
    },
    
    // 更新维修状态分布图
    updateStatusChart() {
      const statusCount = {};
      this.statuses.forEach(status => {
        statusCount[status] = this.filteredRepairs.filter(r => r.status === status).length;
      });
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: this.statuses
        },
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
        series: [
          {
            name: '维修状态',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['50%', '45%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              formatter: '{b}: {c}'
            },
            data: this.statuses.map(status => ({
              value: statusCount[status],
              name: status
            }))
          }
        ]
      };
      
      this.statusChart.setOption(option);
    },
    
    // 更新楼栋报修情况图
    updateBuildingChart() {
      const buildingCount = {};
      this.buildings.forEach(building => {
        buildingCount[building] = this.filteredRepairs.filter(r => r.building === building).length;
      });
      
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
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.buildings
        },
        series: [
          {
            name: '报修数量',
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            data: this.buildings.map(building => buildingCount[building])
          }
        ]
      };
      
      this.buildingChart.setOption(option);
    },
    
    // 更新报修时间趋势图
    updateTrendChart() {
      // 按时间单位分组数据
      const dateMap = {};
      const startDate = new Date(this.selectedDateRange[0]);
      const endDate = new Date(this.selectedDateRange[1]);
      
      // 生成日期序列
      const dateArray = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        let key;
        if (this.timeUnit === 'day') {
          key = currentDate.toISOString().split('T')[0];
        } else if (this.timeUnit === 'week') {
          const year = currentDate.getFullYear();
          const week = this.getWeekNumber(currentDate);
          key = `${year}-W${week}`;
        } else {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;
          key = `${year}-${month.toString().padStart(2, '0')}`;
        }
        
        dateMap[key] = 0;
        dateArray.push(key);
        
        // 增加日期
        if (this.timeUnit === 'day') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (this.timeUnit === 'week') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
      
      // 统计每个时间段的报修数量
      this.filteredRepairs.forEach(repair => {
        const repairDate = new Date(repair.date);
        let key;
        
        if (this.timeUnit === 'day') {
          key = repair.date;
        } else if (this.timeUnit === 'week') {
          key = `${repairDate.getFullYear()}-W${this.getWeekNumber(repairDate)}`;
        } else {
          key = `${repairDate.getFullYear()}-${(repairDate.getMonth() + 1).toString().padStart(2, '0')}`;
        }
        
       if (Object.prototype.hasOwnProperty.call(dateMap, key)) {
        dateMap[key]++;
        }
      });
      
      const data = dateArray.map(date => dateMap[date]);
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dateArray
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
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
              ])
            },
            itemStyle: {
              color: '#5470c6'
            },
            data: data
          }
        ]
      };
      
      this.trendChart.setOption(option);
    },
    
    // 更新维修工工作情况图
    updateWorkerChart() {
      const workerData = {};
      
      // 初始化每个维修工的数据
      this.workers.forEach(worker => {
        workerData[worker.name] = {
          total: 0,
          pending: 0,
          completed: 0,
          canceled: 0,
          transferred: 0
        };
      });
      
      // 统计每个维修工的工作情况
      this.filteredRepairs.forEach(repair => {
        if (workerData[repair.worker]) {
          workerData[repair.worker].total++;
          
          if (repair.status === '待维修') workerData[repair.worker].pending++;
          if (repair.status === '已维修') workerData[repair.worker].completed++;
          if (repair.status === '已取消') workerData[repair.worker].canceled++;
          if (repair.status === '已转接服务商') workerData[repair.worker].transferred++;
        }
      });
      
      const workerNames = this.workers.map(w => w.name);
      const totalData = workerNames.map(name => workerData[name].total);
      const completedData = workerNames.map(name => workerData[name].completed);
      const pendingData = workerNames.map(name => workerData[name].pending);
      const canceledData = workerNames.map(name => workerData[name].canceled);
      const transferredData = workerNames.map(name => workerData[name].transferred);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['总报修', '已完成', '待维修', '已取消', '已转接']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: workerNames
        },
        series: [
          {
            name: '总报修',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: totalData
          },
          {
            name: '已完成',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: completedData,
            itemStyle: {
              color: '#91cc75'
            }
          },
          {
            name: '待维修',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: pendingData,
            itemStyle: {
              color: '#5470c6'
            }
          },
          {
            name: '已取消',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: canceledData,
            itemStyle: {
              color: '#fac858'
            }
          },
          {
            name: '已转接',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: transferredData,
            itemStyle: {
              color: '#ee6666'
            }
          }
        ]
      };
      
      this.workerChart.setOption(option);
    },
    
    // 辅助方法：获取周数
    getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return weekNo;
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 10px;
  background-color: rgb(244,246,249);
  min-height: 100vh;
  overflow-y: auto;
  height: auto;
}
.el-col .el-col-19 {
    width: 85%!important;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.header h1 i {
  margin-right: 10px;
  font-size: 28px;
}

.filters {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.filter-item label {
  font-weight: 500;
  min-width: 70px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 120px;
}

.stat-card.total {
  border-left: 4px solid #1a73e8;
}

.stat-card.pending {
  border-left: 4px solid #f56c6c;
}

.stat-card.completed {
  border-left: 4px solid #67c23a;
}

.stat-card.worker {
  border-left: 4px solid #e6a23c;
}

.stat-card .icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
}

.stat-card.total .icon {
  background: rgba(26, 115, 232, 0.1);
  color: #1a73e8;
}

.stat-card.pending .icon {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.stat-card.completed .icon {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.stat-card.worker .icon {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.stat-card .content .value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-card .content .label {
  font-size: 14px;
  color: #909399;
}

.charts-container {
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin: 0;
}

.chart-header h3 i {
  margin-right: 8px;
  color: #1a73e8;
}

.chart-wrapper {
  flex: 1;
  padding: 10px;
}

.chart {
  width: 100%;
  height: 100%;
}

.el-select {
  width: 75%;
}

@media (max-width: 992px) {
  .el-col {
    margin-bottom: 20px;
  }
  
  .chart-card {
    height: 350px;
  }
}
</style>