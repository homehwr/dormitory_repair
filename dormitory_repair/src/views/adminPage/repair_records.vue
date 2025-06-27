<template>
    <div class="card_container">
    <el-card>
        <el-tabs type="border-card" >
            <el-row style="margin: 20px 10px;width: 80%;display: flex;">
            <el-col :span="8" >
                <span>报修状态：</span>
              <el-select v-model="filterstatus" placeholder="请选择" @change="handleFilterChange1">
                  <el-option
                    v-for="item in status_options"
                    :key="item.filterstatus"
                    :label="item.label"
                    :value="item.filterstatus">
                  </el-option>
                </el-select> 
               </el-col>
            <el-col :span="8">
                <span>维修师傅：</span>
              <el-select v-model="filterWorker" placeholder="请选择" @change="handleFilterChange2">
=======
              <el-select v-model="filterWorker" placeholder="请选择" @change="handleFilterChange" :disabled="isDisabled">
>>>>>>> 83d2d471e535d84af50991527851c3c3a45f2f63
                  <el-option
                    v-for="item in worker_options"
                    :key="item.filterWorker"
                    :label="item.label"
                    :value="item.filterWorker">
                  </el-option>
                </el-select> 
               </el-col>
               <el-col :span="8">
                <span>所在区域：</span>
                <el-cascader
                v-model="filterAddress"
                :options="address_options"
                 @change="handleFilterChange3"></el-cascader>
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
        width="100">
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
        width="120">
        <template #default="{ row }">
              {{  formatAddress(row.address1) }}
        </template>
      </el-table-column>
      <el-table-column
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
      </el-table-column>
      <!-- <el-table-column
        prop="info"
        label="损坏信息"
        width="300">
      </el-table-column> -->
      <el-table-column
        prop="phone"
        label="联系电话"
        width="150">
      </el-table-column>
      <el-table-column
        prop="worker_id"
        label="维修师傅"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button @click="open(scope.row)" type="primary" size="middle">查看</el-button>
          <el-button @click="edit(scope.row)"  type="success" size="middle">修改</el-button>
          <el-button @click="remove(scope.row.id)"  type="danger" size="middle">删除</el-button>
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
 <el-dialog title="修改保修信息" :visible.sync="editVisible" width="30%" :before-close="handleClose">
                <el-form  label-width="80px" :model="editbox">
                <el-form-item label="报修人">
                  <el-input v-model="editbox.name"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                  <el-input v-model="editbox.phone"></el-input>
                </el-form-item>
                <el-form-item label="所在苑区">
                  <el-input v-model="editbox.address1"></el-input>
                </el-form-item>
                <el-form-item label="寝室楼号">
                  <el-input v-model="editbox.address2"></el-input>
                </el-form-item>
                <el-form-item label="寝室号">
                  <el-input v-model="editbox.address3"></el-input>
                </el-form-item>
                <el-form-item label="维修师傅">
                  <el-input v-model="editbox.worker_id"></el-input>
                </el-form-item>
                <el-form-item label="保修日期">
                  <el-input v-model=editbox.start_time></el-input>
                </el-form-item>
                <el-form-item label="维修状态">
                  <el-input v-model="editbox.status"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer"  >
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editpost(editbox)">确 定</el-button>
              </span>
            </el-dialog>
