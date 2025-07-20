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
              width="160"
              v-model="addVisible1">
                 <el-button type="primary" slot="reference">新增工人信息</el-button>
                <el-button size="mini" type="text" @click="addMore">批量导入</el-button>
                <el-button type="primary" size="mini" @click="addWorker">添加单条</el-button>
            </el-popover>
             
            </span>
        </div>
        
        <el-table
          :data="tableData"
           border
          :header-cell-style="{ background: 'rgb(248,249,250)', color: 'rgb(85,85,85)' }"
           height="650"
          style="width: 100% ;overflow-y: auto; ">
          <el-table-column
            fixed
            prop="num"
            label="序号"
            width="150">
            <template #default="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="150">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话"
            width="220">
          </el-table-column>
          <el-table-column
            prop="workAreaShow"
            label="管辖区域"
            width="400">
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
          layout="total,   prev, pager, next, jumper"
          :total="tableData.length"
        ></el-pagination>


          <el-dialog title="新增维修工信息" :visible.sync="addVisible2" width="30%">
          <el-form label-width="80px" :model="addbox">
            <el-form-item label="姓名">
              <el-input v-model="addbox.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="addbox.phone"></el-input>
            </el-form-item>
            <el-form-item label="管理员">
              <el-radio v-model="addbox.duty" label="0">是管理员</el-radio>
              <el-radio v-model="addbox.duty" label="1">不是管理员</el-radio>
            </el-form-item>
            <el-form-item label="管辖区域" v-if="addbox.duty=='1'">
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
            <el-button @click="addVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="addpost">确 定</el-button>
          </span>
        </el-dialog>



        
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


 <el-dialog title="批量导入维修工信息" :visible.sync="batchImportVisible" width="80%">
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
            <el-table-column prop="duty" label="管理员" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.duty" placeholder="请选择">
                  <el-option label="是" value="0"></el-option>
                  <el-option label="否" value="1"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="workArea" label="管辖区域" min-width="250">
               <template slot-scope="scope">
                  {{ scope.row.workArea }}
               </template>
              <!-- <template slot-scope="scope">
                <el-select 
                  v-model="scope.row.workArea" 
                  multiple
                  placeholder="请选择区域"
                  style="width: 100%"
                >
                  <el-option
                    v-for="area in address_options"
                    :key="area.key"
                    :label="area.area"
                    :value="area.key"
                  ></el-option>
                </el-select>
              </template> -->
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
import * as XLSX from 'xlsx'; // 引入xlsx库
export default {
  data() {
    return {
      filterWorker: '',
      bian: true,
      pageSize: 20,
      currentPage: 1,
      editVisible: false,
      editbox: {},
      addbox: {},
      tableData: [],
      tableDataCopy: [],
      dynamicTags: [],
      inputVisible: false,
      selectedArea: null,
      address_options: [],
      addVisible3: false,
      addvisible1: false,
      addVisible2: false,
       // 批量导入相关数据
      batchImportVisible: false,
      file: null,
      importedData: [],
      allAreaOptions: [], // 存储所有区域选项
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
    resetPassword(row){
      this.$confirm('确定要重置密码吗？', '确认信息', {
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
        this.$message("已取消");
      });

    },
    addpost(){
      this.addbox.work_area = this.dynamicTags.map(tag => tag.key).join(',');
      this.$axios.post('/user/addWorker', this.addbox).then(res => {  
        if (res.data.code === 200) {
          this.$message.success('新增成功');
          this.addVisible2 = false;
          this.gerWorkerInfo();
        } else {
          this.$message.error(res.data.message || '新增失败');
        }
      }).catch(() => {
        this.$message.error('服务器错误');
      });
    },
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
      // console.log(this.editbox);
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
    addWorker() {
      this.addvisible1=false;
      this.addVisible2 = true;
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
    },
     // 打开批量导入对话框
    addMore() {
      this.batchImportVisible = true;
      this.file = null;
      this.importedData = [];
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
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // 处理导入数据
          this.processImportedData(jsonData);
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
        this.$message.warning('Excel文件中没有找到数据');
        return;
      }// 获取第一行数据的所有键（列名）
        const firstRow = data[0];
        const columnNames = Object.keys(firstRow);
        
        // 创建列名映射（不区分大小写）
        const columnMapping = {};
        
        // 模糊匹配列名
        columnNames.forEach(colName => {
          const lowerCol = colName.toLowerCase();
          
          if (lowerCol.includes('姓名') || lowerCol.includes('name')) {
            columnMapping.name = colName;
          } 
          else if (lowerCol.includes('电话') || lowerCol.includes('手机') || 
                  lowerCol.includes('联系') || lowerCol.includes('号码')) {
            columnMapping.phone = colName;
          }
          else if (lowerCol.includes('管理') || lowerCol.includes('duty') || 
                  lowerCol.includes('身份') || lowerCol.includes('role')) {
            columnMapping.duty = colName;
          }
          else if (lowerCol.includes('区域') || lowerCol.includes('area') || 
                  lowerCol.includes('负责') || lowerCol.includes('管辖')) {
            columnMapping.workArea = colName;
          }
        });
    // 转换数据格式
        this.importedData = data.map(row => {
          // 使用映射的列名获取值
          const name = columnMapping.name ? row[columnMapping.name] : '';
          const phone = columnMapping.phone ? row[columnMapping.phone] : '';
          const dutyValue = columnMapping.duty ? row[columnMapping.duty] : '';
          const workArea = columnMapping.workArea ? row[columnMapping.workArea] : '';
          
          // 处理管理员状态
          
          let duty = '';
          if (dutyValue) {
            const lowerDuty = String(dutyValue).toLowerCase();
            if (lowerDuty.includes('是') || lowerDuty.includes('管理员') || 
                lowerDuty.includes('admin') || lowerDuty === '0') {
              duty = '0';
            } else if (lowerDuty.includes('否') || lowerDuty.includes('非管理员') || 
                      lowerDuty.includes('worker') || lowerDuty === '1') {
              duty = '1';
            }
          }

          return {
            name: name || '',
            phone: phone || '',
            duty: duty,
            workArea: workArea ,
            workAreaValue: this.parseWorkArea(workArea || ''),
          };
        });
        this.$message.success(`成功导入 ${this.importedData.length} 条记录`);
      },
    
    // 解析管辖区域
   parseWorkArea(areaStr) {
      if (!areaStr) return [];
      
      // 分割字符串（支持顿号、逗号、分号等多种分隔符）
      const areaParts = areaStr.split(/[,;，；、]+/).filter(part => part.trim());
      
      // 存储匹配到的区域key
      const matchedKeys = [];
      
      // 遍历每个区域部分
      for (const part of areaParts) {
        // 尝试匹配格式：苑名+栋号（如"西苑9栋"）
        const match = part.match(/(\D+)(\d+栋)/);
        
        if (match) {
          const yuanName = match[1].trim(); // 苑名（如"西苑"）
          const dongName = match[2].trim();  // 栋号（如"9栋"）
          
          // 在address_options中查找匹配的苑
          const yuanMatch = this.address_options.find(yuan => 
            yuan.area === yuanName
          );
          
          if (yuanMatch) {
            // 查找匹配的栋
            const dongMatch = yuanMatch.children.find(dong => 
              dong.area === dongName
            );
            
            if (dongMatch) {
              matchedKeys.push(dongMatch.key);
              continue; // 匹配成功，跳过后续处理
            }
          }
        }
        // 如果未匹配到标准格式，尝试其他匹配方式
        const found = this.findAreaKey(part.trim());
        if (found) {
          matchedKeys.push(found);
        } else {
          console.warn(`未找到匹配的区域: ${part}`);
        }
      }
      console.log(matchedKeys);
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
        duty: '1', // 默认不是管理员
        workArea: []
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
        work_area: row.workAreaValue.join(','), // 将数组转换为逗号分隔的字符串
      }));
      
      // 调用API批量导入
      this.$axios.post('/user/batchAddWorkers', submitData).then(res => {
        if (res.data.code === 200) {
          console.log(res.data);
          this.$message.success(`导入成功`);
          this.addVisible2=false;
          // this.batchImportVisible = false;
          this.gerWorkerInfo();
          if (res.data.data.failCount > 0) {
            this.$message.warning(`导入失败`);
          }
          
          // 关闭对话框并刷新数据
          this.batchImportVisible = false;
          this.gerWorkerInfo();
        } else {
          this.$message.error(res.data.message || '导入失败');
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

.import-stats {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.worker_info_add{
  width: auto;
  height: auto;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  text-align: center;
}
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