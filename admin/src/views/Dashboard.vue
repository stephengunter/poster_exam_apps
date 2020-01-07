<template>
<div>
<v-layout row wrap>
   <v-flex xs6>
        <core-upload-button ref="uploadButton" @file-added="onFileAdded"/>
   </v-flex>
   <v-flex xs6>
      <v-img  v-if="thumb"
      :src="thumb.data" max-width="100"
      aspect-ratio="1"
      class="grey lighten-2"
      />
   </v-flex>
</v-layout>


</div>
</template>

<script>
export default {
   name: 'Dashboard',
   methods: {
      toggle(){

      }
   },
   data() {
      return {
         photo: null,
         thumb: null
      }
   },
   computed: {

   },
   beforeMount() {
      
   },
   methods: {
      onFileAdded({ files, thumbs }) {
         this.thumb = thumbs[0];
            console.log('thumbs',thumbs);
            return;
         for (let i=0; i<thumbs.length; i++) {
            let name=thumbs[i].name;
            if(!this.fileExist(name)){
               let media={
                  id:0,
                  order:this.findMinOrder() - 1,
                  title:name.split('.')[0],
                  name:name,
                  thumb:thumbs[i].data,
                  type:thumbs[i].type,
                  path:''
               };
               this.addMedia(media);
            }
            
         }
      },
      submit: function (files) {
         let vm = this;
         let form = new FormData();
         form.append('postId', 3);
         form.append('memberId', 32);

         for (let i = 0; i < files.length; i++) {
               form.append('files', files[i]);
         }

         console.log('form', form);
         

         $.ajax({
               url: uploadUrl,
               data: form,
               processData: false,
               contentType: false,
               type: 'POST',
               success: function(data){
                  alert(data);
               }
         });

      },
   }
   
}
</script>