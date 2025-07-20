<template>
  <div class="dashboard-container">
    <!-- 标题和筛选区域 -->
    <div class="header">
      <h1>宿舍报修系统数据分析平台</h1>
      <div class="filters">
        <div class="filter-item">
          <label>时间范围：</label>
          <select v-model="timeRange">
            <option value="week">最近一周</option>
            <option value="month">最近一月</option>
            <option value="quarter">最近三月</option>
            <option value="year">最近一年</option>
          </select>
        </div>
        <div class="filter-item">
          <label>楼栋筛选：</label>
          <select v-model="selectedBuilding" multiple>
            <option value="all">全部楼栋</option>
            <option v-for="building in buildings" :key="building" :value="building">{{ building }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label>维修状态：</label>
          <select v-model="selectedStatus" multiple>
            <option value="all">全部状态</option>
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
        <button class="apply-btn" @click="applyFilters">应用筛选</button>
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
    </div>

    <!-- 数据摘要卡片 -->
    <div class="summary-cards">
      <div class="card">
        <div class="card-icon total">
          <i class="fas fa-tools"></i>
        </div>
        <div class="card-content">
          <h3>总报修量</h3>
          <p>{{ summary.totalRepairs }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="card-content">
          <h3>待维修</h3>
          <p>{{ summary.pendingRepairs }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon completed">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="card-content">
          <h3>已维修</h3>
          <p>{{ summary.completedRepairs }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon workers">
          <i class="fas fa-user-cog"></i>
        </div>
        <div class="card-content">
          <h3>维修工数量</h3>
          <p>{{ summary.totalWorkers }}</p>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 报修类别分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>报修类别分布</h3>
          <div class="chart-actions">
            <button @click="toggleChartType('category')">切换图表</button>
          </div>
        </div>
        <div class="chart-container">
          <div v-if="categoryChartType === 'pie'" id="category-pie-chart" class="chart"></div>
          <div v-else id="category-bar-chart" class="chart"></div>
        </div>
      </div>

      <!-- 报修状态分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>报修状态分布</h3>
          <div class="chart-actions">
            <button @click="toggleChartType('status')">切换图表</button>
          </div>
        </div>
        <div class="chart-container">
          <div id="status-chart" class="chart"></div>
        </div>
      </div>

      <!-- 楼栋报修数量 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>楼栋报修数量</h3>
          <div class="chart-actions">
            <button @click="sortBuildings('count')">按数量排序</button>
            <button @click="sortBuildings('name')">按名称排序</button>
          </div>
        </div>
        <div class="chart-container">
          <div id="building-chart" class="chart"></div>
        </div>
      </div>

      <!-- 维修工工作量 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>维修工工作量</h3>
          <div class="chart-actions">
            <button @click="sortWorkers('total')">按总量排序</button>
            <button @click="sortWorkers('pending')">按待处理排序</button>
          </div>
        </div>
        <div class="chart-container">
          <div id="worker-chart" class="chart"></div>
        </div>
      </div>

      <!-- 报修时间趋势 -->
      <div class="chart-card full-width">
        <div class="chart-header">
          <h3>报修时间趋势</h3>
          <div class="chart-actions">
            <select v-model="trendType">
              <option value="daily">按日</option>
              <option value="weekly">按周</option>
              <option value="monthly">按月</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <div id="trend-chart" class="chart"></div>
        </div>
      </div>

      <!-- 热门报修问题 -->
      <div class="chart-card full-width">
        <div class="chart-header">
          <h3>热门报修问题</h3>
          <div class="chart-actions">
            <input type="text" v-model="searchTerm" placeholder="搜索问题...">
          </div>
        </div>
        <div class="chart-container">
          <div id="issue-chart" class="chart"></div>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="data-table">
      <h3>报修记录详情</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th @click="sortTable('id')">ID</th>
              <th @click="sortTable('building')">楼栋</th>
              <th @click="sortTable('category')">类别</th>
              <th @click="sortTable('status')">状态</th>
              <th @click="sortTable('time')">报修时间</th>
              <th>问题描述</th>
              <th @click="sortTable('worker')">维修工</th>
              <th @click="sortTable('reporter')">报修人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in paginatedRecords" :key="index">
              <td>{{ record.id }}</td>
              <td>{{ record.building }}</td>
              <td>
                <span :class="['category-tag', getCategoryClass(record.category)]">{{ record.category }}</span>
              </td>
              <td>
                <span :class="['status-tag', getStatusClass(record.status)]">{{ record.status }}</span>
              </td>
              <td>{{ formatDate(record.time) }}</td>
              <td class="description-cell">{{ record.description }}</td>
              <td>{{ record.worker }}</td>
              <td>{{ record.reporter }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      // 筛选条件
      timeRange: 'month',
      selectedBuilding: ['all'],
      selectedStatus: ['all'],
      
      // 图表类型控制
      categoryChartType: 'pie',
      statusChartType: 'bar',
      trendType: 'daily',
      searchTerm: '',
      
      // 排序控制
      sortColumn: 'time',
      sortDirection: 'desc',
      
      // 分页控制
      currentPage: 1,
      pageSize: 10,
      
      // 数据摘要
      summary: {
        totalRepairs: 0,
        pendingRepairs: 0,
        completedRepairs: 0,
        totalWorkers: 0
      },
      
      // 模拟数据
      buildings: ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋'],
      categories: ['空调', '热水', '网络', '其他维修'],
      statuses: ['待维修', '已维修', '已取消', '已转接服务商'],
      workers: ['张三', '李四', '王五', '赵六', '钱七', '孙八'],
      
      // 报修记录数据
      repairRecords: [],
      filteredRecords: [],
      
      // 图表实例
      categoryPieChart: null,
      categoryBarChart: null,
      statusChart: null,
      buildingChart: null,
      workerChart: null,
      trendChart: null,
      issueChart: null
    };
  },
  computed: {
    // 计算总页数
    totalPages() {
      return Math.ceil(this.filteredRecords.length / this.pageSize);
    },
    
    // 获取当前页的数据
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredRecords.slice(start, end);
    },
    
    // 获取当前筛选条件下的数据
    filteredData() {
      let result = [...this.repairRecords];
      
      // 楼栋筛选
      if (!this.selectedBuilding.includes('all') && this.selectedBuilding.length > 0) {
        result = result.filter(record => this.selectedBuilding.includes(record.building));
      }
      
      // 状态筛选
      if (!this.selectedStatus.includes('all') && this.selectedStatus.length > 0) {
        result = result.filter(record => this.selectedStatus.includes(record.status));
      }
      
      // 时间范围筛选
      const now = new Date();
      let minDate = new Date();
      
      switch(this.timeRange) {
        case 'week':
          minDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          minDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          minDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          minDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      result = result.filter(record => {
        const recordDate = new Date(record.time);
        return recordDate >= minDate;
      });
      
      return result;
    }
  },
  watch: {
    // 当筛选条件变化时更新数据和图表
    filteredData() {
      this.updateSummary();
      this.renderCharts();
    },
    
    // 当趋势类型变化时更新趋势图
    trendType() {
      this.renderTrendChart();
    },
    
    // 当搜索词变化时更新问题图表
    searchTerm() {
      this.renderIssueChart();
    }
  },
  created() {
    // 初始化模拟数据
    this.generateMockData();
  },
  mounted() {
    // 初始化图表
    this.initCharts();
    // 渲染初始数据
    this.applyFilters();
  },
  methods: {
    // 生成模拟数据
    generateMockData() {
      const records = [];
      const workerBuildings = {
        '张三': ['1栋', '2栋'],
        '李四': ['3栋', '4栋'],
        '王五': ['5栋', '6栋'],
        '赵六': ['7栋', '8栋'],
        '钱七': ['1栋', '3栋', '5栋'],
        '孙八': ['2栋', '4栋', '6栋']
      };
      
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      
      for (let i = 1; i <= 300; i++) {
        const building = this.buildings[Math.floor(Math.random() * this.buildings.length)];
        const category = this.categories[Math.floor(Math.random() * this.categories.length)];
        const status = this.statuses[Math.floor(Math.random() * this.statuses.length)];
        
        // 根据状态分配维修工
        let worker = '无';
        if (status === '待维修' || status === '已维修') {
          const possibleWorkers = Object.keys(workerBuildings).filter(
            w => workerBuildings[w].includes(building)
          );
          if (possibleWorkers.length > 0) {
            worker = possibleWorkers[Math.floor(Math.random() * possibleWorkers.length)];
          }
        }
        
        // 生成随机时间
        const timeOffset = Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000);
        const time = new Date(startDate.getTime() + timeOffset);
        
        // 生成问题描述
        const descriptions = {
          '空调': ['空调不制冷', '空调噪音大', '空调漏水', '空调遥控器失灵'],
          '热水': ['热水器不工作', '水温不稳定', '热水器漏水', '没有热水'],
          '网络': ['无法连接网络', '网速慢', '频繁断网', '路由器故障'],
          '其他维修': ['门窗损坏', '灯管不亮', '水管漏水', '插座故障']
        };
        
        const description = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
        
        records.push({
          id: i,
          building,
          category,
          status,
          time,
          description,
          worker,
          reporter: `学生${Math.floor(Math.random() * 1000)}`
        });
      }
      
      this.repairRecords = records;
      this.filteredRecords = [...records];
    },
    
    // 初始化图表
    initCharts() {
      this.categoryPieChart = echarts.init(document.getElementById('category-pie-chart'));
      this.categoryBarChart = echarts.init(document.getElementById('category-bar-chart'));
      this.statusChart = echarts.init(document.getElementById('status-chart'));
      this.buildingChart = echarts.init(document.getElementById('building-chart'));
      this.workerChart = echarts.init(document.getElementById('worker-chart'));
      this.trendChart = echarts.init(document.getElementById('trend-chart'));
      this.issueChart = echarts.init(document.getElementById('issue-chart'));
      
      // 窗口大小变化时重绘图表
      window.addEventListener('resize', () => {
        this.categoryPieChart.resize();
        this.categoryBarChart.resize();
        this.statusChart.resize();
        this.buildingChart.resize();
        this.workerChart.resize();
        this.trendChart.resize();
        this.issueChart.resize();
      });
    },
    
    // 更新摘要数据
    updateSummary() {
      this.summary.totalRepairs = this.filteredData.length;
      this.summary.pendingRepairs = this.filteredData.filter(r => r.status === '待维修').length;
      this.summary.completedRepairs = this.filteredData.filter(r => r.status === '已维修').length;
      this.summary.totalWorkers = new Set(this.filteredData.map(r => r.worker).filter(w => w !== '无')).size;
    },
    
    // 渲染所有图表
    renderCharts() {
      this.renderCategoryChart();
      this.renderStatusChart();
      this.renderBuildingChart();
      this.renderWorkerChart();
      this.renderTrendChart();
      this.renderIssueChart();
    },
    
    // 渲染报修类别图表
    renderCategoryChart() {
      // 按类别分组
      const categoryCounts = this.categories.map(category => {
        return {
          name: category,
          value: this.filteredData.filter(r => r.category === category).length
        };
      });
      
      // 饼图配置
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: this.categories
        },
        series: [
          {
            name: '报修类别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
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
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: categoryCounts
          }
        ]
      };
      
      // 柱状图配置
      const barOption = {
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
          type: 'category',
          data: this.categories,
          axisLabel: {
            interval: 0,
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '报修数量'
        },
        series: [
          {
            name: '报修数量',
            type: 'bar',
            barWidth: '60%',
            data: categoryCounts.map(item => item.value)
          }
        ]
      };
      
      // 根据当前选择的图表类型渲染
      if (this.categoryChartType === 'pie') {
        this.categoryPieChart.setOption(pieOption);
      } else {
        this.categoryBarChart.setOption(barOption);
      }
    },
    
    // 渲染报修状态图表
    renderStatusChart() {
      // 按状态分组
      const statusCounts = this.statuses.map(status => {
        return this.filteredData.filter(r => r.status === status).length;
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
          type: 'category',
          data: this.statuses,
          axisLabel: {
            interval: 0,
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '报修数量'
        },
        series: [
          {
            name: '报修状态',
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
              color: (params) => {
                const colors = {
                  '待维修': '#5470C6',
                  '已维修': '#91CC75',
                  '已取消': '#EE6666',
                  '已转接服务商': '#FAC858'
                };
                return colors[this.statuses[params.dataIndex]];
              }
            },
            data: statusCounts
          }
        ]
      };
      
      this.statusChart.setOption(option);
    },
    
    // 渲染楼栋报修图表
    renderBuildingChart() {
      // 按楼栋分组
      const buildingCounts = this.buildings.map(building => {
        return {
          name: building,
          value: this.filteredData.filter(r => r.building === building).length
        };
      });
      
      // 按数量排序
      buildingCounts.sort((a, b) => b.value - a.value);
      
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
          type: 'value',
          name: '报修数量'
        },
        yAxis: {
          type: 'category',
          data: buildingCounts.map(item => item.name),
          inverse: true
        },
        series: [
          {
            name: '报修数量',
            type: 'bar',
            data: buildingCounts.map(item => item.value),
            itemStyle: {
              color: (params) => {
                // 使用渐变色
                const colorList = [
                  ['#5470C6', '#91CC75'],
                  ['#73C0DE', '#73DE9F'],
                  ['#EE6666', '#FAC858'],
                  ['#3BA272', '#9A60B4']
                ];
                const index = params.dataIndex % colorList.length;
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colorList[index][0] },
                  { offset: 1, color: colorList[index][1] }
                ]);
              }
            }
          }
        ]
      };
      
      this.buildingChart.setOption(option);
    },
    
    // 渲染维修工工作量图表
    renderWorkerChart() {
      // 按维修工分组
      const workerData = {};
      this.filteredData.forEach(record => {
        if (record.worker !== '无') {
          if (!workerData[record.worker]) {
            workerData[record.worker] = {
              total: 0,
              pending: 0,
              completed: 0
            };
          }
          workerData[record.worker].total++;
          if (record.status === '待维修') workerData[record.worker].pending++;
          if (record.status === '已维修') workerData[record.worker].completed++;
        }
      });
      
      // 转换为数组并排序
      const workers = Object.keys(workerData);
      let workerStats = workers.map(worker => ({
        name: worker,
        total: workerData[worker].total,
        pending: workerData[worker].pending,
        completed: workerData[worker].completed
      }));
      
      // 按总量排序
      workerStats.sort((a, b) => b.total - a.total);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            const data = params[0].data;
            return `${data.name}<br/>
            总报修: ${data.total}<br/>
            待处理: ${data.pending}<br/>
            已完成: ${data.completed}`;
          }
        },
        legend: {
          data: ['总报修', '待处理', '已完成']
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
          data: workerStats.map(item => item.name),
          inverse: true
        },
        series: [
          {
            name: '总报修',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: workerStats.map(item => item.total)
          },
          {
            name: '待处理',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: workerStats.map(item => item.pending)
          },
          {
            name: '已完成',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: workerStats.map(item => item.completed)
          }
        ]
      };
      
      this.workerChart.setOption(option);
    },
    
    // 渲染报修趋势图表
    renderTrendChart() {
      // 生成日期数据
      const now = new Date();
      let dates = [];
      let data = [];
      
      if (this.trendType === 'daily') {
        // 最近30天
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
          dates.push(dateStr);
          
          // 计算当天的报修数量
          const count = this.filteredData.filter(record => {
            const recordDate = new Date(record.time);
            return recordDate.getDate() === date.getDate() && 
                   recordDate.getMonth() === date.getMonth() && 
                   recordDate.getFullYear() === date.getFullYear();
          }).length;
          
          data.push(count);
        }
      } else if (this.trendType === 'weekly') {
        // 最近12周
        for (let i = 11; i >= 0; i--) {
          const startDate = new Date();
          startDate.setDate(now.getDate() - i * 7 - 6);
          const endDate = new Date();
          endDate.setDate(now.getDate() - i * 7);
          
          const weekStr = `第${Math.floor(i/4)+1}周`;
          dates.push(weekStr);
          
          // 计算当周的报修数量
          const count = this.filteredData.filter(record => {
            const recordDate = new Date(record.time);
            return recordDate >= startDate && recordDate <= endDate;
          }).length;
          
          data.push(count);
        }
      } else {
        // 最近12个月
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(now.getMonth() - i);
          const monthStr = `${date.getFullYear()}-${date.getMonth() + 1}`;
          dates.push(monthStr);
          
          // 计算当月的报修数量
          const count = this.filteredData.filter(record => {
            const recordDate = new Date(record.time);
            return recordDate.getMonth() === date.getMonth() && 
                   recordDate.getFullYear() === date.getFullYear();
          }).length;
          
          data.push(count);
        }
      }
      
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
          data: dates
        },
        yAxis: {
          type: 'value',
          name: '报修数量'
        },
        series: [
          {
            name: '报修数量',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 3
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(84, 112, 198, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(84, 112, 198, 0.1)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: data
          }
        ]
      };
      
      this.trendChart.setOption(option);
    },
    
    // 渲染热门问题图表
    renderIssueChart() {
      // 收集问题描述
      const issueCounts = {};
      
      this.filteredData.forEach(record => {
        // 如果搜索词不为空，只统计包含搜索词的问题
        if (this.searchTerm && !record.description.includes(this.searchTerm)) {
          return;
        }
        
        if (!issueCounts[record.description]) {
          issueCounts[record.description] = 0;
        }
        issueCounts[record.description]++;
      });
      
      // 转换为数组并排序
      let issues = Object.keys(issueCounts).map(desc => ({
        desc,
        count: issueCounts[desc]
      }));
      
      issues.sort((a, b) => b.count - a.count);
      
      // 只取前10个
      issues = issues.slice(0, 10);
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '出现次数'
        },
        yAxis: {
          type: 'category',
          data: issues.map(item => item.desc),
          inverse: true
        },
        series: [
          {
            name: '出现次数',
            type: 'bar',
            data: issues.map(item => item.count),
            itemStyle: {
              color: (params) => {
                // 使用渐变色
                const colorList = [
                  ['#5470C6', '#91CC75'],
                  ['#73C0DE', '#73DE9F'],
                  ['#EE6666', '#FAC858'],
                  ['#3BA272', '#9A60B4']
                ];
                const index = params.dataIndex % colorList.length;
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colorList[index][0] },
                  { offset: 1, color: colorList[index][1] }
                ]);
              }
            }
          }
        ]
      };
      
      this.issueChart.setOption(option);
    },
    
    // 切换报修类别图表类型
    toggleChartType(type) {
      if (type === 'category') {
        this.categoryChartType = this.categoryChartType === 'pie' ? 'bar' : 'pie';
        this.renderCategoryChart();
      }
    },
    
    // 楼栋排序
    sortBuildings(type) {
      // 实际应用中需要实现排序逻辑
      this.renderBuildingChart();
    },
    
    // 维修工排序
    sortWorkers(type) {
      // 实际应用中需要实现排序逻辑
      this.renderWorkerChart();
    },
    
    // 表格排序
    sortTable(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      
      this.filteredRecords.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        
        if (column === 'time') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      
      this.currentPage = 1;
    },
    
    // 获取类别标签类名
    getCategoryClass(category) {
      return {
        '空调': 'category-aircon',
        '热水': 'category-water',
        '网络': 'category-network',
        '其他维修': 'category-other'
      }[category];
    },
    
    // 获取状态标签类名
    getStatusClass(status) {
      return {
        '待维修': 'status-pending',
        '已维修': 'status-completed',
        '已取消': 'status-cancelled',
        '已转接服务商': 'status-transferred'
      }[status];
    },
    
    // 应用筛选条件
    applyFilters() {
      this.filteredRecords = this.filteredData;
      this.updateSummary();
      this.renderCharts();
      this.currentPage = 1;
    },
    
    // 重置筛选条件
    resetFilters() {
      this.timeRange = 'month';
      this.selectedBuilding = ['all'];
      this.selectedStatus = ['all'];
      this.applyFilters();
    },
    
    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    // 格式化日期
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans SC', sans-serif;
}

