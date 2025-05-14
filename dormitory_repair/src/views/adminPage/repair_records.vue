<template>
    <div class="card_container">
    <el-card>
        <el-tabs type="border-card" >
            <el-row style="margin: 20px 10px;width: 80%;display: flex;">
            <el-col :span="8" >
                <span>报修状态：</span>
              <el-select v-model="filterstatus" placeholder="请选择" @change="filterChange">
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
              <el-select v-model="filterWorker" placeholder="请选择" @change="filterChange">
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
              <el-select v-model="filterAddress" placeholder="请选择" @change="filterChange">
                  <el-option
                    v-for="item in address_options"
                    :key="item.filterAddress"
                    :label="item.label"
                    :value="item.filterAddress">
                  </el-option>
                </el-select> 
               </el-col>
               
                 <el-button type="primary" round style="width: 10%;">查询</el-button>

          </el-row>
    <el-table
      :data="tableData"
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
      </el-table-column>
      <el-table-column
        prop="date"
        label="报修日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="报修人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dormitory_num"
        label="报修类别"
        width="140">
      </el-table-column>
      <el-table-column
        prop="address"
        label="所在苑区"
        width="120">
      </el-table-column>
      <el-table-column
        prop="dormitory_num"
        label="寝室楼号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="dormitory_num"
        label="寝室号"
        width="100">
      </el-table-column>
      <!-- <el-table-column
        prop="info"
        label="损坏信息"
        width="300">
      </el-table-column> -->
      <el-table-column
        prop="telepohone"
        label="联系电话"
        width="150">
      </el-table-column>
      <el-table-column
        prop="worker"
        label="维修师傅"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="open(scope.row)" type="text" size="middle">查看</el-button>
          <el-button @click="edit(scope.row)"  type="text" size="middle">修改</el-button>
          <el-button @click="remove(scope.row)"  type="text" size="middle">删除</el-button>
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
   style="letter-spacing: 1px;">{{ info }}

</el-dialog>
</div>
  </template>
  
  <script>
    export default {
      methods: {
        filterChange(){
            if(this.filterCollege==='全部'){
                this.TableData=this.AllTableData;
            }
            if(this.filterCollege==='已维修'){
                this.TableData=this.PassedTableData;
            }
            if(this.filterCollege==='待维修'){
                this.TableData=this.RepairTableData;
            }
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
          this.DetailedId = row;
          this.DetailDialogVisible=true;
          //this.$axios   // 获取报修记录的id
           // .get(`/team/getApplicantNameById?userId=${row.informantId}`)
           // .then((res) => {
           //   this.applicantName = res.data.data.username;
           // })
      },
      edit(row) {
        this.DetailedId = row;
          //this.$axios   // 获取报修记录的id
           // .get(`/team/getApplicantNameById?userId=${row.informantId}`)
           // .then((res) => {
           //   this.applicantName = res.data.data.username;
           // })
      },
      remove(row) {
        this.DetailedId = row;
          //this.$axios   // 获取报修记录的id
           // .get(`/team/getApplicantNameById?userId=${row.informantId}`)
           // .then((res) => {
           //   this.applicantName = res.data.data.username;
           // })
         this.$confirm('确定要删除这条报修记录吗？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.$message({
              type: 'info',
              message: '删除成功'
            });
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          });
      },

      },
  
      data() {
        return {
            status_options: [{
          filterstatus: '全部',
          label: '全部'
        }, {
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
      info:'12316465',
      DetailedId:'',
      DetailDialogVisible:false,
      worker_options: [],
      address_options:[],
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
            tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1517 弄',
            zip: 200333
          }, {
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1519 弄',
            zip: 200333
          }, {
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1516 弄',
            zip: 200333
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1517 弄',
            zip: 200333
          },]
        }
      },
    }
  </script>