<template>
    <div class="newOrganization">
        <div class="account shadowLy">
            <div class="left-panel-title">
                <span>{{mechanism}}</span>
            </div>
             <el-form  ref="form" :model="form" label-width="80px" style="margin:20px">
                <el-form-item label="上属省企业党组织" class="l10">
                    <el-input  v-model="topName" disabled></el-input>
                </el-form-item>
                <el-form-item label="隶属上级党组织"  class="l10 f_red" >
                    <el-input v-model="form.zipCode" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="党组织名称" class="l10 fl" style="margin:0 0 20px 0;" prop="orgName">
                    <el-input class="fl" v-model="form.orgName" :disabled="isEdit" @click.native="dialogTableVisible=true"></el-input>
                    <div v-if="form.orgName" class="fl">
                       <span @click="cancelVaulue" class="f_cancel">取消选择</span>
                    </div>
                    </el-form-item>
                 <p style="font-size:12px;color:red;line-height:40px;">灯塔内企业,请选择对应党组织名称进行关联</p>
                
                <el-form-item label="所在党组织全称" prop="name" style="margin-top:10px" class=" f_red clear l10">
                    <el-input v-model="form.name" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="所在党组织简称" prop="shortName" class=" f_red l10">
                    <el-input v-model="form.shortName"></el-input>
                </el-form-item>
                <el-form-item label="企业分类" prop="typeList" class=" f_red l10">
                     <el-select v-model="form.typeList" multiple placeholder="请选择企业分类">
                        <el-option
                        v-for="item in tabelType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织人数" class="f_red l10">
                    <el-input v-model="form.fax" type="number" :disabled="isEdit"></el-input>
                </el-form-item>
                 <el-form-item label="组织类别" prop="email" class="f_red l10">
                   <el-input v-model="form.email" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="负责人" class="l10">
                    <el-input v-model="form.master"></el-input>
                </el-form-item>
                 <el-form-item label="联系人" class="l10">
                    <el-input v-model="form.primaryPerson"></el-input>
                </el-form-item>
                 <el-form-item label="电话" prop="phone" class="l10">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                 <el-form-item label="显示顺序" class="l10">
                    <el-input v-model="form.sort" type="number"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" class="l10">
                    <el-input type="textarea" v-model="form.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div class="button">
                <input type="button" class="f_btn f_deepBlue" @click="submitForm('form')"  value="保存">
                <input type="button" value="返回" class="f_btn" style="color:#000;margin-left:20px" @click="onReturn">
            </div>
        </div>
        <el-dialog title="" :visible.sync="dialogTableVisible">
            <div>
                <el-input v-model="wordName" class="fl" style="width:280px" placeholder="请输入党组织名称"></el-input>
                <button class="f_btn f_purple default fl" style="margin-left:20px" @click="onQuery">查询</button>
            </div>
            <div class="cle"></div>
            <el-table :data="gridData" stripe border style="margin-top:20px;height:300px;overflow-y: auto;">
                <el-table-column property="org_name" label="党组织名称"></el-table-column>
                <el-table-column porperty="" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" style="padding:5px 10px" @click="seleteMenu(scope.row)">添加</el-button>  
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax } from "../../../api/api.js";

