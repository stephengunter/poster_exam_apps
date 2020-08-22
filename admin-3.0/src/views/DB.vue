<template>
   <core-container>
      <v-row>
         <v-col cols="12" sm="6">
            <span style="font-size:16px">數據庫名稱： {{ dbName }} </span>
            <v-chip v-show="hasBackup" class="ml-2 mb-1" small color="success" text-color="white">
               已備份
            </v-chip>
         </v-col>
         <v-col cols="12" sm="6" class="text-right">
            <v-tooltip top>
               <template v-slot:activator="{ on, attrs }">
                  <v-btn  small fab color="success"
                  v-bind="attrs" v-on="on"
                  @click.prevent="onBackup"   
                  >
                     <v-icon>mdi-content-save</v-icon>
                  </v-btn>
               </template>
               <span>備份</span>
            </v-tooltip>
            <v-tooltip top>
               <template v-slot:activator="{ on, attrs }">
                  <v-btn  small fab color="info" class="ml-2"
                  v-bind="attrs" v-on="on"
                  @click.prevent="onExport"   
                  >
                     <v-icon>mdi-file-export</v-icon>
                  </v-btn>
               </template>
               <span>匯出</span>
            </v-tooltip>
            <v-tooltip top>
               <template v-slot:activator="{ on, attrs }">
                  <v-btn  small fab color="error" class="ml-2"
                  v-bind="attrs" v-on="on"
                  @click.prevent="onMigrate"   
                  >
                     <v-icon>mdi-play-pause</v-icon>
                  </v-btn>
               </template>
               <span>Migrate</span>
            </v-tooltip>
            <v-tooltip top>
               <template v-slot:activator="{ on, attrs }">
                  <v-btn  small fab color="error" class="ml-2"
                  v-bind="attrs" v-on="on"
                  @click.prevent="onImport"   
                  >
                     <v-icon>mdi-upload</v-icon>
                  </v-btn>
               </template>
               <span>匯入</span>
            </v-tooltip>
         </v-col>
      </v-row>

      <v-dialog v-model="form.active" persistent :max-width="form.maxWidth">
         <db-form v-if="form.active" 
         :db_name="dbName" :model="model" :title="title"
         @cancel="onCancel" @submit="onSubmit"
         />
		</v-dialog>

      <v-dialog v-model="importing.active" persistent :max-width="importing.maxWidth">
         <db-import :model="model"
         @cancel="onCancel" @saved="onImported"
         />
		</v-dialog>
      
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { GET_DB_NAME, DB_BACKUP, DB_EXPORT, DB_IMPORT, DB_MIGRATE } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
   name: 'DBView',
   data () {
      return {
         dbName: '',
         action: '',
         title: '',
         hasBackup: false,
         model: {
            key: '',
            cmd: '',
            files: []
         },
         form: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
         importing: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},
      };
   },
   beforeMount() {
      this.fetchDBName();
   },
   methods: {
      init(action = '') {
         this.model = {
            key: '',
            cmd: '',
            files: []
         };
         this.action = action;
         if(action === DB_BACKUP) this.title = '數據庫備份';
         else if(action === DB_EXPORT) this.title = '匯出JSON';
         else if(action === DB_IMPORT) this.title = '匯入JSON';
         else if(action === DB_MIGRATE) this.title = 'Database Migrate';
         else this.title = '';
      },
      fetchDBName(callback) {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(GET_DB_NAME)
         .then(name => {
           this.dbName = name;
           if(callback) callback(name);
         })
         .catch(error => {
            onError(error);
         })
      },
      onCancel() {
         this.importing.active = false;
         this.form.active = false;
         this.init();
      },
      onImported() {
         this.importing.active = false;
         this.init();
         Bus.$emit('success');
      },
      onSubmit() {
         let action = this.action;
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(action, this.model)
         .then(() => {
            Bus.$emit('success');
            if(action === DB_BACKUP) this.hasBackup = true;
            this.form.active = false;
            this.init();
         })
         .catch(error => {
            if(error)  this.$store.commit(SET_ERROR, error);
				else Bus.$emit('errors');
         })
      },
      onExport() {
         this.fetchDBName(() => {
            this.init(DB_EXPORT);
            this.form.active = true;
         });
      },
      onMigrate() {
         if(!this.hasBackup) {
            Bus.$emit('warning', '必需先備份數據庫.');
            return;
         }
         this.fetchDBName(() => {
            this.init(DB_MIGRATE);
            this.form.active = true;
         });
      },
      onImport() {
         if(!this.hasBackup) {
            Bus.$emit('warning', '必需先備份數據庫.');
            return;
         }
         this.fetchDBName(() => {
            this.init();
            this.importing.active = true;
         });
      },
      onBackup() {
         this.fetchDBName(() => {
            this.init(DB_BACKUP);
            this.form.active = true;
         });
      }
   }
}
</script>

<style>

</style>