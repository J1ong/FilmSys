<template>
    <div id="comment-manage">
      <!--搜索-->
      <div class="top">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select" style="width: 100%">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="1">
        </el-col>
      </div>
      <!--表格-->
      <div class="comment-table">
        <el-table
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="评论 ID"
            align="center"
            width="100"
            prop="comment_id">
          </el-table-column>
          <el-table-column
            label="用户名"
            width="120"
            show-overflow-tooltip
            prop="user_name">
          </el-table-column>
          <el-table-column
            label="电影名"
            show-overflow-tooltip
            prop="name">
          </el-table-column>
          <el-table-column
            label="评论时间"
            show-overflow-tooltip
            prop="comment_date">
          </el-table-column>
          <el-table-column
            label="用户评分"
            width="80"
            align="center"
            prop="user_score">
          </el-table-column>
          <el-table-column
            label="评论内容"
            show-overflow-tooltip
            prop="comment_content">
          </el-table-column>
          <el-table-column 
          align="center"
          label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.is_pass"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">通过</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    import {MessageBox,Message} from 'element-ui'
    import {getCurrentPageComment,passCurrentComment,deleteCurrentComment} from '../../../api/index'
    import moment from 'moment'
    export default {
        name: "CommentManage",
        data() {
          return {
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
        created(){
          this.loadCurrentPageComment(this.currentPage,8,'');
        },
        methods: {
          async loadCurrentPageComment(currentPage,pageSize,input){
            let json = await getCurrentPageComment(currentPage,pageSize,input);
            if (json.success_code===200){
              this.tableData = json.data;
              this.tableData.forEach(value => {
                value.comment_date = moment(value.comment_date).format('YYYY-MM-DD HH:mm:ss');
              });
              this.total = json.total;
            }
          },
          async currentChange(currentPage){
            this.currentPage = currentPage;
            this.loadCurrentPageComment(this.currentPage,8,this.searchInput);
          },
          //搜索评论
          search(){
            this.searchInput = this.input;
            this.loadCurrentPageComment(1,8,this.searchInput);
          },
          async handleEdit(index, row) {
            console.log(index, row);
            let json = await passCurrentComment(row.comment_id,row.movie_id);
            if (json.success_code===200){
              this.loadCurrentPageComment(this.currentPage,8,this.searchInput);
              Message.success('评论审核通过！');
            }
          },
          async handleDelete(index, row) {
            console.log(index, row);
            MessageBox.confirm('此操作将永久删除该评论所有信息, 是否继续？','提示').then(async (value)=>{
              if (value==='confirm'){
                let json = await deleteCurrentComment(row.comment_id,row.movie_id);
                if (json.success_code===200){
                  this.loadCurrentPageComment(this.currentPage,8,this.searchInput);
                  Message.success('删除该评论成功！');
                }
              }
            });
          }
        },
    }
</script>

<style>
  .comment-table{
    width:90%;
    min-width:900px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .top{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    margin-bottom: 30px;
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
