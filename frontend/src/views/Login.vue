<template>
  <div class="login-container">
    <div class="login">
      <h1 class="heading">Login</h1>
      <el-alert title="Invalid username or password" :closable="false" type="error" v-if="error"/>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" @keyup.enter.native="submit"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" @keyup.enter.native="submit"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex';
import { login, handleAPIError } from '../api';
import router from '../router';
import { Vue, Component } from 'vue-property-decorator';

const { mapActions } = createNamespacedHelpers('auth');


@Component({})
export default class Login extends Vue {
  private form = {
    username: '',
    password: '',
  }
  private rules = {
    username: [
      {
        required: true,
        message: 'This field is required',
        trigger: 'change',
      },
    ],
    password: [
      {
        required: true,
        message: 'This field is required',
        trigger: 'change',
      },
    ],
  }
  private error = false

  ...mapActions(['login'])

  async submit() {
    this.error = false;
    try {
      await this.$refs.form.validate();
    } catch (e) {
      return;
    }
    let success = null;
    try {
      success = await login(this.form.username, this.form.password);
    } catch (e) {
      handleAPIError(e);
    }
    if (success) {
      router.push({ name: 'CustomerList' });
    } else {
      this.error = true;
    }
  }
};
</script>

<style lang="sass" scoped>
  .heading
    text-align: center
    margin-top: 30px
  .login-container
    display: flex
    flex-direction: column
    flex-grow: 1
    justify-content: center
    align-items: center
  .login
    width: 300px
</style>
