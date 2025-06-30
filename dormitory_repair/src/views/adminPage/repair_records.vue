<template>
  <div class="card_container">
    <el-card>
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
              :disabled="duty == 1"
              @change="handleAddressChange"
            ></el-cascader>
          </el-col>
          <el-col :span="6">
          <span>所在寝室号：</span>
          <el-input
            v-model="filterDormitory"
            placeholder="请输入寝室号"
            clearable
            :disabled="!filterAddress"
            :style="{ width: '200px' }"
            @input="handleFilterChange"
          ></el-input>
        </el-col>
        </el-row>
        <el-table :data="currentTableData" :border="bian" height="400" style="width: auto">
          <el-table-column fixed prop="num" label="序号" width="50">
            <template #default="scope">
              {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="维修状态" width="140">
            <template #default="{ row }">
              {{ formatStatus(row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="报修日期" width="150">
            <template #default="{ row }">
              {{ formatDate(row.start_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="报修人" width="120"></el-table-column>
          <el-table-column prop="kind" label="报修类别" width="140">
            <template #default="{ row }">
              {{ formatKind(row.kind) }}
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
      </el-tabs>
    </el-card>

    <el-dialog title="报修详情信息" :visible.sync="DetailDialogVisible" width="40%" center style="letter-spacing: 1px;">
      {{ info }}<br><br>
      <img :src="info_img" style="max-width: 100%" />
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
export default {
  data() {
    return {
      isDisabled: false,
      yuan: [],
      lou: [],
      duty: localStorage.getItem("dormitory_duty"),
      name: localStorage.getItem("dormitory_name"),
      dormitory_work_area: localStorage.getItem("dormitory_work_area"),
      status_options: [
        { filterstatus: -1, label: "全部" },
        { filterstatus: 0, label: "待维修" },
        { filterstatus: 1, label: "已维修" },
        { filterstatus: 2, label: "已取消" },
        { filterstatus: 3, label: "已转对应服务商" },
      ],
      info: "",
      info_img: "",
      editVisible: false,
      DetailDialogVisible: false,
      editbox: {},
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
        1: "空调维修",
        2: "热水维修",
        3: "网络维修",
        4: "其他维修",
      },
      workerInputTimer: null,
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
      let data = [...this.tableData];
      
      // 1. 状态筛选
      if (this.filterstatus !== null && this.filterstatus !== -1) {
        data = data.filter(
          record => Number(record.status) === Number(this.filterstatus)
        );
      }

      // 2. 维修师傅筛选
      if (this.filterWorker && this.filterWorker.trim()) {
        const keyword = this.filterWorker.toLowerCase().trim();
        data = data.filter(
          record =>
            record.workerName &&
            record.workerName.toLowerCase().includes(keyword)
        );
      }
      
      // 新增：3. 寝室号筛选
      if (this.filterDormitory && this.filterDormitory.trim()) {
        const dormitory = this.filterDormitory.trim();
        data = data.filter(record => 
          record.address3 && record.address3.includes(dormitory)
        );
      }
      
      return data;
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
    fetchData() {
      this.loading = true;
      if (this.duty == 1) {
        this.$axios
          .get(`/record/getRecordsByAddress?address=${this.dormitory_work_area}`)
          .then((res) => {
            this.tableData = res.data || [];
            this.$axios
              .get(`/area/getArea?address=${localStorage.getItem("dormitory_work_area")}`)
              .then((res) => {
                this.address_options = res.data || [];
                this.loading = false;
              });
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$axios
          .get(`/record/getAllRecords`)
          .then((res) => {
            this.tableData = res.data || [];
            this.$axios
              .get("/area/getAllArea2")
              .then((res) => {
                this.address_options = res.data || [];
                this.loading = false;
              });
          })
          .catch(() => {
            this.loading = false;
          });
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
    handleFilterChange() {
      // 重置当前页码
      this.currentPage = 1;
    },

    // 处理地址选择变化
    handleAddressChange(value) {
      this.filterAddress = value;
      this.$axios
        .get(`/record/filterRecords?key=${value}`)
        .then((res) => {
          this.tableData = res.data || [];
          // 重置其他筛选条件
          this.filterstatus = -1;
          this.filterWorker = "";
          this.filterDormitory = ""; // 重置寝室号筛选
          this.handleFilterChange();
        })
        .catch((error) => {
          console.error("地址筛选失败:", error);
          this.$message.error("地址筛选失败");
        });
    },


    // 处理维修师傅输入 (带防抖)
    handleWorkerInput() {
      // 清除之前的定时器
      if (this.workerInputTimer) {
        clearTimeout(this.workerInputTimer);
      }
      
      // 设置新的定时器
      this.workerInputTimer = setTimeout(() => {
        this.handleFilterChange();
      }, 300);
    },

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
        .post(`/record/updateStatus?id=${row.id}&status=${1}`)
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
        .post(`/record/updateStatus?id=${row.id}&status=${0}`)
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
        .post(`/record/updateStatus?id=${row.id}&status=${3}`)
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
        .post(`/record/updateStatus?id=${row.id}&status=${0}`)
        .then(() => {
          row.status = 0;
          this.$message.success("已取消转接");
        })
        .catch(() => {
          this.$message.error("取消转接失败");
        });
    },

    open(row) {
      this.info = row.info;
      this.info_img = row.info_img;
      this.DetailDialogVisible = true;
    },

    edit(row) {
      this.getWorkerOptions();
      this.editVisible = true;
      
      // 使用原始数据而非格式化值
      this.editbox = {
        ...row,
        worker_id: row.worker_id || "",
        start_time: row.start_time ? row.start_time.substring(0, 10) : "",
        status: row.status,
        kind: row.kind,
      };
    },

    editpost() {
      const { id, worker_id, kind, status } = this.editbox;
      
      this.$axios
        .post(`/record/updateRecord?id=${id}&worker_id=${worker_id}&kind=${kind}&status=${status}`)
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
</style>