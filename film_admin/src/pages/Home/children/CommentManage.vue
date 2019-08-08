<template>
    <div id="comment-manage">
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
      <div class="comment-table">
        <el-table
          border
          height="476px"
          max-height="476px"
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
                <el-form-item label="评论时间">
                  <span>{{ props.row.comment_date }}</span>
                </el-form-item>
                <el-form-item label="用户评分">
                  <span>{{ props.row.user_score }}</span>
                </el-form-item>
                <el-form-item label="点赞数">
                  <span>{{ props.row.support_num}}</span>
                </el-form-item>
                <el-form-item label="评论内容">
                  <span>{{ props.row.comment_content }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="评论 ID"
            align="center"
            width="100"
            prop="comment_id">
          </el-table-column>
          <el-table-column
            label="用户名"
            prop="user_name">
          </el-table-column>
          <el-table-column
            label="电影名"
            prop="name">
          </el-table-column>
          <el-table-column
            label="评论时间"
            prop="comment_date">
          </el-table-column>
          <el-table-column
            label="用户评分"
            prop="user_score">
          </el-table-column>
          <el-table-column
            label="评论内容"
            show-overflow-tooltip
            prop="comment_content">
          </el-table-column>
          <el-table-column label="操作">
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