export default {
  created() {
    if (this.editId) {
      //修改
      //   console.log(this.editId);
      this.mechanism = "机构修改";
      this.isEdit = true;
      this.editMechanism(this.editId);
    }
    if (this.newId) {
      //新建
      this.topWordName(this.newId);
    }
    this.MechanismType(); //企业分类
  },
  data() {
    return {
      editId: this.$route.query.editId, //编辑
      newId: this.$route.query.newId, //添加
      mechanism: "机构添加", //导航名字
      topName: "", ////上属省企业党组织
      isEdit: false, //修改状态是否可编辑,
      verifiShow: true, //判断验证是否通过使用
      form: {
        typeList: [],
        fax: 0
      },
      tabelType: [], //企业分类
      dialogTableVisible: false, //弹窗
      gridData: [], //弹窗里面的表格
      wordName: "" //弹窗里面输入框的内容
    };
  },
  methods: {
    topWordName(id) {
      //上属省企业党组织
      postAjax("ajax/officeTree/sysOfficeTree/getParent/" + id).then(res => {
        if (res.status == 200) {
          this.topName = res.data.data.parent.shortName;
          this.form.parentId = res.data.data.parent.id;
        }
      });
    },
    editMechanism(id) {
      //修改机构信息
      postAjax("ajax/officeTree/sysOfficeTree/info/" + id).then(res => {
        if (res.status == 200) {
          let date = res.data.data;
          this.topName = date.parent.shortName; //上属省企业党组织
          this.form = {
            id: date.id, //id
            parentId: date.parent.id, //	父级ID
            name: date.name, //	组织名称
            code: date.code, //组织编码
            email: date.email, //组织类别
            fax: date.fax, //	党组织人数
            master: date.master, //	负责人
            orgId: date.orgId, //	组织ID
            orgName: date.name, //组织名称
            phone: date.phone, //	联系电话
            primaryPerson: date.primaryPerson, //	联系人
            remarks: date.remarks, //	备注
            shortName: date.shortName, //简短名称
            sort: date.sort, //	排序值
            typeList: date.typeList, //	企业分类
            zipCode: date.zipCode //上级党组织名称
          };
        }
      });
    },
    MechanismType() {
      //企业类别
      postAjax("ajax/meeting/taskMeeting/getDict?type=qylb").then(res => {
        this.tabelType = res.data;
      });
    },
    submitForm() {
      //保存之前的验证
      if (this.editId) {
        //如果是修改
        this.isFrom(); //先做其他的一些无法直接验证必填的
        if(!this.verifiShow){
          return;
        }
        this.editCorrect(); //通过验证则保存修改
      }
      if (this.newId) {
        //如果是添加
        this.isFrom(); //先做其他的一些无法直接验证必填的
         if(!this.verifiShow){
          return;
        }
        this.correct(); //通过验证则保存
      }
    },
    Verification() {
      //验证提示
      this.$message({
        message: "您填的信息有误,请进行核实后在保存!!!",
        type: "warning"
      });
    },
    isFrom() {
      this.verifiShow=true;
      //判断其他的一些无法直接验证必填的
      if (!this.form.zipCode) {
        //隶属上级党组织
        this.Verification();
        this.verifiShow = false;
      }
      if (!this.form.name) {
        //所在党组织全称
        this.Verification();
        this.verifiShow = false;
      }
      if (this.form.fax == "") {
        //组织人数
        this.form.fax=0;
      }
      if (!this.form.email) {
        //组织类别
        this.Verification();
        this.verifiShow = false;
      }
      if (!this.form.typeList) {
        //企业分类
        this.Verification();
        this.verifiShow = false;
      }
      if (!this.form.shortName) {
        //组织简称
        this.Verification();
        this.verifiShow = false;
      }
      if (this.form.remarks) {//备注
        if (this.form.remarks.length > 1000) {
          this.$message({
            message: "备注字符不得超过1000!!!",
            type: "warning"
          });
          this.verifiShow = false;
        }
      }
    },
    editCorrect() {
      //如果是修改
      postAjax("ajax/officeTree/sysOfficeTree/update", this.form).then(res => {
        if (res.data.state== 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({
            name: "organizationManagement"
          });
        }else{
           this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    correct() {
      //验证通过后保存
      postAjax("ajax/officeTree/sysOfficeTree/save", this.form).then(res => {
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({
            name: "organizationManagement"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    onQuery() {
      //弹窗框里面的查询
      postAjax("orgjdbc/list?orgName=" + this.wordName).then(res => {
        if (res.status == 200) {
          this.gridData = res.data;
        }
      });
    },
    seleteMenu(obj) {
      //添加党组织名称
      this.form.orgName = obj.org_name; //组织名称
      this.form.zipCode = obj.parent_id; //隶属上级党组织
      this.form.fax = obj.pelNum; //组织人数
      this.form.email = obj.d01021; //组织类型
      this.form.code = obj.code; //code
      this.form.name = this.form.orgName;
      this.dialogTableVisible = false;
      this.isEdit = true;
    },
    cancelVaulue() {
      //取消选择的党组织名称
      // console.log(this.form.orgName)
      this.form.orgName = "";
      this.form.zipCode = "";
      this.form.fax = "";
      this.form.name = "";
      this.form.email = "";
      this.isEdit = false;
    },
    onReturn() {
      //返回
      window.history.back(-1);
    }
  }
};
</script>

<style scoped>
.account {
  width: 99%;
  margin: 10px auto;
  box-sizing: border-box;
  border-radius: 5px;
  padding-bottom: 20px;
}
.button {
  margin-left: 50px;
}
.f_cancel {
  cursor: pointer;
  color: #4ba4db;
  padding-right: 10px;
}
.f_cancel:hover {
  color: #ec391a;
}
.f_red {
  position: relative;
}

.f_red::before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  top: 10px;
  left: -3px;
}
</style>
