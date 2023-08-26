<template>
  <div class="output-feed">
    <div class="breadcrums">
      <router-link :to="{ name: 'demandDetail' ,query:{demandId:demandId} }">{{ parentName }}</router-link> &nbsp;›
      <a>Output Feedback</a>
    </div>
    <div class="content">
      <h1>Output Feedback</h1>
      <div class="param" style="height:20px;">
        <label class="paramTitle">name:</label>
        <span>{{outputTitle}}</span>
      </div>
      <div class="param" style="height:20px;">
        <label class="paramTitle">description:</label>
        <span>{{outputdetail}}</span>
      </div>
      <div class="param" v-if="newfeed===true || isStaff">
        <label class="paramTitle">question:</label>
        <textarea v-model="feedto" cols="40" rows="10"></textarea>
      </div>
      <div class="param" v-if="newfeed===false && isStaff!==true">
        <label class="paramTitle">description:</label>
        <span>{{feedto}}</span>
      </div>
      <div class="param" v-if="newfeed===false" >
        <label class="paramTitle">response:</label>
        <textarea v-model="feedback" cols="40" rows="10"></textarea>
      </div>
      <div class="submit-row">
        <button class="default" v-if="newfeed===true" @click="createFeed" >create</button>
        <button class="default"  v-if="newfeed===false" @click="changeFeed"  >create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getLocalStore } from '@/utils/storageUtil';
    import {queryUser, Demandquery, queryTaskDetail, queryOutputColumn, createFeed, getFeedById, updateFeed} from '../../api/api';
    export default {
        name: "output-feed",
        data(){
          return {
            userId:"",
            isStaff:false,
            demandId:"",
            seq:"",
            taskId:"",
            feedId:"",
            outputId:"",
            parentName:"",
            taskName:"",
            outputTitle:"",
            feedto:"",
            feedback:"",
            newfeed:true,
            outputdetail:""
          }
        },
        created(){
          this.demandId = this.$route.query.demandId;
          this.taskId = this.$route.query.taskId;
          this.feedId = this.$route.query.feedId;
          this.outputId = this.$route.query.outputId;
          queryUser({ params: {username:getLocalStore('name')}} ).then((response) =>{
            this.isStaff = response.data[0].is_staff;
            this.userId =  response.data[0].id;
          }).catch(function (error) {console.log(error);});
          Demandquery(this.demandId).then((response) => {
            this.parentName = response.data.title;
            this.seq = response.data.seq;
          }).catch(function (error) {console.log(error);});
          if(typeof(this.taskId)!=="undefined"){
            queryTaskDetail(this.taskID).then((response) => {
              this.taskName = response.data.results[0].title;
            }).catch(function (error) {console.log(error);});
          }
          if(typeof(this.outputId)!=="undefined"){
            queryOutputColumn(this.outputId).then((response) =>{
              this.outputTitle = response.data[0].name;
              this.outputdetail = response.data[0].detail;
            }).catch(function (error) {console.log(error);});
          }
          if(typeof(this.feedId)!=="undefined"){
            this.newfeed = false;
            getFeedById(this.feedId).then((response) =>{
              this.taskId = response.data[0].task_id;
              this.outputId = response.data[0].model_id;
              this.outputTitle = response.data[0].model_title;
              this.feedto = response.data[0].feedto;
              this.feedback = response.data[0].feedback;
              queryOutputColumn(this.outputId).then((response) =>{
                this.outputdetail = response.data[0].detail;
              }).catch(function (error) {console.log(error);});
            }).catch(function (error) {console.log(error);});
          }
        },
        methods:{
          createFeed(){
            var param = {
              'model_name':'OutputColumn',
              'model_id':this.outputId,
              'model_title':this.outputTitle,
              'feedto':this.feedto,
              'demind_id':this.demandId,
              'demind_seq':this.seq,
              'task_id':this.taskId,
              'feedto_user':this.userId
            };
            createFeed(param).then((response) => {
              if (response.status == 201) {
                setTimeout( this.$router.push({ name: 'demandDetail' ,query:{demandId:this.demandId}}), 1000 );
              }
              else{console.log(response);}
            }).catch(function (error) {console.log(error);});
          },
          changeFeed(){
            let now = new Date();
            now = new Date(now.setHours(now.getHours() + 8));
            var param = {
              'feedback':this.feedback,
              'feedto':this.feedto,
              'feedback_user':this.userId,
              'feedback_time':now,
              'if_feed':true
            };
            updateFeed(this.feedId, param).then((response) => {
              if (response.status == 200) {this.$router.push({ name: 'demandDetail' ,query:{demandId:this.demandId}});}
              else{console.log(response);}
            }).catch(function (error) {console.log(error);});
          }
        }
    }
</script>

<style scoped>

</style>
