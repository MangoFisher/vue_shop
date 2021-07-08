<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                :closable="false"
                :show-icon="true"
                type="warning">
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 级联选择框 -->
                     <el-cascader
                            class="cat_select"
                            v-model="selectedValue"
                            :options="cateList"
                            :props="cascaderProps"
                            @change="cascaderChanged"
                            size="mini"
                            clearable
                            >
                        </el-cascader>
                </el-col>
            </el-row>
            <!-- tab页面区域 -->
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="selectedValue.length !== 3" @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="selectedValue.length !== 3" @click="addDialogVisible = true">添加属性</el-button>
                    <!-- 静态参数表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框 -->
        <el-dialog :title="'添加' + titleText"
                   :visible.sync="addDialogVisible" width="50%" @close="addParamsDialogClosed">
            <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button @click="addParams">确定</el-button>

            </span>

        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cateList: [],
            manyTableData: [],
            onlyTableData: [],
            //级联选择器选中的数据
            selectedValue: [],
            cascaderProps: {
                expandTrigger:'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                // checkStrictly: true
            },
            //tab标签页区域被选中的页面名称
            activeName: 'many',
            //控制添加动态参数(静态属性)对话框的展示和隐藏
            addDialogVisible: false,
            addParamsForm: {
                attr_name: ''
            },
            addParamsFormRules: {
                attr_name: [{required: true, message: '请输入参数名称', trigger: 'blur'}]
            }
        }
    },
    methods: {
        //获取所有商品分类信息数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error('获取商品分类信息数据出错')
            this.cateList = res.data
        },
        async getParamsData() {
            // console.log(this.activeName)
            const { data: res } = await this.$http.get(`categories/${this.selectedValue[2]}/attributes`, {params: {
                sel: this.activeName
            }})
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取商品分类参数(属性)出错')
            if(this.activeName == 'many') this.manyTableData = res.data
            if(this.activeName == 'only') this.onlyTableData = res.data
        },
        //级联选择器发生变化
        cascaderChanged() {
            //如果选中的不是三级菜单，则通过将selectedValue置空的方式，让一级、二级菜单无法被选中
            if(this.selectedValue.length !== 3) {
                this.selectedValue = []
                return
            }
            this.getParamsData()
        },
        //tab页面点击事件
        tabClick() {
            // console.log(this.activeName)
            if(this.selectedValue.length !== 3) return

            this.getParamsData()
            // console.log(this.paramsData)
        },
        addParamsDialogClosed() {
            this.$refs.addParamsFormRef.resetFields()
        },
        addParams() {
            this.$refs.addParamsFormRef.validate(async valid => {
                if(!valid) return 
                const { data: res} = await this.$http.post(`categories/${this.selectedValue[2]}/attributes`, {
                    attr_name: this.addParamsForm.attr_name,
                    attr_sel: this.activeName
                })
                if(res.meta.status !== 201) return this.$message.error('添加参数失败')
                // console.log(res)
                this.addDialogVisible = false
            })
        }
        
    },
    computed: {
        titleText() {
            if(this.activeName == 'many') {
                return '动态参数'
            }
            return '静态属性'
        }
    },
    
    created() {
        this.getCateList()
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;

}


</style>
