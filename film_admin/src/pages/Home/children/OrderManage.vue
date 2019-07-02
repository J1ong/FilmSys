<template>
  <div id="order-manage">
    <!--搜索-->
    <div class="top" style="margin-top: 15px;">
      <el-col :span="12" :offset="6">
        <el-input placeholder="请输入内容" v-model="input" class="input-with-select" style="width: 100%">
          <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
      </el-col>
    </div>
    <!--表格-->
    <div class="order-table">
      <el-table
        height="476px"
        max-height="476px"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户 ID">
                <span>{{ props.row.user_id }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ props.row.user_name }}</span>
              </el-form-item>
              <el-form-item label="电影 ID">
                <span>{{ props.row.movie_id }}</span>
              </el-form-item>
              <el-form-item label="电影名">
                <span>{{ props.row.name}}</span>
              </el-form-item>
              <el-form-item label="影院 ID">
                <span>{{ props.row.cinema_id }}</span>
              </el-form-item>
              <el-form-item label="影院名">
                <span>{{ props.row.cinema_name}}</span>
              </el-form-item>
              <el-form-item label="订单电话">
                <span>{{ props.row.order_phone }}</span>
              </el-form-item>
              <el-form-item label="订单日期">
                <span>{{ props.row.order_date }}</span>
              </el-form-item>
              <el-form-item label="票数">
                <span>{{ props.row.ticket_num}}</span>
              </el-form-item>
              <el-form-item label="总价">
                <span>{{ props.row.ticket_total_price }}</span>
              </el-form-item>
              <el-form-item label="支付方式">
                <span>{{ props.row.pay_type===1?'支付宝':'微信' }}</span>
              </el-form-item>
              <el-form-item label="取票码">
                <span>{{ props.row.phone_code }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="订单 ID"
          align="center"
          width="100"
          prop="order_id">
        </el-table-column>
        <el-table-column
          label="用户名"
          prop="user_name">
        </el-table-column>
        <el-table-column
          label="电影名"
          show-overflow-tooltip
          prop="name">
        </el-table-column>
        <el-table-column
          label="影院名"
          show-overflow-tooltip
          prop="cinema_name">
        </el-table-column>
        <el-table-column
          label="票数"
          prop="ticket_num">
        </el-table-column>
        <el-table-column
          label="总价"
          prop="ticket_total_price">
        </el-table-column>
        <el-table-column
          label="取票码"
          prop="phone_code">
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="order_date">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="block" v-if="tableData.length">
      <el-pagination
        @current-change="currentChange"
        background
        layout="prev, pager, next"
        :page-size="8"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    import {getCurrentPageOrder,deleteOrder} from '../../../api/index'
    import {MessageBox,Message} from 'element-ui'
    export default {
        name: "OrderManage",
        data(){
          return{
            tableData:[],
            total:0,
            currentPage:1,
            dialogFormVisible:false,
            dialogTitle:'',
            labelPosition:'left',
            input:'',
            searchInput:'',
          }
        },
        created() {
          this.loadCurrentPageOrder(this.currentPage,8,'');
        },
        methods:{
          async loadCurrentPageOrder(currentPage,pageSize,input){
            let json = await getCurrentPageOrder(currentPage,pageSize,input);
            if (json.success_code===200){
              this.tableData = json.data;
              this.total = json.total;
            }
          },
          async currentChange(currentPage){
            this.currentPage = currentPage;
            this.loadCurrentPageOrder(this.currentPage,8,this.searchInput);
          },
          //搜索订单
          search(){
            this.searchInput = this.input;
            this.loadCurrentPageOrder(1,8,this.searchInput);
          },
          handleDelete(index, row) {
            MessageBox.confirm('此操作将永久删除该订单所有信息, 是否继续？','提示').then(async (value)=>{
              if (value==='confirm'){
                let json = await deleteOrder(row.order_id,row.schedule_id,row.order_seat_info);
                if (json.success_code===200){
                  Message.success('删除该订单成功！');
                  this.loadCurrentPageOrder(this.currentPage,8,this.searchInput);
                }
              }
            });
            console.log(index, row);
          },
        }
    }
</script>

<style>
  .order-table{
    margin-bottom: 20px;
  }
  .top{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .block{
    text-align: center;
  }
  .el-dialog__header{
    text-align: center;
  }
  .el-dialog__body .el-form-item{
    padding-left: 20%;
  }
</style>
