<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->       
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUsersList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList" ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="usersList" :border="true" :stripe="true">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="userDeleteById(scope.row.id)"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="30%" @close="addDialogClosed">

            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="userEditDialogVisible"
            @close="userEditDialogClosed"
            width="30%"
            >
            <el-form :model="userEditForm" :rules="userEditFormRules" ref="userEditFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userEditForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userEditForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="userEditForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userEditDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userEditInfo(userEditForm.id)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色对话框"
            :visible.sync="setRoleDialogVisible"
            width="30%">
            <div>
                <p>当前的用户: {{ userInfo.username }}</p>
                <p>当前的角色: {{ userInfo.role_name }}</p>
                <p>分配新角色:
                     <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>

                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="savaRoleInfo(userInfo.id)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        //重要提醒！！！自定义校验规则在data内部，return外部
         //验证邮箱的规则
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)) {
                return callback()
            } 
            callback(new Error("请输入合法的邮箱"))
        }

        var checkMobile = (rule, value, callback) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)) {
                return callback()
            }
            callback(new Error("请输入合法的手机号码"))
        }
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 1
            },
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addUserFormRules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' },],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                    ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                    ]
            },
            //用户修改表单数据校验规则
            userEditFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                    ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                    ]
            },
            usersList: [],
            total: 0,
            addDialogVisible: false,
            //控制修改用户对话框是否展示
            userEditDialogVisible: false,
            //修改用户表单数据
            userEditForm: {},
            //控制分配角色对话框的显示和隐藏
            setRoleDialogVisible: false,
            //需要被分配权限的用户信息
            userInfo: {},
            //所有角色数据
            rolesList: [],
            //被选中的角色id
            selectedRoleId: ''
        }
       
    },
    methods: {
        async getUsersList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo } )
            // console.log(res)
            if(res.meta.status !== 200 ) return this.$message.error("获取用户列表失败")
            this.usersList = res.data.users
            this.total = res.data.total
            this.$message.success("获取用户列表成功")
        },
        //监听pagesize发生变化
        handleSizeChange(newSize) {
            
            // console.log("newSize=" + newSize)
            this.queryInfo.pagesize = newSize
            this.getUsersList()
        },

        //监听pagenum发生变化
        handleCurrentChange(newPage) {
            // console.log("newPage=" + newPage)
            this.queryInfo.pagenum = newPage
            this.getUsersList()
        },

        async userStateChanged(userInfo) {
            // console.log("userInfo= ")
            // console.log(userInfo)
            //字符串用反引号括起来非常重要
            const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if(res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更改用户状态失败！！！')
                
                }
            // console.log(res)
            return this.$message.success('修改用户状态成功')
        },

        //监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addUserFormRef.resetFields()
        },

        //添加用户
        async addUser() {
            //表单预校验
            this.$refs.addUserFormRef.validate(valid => {
                if(!valid) return
            })
            //校验通过可以发起添加用户的http请求
            const { data: res } = await this.$http.post('users', this.addUserForm)
            // console.log(res)
            if(res.meta.status !==s201) return this.$message.error('添加用户失败')
            this.$message.success('添加用户成功')
            this.addDialogVisible = false
        },
        //展示修改用户对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get('users/' + id)
            // console.log(res)
            if(res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败')
            }
            this.userEditForm = res.data
            this.userEditDialogVisible = true
        },
        //关闭用户修改对话框
        userEditDialogClosed() {
            this.$refs.userEditFormRef.resetFields()
        },
        //修改用户信息
        async userEditInfo(id) {
            //表单预验证
            this.$refs.userEditFormRef.validate(valid => {
                if(!valid) return              
            })
            //校验通过可以发起修改用户的http请求
            const { data: res } = await this.$http.put('users/' + id, {
                email: this.userEditForm.email,
                mobile: this.userEditForm.mobile

            } )
            if(res.meta.status !== 200) return this.$message.error('修改用户信息失败')
            this.$message.success('修改用户信息成功')
            //关闭修改用户信息对话框
            this.userEditDialogVisible = false
            //重新获取用户信息,以更新最新数据
            this.getUsersList()
        },
        //用户信息删除
        async userDeleteById(id) {
            //如果用户确认删除，则返回字符串为confirm；如果用户取消删除，则返回字符串cancel;以此来区分用户的不同点击操作
            const res = await this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                            }).catch((err) => {
                                                return err
                                            })
            if('confirm' !== res) return this.$message.info('用户取消删除！')
            const { data: result } = await this.$http.delete('users/' + id )
            if(result.meta.status !== 200) return this.$message.error('用户删除失败！')
            this.$message.success('用户删除成功！')
            this.getUsersList()

        },
        //展示分配角色对话框
        async setRole(userInfo) {
            this.userInfo = userInfo
            // console.log(this.userInfo)
            //在展示对话框之前，获取所有角色列表
            const { data: res } = await this.$http.get('roles')
            if(res.meta.status !== 200) return this.$message.error('获取所有角色数据失败')
            this.rolesList = res.data
            // console.log(this.rolesList)

            this.setRoleDialogVisible = true
        },
        //保存为用户分配的权限
        async savaRoleInfo(id) {
            // console.log(this.selectedRoleId)
            // console.log(id)
            const { data: res } = await this.$http.put(`users/${id}/role`,{rid: this.selectedRoleId})
            // console.log(res)
            //关闭分配角色对话框
            this.setRoleDialogVisible = false
            //刷新当用户页面
            this.getUsersList()

        }   

    },  
    created() {
        this.getUsersList()
    }
}
</script>

<style lang="less" scoped>

</style>