<template>
    <div class="card_container">
    <el-card>
        <el-tabs type="border-card" >
            <div class="area_header">&nbsp;&nbsp;宿舍区域管理</div>
            <!-- <el-row style="margin: 20px 10px;width: 60%;display: flex;">
            <el-col :span="8" >
                <span>姓名：</span>
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
          </el-row> -->
          <el-table
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="address1"
      label="苑区"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="address2"
      label="宿舍楼号">
    </el-table-column>
    <el-table-column
        label="操作"
        width="150">
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
                :total="tableData.length"
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
                this.tableData=this.AllTableData;
            }
            if(this.filterCollege==='已维修'){
                this.tableData=this.PassedTableData;
            }
            if(this.filterCollege==='待维修'){
                this.tableData=this.RepairTableData;
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
      address_options:[],
      filterAddress: '南苑',
      bian:true, 
        pageSize:20,
        currentPage:1,
        tableData: [{
          id: 1,
          address1: '南苑',
          children: [{
              id: 11,
              address2: '1'
            }, {
              id: 12,
              address2: '2'
          }]
        }, {
          id: 2,
          address1: '西苑',
          children: [{
              id: 21,
              address2: '1'
            }, {
              id: 22,
              address2: '2'
          }]
        }, {
          id: 3,
          address1: '北苑',
          children: [{
              id: 31,
              address2: '1栋'
            }, {
              id: 32,
              address2: '2栋'
          }]
        }, ],
        }
      },
    }
  </script>
<style scoped>
.area_header{
    border-left: 7px solid rgb(228, 70, 49) ;
    font-size: large;
    font-weight: 500;
    margin-bottom: 20px;
}
</style>