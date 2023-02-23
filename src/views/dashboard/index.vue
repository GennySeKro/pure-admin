<template>
  <div>
    <header class="dashboard-header">
      <div class="flow-capture">
        <el-row class="mb-4">
          <!--        抓包控制，与宋可飞工作衔接-->
          <el-button
            type="primary"
            :disabled="startAble"
            @click="dialogFormVisible = true"
            >开始抓包</el-button
          >
          <el-button type="primary" :disabled="!startAble" @click="terminate"
            >停止抓包</el-button
          >
        </el-row>
      </div>
      <div>
        <el-dialog v-model="dialogFormVisible" title="请填写抓包配置">
          <el-form
            :rules="rules"
            :model="form"
            ref="ruleFormRef"
            :label-width="formLabelWidth"
          >
            <el-form-item label="网卡">
              <el-select v-model="form.nic" placeholder="Select">
                <el-option
                  v-for="item in nicList"
                  :key="item.id"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="源ip地址" prop="src_ip">
              <el-select v-model="form.src_ip" placeholder="Select">
                <el-option
                  v-for="item in ipList"
                  :key="item.id"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="目的ip地址" prop="dst_ip">
              <el-input v-model="form.dst_ip" placeholder="请输入目的ip地址" />
            </el-form-item>

            <el-form-item label="源端口号">
              <el-input-number
                v-model="form.src_port"
                placeholder="请输入源端口号"
                :min="0"
                :max="65535"
                :precision="0"
              />
            </el-form-item>

            <el-form-item label="目的端口号">
              <el-input-number
                v-model="form.dst_port"
                placeholder="请输入目的端口号"
                :min="0"
                :max="65535"
                :precision="0"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="start(ruleFormRef, form)">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </header>

    <div class="dashboard-container">
      <div>
        <iframe
          src="http://10.128.221.157:3000/d/VfaeU314z/test?orgId=1&refresh=1s&from=now-5m&to=now&kiosk=tv"
          width="1500"
          height="900"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  FlowRequest,
  FlowResult,
  flowStart,
  flowTerminate,
  getNicList,
  getIpList
} from "@/api/dashboard";
import { FormRules } from "element-plus";
import { validateIPv4 } from "@/utils/validate";
import type { FormInstance } from "element-plus";
import { ElNotification } from "element-plus";
defineOptions({
  name: "Dashboard"
});

// 定义表单，向服务端传送输入的数据
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
const ruleFormRef = ref<FormInstance>();
const form: FlowRequest = reactive({
  // 定义表单默认值
  nic: "",
  src_ip: "",
  dst_ip: "101.200.132.223",
  src_port: 50020,
  dst_port: 5022
});
const nicList = ref([]);
const ipList = ref([]);
const startAble = ref(false);
const rules = reactive<FormRules>({
  src_ip: [{ required: true, validator: validateIPv4, trigger: "blur" }],
  dst_ip: [{ required: true, validator: validateIPv4, trigger: "blur" }]
});

async function start(ruleForm: FormInstance, formEl: FlowRequest) {
  await ruleForm.validate(valid => {
    if (valid) {
      this.dialogFormVisible = false;
      return new Promise<FlowResult>((resolve, reject) => {
        flowStart(formEl)
          .then(res => {
            console.log(res.success);
            startAble.value = !startAble.value;
            startSuccess();
            resolve(res);
          })
          .catch(err => {
            console.log(err);
            reject(err.success);
          });
      });
    } else {
      startError();
    }
  });
}

async function terminate() {
  return new Promise<FlowResult>((resolve, reject) => {
    flowTerminate()
      .then(res => {
        console.log(res);
        startAble.value = !startAble.value;
        terminateSuccess();
        resolve(res);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

// TODO: 将网卡和源ip的互相绑定
// TODO: 关闭不必要的视图组件
getNicList()
  .then(res => {
    nicList.value.push(...res.data.nicList);
    // set nic as the first option
    form.nic = res.data.nicList[0];
  })
  .catch(err => {
    console.log(err);
  });

getIpList()
  .then(res => {
    ipList.value.push(...res.data.ipList);
    // set src_id as the first option
    form.src_ip = res.data.ipList[0];
  })
  .catch(err => {
    console.log(err);
  });

const startSuccess = () => {
  ElNotification({
    title: "Success",
    message: "Start successfully",
    type: "success"
  });
};
const terminateSuccess = () => {
  ElNotification({
    title: "Success",
    message: "Terminate successfully",
    type: "success"
  });
};

const startError = () => {
  ElNotification({
    title: "Error",
    message: "Please fill in the correct form",
    type: "error"
  });
};

// 以下是生命周期维护区
// TODO: 若未点击终止抓包却关闭页面，则发送终止抓包命令
</script>

<style scoped>
@import url("@/style/dashboard.css");
</style>
