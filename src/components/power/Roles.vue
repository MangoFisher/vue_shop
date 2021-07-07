<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" :border="true" :stripe="true">
                //展开列
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', index1 == 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级、三级权限 -->
                            <el-col :span="19">
                                <el-row  :class="[index2 == 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                                    <el-col :span="9">
                                        <el-tag type="warning">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="15" >
                                        <el-tag type="danger" v-for="(item3, index3) in item2.children" :key="item3.id">
                                            {{ item3.authName }}
                                            <i class="el-icon-caret-right"></i>
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="roleDeleteById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRolesEditDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限对话框"
            :visible.sync="roleEditDialogVisible"
            width="30%"
            @close="rolesEditDialogClosed"
            >
            <el-tree ref="treeRef" :data="rightsList" :props="rightsProps" :show-checkbox="true" node-key="id" :default-expand-all="true" :default-checked-keys="defKeys"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleEditDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            //控制分配权限对话框是否可见
            roleEditDialogVisible: false,
            rightsList: [],
            rightsProps: {
                label: 'authName',
                children: 'children'
            },
            //权限tree结构中，默认选中的权限列表    
            defKeys: [],
            roleId: ''
        }
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            // console.log(res.data)
            if(res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
            this.rolesList = res.data
            this.$message.success('获取角色列表成功')
        },
        async roleDeleteById(id) {
            const res = await this.$confirm('此操作将删除该角色信息, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                            }).catch((err) => {
                                                return err
                                            })
            if('confirm' !== res) return this.$message.info('用户取消删除！')
            const { data: result } = await this.$http.delete('roles/' + id )
            if(result.meta.status !== 200) return this.$message.error('角色删除失败！')
            this.$message.success('角色删除成功！')
            this.getRolesList()
        },
        //分配权限对话框
        async showRolesEditDialog(role) {
            this.roleId = role.id
            const { data: res } = await this.$http.get('rights/tree')
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取权限树形数据失败')
            this.rightsList = res.data
            this.$message.success('获取权限树形数据成功')
            //获取拥有权限的id
            this.getLeafKeys(role, this.defKeys)
            // console.log(this.defKeys)
            this.roleEditDialogVisible = true

        },
        //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys中
        getLeafKeys(node, arr) {
            if(!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            });
        },
        //关闭权限分配对话框
        rolesEditDialogClosed() {
            this.defKeys = []
        },
        //点击为角色分配权限
        async allotRights() {
            const keys = [
                //展开运算符
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys)
            const idStr = keys.join(',')
            // console.log(idStr)
            //为了能在字符串中使用变量，必须使用反义字符（而不是单引号！！！！）
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
                rids:idStr
            })
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('给该角色分配权限失败！')
            this.$message.success('给该角色分配权限成功')
            this.roleEditDialogVisible = false


        }

    },
    created() {
        this.getRolesList()
    }
}
</script>

<style lang="less">
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

//垂直方向居中对齐，谁想要此效果，绑定该类即可
.vcenter {
    display: flex;
    align-items: center;
}
</style>