.dashboard-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
}

.header {
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 8px;
}

.filter-item label {
  font-size: 14px;
  margin-right: 8px;
  font-weight: 500;
}

.filter-item select {
  background: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  min-width: 120px;
  font-size: 14px;
}

.filter-item select[multiple] {
  min-height: 80px;
  min-width: 150px;
}

.apply-btn, .reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.apply-btn {
  background-color: #4CAF50;
  color: white;
}

.apply-btn:hover {
  background-color: #45a049;
}

.reset-btn {
  background-color: #f44336;
  color: white;
  margin-left: 10px;
}

.reset-btn:hover {
  background-color: #d32f2f;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.card-icon.total {
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
}

.card-icon.pending {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.card-icon.completed {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}

.card-icon.workers {
  background: linear-gradient(135deg, #9C27B0, #6A1B9A);
}

.card-content h3 {
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
}

.card-content p {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h3 {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.chart-actions {
  display: flex;
  gap: 10px;
}

.chart-actions button, .chart-actions select, .chart-actions input {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-actions button:hover {
  background: #e2e8f0;
}

.chart-actions input {
  min-width: 200px;
}

.chart {
  width: 100%;
  height: 300px;
}

.data-table {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.data-table h3 {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin-bottom: 15px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  user-select: none;
}

th:hover {
  background-color: #f1f5f9;
}

tr:hover {
  background-color: #f8f9fa;
}

.category-tag, .status-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.category-aircon {
  background: #e3f2fd;
  color: #1976d2;
}

.category-water {
  background: #e1f5fe;
  color: #0288d1;
}

.category-network {
  background: #e8f5e9;
  color: #388e3c;
}

.category-other {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-pending {
  background: #fff8e1;
  color: #ff8f00;
}

.status-completed {
  background: #e8f5e9;
  color: #388e3c;
}

.status-cancelled {
  background: #ffebee;
  color: #d32f2f;
}

.status-transferred {
  background: #e3f2fd;
  color: #1976d2;
}

.description-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

.pagination button {
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.pagination button:disabled {
  background: #9e9e9e;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #0d47a1;
}

@media (max-width: 1200px) {
  .charts-container {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-item label {
    margin-bottom: 5px;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 250px;
  }
}
</style>