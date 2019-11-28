<template>
    <div class="system-container">
        <el-row :gutter="0" class="main-content">
            <el-col :span="5" class="full-height">
                <div class="tool-bar" @click="changePage">
                    <div id="sentence" :class=" {active: curPage=='sentence'}"><a href="#sentence-contro">审核句子</a></div>
                    <div id="tag" :class="{active: curPage=='tag'}"><a href="#tag-contro">审核句子标记</a></div>
                    <div id="account" :class="{active: curPage=='account'}"><a href="#account-contro">账号管理</a></div>
                </div>
            </el-col>
            <el-col :span="19" class="full-height" >
                <div class="sentence-container">
                    <div class="sentence-container" id='sentence-contro'>
                        <p class="guide">审核句子</p>

                            <!-- <div class="introduction-container">
                                <p class="homepage-title">实验室介绍</p>
                                <LabInfo />
                            </div>
                            <div class="news-container">
                                <p class="homepage-title">实验室新闻</p>
                                <LabNews />
                            </div> -->
                    </div>

                    <div class="tag-container" id='tag-contro'>
                            <p class="guide">审核标记结果</p>

                            <!-- <el-collapse v-model="activePannel" accordion>
                                <el-collapse-item title="著作" name="book">
                                    <Book :getUserAccount="getUserAccount" />
                                </el-collapse-item>

                                <el-collapse-item title="论文" name="paper">
                                    <Paper :getUserAccount="getUserAccount" />
                                </el-collapse-item>

                                <el-collapse-item title="专利" name="patent">
                                    <Patent :getUserAccount="getUserAccount" />
                                </el-collapse-item>

                                <el-collapse-item title="项目" name="project">
                                    <Project :getUserAccount="getUserAccount" />
                                </el-collapse-item>

                                <el-collapse-item title="数据集" name="dataset">
                                    <Dataset :getUserAccount="getUserAccount" />
                                </el-collapse-item>
                            </el-collapse> -->
                    </div>

                    <div class="account-container" id='account-contro'>
                        <p class="guide">账号管理</p>
                        <Account />
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    // import LabInfo from '../Modules/LabInfo/view.vue';
    // import LabNews from '../Modules/News/view.vue';

    // import Book from '../Modules/Book/View.vue';
    // import Paper from '../Modules/Paper/View.vue';
    // import Patent from '../Modules/Patent/View.vue';
    // import Project from '../Modules/Project/View.vue';
    // import Dataset from '../Modules/Dataset/View.vue';

    // import Carousel from '../Modules/Carousel/view.vue';
    import Account from '../Modules/Account/view.vue';
export default {
     data() {
            return {
                curPage: 'sentence',

                // activePannel: 'book',
                // userAccount: 'minslab'
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init(){
                this.$store.commit('changePersonState',false)
            },
            changePage: function(event) {
                this.curPage = event.target.id;
            },
            getUserAccount(){
                if (this.$store.state.loginuser){
                    this.userAccount = this.$store.state.loginuser;
                    // this.userAccount = 'T001';
                }else{
                    this.userAccount = 'T001';
                }
                return this.userAccount;
            },
        },
        components: {
            // LabInfo,
            // LabNews,
            // Book,
            // Paper,
            // Patent,
            // Project,
            // Dataset,
            // Carousel,
            Account,
        }
    };
</script>

<style lang='scss' scoped>
    @import '../../../static/css/base.scss';

    .system-container{
        position: absolute;
        left: 0;
        top: 50px;
        width: 100%;
        height: 100%;
        min-width: 1700px;
        font-size: 15px;
    }
    .el-row {
        display: flex;
    }
    .main-content {
        width: 100%;
        height: 100%;
    }

    .full-height {
        height: 100%;
    }

    .tool-bar {
        height: 100%;
        padding: 25px 0;
        min-width: 300px;
        text-align: center;
        position: fixed;
        background-color: $main-bg-color;

        a {
            display: block;
            color: white;
            text-decoration: none;
        }

        // .active {
        //     background-color: $primary-color;
        // }

        div {
            height: 50px;
            line-height: 50px;
            color: white;
            font-size: 16px;
            // border-bottom: 1px solid $gray-color-3;

            &:hover {
                cursor: pointer;
                // background-color: $primary-color;
            }
        }
    }

    .guide {
        // color: $gray-color-10;
        font-size: 16px;
        font-style: italic;
        margin: 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 150px;
        // background-color: $primary-color;
    }

    .home-container {
        width: 85%;
        margin: 0 auto;
    }

    .homepage-container {
        position: relative;
        min-height: 300px;
        margin-top: 50px;

        .homepage-title {
            // color: $primary-color;
            font-size: 16px;
            margin: 0 0 0 30px;

            &::before {
                content: 'hh';
                // background: $primary-color;
                margin-right: 10px;
            }
        }

        .introduction-container {
            min-height: 300px;
            position: relative;
        }

        .news-container {
            position: relative;
            min-height: 300px;
        }

        .carousel-container {
            position: relative;
            min-height: 300px;
        }
    }

    .achievement-container {
        position: relative;
        min-height: 300px;
        // border-top: 2px solid $primary-color;
    }

    .el-collapse {
        width: 90%;
        margin: 30px auto;

        .el-collapse-item__header {
        font-size: 16px;
        // color: $primary-color;

            &::before{
                content: '';
                width: 0;
                // border-top: 10px solid $primary-color;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                margin-right: 10px;
            }
        }
    }

    .account-container {
        position: relative;
        min-height: 300px;
        // border-top: 2px solid $primary-color;
    }

    .nav_fix {
        position: absolute;
        right: 0.8%;
        top: 15px;
        color: #000;
    }
</style>
