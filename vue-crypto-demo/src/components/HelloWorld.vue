<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <h2>登陆前接口测试</h2>
      <input type="button" value="测试" @click="methodBeforeLoginTest">
    </div>
    <div>
      <h2>登录必要测试接口</h2>
      <input type="button" value="测试" @click="methodLoginRequiredTest">
    </div>
    <div>
      <h2>请求数据加密测试接口</h2>
      <input type="button" value="测试" @click="methodReqEncryptTest">
    </div>
    <div>
      <h2>登录入口测试接口</h2>
      <input type="button" value="测试" @click="methodLoginEntryTest">
    </div>
    <div>
      <h2>响应数据加密测试接口</h2>
      <input type="button" value="测试" @click="methodRespEncryptedTest">
    </div>
    <div>
      <h2>防重放攻击测试接口</h2>
      <input type="button" value="测试" @click="methodReplayDefenseTest">
    </div>
  </div>
</template>

<script>
import {reactive} from "vue"
import {
  beforeLoginTest,
  loginRequiredTest,
  reqEncryptTest,
  loginEntryTest,
  respEncryptedTest,
  replayDefenseTest
} from "@/api/testApis"
import {login} from "@/utils/session"

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const dataBeforeLoginTest = reactive({id: "hello"});
    const methodBeforeLoginTest = () => {
      console.log("------methodBeforeLoginTest")
      beforeLoginTest({id: "hello"}).then(resp => {
        console.log("resp data === ", resp)
      })
    }
    const methodLoginRequiredTest = () => {
      loginRequiredTest().then(resp => {
        console.log("resp data === ", resp)
      }).catch(error => {
        console.error("resp error ===", error)
      })
    }
    const methodReqEncryptTest = () => {
      reqEncryptTest({userName: "hehehhe", password: "212312321"}).then(resp => {
        console.log("resp data === ", resp)
      }).catch(error => {
        console.error("resp error ===", error)
      })
    }
    const methodLoginEntryTest = () => {
      loginEntryTest({userName: "hehehhe", password: "212312321"}).then(resp => {
        console.log("resp data === ", resp)
        login();
      }).catch(error => {
        console.error("resp error ===", error)
      })
    }
    const methodRespEncryptedTest = () => {
      respEncryptedTest().then(resp => {
        console.log("响应数据加密测试结果-----", resp)
      })
    }
    const methodReplayDefenseTest = () => {
      replayDefenseTest().then(resp => {
        console.log("防重放攻击测试结果-----", resp)
      })
    }
    return {
      dataBeforeLoginTest,
      methodBeforeLoginTest,
      methodLoginRequiredTest,
      methodReqEncryptTest,
      methodLoginEntryTest,
      methodRespEncryptedTest,
      methodReplayDefenseTest
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
