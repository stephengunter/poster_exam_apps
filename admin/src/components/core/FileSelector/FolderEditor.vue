<template>
   <v-card>
      <v-card-title>
         <span class="headline">{{ title }}</span>
         <v-spacer />
         <a href="#" @click.prevent="cancel">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-container grid-list-md>
            <v-layout wrap>
					<v-flex xs12>
                  <v-text-field v-model="folder.name" label="名稱"
						v-validate="'required'"
						:error-messages="getErrMsg('name')"
						name="name"
						required
						/>
               </v-flex>
               <v-flex xs12>
                  <v-text-field :value="path" label="Path"
						readonly
						/>
               </v-flex>
            </v-layout>
         </v-container>
      </v-card-text>
      <v-card-actions>
         <v-spacer />
         <v-btn type="submit" @click.prevent="onSubmit" color="success">
            存檔
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'FileSelectorFolderEditor',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   data () {
      return {
         title: '',
         folder: null,

         pathList: []
      }
   },
   computed: {
      path() {
         let pathList = this.pathList.length ? this.pathList.join('/') : '';

         if(this.folder.name) return `${pathList}/${this.folder.name}`;
         return pathList;
         
      }
   },
   beforeMount() {
      this.folder = {
         name: this.model.name ? this.model.name : '',
         path: ''
      };

      this.pathList =  this.model.path ? this.model.path.split('/') : [];
      
      if(this.model.name) this.title = '編輯資料夾';
      else this.title = '新增資料夾';
   },
   methods: {
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('name', '名稱');
			}
			return '';
      },
      cancel() {
         this.$emit('cancel');
      },
      onSubmit() {
         this.$validator.validate().then(valid => {
            if(valid) this.submit();
         })
      },
      submit() {
         this.folder.path = this.path;
         this.$emit('submit', this.folder);
      },
   }
}
</script>

<style>

</style>