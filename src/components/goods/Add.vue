<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" :align-center="true">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                                class="cat_select"
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cascaderProps"
                                @change="cascaderChanged"
                                size="mini"
                                clearable
                            >
                            </el-cascader>
                        </el-form-item>                        
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i ) in item.attr_vals" :key="i" :border="true"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%"
            >
            <img :src="previewPath" class="priviewImg">
            
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            //步骤条中默认被激活的索引，索引从0开始
            activeIndex: '0',
            //添加商品的表单
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                pics: [],
                goods_introduce: '',
                attrs: []

            },
            addFormRules: {
                goods_name:[
                   {required: true, message: '请输入商品名称', trigger: 'blur'}
                ],
                goods_price: [
                   {required: true, message: '请输入商品价格', trigger: 'blur'}
                ],
                goods_weight: [
                   {required: true, message: '请输入商品重量', trigger: 'blur'}
                ],
                goods_number: [
                   {required: true, message: '请输入商品重量', trigger: 'blur'}
                ]
            },
            //商品分类数据
            cateList: [],
            cascaderProps: {
                expandTrigger:'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
                // checkStrictly: true
            },
            //动态参数数据
            manyTableData: [],
            //静态属性数据
            onlyTableData: [],
            //图片上传的后台地址
            uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
            //upload组件图片上传时http请求header头部
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewPath: '',
            previewVisible: false
            
           

        }
    },
    methods: {
        //获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
            this.cateList = res.data
            // console.log(this.cateList)
        },
        //级联选择器发生变化事件
        cascaderChanged() {
            if(this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },
        //tab标签页切换前钩子函数
        beforeTabLeave(activeName, oldActiveName) {
            //控制tabs是否可以切换
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('未选择商品分类')
                return false
            }
        },
        //tab标签栏被点击
        async tabClicked() {
            // console.log(this.activeIndex)
            //点击的是商品动态参数页面，则发起获取商品参数的http请求
            if(this.activeIndex == '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {params: {
                    sel: 'many'
                }})
                if(res.meta.status !== 200) return this.$message.error('获取商品分类参数出错')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(',')
                })
                this.manyTableData = res.data
                console.log(this.manyTableData)
            }
            //点击的是静态属性页面，则发起获取商品属性的http请求
            if(this.activeIndex == '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {params: {
                    sel: 'only'
                }})
                if(res.meta.status !== 200) return this.$message.error('获取商品分类属性出错')
                // console.log(res.data)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(',')
                })
                this.onlyTableData = res.data
                console.log(this.onlyTableData)
            }
        },
        //图片预览
        handlePreview(file) {
            console.log(file)
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        //图片删除
        handleRemove(file) {
            // console.log(file)
            const filePath = file.response.data.tmp_path
            const i = this.addForm.pics.findIndex(x => x.pic == filePath)
            this.addForm.pics.splice(i, 1)
        },
        //图片上传成功事件处理
        handleSuccess(response) {
            // console.log(response)
            const picInfo = {pic: response.data.tmp_path}
            this.addForm.pics.push(picInfo)
            // console.log(this.addForm.pics)
        },
        //添加商品
        add() {
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) {
                    this.$message.error('请填写必要的表单项！')
                }
                //执行添加的业务逻辑
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // console.log(form)
                console.log(this.manyTableData)
                console.log(this.onlyTableData)
                this.manyTableData.forEach( item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.length == 0 ? '' : item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                this.onlyTableData.forEach( item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.length == 0 ? '' : item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                const { data: res } = await this.$http.post('goods', form)
                if(res.meta.status !== 201) return this.$message.error('添加商品失败')
                this.$router.push('/goods')
            })
        }
    },
    computed: {
        cateID() {
            if(this.addForm.goods_cat.length == 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
    created() {
        this.getCateList()
    }
}
</script>

<style lang="less" scoped>
.el-checkbox {
    margin: 0, 5px, 0, 0git;
}

.priviewImg {
    width: 100%;
}

.btnAdd {
    margin-top: 5px;
}

</style>