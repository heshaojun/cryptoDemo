<template>
  <div class="home-page">
    <div style="width: 100%; border: 1px solid red; margin: 20px">
      <h1>RSA加解密</h1>
      <div>公钥</div>
      <textarea
        style="width: 100%"
        v-model="dataPubKey"
        placeholder="输入公钥"
      />
      <div>私钥</div>
      <textarea
        style="width: 100%"
        v-model="dataPriKey"
        placeholder="输入私钥"
      />
      <div>原文</div>
      <textarea
        style="width: 100%"
        v-model="dataContext"
        placeholder="请输入加密内容"
      />
      <div>密文</div>
      <textarea
        style="width: 100%"
        v-model="dataEncripted"
        placeholder="请输入解密内容"
      />
      <input
        value="加密"
        type="button"
        style="width: 100%; margin-top: 2rem"
        @click="methodEncryptByPub"
      />
      <span style="width: 100%; padding: 16px; border: 1px solid black">
        {{ dataAfterEncrypted }}
      </span>

      <input
        value="解密"
        type="button"
        style="width: 100%; margin-top: 2rem"
        @click="methodDecryptByPri"
      />
      <div style="width: 100%; padding: 16px; border: 1px solid black">
        {{ dataAfterDecrypted }}
      </div>
    </div>
    <div style="width: 100%; border: 1px solid red; margin: 20px">
      <h1>文件对称加解密</h1>
      <div>AES加密密钥</div>
      <input
        type="text"
        v-model="dataAesKey"
        placeholder="请输入对称加密密钥"
        style="width: 100%"
      />
      <div>选择加密文件</div>
      <input type="file" ref="sourceFile" placeholder="请选择源文件" />
      <input type="button" value="加密文件" @click="methodEncryptFile" />
      <div>选择解密文件</div>
      <input type="file" ref="encryptedFile" pattern="选择需要解密的文件" />
      <input type="button" value="解密文件" />
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { encryptByPub, decryptByPub } from "@/utils/rsaUtils";
import CryptoJS from "crypto-js";

export default {
  name: "homePage",
  setup() {
    const { proxy } = getCurrentInstance();
    const dataPubKey = ref();
    const dataPriKey = ref();
    const dataContext = ref();
    const dataEncripted = ref();
    const dataAfterEncrypted = ref();
    const dataAfterDecrypted = ref();

    const dataAesKey = ref();

    const methodEncryptByPub = () => {
      alert("公钥加密");
      dataAfterEncrypted.value = encryptByPub(
        dataPubKey.value,
        dataContext.value
      );
    };
    const methodDecryptByPri = () => {
      alert("私钥解密");
      dataAfterDecrypted.value = decryptByPub(
        dataPriKey.value,
        dataEncripted.value
      );
    };

    const methodEncryptFile = () => {
      let aesKey = dataAesKey.value;
      let files = proxy.$refs["sourceFile"].files;
      console.log("aesKey------", aesKey);
      console.log("files------", files);
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        let data = e.target.result;
        console.log("------file data", data);
        let seedByte = CryptoJS.enc.Utf8.parse(aesKey);
        console.log("-----seedByte", seedByte);

        console.log("------dfdsafdsfa", CryptoJS.enc.Utf8.parse("hefadsfdsa"));
        let key = CryptoJS.SHA256(seedByte);
        let ckey = CryptoJS.SHA256(key);
        let words = ckey.words.slice(0, 4);
        ckey.words = words;
        ckey.sigBytes = 16;
        let encrypted = CryptoJS.AES.encrypt(
          CryptoJS.lib.WordArray.create(data),
          key,
          {
            iv: ckey,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        ).toString();
        console.log("------encrypted", encrypted);
      };
      fileReader.readAsArrayBuffer(files[0]);
    };
    return {
      dataPubKey,
      dataContext,
      dataPriKey,
      dataAesKey,
      dataEncripted,
      dataAfterDecrypted,
      dataAfterEncrypted,
      methodEncryptByPub,
      methodDecryptByPri,
      methodEncryptFile,
    };
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  .rsa-test {
    width: 100%;
  }
}
</style>
