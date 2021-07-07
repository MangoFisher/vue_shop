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
                    <el-button type="primary" size="mini" :disabled="selectedValue.length !== 3">添加参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="selectedValue.length !== 3">添加属性</el-button>
                </el-tab-pane>
                
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cateList: [],
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
            activeName: 'many'
        }
    },
    methods: {
        //获取所有商品分类信息数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error('获取商品分类信息数据出错')
            this.cateList = res.data
        },
        //级联选择器发生变化
        async cascaderChanged() {
            //如果选中的不是三级菜单，则通过将selectedValue置空的方式，让一级、二级菜单无法被选中
            if(this.selectedValue.length !== 3) {
                this.selectedValue = []
                return
            }
            
            const { data: res } = await this.$http.get(`categories/${this.selectedValue[2]}/attributes`, {params: {
                sel: this.activeName
            }})
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取商品分类参数(属性)出错')
        },
        //tab页面点击事件
        tabClick() {}
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
