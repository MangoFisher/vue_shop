<template>
    <div class='login_container'>
        <div class='login_box'>
            <div class='avatar_box'>
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="login_form" :rules="rules">
                <el-form-item prop="user">
                    <el-input v-model='login_form.username' prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model='login_form.password' type='password' prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class='btns'>
                      <el-button type="primary" @click="login">登录</el-button>
                      <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                login_form: {
                    username: 'admin',  
                    password: '123456'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ]

                }
            };
        },
        methods: {
            resetLoginForm() {
                // console.log(this)
                this.$refs.loginFormRef.resetFields()
            },
            login() {
                const _this = this
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return
                    //解决前端发起的http请求中Content-Type同后端不兼容的问题，vue默认是application/json，这里是改成application/x-www-form-urlencoded
                    let param = new URLSearchParams()
                    param.append('username', this.login_form.username)
                    param.append('password', this.login_form.password)

                    const result = await this.$http.post('login', param)
                    if (result.data.meta.status != 200)
                        return this.$message.error('登录失败')
                    this.$message.success('登录成功')
                    // console.log(result)
                    window.sessionStorage.setItem('token', result.data.data.token)
                    this.$router.push('/home')
                })
            }
            
    }
    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    };
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    }
</style>