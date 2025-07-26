<template>
  <div class="card_container">
    <el-card v-loading="loading">
      <el-tabs type="border-card">
        <div class="card_header">报修记录查看</div>
        <el-row style="margin: 20px 10px; width: 100%; display: flex">
          <el-col :span="6">
            <span>报修状态：</span>
            <el-select v-model="filterstatus" placeholder="请选择" @change="handleFilterChange">
              <el-option
                v-for="item in status_options"
                :key="item.filterstatus"
                :label="item.label"
                :value="item.filterstatus"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <span>维修师傅：</span>
            <el-input
              v-model="filterWorker"
              placeholder="请输入姓名"
              clearable
              :disabled="isDisabled"
              :style="{ width: '200px' }"
              @input="handleWorkerInput"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>所在区域：</span>
            <el-cascader
              v-model="filterAddress"
              :options="address_options"
              :props="{
                label: 'area',
                value: 'key',
                emitPath: false,
              }"
              @change="handleAddressChange"
            ></el-cascader>
          </el-col>
          <el-col :span="6">
          <span>所在寝室号：</span>
          <el-input
            v-model="filterDormitory"
            placeholder="请输入寝室号"
            clearable
            :style="{ width: '200px' }"
            @input="handleFilterChange"
          ></el-input>
        </el-col>
        </el-row>
        <div v-loading="loading" element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)">
          <el-table :data="currentTableData"  height="650"  style="width: 100% ;" :header-cell-style="{ background: 'rgb(248,249,250)', color: 'rgb(85,85,85)' }">
            <el-table-column fixed prop="num" label="序号" width="50">
              <template #default="scope">
                {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="维修状态" width="140">
              <template #default="{ row }">
                <span :class="['status-tag', getStatusClass(row.status)]">
                {{ formatStatus(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="报修日期" width="150">
              <template #default="{ row }">
                {{ formatDate(row.start_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="报修人" width="120"></el-table-column>
            <el-table-column prop="kind" label="报修类别" width="140">
              <template #default="{ row }" >
                <span :class="['category-tag', getCategoryClass(row.kind)]">
                {{ formatKind(row.kind) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="address1" label="所在苑区" width="180">
              <template #default="{ row }">
                {{ row.address }}-{{ row.address3 }}
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="联系电话" width="180"></el-table-column>
            <el-table-column prop="workerName" label="维修师傅" width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button @click="open(scope.row)" type="primary" size="middle">查看</el-button>
                <el-button @click="edit(scope.row)" type="success" size="middle" v-if="duty == 0">修改</el-button>
                <el-button @click="repaired(scope.row)" type="primary" size="middle" v-else-if="duty == 1 && scope.row.status != 1">已维修</el-button>
                <el-button @click="repairing(scope.row)" type="primary" size="middle" v-else>待维修</el-button>
                <el-button @click="transfer(scope.row)" type="primary" size="middle" v-if="duty == 1 && scope.row.status != 3">转接</el-button>
                <el-button @click="cancelTransfer(scope.row)" type="primary" size="middle" v-if="duty == 1 && scope.row.status == 3">取消转接</el-button>
                <el-button @click="remove(scope.row.id)" type="danger" size="middle" v-if="duty == 0">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredTableData.length"
          ></el-pagination>
          </div>
      </el-tabs>
    </el-card>

    <el-dialog title="报修详情信息" :visible.sync="DetailDialogVisible" width="40%" center style="letter-spacing: 1px;">
      <div class="detail_info"><strong>报修人：</strong>{{ info.name }}</div>
      <br>
      <div class="detail_info"><strong>联系电话:</strong> {{ info.phone }}</div>
      <br>
      <div class="detail_info"><strong>所在寝室: </strong>{{ info.address }} {{ info.address3 }}</div>
      <br>
      <div class="detail_info"><strong>详细信息：</strong></div>
      {{ info.info }}<br><br>
      <img :src="info.info_img" style="max-width: 100%" />
    </el-dialog>

    <el-dialog title="修改报修信息" :visible.sync="editVisible" width="30%">
      <el-form label-width="80px" :model="editbox">
        <el-form-item label="报修人">
          <el-input v-model="editbox.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editbox.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="所在苑区">
          <el-input v-model="editbox.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="寝室号">
          <el-input v-model="editbox.address3" disabled></el-input>
        </el-form-item>
        <el-form-item label="报修日期">
          <el-input v-model="editbox.start_time" disabled></el-input>
        </el-form-item>
        <el-form-item label="报修类别">
          <el-select v-model="editbox.kind" placeholder="请选择">
            <el-option
              v-for="(label, value) in kindMap"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修状态">
          <el-select v-model="editbox.status" placeholder="请选择">
            <el-option
              v-for="(label, value) in statusMap"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修师傅">
          <el-select v-model="editbox.worker_id" placeholder="请选择">
            <el-option
              v-for="item in workersList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editpost">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      loading: false, // 添加loading状态
      isDisabled: false,
      yuan: [],
      lou: [],
      duty: localStorage.getItem("dormitory_duty"),
      name: localStorage.getItem("dormitory_name"),
      dormitory_work_area: localStorage.getItem("dormitory_work_area"),
      workerId: localStorage.getItem("dormitory_workerId"),
      status_options: [
        { filterstatus: -1, label: "全部" },
        { filterstatus: 0, label: "待维修" },
        { filterstatus: 1, label: "已维修" },
        { filterstatus: 2, label: "已取消" },
        { filterstatus: 3, label: "已转对应服务商" },
      ],
      info: "",
      editVisible: false,
      DetailDialogVisible: false,
      editbox: {
      },
      tableData: [],
      address_options: [],
      filterstatus: -1,
      filterWorker: "",
      filterAddress: "",
      filterDormitory: '',
      bian: true,
      pageSize: 10,
      currentPage: 1,
      workersList: {},
      statusMap: {
        0: "待维修",
        1: "已维修",
        2: "已取消",
        3: "已转接对应服务商",
      },
      kindMap: {
        1: "空调",
        2: "热水",
        3: "网络",
        4: "其他维修",
      },
      workerInputTimer: null,
      loading: false, // 新增加载状态
      cacheData: null, // 新增数据缓存
      cacheTimestamp: null, // 新增缓存时间
    };
  },

  computed: {
    // 计算当前分页数据
    currentTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTableData.slice(start, end);
    },

    // 计算属性：筛选后的数据
    filteredTableData() {
      if (!this.tableData.length) return [];
      
      return this.tableData.filter(record => {
        // 状态筛选
        const statusMatch = this.filterstatus === -1 || 
                            Number(record.status) === Number(this.filterstatus);
        
        // 维修师傅筛选
        const workerMatch = !this.filterWorker.trim() || 
                           (record.workerName && 
                            record.workerName.toLowerCase().includes(this.filterWorker.toLowerCase().trim()));
        
        // 寝室号筛选
        const dormitoryMatch = !this.filterDormitory.trim() || 
                              (record.address3 && 
                               record.address3.includes(this.filterDormitory.trim()));
        
        return statusMatch && workerMatch && dormitoryMatch;
      });
    }
  },

  watch: {
    filterstatus() {
      this.handleFilterChange();
    },
    filterWorker() {
      this.handleFilterChange();
    }
  },

  mounted() {
    this.initUser();
    this.fetchData();
    this.getWorkerOptions();
    
  },

  methods: {
    // 初始化用户角色相关设置
    initUser() {
      if (this.duty == 1) {
        this.isDisabled = true;
        this.filterWorker = this.name;
      } else {
        this.filterWorker = "";
      }
    },

    // 获取数据
    async fetchData() {
      // 如果缓存有效且未过期（5分钟内），直接使用缓存数据
      if (this.cacheData && Date.now() - this.cacheTimestamp < 300000) {
        this.tableData = this.cacheData;
        return;
      }
      
      this.loading = true;
      try {
        if (this.duty == 1) {
          // 使用Promise.all并行获取数据
          const [recordsRes, areasRes] = await Promise.all([
            this.$axios.get(`/record/getRecordsByWId?workerId=${this.workerId}`),
            this.$axios.get(`/area/getArea?address=${localStorage.getItem("dormitory_work_area")}`)
          ]);
          
          this.tableData = recordsRes.data || [];
          this.address_options = areasRes.data || [];
        } else {
          // 使用Promise.all并行获取数据
          const [recordsRes, areasRes] = await Promise.all([
            this.$axios.get(`/record/getAllRecords`),
            this.$axios.get("/area/getAllArea2")
          ]);
          
          this.tableData = recordsRes.data || [];
          this.address_options = areasRes.data || [];
        }
        
        // 缓存数据并记录时间
        this.cacheData = [...this.tableData];
        this.cacheTimestamp = Date.now();
      } catch (error) {
        console.error("数据获取失败", error);
        this.$message.error("数据加载失败");
      } finally {
        this.loading = false;
      }
    },

    // 格式化状态
    formatStatus(status) {
      return this.statusMap[status] || status;
    },
    
    // 格式化类别
    formatKind(kind) {
      return this.kindMap[kind] || kind;
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return "";
      // 仅返回日期部分
      return date.substring(0, 10);
    },

    // 处理筛选变化
    handleFilterChange: _.debounce(function() {
      // 重置当前页码
      this.currentPage = 1;
    }, 300),

    // 处理地址选择变化
    handleAddressChange(value) {
      if (this.duty == 1) {
        // 维修工模式下使用前端筛选
        if (!value) {
          this.tableData = [...this.cacheData];
        } else {
          this.tableData = this.cacheData.filter(
            record => record.address2 === value
          );
        }
      } else {
        // 管理员模式下发送请求获取数据
        this.loading = true;
        this.$axios
          .get(`/record/filterRecords?key=${value}`)
          .then((res) => {
            this.tableData = res.data || [];
            // 重置筛选条件
            this.filterstatus = -1;
            this.filterWorker = "";
            this.filterDormitory = "";
            this.handleFilterChange();
          })
          .catch((error) => {
            console.error("地址筛选失败:", error);
            this.$message.error("地址筛选失败");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    // 处理维修师傅输入 (带防抖)
    handleWorkerInput: _.debounce(function() {
      // 直接使用前端筛选
      this.currentPage = 1;
    }, 300),

    // 获取维修师傅选项
    getWorkerOptions() {
      this.$axios.get("/user/getAllWorkers").then((res) => {
        this.workersList =
          res.data.map((worker) => ({
            value: worker.id,
            label: worker.name,
          })) || [];
      });
    },

    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1; // 重置到第一页
    },

    // 当前页码变化
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },

    repaired(row) {
      this.$axios
        .post(`/student/updateStatus?id=${row.id}&status=${1}`)
        .then(() => {
          row.status = 1;
          this.$message.success("状态已更新");
        })
        .catch(() => {
          this.$message.error("状态更新失败");
        });
    },

    repairing(row) {
      this.$axios
        .post(`/student/updateStatus?id=${row.id}&status=${0}`)
        .then(() => {
          row.status = 0;
          this.$message.success("状态已更新");
        })
        .catch(() => {
          this.$message.error("状态更新失败");
        });
    },

    transfer(row) {
      this.$axios
        .post(`/student/updateStatus?id=${row.id}&status=${3}`)
        .then(() => {
          row.status = 3;
          this.$message.success("已转接");
        })
        .catch(() => {
          this.$message.error("转接失败");
        });
    },

    cancelTransfer(row) {
      this.$axios
        .post(`/student/updateStatus?id=${row.id}&status=${0}`)
        .then(() => {
          row.status = 0;
          this.$message.success("已取消转接");
        })
        .catch(() => {
          this.$message.error("取消转接失败");
        });
    },

    open(row) {
      this.info = row;
      console.log(row);
      this.DetailDialogVisible = true;
    },

    edit(row) {
      this.getWorkerOptions();
      this.editVisible = true;
      
      // 使用原始数据但显示格式化后的文字
      this.editbox = {
        ...row,
        worker_id: row.worker_id || "",
        start_time: row.start_time ? row.start_time.substring(0, 10) : "",
        // 显示格式化后的文字而不是数字
        status: this.statusMap[row.status] || row.status,
        kind: this.kindMap[row.kind] || row.kind,
      };
    },

    editpost() {
      // 在提交前将文字转换回数字
      const statusValue = this.findKeyByValue(this.statusMap, this.editbox.status);
      const kindValue = this.findKeyByValue(this.kindMap, this.editbox.kind);
      
      this.$axios
        .post(`/record/updateRecord?id=${this.editbox.id}&worker_id=${this.editbox.worker_id}&kind=${kindValue}&status=${statusValue}`)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success("修改成功");
            this.editVisible = false;
            this.fetchData();
          } else {
            this.$message.error(res.data.message || "修改失败");
          }
        })
        .catch(() => {
          this.$message.error("网络请求失败");
        });
    },

    remove(id) {
      this.$confirm("确定要删除这条报修记录吗？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$axios
            .post(`/record/removeRecord?id=${id}`)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message.success("删除成功");
                this.tableData = this.tableData.filter((item) => item.id !== id);
              } else {
                this.$message.error(res.data.message || "删除失败");
              }
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
        })
        .catch((action) => {
          if (action !== "cancel") {
            this.$message.info("已取消删除");
          }
        });
    },
    
    // 根据值从映射中找到对应的键
    findKeyByValue(map, value) {
      for (const [key, val] of Object.entries(map)) {
        if (val === value) {
          return key;
        }
      }
      return null;
    },
    // 获取类别标签类名
    getCategoryClass(category) {
      return {
        1: 'category-aircon',
        2: 'category-water',
        3: 'category-network',
        4: 'category-other'
      }[category];
    },
    // 获取状态标签类名
    getStatusClass(status) {
      return {
        0: 'status-pending',
        1: 'status-completed',
        2: 'status-cancelled',
        3: 'status-transferred'
      }[status];
    },
  },
};
</script>

<style scoped>
.card_header {
  font-size: large;
  border-left: 7px solid rgb(228, 70, 49);
  padding-left: 5px;
  margin-bottom: 20px;
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

.el-loading-spinner {
  top: 40%;
}
.el-loading-spinner .el-icon-loading {
  font-size: 40px;
  color: #409EFF;
}
</style>