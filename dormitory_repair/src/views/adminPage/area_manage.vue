<template>
    <div class="card_container">
    <el-card>
        <el-tabs type="border-card" >
            <el-row style="margin: 20px 10px;width: 60%;display: flex;">
            <el-col :span="8" >
                <span>姓名：</span>
              <el-select v-model="filterWorker" placeholder="请选择" @change="filterChange">
                  <el-option
                    v-for="item in worker_options"
                    :key="item.filterWorker"
                    :label="item.label"
                    :value="item.filterWorker">
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
        width="320">
        <template #default="scope">
                    {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="宿舍楼号"
        width="380">
      </el-table-column>
      <el-table-column
        prop="telepohone"
        label="联系电话"
        width="250">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250">
        <template slot-scope="scope">
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
         this.$confirm('确定要删除这一楼栋信息吗？', '确认信息', {
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
      worker_options: [],
      address_options:[],
     filterWorker: 'wanglili',
           
        TableData:[1,1,1],
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