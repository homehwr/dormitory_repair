<template>
  <div class="card_container">
    <el-card>
      <el-tabs type="border-card">
        <div class="workers__header">
          <div class="worker_info">维修工信息管理</div>
          <el-row style="margin: 0px auto;width:80vh;display: flex;">
            <el-col :span="6">
              <el-input v-model="filterWorker" placeholder="请输入姓名" clearable @input="handleSearch"></el-input>
            </el-col>
            <el-button @click="handleSearch" type="primary" round style="width: 10%; margin-left: 10px;">查询</el-button>
          </el-row>
           <span class="worker_info_add"> 
             <el-popover
              placement="top"
              v-model="addVisible1">
                 <el-button type="primary" slot="reference">新增工人信息</el-button>
                <el-button size="mini" type="text" @click="addMore">批量导入</el-button>
                <el-button type="primary" size="mini" @click="addWorker">添加单条</el-button>
            </el-popover>
             
            </span>
        </div>
        
        <el-table v-loading="loading"
          :data="paginatedData"
           border
          :header-cell-style="{ background: 'rgb(248,249,250)', color: 'rgb(85,85,85)' }"
           height="650"
          style="width: 100% ;overflow-y: auto; ">
          <el-table-column
            fixed
            prop="num"
            label="序号"
            width="100">
            <template #default="scope">
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="dutyText"
            label="身份"
            width="140">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话"
            width="150">
          </el-table-column>
          <el-table-column
            prop="workAreaShow"
            label="管辖区域"
            min-width="300">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="350">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="primary" size="middle">修改</el-button>
              <el-button @click="resetPassword(scope.row)" type="primary" size="middle">重置密码</el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredData.length"
        ></el-pagination>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%">
          <el-form label-width="100px" :model="dialogForm">
            <el-form-item label="姓名" prop="name" required>
              <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone" required>
              <el-input v-model="dialogForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="身份类型" prop="duty" required>
              <el-select v-model="dialogForm.duty" placeholder="请选择身份" @change="handleDutyChange">
                <el-option label="管理员" value="0"></el-option>
                <el-option label="一般维修工" value="1"></el-option>
                <el-option label="热水维修工" value="2"></el-option>
                <el-option label="空调维修工" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="管辖区域" 
              prop="workArea" 
              v-if="dialogForm.duty === '1'"
              required>
              <div class="area-tags-container">
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
                <div class="area-tips" v-if="dynamicTags.length > 0">
                  （已有{{ dynamicTags.length }}个管辖区域）
                </div>
                <div class="area-tips" v-else>
                  （请至少选择一个管辖区域）
                </div>
              </div>
            </el-form-item>
            <el-form-item 
              label="管辖说明" 
              v-if="dialogForm.duty === '2' || dialogForm.duty === '3'">
              <div class="special-worker-tips">
                {{ dialogForm.duty === '2' ? '热水维修工负责全校范围的热水问题维修' : '空调维修工负责全校范围的空调问题维修' }}
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">{{ dialogType === 'add' ? '添 加' : '修 改' }}</el-button>
          </span>
        </el-dialog>

        <el-dialog title="批量导入维修工信息" :visible.sync="batchImportVisible" width="60%">
          <div class="batch-import-header" style="display: flex;"> 
            <el-button type="text" @click="downloadTemplate">下载Excel模板</el-button> &nbsp;&nbsp;
            <img src="@/assets/模版.png" style="width: 40%; height: 3.5vw;" />
          </div>
          <div class="batch-import-container">
            <!-- 文件上传区域 -->
            <div class="upload-section">
              <el-upload
                class="upload-demo"
                drag
                action=""
                :auto-upload="false"
                :on-change="handleFileChange"
                :show-file-list="false"
                accept=".xlsx, .xls"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">支持.xlsx和.xls格式文件</div>
              </el-upload>
              
              <div v-if="file" class="file-info">
                <i class="el-icon-document"></i>
                <span>{{ file.name }}</span>
                <el-button type="text" @click="removeFile">移除</el-button>
              </div>
            </div>
            
            <!-- 数据预览和编辑区域 -->
            <div class="preview-section" v-if="importedData.length > 0">
              <div class="section-header">
                <h3>数据预览与编辑</h3>
                <el-button type="primary" @click="submitBatchImport">提交导入</el-button>
              </div>
              
              <el-table :data="importedData" border height="400" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="120">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name" placeholder="请输入姓名"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.phone" placeholder="请输入电话"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="duty" label="身份类型" width="150">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.duty" placeholder="请选择">
                      <el-option label="管理员" value="0"></el-option>
                      <el-option label="一般维修工" value="1"></el-option>
                      <el-option label="热水维修工" value="2"></el-option>
                      <el-option label="空调维修工" value="3"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="workArea" label="管辖区域" min-width="250">
                  <template slot-scope="scope">
                    <div v-if="scope.row.duty === '1'">
                      {{ scope.row.workArea }}
                    </div>
                    <div v-else class="no-area-tip">
                      {{ getDutyText(scope.row.duty) }}无需指定管辖区域
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle @click="removeImportRow(scope.$index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="import-stats">
                <span>共导入 {{ importedData.length }} 条记录</span>
                <el-button type="text" @click="addEmptyRow">+ 添加一行</el-button>
              </div>
            </div>
          </div>
          
          <div slot="footer" class="dialog-footer">
            <el-button @click="batchImportVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitBatchImport" :disabled="importedData.length === 0">提交导入</el-button>
          </div>
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      filterWorker: '',
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      dialogType: 'add', // 'add' 或 'edit'
      dialogForm: {
        id: '',
        name: '',
        phone: '',
        duty: '1',
        work_area: ''
      },
      tableData: [],
      tableDataCopy: [],
      filteredData: [],
      dynamicTags: [],
      inputVisible: false,
      selectedArea: null,
      address_options: [],
      addVisible1: false,
      batchImportVisible: false,
      file: null,
      importedData: [],
      keyToDisplayMap: null,
      loading: true
    };
  },

  computed: {
    // 分页后的数据
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    
    // 对话框标题
    dialogTitle() {
      return this.dialogType === 'add' ? '新增维修工信息' : '修改维修工信息';
    }
  },

  mounted() {
    this.fetchData();
  },
  
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true;
      Promise.all([
        this.$axios.get('/area/getAllArea2'),
        this.$axios.get('/user/getAllWorkersDutyNot0')//只获取维修工信息而不包括管理员
      ]).then(([areaRes, workerRes]) => {
        this.address_options = areaRes.data;
        this.buildAreaMaps();
        this.processWorkerData(workerRes.data);
        this.loading = false;
      }).catch(error => {
        console.error('数据获取失败:', error);
        this.loading = false;
        this.$message.error('数据获取失败');
      });
    },
    
    // 处理维修工数据
    processWorkerData(workerData) {
      this.tableData = workerData.map(worker => {
        // 添加身份文本
        worker.dutyText = this.getDutyText(worker.duty);
        
        // 前端生成管辖区域显示文本
        if (worker.work_area && worker.duty === '1') {
          const keys = worker.work_area.split(',');
          const displayNames = keys.map(key => this.getDisplayName(key));
          worker.workAreaShow = displayNames.join('; ');
        } else {
          if (worker.duty == '1') {
            worker.workAreaShow = null;
          } else {
            worker.workAreaShow = worker.duty === '0' ? '全系统' : '全校范围';
          }
          
        }
        return worker;
      });
      this.tableDataCopy = [...this.tableData];
      this.filteredData = [...this.tableData];
    },
    
    // 获取身份文本
    getDutyText(duty) {
      switch(duty) {
        case '0': return '管理员';
        case '1': return '一般维修工';
        case '2': return '热水维修工';
        case '3': return '空调维修工';
        default: return '未知身份';
      }
    },
    
    // 处理搜索
    handleSearch() {
      if (!this.filterWorker.trim()) {
        this.filteredData = [...this.tableDataCopy];
        this.currentPage = 1;
        return;
      }
      const searchTerm = this.filterWorker.toLowerCase().trim();
      this.filteredData = this.tableDataCopy.filter(worker => 
        worker.name.toLowerCase().includes(searchTerm) || 
        worker.phone.includes(searchTerm)
      );
      this.currentPage = 1;
    },
    
    // 分页处理
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
    
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    
    // 打开新增对话框
    addWorker() {
      this.addVisible1 = false;
      this.dialogType = 'add';
      this.dialogForm = {
        id: '',
        name: '',
        phone: '',
        duty: '1',
        work_area: ''
      };
      this.dynamicTags = [];
      this.dialogVisible = true;
    },
    
    // 打开编辑对话框
    edit(row) {
      this.dialogType = 'edit';
      this.dialogForm = {
        id: row.id,
        name: row.name,
        phone: row.phone,
        duty: row.duty.toString(),
        work_area: row.work_area || ''
      };
      
      // 初始化区域标签
      if (row.duty === '1' && row.work_area) {
        this.initializeTags(row.work_area);
      } else {
        this.dynamicTags = [];
      }
      
      this.dialogVisible = true;
    },
    
    // 提交对话框表单
    submitDialog() {
      if (!this.dialogForm.name || !this.dialogForm.phone) {
        this.$message.warning("姓名和联系电话不能为空！");
        return;
      }
      
      // 验证一般维修工必须选择管辖区域
      if (this.dialogForm.duty === '1' && this.dynamicTags.length === 0) {
        this.$message.warning("一般维修工必须选择管辖区域！");
        return;
      }
      
      // 从动态标签获取工作区域
      if (this.dialogForm.duty === '1') {
        this.dialogForm.work_area = this.dynamicTags.map(tag => tag.key).join(',');
      } else {
        this.dialogForm.work_area = ''; // 非一般维修工不需要管辖区域
      }
      console.log(this.dialogForm);
      
      const url = this.dialogType === 'add' ? '/user/addWorker' : '/user/updateUser';
      this.$axios.post(url, this.dialogForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success(this.dialogType === 'add' ? '新增成功' : '修改成功');
          this.dialogVisible = false;
          this.fetchData();
        } else {
          this.$message.error(res.data.message || '操作失败');
        }
      }).catch(() => {
        this.$message.error('服务器错误');
      });
    },
    
    // 重置密码
    resetPassword(row) {
      this.$confirm('确定要重置密码吗？重置密码之后密码将会变为默认密码（手机号）', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const id = row.id;
        const phone = row.phone;
        this.$axios.post(`/user/upPassword?id=${id}&phone=${phone}`).then(res => {
          if (res.data.code === 200) {
            this.$message.success('密码重置成功');
          } else {
            this.$message.error('密码重置失败');
          }
        });
      }).catch(() => {
        this.$message.info("已取消");
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
            this.fetchData();
          } else {
            this.$message.error('删除失败');
          }
        });
      }).catch(() => {});
    },
    
    // 身份类型变化处理
    handleDutyChange(value) {
      // 如果不是一般维修工，清空区域选择
      if (value !== '1') {
        this.dynamicTags = [];
      }
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
      if (this.dynamicTags.length >= 5) {
        this.$message.warning('最多只能选择5个区域');
        return;
      }
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
        } else {
          this.$message.warning('该区域已添加');
        }
      }
      this.inputVisible = false;
    },
    
    // 移除标签
    handleClose(tag) {
      this.dynamicTags = this.dynamicTags.filter(t => t.key !== tag.key);
    },
    
    // --- 批量导入相关方法 ---
    // 打开批量导入对话框
    addMore() {
      this.batchImportVisible = true;
      this.file = null;
      this.importedData = [];
    },
    
    downloadTemplate() {
      // 创建表头数据
      const headers = ['姓名', '手机号码', '身份类型(0-管理员,1-一般维修工,2-热水维修工,3-空调维修工)', '负责苑区(仅一般维修工需要填写)'];
      
      // 示例数据
      const examples = [
        ['张三', '13800138000', '1', '东苑1栋,东苑2栋'],
        ['李四', '13900139000', '2', ''],
        ['王五', '13700137000', '3', '']
      ];
      
      // 创建工作簿
      const wb = XLSX.utils.book_new();
      
      // 创建工作表数据
      const wsData = [headers, ...examples];
      
      // 将数据转换为工作表对象
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // 设置列宽
      const colWidths = [15, 15, 30, 40];
      ws['!cols'] = colWidths.map(width => ({ width }));
      
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '维修工导入模板');
      
      // 生成Excel二进制数据
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // 创建Blob对象并下载
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, '维修工信息导入模板.xlsx');
    },
    
    // 处理文件选择
    handleFileChange(file, fileList) {
      this.file = file.raw;
      this.readExcelFile(file.raw);
    },
    
    // 移除文件
    removeFile() {
      this.file = null;
      this.importedData = [];
    },
    
    // 读取Excel文件
    readExcelFile(file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // 获取第一个工作表
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // 将工作表转换为JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // 去除空行和表头
          const filteredData = jsonData.filter((row, index) => {
            return index > 0 && row.length > 0 && row.some(cell => cell !== null && cell !== '');
          });
          
          // 处理导入数据
          this.processImportedData(filteredData);
        } catch (error) {
          console.error('Excel解析错误:', error);
          this.$message.error('Excel文件解析失败，请检查文件格式');
        }
      };
      
      reader.readAsArrayBuffer(file);
    },
    
    // 处理导入的数据
    processImportedData(data) {
      if (!data || data.length === 0) {
        this.$message.warning('Excel文件中没有找到有效数据');
        return;
      }
      
      this.importedData = data.map(row => {
        // 确保行有足够的数据
        while (row.length < 4) row.push('');
        
        const [name, phone, duty, workArea] = row;
        
        // 处理身份类型
        let dutyValue = '1'; // 默认为一般维修工
        if (duty !== undefined && duty !== null) {
          if (['0', '1', '2', '3'].includes(duty.toString())) {
            dutyValue = duty.toString();
          } else if (typeof duty === 'string') {
            // 处理文本类型的身份
            if (duty.includes('管理')) dutyValue = '0';
            else if (duty.includes('热水')) dutyValue = '2';
            else if (duty.includes('空调')) dutyValue = '3';
          }
        }
        
        return {
          name: name || '',
          phone: phone ? phone.toString() : '',
          duty: dutyValue,
          workArea: workArea || '',
          workAreaValue: dutyValue === '1' ? this.parseWorkArea(workArea || '') : []
        };
      });
      
      this.$message.success(`成功导入 ${this.importedData.length} 条记录`);
    },
    
    // 解析管辖区域
    parseWorkArea(areaStr) {
      if (!areaStr) return [];
      
      // 分割字符串（支持多种分隔符）
      const areaParts = areaStr.split(/[,;，；、\s]+/).filter(part => part.trim());
      
      // 存储匹配到的区域key
      const matchedKeys = [];
      
      // 遍历每个区域部分
      for (const part of areaParts) {
        const found = this.findAreaKey(part.trim());
        if (found) {
          matchedKeys.push(found);
        } else {
          console.warn(`未找到匹配的区域: ${part}`);
        }
      }
      
      return matchedKeys;
    },

    // 辅助方法：查找区域key
    findAreaKey(areaName) {
      // 先尝试在整个区域树中查找
      for (const yuan of this.address_options) {
        if (yuan.area === areaName) {
          return yuan.key;
        }
        
        if (yuan.children) {
          for (const dong of yuan.children) {
            if (dong.area === areaName) {
              return dong.key;
            }
          }
        }
      }
      
      return null;
    },
    
    // 添加空行
    addEmptyRow() {
      this.importedData.push({
        name: '',
        phone: '',
        duty: '1',
        workArea: '',
        workAreaValue: []
      });
    },
    
    // 删除导入行
    removeImportRow(index) {
      this.importedData.splice(index, 1);
    },
    
    // 提交批量导入
    submitBatchImport() {
      // 验证数据
      const invalidRows = this.importedData.filter(row => 
        !row.name || !row.phone || !row.duty
      );
      
      if (invalidRows.length > 0) {
        this.$message.error(`有 ${invalidRows.length} 条记录缺少必要信息，请补充完整`);
        return;
      }
      
      // 准备提交数据
      const submitData = this.importedData.map(row => ({
        name: row.name,
        phone: row.phone,
        duty: row.duty,
        work_area: row.duty === '1' ? row.workAreaValue.join(',') : ''
      }));
      
      // 调用API批量导入
      this.$axios.post('/user/batchAddWorkers', submitData).then(res => {
        if (res.data.code === 200) {
          this.$message.success(`成功导入 ${res.data.data || submitData.length} 条记录`);
          this.batchImportVisible = false;
          this.fetchData();
        } else {
          this.$message.error(res.data.message || '导入失败');
          if (res.data.code === 400) {
            this.$notify({
              title: '提示',
              message: res.data.data,
              duration: 0
            });
          }
        }
      }).catch(error => {
        console.error('批量导入错误:', error);
        this.$message.error('服务器错误，导入失败');
      });
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
  font-weight: bold;
}

.workers__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.worker_info_add {
  flex-shrink: 0;
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
  padding: 15px 0;
}

.dialog-footer {
  text-align: center;
}

.area-tags-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #fafafa;
}

.area-tips {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.special-worker-tips {
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 4px solid #1890ff;
  color: #606266;
}

.no-area-tip {
  color: #909399;
  font-style: italic;
}

/* 批量导入样式 */
.batch-import-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-section {
  padding: 20px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  text-align: center;
  background-color: #fafafa;
}

.file-info {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.preview-section {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
  color: #303133;
}

.import-stats {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .workers__header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .worker_info_add {
    align-self: flex-end;
    margin-top: 15px;
  }
}
</style>