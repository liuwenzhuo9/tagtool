<template>
    <div class = "inferResult">
        序列标注结果预测
    </div>
</template>

<script>
import {findInferInfoByTaskId} from '../../../unit/fetch';
export default {
    mounted(){
        this.init();
    },
    props: {
            editInfo: Object,
            selectShowPart: Function
        },
    data(){
        return{
            
        }
    },
    methods: {
        async init(){
            const info  = await findInferInfoByTaskId({task_id: this.editInfo.id});
            console.log(info.data);
        },
    }
}
</script>

<style scoped>

</style>