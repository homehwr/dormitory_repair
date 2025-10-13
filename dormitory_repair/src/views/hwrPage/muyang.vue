<template>
  <div class="container">
    <div class="header">
      <div class="studio-info">
        <div class="logo">
          <img src="./13.jpg" alt="" style="width: 100%; border-radius: 15px;">
        </div>
        <div class="titles">
          <h1>赣南师范大学沐阳工作室</h1>
          <h2>第八期创享班学员数据可视化</h2>
          <p class="slogan">心中有阳光，脚下有力量</p>
        </div>
      </div>
      
      <div class="badge-container">
        <div class="badge">
          <i class="fas fa-trophy"></i>教育部日新卓越高校辅导员名师工作室
        </div>
        <div class="badge">
          <i class="fas fa-star"></i>江西省教育系统劳模创新工作室
        </div>
        <div class="badge">
          <i class="fas fa-heart"></i>围绕学生 关照学生 服务学生
        </div>
      </div>
    </div>
    
    <div class="stats-container">
      <div class="stat-card">
        <h3><i class="fas fa-university"></i> 学院分布</h3>
        <div class="chart-container">
          <canvas ref="collegeChart"></canvas>
        </div>
      </div>
      
      <div class="stat-card">
        <h3><i class="fas fa-book"></i> 专业分布</h3>
        <div class="chart-container">
          <canvas ref="majorChart"></canvas>
        </div>
      </div>
      
      <div class="stat-card">
        <h3><i class="fas fa-users"></i> 部门分布</h3>
        <div class="chart-container">
          <canvas ref="departmentChart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <div class="table-header">
        <h3>第八期创享班学员名单 (共{{ filteredStudents.length }}人)</h3>
        <div class="search-box">
          <input type="text" v-model="searchTerm" placeholder="搜索姓名、学院或专业...">
          <i class="fas fa-search"></i>
        </div>
      </div>
      
      <div class="table-responsive">
        <table id="studentsTable">
          <thead>
            <tr>
              <th @click="sortBy('id')">序号 
                <i v-if="sortField === 'id'" class="fas" 
                  :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fas fa-sort"></i>
              </th>
              <th @click="sortBy('name')">姓名 
                <i v-if="sortField === 'name'" class="fas" 
                  :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fas fa-sort"></i>
              </th>
              <th @click="sortBy('department')">部门 
                <i v-if="sortField === 'department'" class="fas" 
                  :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fas fa-sort"></i>
              </th>
              <th @click="sortBy('college')">学院 
                <i v-if="sortField === 'college'" class="fas" 
                  :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fas fa-sort"></i>
              </th>
              <th @click="sortBy('major')">专业 
                <i v-if="sortField === 'major'" class="fas" 
                  :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fas fa-sort"></i>
              </th>
              <th @click="sortBy('grade')">年级 
                <i v-if="sortField === 'grade'" class="fas" 
                  :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fas fa-sort"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in sortedStudents" :key="student.id">
              <td>{{ student.id }}</td>
              <td>{{ student.name }}</td>
              <td>
                <span class="department-badge" :style="{ background: departmentColors[student.department] }">
                  {{ student.department }}
                </span>
              </td>
              <td>{{ student.college }}</td>
              <td>{{ student.major }}</td>
              <td>{{ student.grade }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="footer">
      <p>总编室〔2025〕005 号 | 沐阳工作室第八期创享班学员招募决定</p>
      <p>© 2025 赣南师范大学沐阳工作室技术部 | 2025年8月22日</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'StudentDataVisualization',
  data() {
    return {
      students: [
        {id: 1, name: "聂冉", department: "影像部", college: "经济管理与法学学院", major: "金融学", grade: "25级"},
        {id: 2, name: "许宁玲", department: "影像部", college: "生命科学学院", major: "生物科学", grade: "25级"},
        {id: 3, name: "程嘉怡", department: "影像部", college: "经济管理与法学学院", major: "金融学", grade: "24级"},
        {id: 4, name: "邓新越", department: "影像部", college: "地理与环境工程学院", major: "地理信息科学", grade: "25级"},
        {id: 5, name: "徐梦", department: "影像部", college: "美术与设计学院", major: "美术学", grade: "25级"},
        {id: 6, name: "叶梦昵", department: "影像部", college: "经济管理与法学学院", major: "金融学", grade: "25级"},
        {id: 7, name: "梁嘉仪", department: "影像部", college: "马克思主义学院", major: "思想政治教育", grade: "25级"},
        {id: 8, name: "刘炎炎", department: "影像部", college: "外国语学院", major: "英语学", grade: "24级"},
        {id: 9, name: "曾芳", department: "影像部", college: "文学院", major: "汉语国际教育", grade: "24级"},
        {id: 10, name: "郭名芳", department: "影像部", college: "外国语学院", major: "英语学师范", grade: "25级"},
        {id: 11, name: "夏紫钰", department: "影像部", college: "物理与电子信息学院", major: "电气工程及自动化", grade: "25级"},
        {id: 12, name: "蓝博", department: "人事部", college: "经济管理与法学学院", major: "金融学", grade: "25级"},
        {id: 13, name: "郭蕊", department: "人事部", college: "教育科学学院", major: "教育学", grade: "25级"},
        {id: 14, name: "刘霜霜", department: "运营部", college: "物理与电子信息学院", major: "物理学", grade: "23级"},
        {id: 15, name: "李钧泓", department: "运营部", college: "美术与设计学院", major: "数字媒体艺术专业", grade: "25级"},
        {id: 16, name: "方薛美瑶", department: "运营部", college: "智能制造与未来能源学院", major: "复合材料成型工程专业", grade: "25级"},
        {id: 17, name: "缪欣怡", department: "编辑部", college: "美术与设计学院", major: "美术学", grade: "25级"},
        {id: 18, name: "魏紫涵", department: "编辑部", college: "文学与新闻传播学院", major: "汉语言文学", grade: "24级"},
        {id: 19, name: "潘文佳", department: "编辑部", college: "数学与计算机科学学院", major: "数学与应用数学", grade: "24级"},
        {id: 20, name: "王心怡", department: "编辑部", college: "美术与设计学院", major: "数字媒体艺术", grade: "25级"},
        {id: 21, name: "陈梓彤", department: "美工部", college: "美术与设计学院", major: "美术学", grade: "25级"},
        {id: 22, name: "胡鹤玲", department: "美工部", college: "美术与设计学院", major: "美术学", grade: "25级"},
        {id: 23, name: "施雨娜", department: "美工部", college: "美术与设计学院", major: "产品设计", grade: "25级"},
        {id: 24, name: "向思雨", department: "美工部", college: "美术与设计学院", major: "产品设计", grade: "25级"},
        {id: 25, name: "徐菁颖", department: "美工部", college: "美术与设计学院", major: "数字媒体艺术", grade: "25级"},
        {id: 26, name: "李斯婷", department: "美工部", college: "美术与设计学院", major: "数字媒体艺术", grade: "25级"},
        {id: 27, name: "刘念琪", department: "青音部", college: "文学与新闻传播学院", major: "播音与主持艺术", grade: "25级"},
        {id: 28, name: "吕聪", department: "青音部", college: "外国语学院", major: "商务英语", grade: "25级"},
        {id: 29, name: "郭桂珍", department: "职引部", college: "外国语学院", major: "英语学师范", grade: "24级"},
        {id: 30, name: "孙珈珺", department: "技术部", college: "地理与环境工程学院", major: "环境科学", grade: "24级"}
      ],
      searchTerm: '',
      departmentColors: {
        "影像部": "#FF6B6B",
        "人事部": "#4ECDC4",
        "运营部": "#FFD166",
        "编辑部": "#6A0572",
        "美工部": "#118AB2",
        "青音部": "#06D6A0",
        "职引部": "#FF9F1C",
        "技术部": "#073B4C"
      },
      currentDate: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      sortField: 'id',
      sortDirection: 'asc'
    }
  },
  computed: {
    filteredStudents() {
      if (!this.searchTerm) return this.students;
      const term = this.searchTerm.toLowerCase();
      return this.students.filter(student => 
        student.name.toLowerCase().includes(term) ||
        student.college.toLowerCase().includes(term) ||
        student.major.toLowerCase().includes(term)
      );
    },
    sortedStudents() {
      const students = this.filteredStudents.slice();
      return students.sort((a, b) => {
        let modifier = 1;
        if (this.sortDirection === 'desc') modifier = -1;
        
        if (a[this.sortField] < b[this.sortField]) return -1 * modifier;
        if (a[this.sortField] > b[this.sortField]) return 1 * modifier;
        return 0;
      });
    }
  },
  beforeCreate(){
    document.title = "沐阳工作室第八期创享班学员数据可视化";
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      // 学院分布图
      const collegeCtx = this.$refs.collegeChart;
      new Chart(collegeCtx, {
        type: 'doughnut',
        data: {
          labels: ['美术与设计学院', '经济管理与法学学院', '外国语学院', '其他学院'],
          datasets: [{
            data: [10, 5, 4, 11],
            backgroundColor: ['#6a11cb', '#2575fc', '#8c14fc', '#2a9fd6'],
            borderWidth: 0,
            hoverOffset: 20
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 14
                },
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 15,
              titleFont: {
                size: 16
              },
              bodyFont: {
                size: 14
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
      
      // 专业分布图
      const majorCtx = this.$refs.majorChart;
      new Chart(majorCtx, {
        type: 'pie',
        data: {
          labels: ['美术学', '金融学', '英语相关', '数字媒体艺术', '其他专业'],
          datasets: [{
            data: [7, 4, 4, 3, 12],
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffd166', '#6a0572', '#118ab2'],
            borderWidth: 0,
            hoverOffset: 20
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 14
                },
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 15,
              titleFont: {
                size: 16
              },
              bodyFont: {
                size: 14
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
      
      // 部门分布图
      const departmentCtx = this.$refs.departmentChart;
      new Chart(departmentCtx, {
        type: 'bar',
        data: {
          labels: ['影像部', '美工部', '编辑部', '运营部', '青音部', '人事部', '职引部', '技术部'],
          datasets: [{
            label: '人数',
            data: [11, 6, 4, 3, 2, 2, 1, 1],
            backgroundColor: ['#FF6B6B', '#118AB2', '#6A0572', '#FFD166', '#06D6A0', '#4ECDC4', '#FF9F1C', '#073B4C'],
            borderWidth: 0,
            borderRadius: 10,
            hoverBackgroundColor: ['#ff5252', '#0d7ea6', '#5a0469', '#ffca28', '#00c853', '#36b3a9', '#ff8f00', '#052c3d']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 15,
              titleFont: {
                size: 16
              },
              bodyFont: {
                size: 14
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false
              },
              ticks: {
                font: {
                  size: 13
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 13
                }
              }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%);
  color: #2c3e50;
  min-height: 100vh;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  padding: 40px 0;
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  overflow: hidden;
  animation: headerSlide 1s ease-out;
}

.header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(to right, #ffd700, #ff8c00);
}

.studio-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.logo {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ffd700;
  box-shadow: 0 0 0 10px rgba(255, 215, 0, 0.2);
}

.sun {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ff8c00;
}

.rays {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.rays::before, .rays::after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  background: #ffd700;
  transform: translateX(-50%);
}

.rays::after {
  transform: translateX(-50%) rotate(90deg);
}

.titles h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
  text-shadow: 0 3px 6px rgba(0,0,0,0.2);
  font-weight: 800;
  letter-spacing: 1.5px;
}

.titles h2 {
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 10px;
  opacity: 0.95;
}

.slogan {
  font-size: 1.4rem;
  font-weight: 300;
  font-style: italic;
}

.badge-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 18px 30px;
  font-size: 1.2rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.badge:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.badge i {
  font-size: 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: transform 0.4s, box-shadow 0.4s;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.12);
}

.stat-card h3 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 18px;
}

.chart-container {
  height: 320px;
  position: relative;
  margin-top: 15px;
}

.table-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  margin: 50px 0;
  animation: fadeIn 1.2s ease-out;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.search-box {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #f8f9fa;
  padding: 15px 25px;
  border-radius: 50px;
  border: 1px solid #dee2e6;
  transition: box-shadow 0.3s;
}

.search-box:focus-within {
  box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.2);
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.05rem;
  min-width: 280px;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

th {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  padding: 18px 15px;
  text-align: left;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: background 0.3s;
}

th:hover {
  background: linear-gradient(to right, #5a0fb8, #1c64d6);
}

tr {
  transition: background 0.3s;
}

tr:nth-child(even) {
  background-color: #f9f9fc;
}

tr:hover {
  background-color: #f1f3ff;
}

td {
  padding: 15px;
  border-bottom: 1px solid #eaecef;
}

.department-badge {
  display: inline-block;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
}

.footer {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 1rem;
  margin-top: 30px;
  border-top: 1px solid #eaecef;
}

/* Animations */
@keyframes headerSlide {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive styles */
@media (max-width: 992px) {
  .titles h1 {
    font-size: 2.4rem;
  }
  
  .titles h2 {
    font-size: 1.5rem;
  }
  
  .badge {
    font-size: 1.1rem;
    padding: 15px 20px;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .studio-info {
    flex-direction: column;
    text-align: center;
  }
  
  .titles h1 {
    font-size: 2.0rem;
  }
  
  .titles h2 {
    font-size: 1.3rem;
  }
  
  .badge {
    font-size: 1rem;
    padding: 12px 18px;
  }
  
  .search-box input {
    min-width: 200px;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 576px) {
  .header {
    padding: 30px 0;
  }
  
  .titles h1 {
    font-size: 1.8rem;
  }
  
  .badge-container {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .badge {
    width: 100%;
    justify-content: center;
  }
  
  .search-box input {
    min-width: 100%;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .controls, .animation-controls {
    flex-direction: column;
  }
  
  .control-btn, .animation-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>