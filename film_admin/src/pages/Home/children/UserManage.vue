<template>
  <div id="user-manage">
    <!--搜索-->
    <div class="top">
      <el-col :span="12">
        <el-input
          placeholder="请输入内容"
          v-model="input"
          class="input-with-select"
          clearable
          style="width: 100%"
        >
          <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
      </el-col>
    </div>
    <!--表格-->
    <div class="user-table">
      <el-table border :data="tableData">
        <el-table-column label="用户 ID" align="center" width="100" prop="user_id"></el-table-column>
        <el-table-column
          label="用户名"
          align="center"
          width="120"
          show-overflow-tooltip
          prop="user_name"
        ></el-table-column>
        <el-table-column label="性别" align="center" width="60" prop="sex"></el-table-column>
        <el-table-column label="手机" align="center" width="120" prop="phone"></el-table-column>
        <el-table-column label="个人签名" show-overflow-tooltip prop="sign"></el-table-column>
        <el-table-column align="center" width="200" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">注销</el-button>
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
        :total="total"
      ></el-pagination>
    </div>
    <!--用户弹框-->
    <div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        :modal-append-to-body="false"
        v-if="dialogFormVisible"
        :show-close="false"
      >
        <el-form
          :label-position="labelPosition"
          :rules="rules"
          label-width="80px"
          :model="userInfo"
        >
          <el-form-item label="用户名" prop="user_name">
            <el-col :span="16">
              <el-input v-model="userInfo.user_name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="头像">
            <el-col :span="16">
              <img
                :src="userInfo.avatar?userInfo.avatar:server+'/images/avatar/monkey.png'"
                ref="previewImg"
                alt
                width="80px"
                height="80px"
              />
              <div style="position: relative;height: 64px">
                <el-button
                  size="small"
                  type="primary"
                  style="position: absolute;left: 0;top: 0;cursor: pointer"
                >点击上传</el-button>
                <input
                  type="file"
                  id="file"
                  name="file"
                  ref="uploadImg"
                  accept="image/png, image/jpeg, image/gif, image/jpg"
                  style="position: absolute;left: 0;top: 0;opacity: 0;height: 32px;width: 80px;cursor: pointer"
                  @change="changeImg"
                />
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="position: absolute;left: 0;top: 32px;height: 32px"
                >只能上传jpg/png文件，且不超过500kb（默认为系统头像）</div>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-col :span="16">
              <el-input v-model="userInfo.phone"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-col :span="16">
              <el-input v-model="userInfo.password" show-password></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="性别">
            <el-col :span="16">
              <el-select v-model="userInfo.sex" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="生日">
            <el-col :span="16">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="userInfo.birthday"
                :picker-options="pickerBirthday"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="个人签名">
            <el-col :span="16">
              <el-input
                type="textarea"
                v-model="userInfo.sign"
                :autosize="{ minRows: 2, maxRows: 4}"
              ></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="manageUserInfo()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getCurrentPageUser,
  upLoadImg,
  updateUserInfo,
  deleteUserInfo,
  addUserInfo
} from "../../../api/index";
import { MessageBox, Message } from "element-ui";
export default {
  name: "UserManage",
  data() {
    let checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空！"));
      } else {
        callback();
      }
    };
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号码"));
      } else {
        if (/^1[3|4|5|6|7|8][0-9]{9}$/.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确格式的手机号码"));
        }
      }
    };
    let checkPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      //服务器地址
      server: "http://localhost:3000",
      tableData: [],
      total: 0,
      currentPage: 1,
      userInfo: {},
      dialogFormVisible: false,
      dialogTitle: "",
      labelPosition: "right",
      input: "",
      searchInput: "",
      rules: {
        user_name: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      pickerBirthday: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    this.loadCurrentPageUser(this.currentPage, 8, "");
  },
  methods: {
    async loadCurrentPageUser(currentPage, pageSize, input) {
      let json = await getCurrentPageUser(currentPage, pageSize, input);
      if (json.success_code === 200) {
        this.tableData = json.data;
        this.total = json.total;
      }
    },
    handleEdit(index, row) {
      this.dialogTitle = "编辑用户信息";
      this.userInfo = row;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      MessageBox.confirm(
        "此操作将永久删除该用户所有信息, 是否继续？",
        "提示"
      ).then(async value => {
        if (value === "confirm") {
          let json = await deleteUserInfo(row.user_id);
          if (json.success_code === 200) {
            Message.success("删除该用户成功！");
            this.loadCurrentPageUser(this.currentPage, 8, this.searchInput);
          }
        }
      });
      console.log(index, row);
    },
    async currentChange(currentPage) {
      this.currentPage = currentPage;
      this.loadCurrentPageUser(this.currentPage, 8, this.searchInput);
    },
    changeImg(e) {
      let reader = new FileReader();
      reader.readAsDataURL(this.$refs.uploadImg.files[0]); //发起异步请求
      let _this = this;
      reader.onload = function() {
        //读取完成后，将结果赋值给img的src
        _this.$refs.previewImg.src = this.result;
        _this.userInfo.avatar = this.result;
      };
    },
    //修改用户信息
    async manageUserInfo() {
      if (
        !this.userInfo.user_name ||
        !/^1[3|4|8|6|7|8][0-9]{9}$/.test(this.userInfo.phone) ||
        !this.userInfo.password
      ) {
        Message.error("请完成必填内容！");
        return false;
      } else {
        let formData = new FormData();
        formData.append("file", this.$refs.uploadImg.files[0]);
        let json = await upLoadImg(formData);
        if (json.success_code === 200) {
          if (this.userInfo.birthday) {
            let date = new Date(this.userInfo.birthday);
            this.userInfo.birthday =
              date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getDate();
          }
          if (json.data.length) {
            this.userInfo.avatar = "/images/avatar/" + json.data[0].filename;
          }
          if (this.dialogTitle === "编辑用户信息") {
            json = await updateUserInfo(
              this.userInfo.user_id,
              this.userInfo.user_name,
              this.userInfo.avatar,
              this.userInfo.password,
              this.userInfo.sex,
              this.userInfo.phone,
              this.userInfo.sign,
              this.userInfo.birthday
            );
            if (json.success_code === 200) {
              this.dialogFormVisible = false;
              Message.success("修改用户信息成功！");
            } else if (json.error_code === 1) {
              Message.error(json.message);
            }
          } else {
            json = await addUserInfo(
              this.userInfo.user_name,
              this.userInfo.avatar,
              this.userInfo.phone,
              this.userInfo.password,
              this.userInfo.sex,
              this.userInfo.sign,
              this.userInfo.birthday
            );
            if (json.success_code === 200) {
              this.loadCurrentPageUser(this.currentPage, 8, this.searchInput);
              this.dialogFormVisible = false;
              Message.success("添加用户成功！");
            } else if (json.error_code === 1) {
              Message.error(json.message);
            }
          }
        }
      }
    },
    cancel() {
      this.loadCurrentPageUser(this.currentPage, 8, this.searchInput);
      this.dialogFormVisible = false;
    },
    //搜索用户
    search() {
      this.searchInput = this.input;
      this.loadCurrentPageUser(1, 8, this.searchInput);
    },
    //添加用户
    addUser() {
      this.dialogTitle = "添加用户";
      this.userInfo = {};
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style scoped>
.user-table {
  width: 90%;
  min-width: 900px;
  margin: 0 auto;
  margin-bottom: 30px;
}
.top {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  margin-bottom: 30px;
}
.block {
  text-align: center;
}
.el-dialog__header {
  text-align: center;
}
.el-dialog__body .el-form-item {
  padding-left: 20%;
}
</style>