</div>
  </template>
  
  <script>
    export default {
         
       
      mounted(){
        if (this.duty == 1) {
          this.isDisabled = true;
          this.filterWorker = this.name;
        }
         this.fetchData();
      },
      methods: {
        fetchData(){
          if (this.duty == 1) {
            this.area = this.dormitory_work_area.split(",");
            
          } else {
          if (this.duty == 1) {
            this.area = this.dormitory_work_area.split(",");
            
          } else {
            this.$axios.get(`/record/getAllRecords`).then((res) =>{
            this.TableData=res.data;
            this.tableDataCopy=res.data;
            // console.log(res.data)
          })
        },
        // 格式化状态
        formatStatus(status) {
        const map = {
            0: '待维修',
            1: '已维修',
            2: '已转对应服务商',
            3: '已取消'
        }
        return map[status] || status;
        },
         // 格式化类别
        formatKind(kind) {
        const map = {
            1: '空调维修',
            2: '热水维修',
            3: '网络维修',
            4: '其他维修',
        }
        return map[kind] || kind;
        },
        formatAddress(address1) {
        const map = {
            1: '南苑',
            2: '西苑',
            3: '北苑'
        }
        return map[address1] || address1;
        },
         // 格式化日期
        formatDate(date) {
        const d = new Date(date);
        if (!date) return 'N/A'; // 处理空值
        return date.substring(0, 10);
        },
        // 处理筛选变化
    handleFilterChange1() {
       console.log(this.filterstatus);
       if (!this.filterstatus.trim()) {
          this.tableData = this.tableDataCopy;
          return;
        }
        const searchTerm = this.filterstatus.toLowerCase().trim();
        this.tableData = this.tableData.filter(records => {
          // 这里实现了模糊匹配
          return records.status.toLowerCase().includes(searchTerm);
        });
     
    },
     handleFilterChange2() {
       if (!this.filterstatus.trim()) {
          this.tableData = this.tableDataCopy;
          return;
        }
        const searchTerm = this.filterstatus.toLowerCase().trim();
        this.tableData = this.tableData.filter(records => {
          // 这里实现了模糊匹配
          return records.status.toLowerCase().includes(searchTerm);
        });
     
    },
     handleFilterChange3() {
       if (!this.filterstatus.trim()) {
          this.tableData = this.tableDataCopy;
          return;
        }
        const searchTerm = this.filterstatus.toLowerCase().trim();
        this.tableData = this.tableData.filter(records => {
          // 这里实现了模糊匹配
          return records.status.toLowerCase().includes(searchTerm);
        });
     
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
          //this.$axios   // 获取报修记录的id
           // .get(`/team/getApplicantNameById?userId=${row.informantId}`)
           // .then((res) => {
           //   this.applicantName = res.data.data.username;
           // })
      },
      edit(row) {
        this.editVisible=true;
        this.editbox=row;
         
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
  
      data() {
        return {
<<<<<<< HEAD
            status_options: [ {
=======
          area:[],
          isDisabled: false,
          duty: localStorage.getItem("dormitory_duty"),
          name: localStorage.getItem("dormitory_name"),
          dormitory_work_area:localStorage.getItem("dormitory_work_area"),
            status_options: [{
          filterstatus: '全部',
          label: '全部'
        }, {
>>>>>>> 83d2d471e535d84af50991527851c3c3a45f2f63
            filterstatus: '待维修',
          label: '待维修'
        }, {
            filterstatus: '已维修',
          label: '已维修'
        }, 
        {
            filterstatus: '已转对应服务商',
          label: '已转对应服务商'
        }, 
        {
            filterstatus: '已取消',
          label: '已取消'
        }, 
      ],
      info:'',
      info_img:'',
      editVisible:false,
      DetailDialogVisible:false,
      editbox:[

      ],
      tableDataCopy:[],
      worker_options: [],
      address_options:[{
      value: '1',
          label: '南苑',
          children: [{
            value: '11',
            label: '1栋',
            children:[{
                value:'101',
                label:'101'
            },{
                value:'102',
                label:'102'
            }]
            },
            {
            value: '12',
            label: '2栋',
            },
        ],
        }],
        filterstatus: '全部',
        filterWorker: 'wanglili',
        filterAddress: '南苑',
        bian:true,
        TableData:[1,1,1],
        AllTableData:[1,1,1],
        PassedTableData:[],
        StartTableData:[],
        MissedTableData:[],
        pageSize:20,
        currentPage:1,
        }
      },
    }
  </script>