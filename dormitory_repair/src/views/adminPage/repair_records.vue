<template>
    <div class="card_container">
    <el-card>
        <el-tabs type="border-card" >
            <div class="card_header">报修记录查看</div>
            <el-row style="margin: 20px 10px;width: 80%;display: flex;">
            <el-col :span="8" >
                <span>报修状态：</span>
              <el-select v-model="filterstatus" placeholder="请选择" @change="handleFilterChange">
                  <el-option
                    v-for="item in status_options"
                    :key="item.filterstatus"
                    :label="item.label"
                    :value="item.filterstatus">
                  </el-option>
                </el-select> 
               </el-col>
            <el-col :span="8" >
                <span>维修师傅：</span>
                  <el-input v-model="filterWorker" placeholder="请输入姓名"  clearable  @input="handleFilterChange"  :disabled="isDisabled"  :style="{width: '200px'}" >
                  </el-input>
           
               </el-col>
               <el-col :span="8">
                <span>所在区域：</span>
                <el-cascader
                  v-model="filterAddress"
                  :options="address_options"
                    :props="{
                      label: 'area',        // 映射顶层标签字段
                      value: 'key',            // 映射所有层级的value字段
                      emitPath: false,
                    }"
                  @change="handleFilterChange">
                </el-cascader>
               </el-col>
               
                 <!-- <el-button type="primary" round style="width: 10%;">查询</el-button> -->

          </el-row>
    <el-table
      :data="TableData"
      :border=bian
      height:auto
      style="width: auto">
      <el-table-column
       fixed
        prop="num"
        label="序号"
        width="50">
        <template #default="scope">
                    {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="维修状态"
        width="120">
        <template #default="{ row }">
              {{ formatStatus(row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="报修日期"
        width="150">
        <template #default="{ row }">
              {{  formatDate(row.start_time) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="报修人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="kind"
        label="报修类别"
        width="140">
         <template #default="{ row }">
              {{  formatKind(row.kind) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address1"
        label="所在苑区"
        width="180">
       <template #default="{ row }">
              {{ row.address}}-{{row.address3}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="address2"
        label="寝室楼号"
        width="100">
        <template #default="{ row }">
              {{ row.address2}}栋
        </template>
      </el-table-column>
      <el-table-column
        prop="address3"
        label="寝室号"
        width="100">
      </el-table-column> -->
      <!-- <el-table-column
        prop="info"
        label="损坏信息"
        width="300">
      </el-table-column> -->
      <el-table-column
        prop="phone"
        label="联系电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="workerName"
        label="维修师傅"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
            <el-button @click="open(scope.row)" type="primary" size="middle">查看</el-button>
            <el-button @click="edit(scope.row)"  type="success" size="middle" v-if="duty==0">修改</el-button>
            <el-button @click="repaired(scope.row)" type="primary" size="middle" v-else-if="duty==1 && scope.row.status != 1">已维修</el-button>
            <el-button @click="repairing(scope.row)" type="primary" size="middle" v-else>待维修</el-button>
            <el-button @click="transfer(scope.row)" type="primary" size="middle" v-if="duty==1 && scope.row.status != 3">转接</el-button>
            <el-button @click="cancelTransfer(scope.row)" type="primary" size="middle" v-if="duty==1 && scope.row.status == 3">取消转接</el-button>
            <el-button @click="remove(scope.row.id)"  type="danger" size="middle" v-if="duty==0">删除</el-button>
        
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
                :total="TableData.length"
              ></el-pagination>

</el-tabs>
</el-card>
<el-dialog
  title="报修详情信息"  
  :visible.sync="DetailDialogVisible"
   width="40%"
   center
   style="letter-spacing: 1px;">{{ info }}<br><br><img :src=info_img />
</el-dialog>
 <el-dialog title="修改报修信息" :visible.sync="editVisible" width="30%">
                <el-form  label-width="80px" :model="editbox">
                <el-form-item label="报修人">
                  <el-input v-model="editbox.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                  <el-input v-model="editbox.phone" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所在苑区">
                  <el-input v-model="editbox.address" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="寝室楼号">
                  <el-input v-model="editbox.address2"></el-input>
                </el-form-item> -->
                <el-form-item label="寝室号">
                  <el-input v-model="editbox.address3" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="报修日期">
                  <el-input v-model=editbox.start_time :disabled="true"> </el-input>
                </el-form-item>
                  <el-form-item label="报修类别">
                   <el-select v-model="editbox.kind" placeholder="请选择">
                  <el-option
                    v-for="(label, value) in kindMap"
                    :key="value"
                    :label="label"
                    :value="value">
                  </el-option>
                </el-select> 
                </el-form-item>
                <el-form-item label="维修状态">
                   <el-select v-model="editbox.status" placeholder="请选择">
                  <el-option
                    v-for="(label, value) in statusMap"
                    :key="value"
                    :label="label"
                    :value="value">
                  </el-option>
                </el-select> 
                </el-form-item>
                 <el-form-item label="维修师傅">
                  <el-select v-model="editbox.worker_id" placeholder="请选择">
                  <el-option
                    v-for="item in workersList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> 
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer"  >
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editpost">确 定</el-button>
              </span>
            </el-dialog>
</div>
</template>

<script>

import { Tab } from 'vant';

  export default {
    data() {
      return {
        isDisabled: false,
        yuan:[],
        lou:[],
        duty: localStorage.getItem("dormitory_duty"),
        name: localStorage.getItem("dormitory_name"),
        dormitory_work_area:localStorage.getItem("dormitory_work_area"),
      status_options: [{
        filterstatus: -1,
        label: '全部'
      }, {
          filterstatus: 0,
        label: '待维修'
      }, {
          filterstatus: 1,
        label: '已维修'
      }, 
      {
          filterstatus: 2,
        label: '已取消'
      }, 
        {
          filterstatus: 3,
        label: '已转对应服务商'
      }, 
    ],
    info:'',
    info_img:'',
    editVisible:false,
    DetailDialogVisible:false,
    editbox:[],
    tableDataCopy:[],
    worker_options: [],
    address_options:[{
    // value: '1',
    //     label: '南苑',
    //     children: [{
    //       value: '11',
    //       label: '1栋',
    //       },
    //       {
    //       value: '12',
    //       label: '2栋',
    //       },
    //   ],
      }],
      filterstatus: -1,
      filterWorker: '',
      filterAddress: '',
          bian:true,
          TableData:[1,1,1],
          AllTableData:[1,1,1],
          PassedTableData:[],
          StartTableData:[],
          MissedTableData:[],
          pageSize:20,
          currentPage:1,
          workersList:{},
          statusMap:{
            0: '待维修',
            1: '已维修',
            2: '已取消',
            3: '已转接对应服务商'
          },
           kindMap : {
            1: '空调维修',
            2: '热水维修',
            3: '网络维修',
            4: '其他维修'
          },
      }
    },
      
    mounted(){
      if (this.duty == 1) {
        this.isDisabled = true;
        this.filterWorker = this.name;
      }
        this.fetchData();
    },
    methods: {

      repaired(row){
        this.$axios.post(`/record/updateStatus?id=${row.id}&status=${1}`)
        row.status = 1;
      },
      repairing(row) {
        this.$axios.post(`/record/updateStatus?id=${row.id}&status=${0}`)
        row.status = 0;
      },
      transfer(row) {
        this.$axios.post(`/record/updateStatus?id=${row.id}&status=${3}`)
        row.status = 3;
      },
      cancelTransfer(row) {
        this.$axios.post(`/record/updateStatus?id=${row.id}&status=${0}`)
        row.status = 0;
      },
      fetchData(){
      
        if (this.duty == 1) {
          this.$axios.get(`/record/getRecordsByAddress?address=${this.dormitory_work_area}`).then((res) => {
            this.TableData=res.data;
            this.tableDataCopy=res.data;
            this.$axios.get(`/area/getArea?address=${localStorage.getItem("dormitory_work_area")}`).then((res) => {
              this.address_options = res.data;
            })
          })
        } else {
          this.$axios.get(`/record/getAllRecords`).then((res) =>{
          this.TableData=res.data;
          this.tableDataCopy=res.data;
          // console.log(res.data)
          this.$axios.get('/area/getAllArea2').then((res) => {
            this.address_options = res.data;
          }).catch((res) => {

          }
        )
        }).catch((res) => {

        })
      }
      },
      // 格式化状态
      formatStatus(status) {
      return this.statusMap[status] || status;
      },
        // 格式化类别
      formatKind(kind) {
      console.log(this.kindMap[kind]);
      return this.kindMap[kind] || kind;
      },
        // 格式化日期
      formatDate(date) {
      const d = new Date(date);
      if (!date) return 'N/A'; // 处理空值
      return date.substring(0, 10);
      },
      findKeyByValue(map, value) {
        // 使用Object.entries()将对象转换为键值对数组
        const entry = Object.entries(map).find(([key, val]) => val === value);
        console.log(entry[0]);
        // 如果找到则返回键，否则返回null
        return entry ? entry[0] : null;
      },
    // 处理筛选变化
      handleFilterChange(){
          if (this.filterAddress) {
            this.filterstatus = -1; // 重置状态筛选
            this.filterWorker = '';   // 重置维修师傅筛选
            
            this.$axios.get(`/record/filterRecords?key=${this.filterAddress}`)
              .then((res) => {
                this.tableDataCopy = res.data; // 更新原始数据副本
                this.applyFilters(); // 应用所有筛选条件
              })
              .catch(error => {
                console.error('地址筛选失败:', error);
                this.$message.error('地址筛选失败');
              });
            return; // 地址筛选需要等待请求完成
          }
          this.applyFilters();
      },
        applyFilters() {
          // 从原始数据开始筛选
          let filteredData = [...this.tableDataCopy];
          
          // 应用状态筛选
          if (this.filterstatus && this.filterstatus !== -1) {
            filteredData = filteredData.filter(record => 
              record.status.toString() === this.filterstatus
            );
          }
          
          // 应用维修师傅筛选
          if (this.filterWorker.trim()) {
            const workerKey = this.filterWorker.toLowerCase().trim();
            filteredData = filteredData.filter(record => 
              record.workerName && record.workerName.toLowerCase().includes(workerKey)
            );
          }
          
          // 更新表格数据
          this.TableData = filteredData;
        },
       getWorkerOptions() {
        this.$axios.get('/user/getAllWorkers').then((res) => {
          this.workersList = res.data.map(worker => ({
            value: worker.id,
            label: worker.name
          }));
        })
       },
  
   
      highlightMatch(text) {
        const regex = new RegExp(this.filterWorker, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
      },
      
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange (size) {
            console.log(size, 'size');
            this.pageSize = size;
            console.log(this.pageSize);
        },
  
        handleCurrentChange (currentPage) {
            this.currentPage = currentPage;
        },
      open(row) {
        this.info=row.info;
        this.info_img=row.info_img;
        this.DetailDialogVisible=true;
    },
    edit(row) {
      this.getWorkerOptions();
      this.editVisible=true;
      const time = this.formatDate(row.start_time);
      const s = this.formatStatus(row.status);
      const k = this.formatKind(row.kind);
      this.editbox={
        id:row.id,
        name:row.name,
        phone:row.phone,
        address:row.address,
        address3:row.address3,
        workerName:row.workerName,
        worker_id:row.worker_id,
        start_time:time,
        status:s,
        kind:k,
      }
        
    },
    editpost(){
      const id = this.editbox.id;
      const worker_id = this.editbox.worker_id;
      const kind = Number(this.editbox.kind);
      const status = Number(this.findKeyByValue(this.statusMap, this.editbox.status));
      console.log(id,worker_id,kind,status);
      this.$axios.post(`/record/updateRecord?id=${id}&worker_id=${worker_id}&kind=${kind}&status=${status}`)
      .then(res => {
        console.log(res.data);
           if (res.data.code === 200) { // 根据实际响应结构调整
             this.$message({
               type: 'success',
               message: '修改成功'
             });
             this.editVisible=false;
             this.fetchData();
           } else {
             this.$message({
               type: 'error',
               message: res.data.message || '修改失败'
             });
           }
         })
      //   .catch(error => {
      //      this.$message({
      //        type: 'error',
      //        message: error.res || '网络请求失败'
      // })
    // })
    },
    remove(id) {
        this.$confirm('确定要删除这条报修记录吗？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          // 用户点击确定后执行删除操作
          this.$axios.post(`/record/removeRecord?id=${id}`)
            .then(res => {
              if (res.data.code === 200) { // 根据实际响应结构调整
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.TableData = this.TableData.filter(item => item.id !== id);
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message || '删除失败'
                });
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error.response?.data?.message || '网络请求失败'
              });
            });
        }).catch(action => {
          // 用户取消操作
          if (action !== 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }
        });
      },
    },

  }
</script>

<style scoped>

.card_header{
    font-size: large;
    border-left: 7px solid rgb(228, 70, 49) ;
    padding-left: 5px;
    margin-bottom: 20px;
}
</style>