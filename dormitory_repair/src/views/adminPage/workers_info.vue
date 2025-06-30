<template>
  <div class="card_container">
    <el-card>
      <el-tabs type="border-card">
        <div class="workers__header">
          <div class="worker_info">维修工信息管理</div>
          <el-row style="margin: 0px auto;width: 60%;display: flex;">
            <el-col :span="6">
              <el-input v-model="filterWorker" placeholder="请输入姓名" clearable @input="handleSearch"></el-input>
            </el-col>
            <el-button @click="handleSearch" type="primary" round style="width: 10%; margin-left: 10px;">查询</el-button>
          </el-row>
        </div>
        
        <el-table
          :data="tableData"
          :border="bian"
          height="400"
          style="width: auto">
          <el-table-column
            fixed
            prop="num"
            label="序号"
            width="100">
            <template #default="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="200">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话"
            width="220">
          </el-table-column>
          <el-table-column
            prop="workAreaShow"
            label="管辖区域"
            width="280">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="primary" size="middle">修改</el-button>
              <el-button @click="remove(scope.row.id)" type="danger" size="middle">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 25, 50, 100, 200]"
          :page-size="pageSize"
          layout="total,   prev, pager, next, jumper"
          :total="tableData.length"
        ></el-pagination>
        
        <el-dialog title="修改维修工信息" :visible.sync="editVisible" width="30%">
          <el-form label-width="80px" :model="editbox">
            <el-form-item label="姓名">
              <el-input v-model="editbox.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="editbox.phone"></el-input>
            </el-form-item>
            <el-form-item label="管理员">
              <el-radio v-model="editbox.duty" label="0">是管理员</el-radio>
              <el-radio v-model="editbox.duty" label="1">不是管理员</el-radio>
            </el-form-item>
            <el-form-item label="管辖区域" v-if="editbox.duty=='1'">
              <el-tag
                v-for="tag in dynamicTags"
                :key="tag.key"
                closable
                @close="handleClose(tag)">
                {{ tag.display }}
              </el-tag>
              <el-cascader 
                v-if="inputVisible"
                v-model="selectedArea"
                :options="address_options"
                :props="{
                  label: 'area',
                  value: 'key',
                  emitPath: false,
                  // checkStrictly: true
                }"
                @change="handleInputConfirm"
                placeholder="请选择区域"
                clearable
                class="cascader-input">
              </el-cascader>
              <el-button 
                v-else 
                class="button-new-tag" 
                size="small" 
                @click="showInput">
                + 添加区域
              </el-button>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="editpost">确 定</el-button>
          </span>
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterWorker: '',
      bian: true,
      pageSize: 20,
      currentPage: 1,
      editVisible: false,
      editbox: {},
      tableData: [],
      tableDataCopy: [],
      dynamicTags: [],
      inputVisible: false,
      selectedArea: null,
      address_options: [],
      keyToDisplayMap: null
    };
  },

  mounted() {
    // 同时获取区域数据和维修工数据
    Promise.all([
      this.$axios.get('/area/getAllArea2'),
      this.$axios.get('/user/getAllWorkers')
    ]).then(([areaRes, workerRes]) => {
      this.address_options = areaRes.data;
      this.buildAreaMaps();  // 构建映射表
      this.processWorkerData(workerRes.data);  // 处理维修工数据
    });
  },
  
  methods: {
    // 处理维修工数据
    processWorkerData(workerData) {
      // console.log(workerData)
      this.tableData = workerData.map(worker => {
        // 前端生成管辖区域显示文本
        if (worker.work_area) {
          const keys = worker.work_area.split(',');
          const displayNames = keys.map(key => this.getDisplayName(key));
          worker.workAreaShow = displayNames.join('; ');
        } else {
          worker.workAreaShow = '';
        }
        return worker;
      });
      this.tableDataCopy = [...this.tableData];
    },
    
    // 处理搜索
    handleSearch() {
      if (!this.filterWorker.trim()) {
        this.tableData = [...this.tableDataCopy];
        return;
      }
      const searchTerm = this.filterWorker.toLowerCase().trim();
      this.tableData = this.tableDataCopy.filter(worker => 
        worker.name.toLowerCase().includes(searchTerm)
      );
    },
    
    // 分页处理
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    
    // 打开编辑对话框
    edit(row) {
      this.editVisible = true;
      this.editbox = JSON.parse(JSON.stringify(row));
      this.initializeTags(this.editbox.work_area || '');
    },
    
    // 提交编辑
    editpost() {
      if (!this.editbox.name || !this.editbox.phone) {
        this.$message.warning("姓名和联系电话不能为空！");
        return;
      }
      
      // 从动态标签获取工作区域
      this.editbox.work_area = this.dynamicTags.map(tag => tag.key).join(',');
      console.log(this.editbox);
      this.$axios.post('/user/updateUser', this.editbox).then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功');
          this.editVisible = false;
          this.gerWorkerInfo();
        } else {
          this.$message.error(res.data.message || '修改失败');
        }
      }).catch(() => {
        this.$message.error('服务器错误');
      });
    },
    
    // 删除工人
    remove(id) {
      this.$confirm('确定要删除这位工人的信息吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$axios.post(`/user/removeUser?id=${id}`).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功');
            this.tableData = this.tableData.filter(item => item.id !== id);
            this.tableDataCopy = this.tableDataCopy.filter(item => item.id !== id);
          } else {
            this.$message.error('删除失败');
          }
        });
      }).catch(() => {});
    },
    
    // 获取工人信息
    gerWorkerInfo() {
      this.$axios.get('/user/getAllWorkers').then(res => {
        this.processWorkerData(res.data);
      });
    },
    
    // --- 管辖区域相关方法 ---
    // 初始化标签
    initializeTags(workAreaStr) {
      this.dynamicTags = [];
      if (!workAreaStr) return;
      
      const keys = workAreaStr.split(',').filter(key => key.trim() !== '');
      keys.forEach(key => {
        const displayName = this.getDisplayName(key);
        this.dynamicTags.push({ key, display: displayName });
      });
    },
    
    // 构建区域映射表
    buildAreaMaps() {
      this.keyToDisplayMap = new Map();
      
      const processNode = (node, parent = null) => {
        if (parent) {
          // 子节点：父区域名 + 当前节点名
          const display = parent.area + node.area;
          this.keyToDisplayMap.set(node.key, display);
        } else {
          // 父节点
          this.keyToDisplayMap.set(node.key, node.area);
        }
        
        // 处理子节点
        if (node.children) {
          node.children.forEach(child => processNode(child, node));
        }
      };
      
      this.address_options.forEach(area => processNode(area));
    },
    
    // 根据key获取显示名称
    getDisplayName(key) {
      if (this.keyToDisplayMap?.get(key)) {
        return this.keyToDisplayMap.get(key);
      }
      
      // 如果映射表还没建，回退方法
      let result = `未知区域(${key})`;
      if (this.address_options.length > 0) {
        for (const parent of this.address_options) {
          if (parent.key === key) {
            return parent.area;
          }
          if (parent.children) {
            for (const child of parent.children) {
              if (child.key === key) {
                return parent.area + child.area;
              }
            }
          }
        }
      }
      return result;
    },
    
    // 显示级联选择器
    showInput() {
      this.inputVisible = true;
      this.selectedArea = null;
    },
    
    // 选择区域确认
    handleInputConfirm() {
      if (this.selectedArea) {
        const key = this.selectedArea;
        const display = this.getDisplayName(key);
        
        // 检查是否已存在
        if (!this.dynamicTags.some(tag => tag.key === key)) {
          this.dynamicTags.push({ key, display });
        }
      }
      this.inputVisible = false;
    },
    
    // 移除标签
    handleClose(tag) {
      this.dynamicTags = this.dynamicTags.filter(t => t.key !== tag.key);
    }
  },
};
</script>

<style scoped>
.card_container {
  padding: 20px;
}

.worker_info {
  font-size: large;
  margin-bottom: 10px;
  border-left: 7px solid rgb(228, 70, 49);
  padding-left: 10px;
}

.workers__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.button-new-tag {
  margin-top: 10px;
}

.cascader-input {
  width: 100%;
  margin-top: 10px;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.dialog-footer {
  text-align: center;
}
</style>