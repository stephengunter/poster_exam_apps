<template>
<div>
   <v-layout row>
		<v-flex xs12 sm6 md6>
			<v-layout row  v-for="(item, index) in selected.recruits" :key="index" >
				<v-flex>
					<a href="#" class="text-truncate" @click.prevent="onSelected(index)"> 
						{{ title }}：{{ item.fullText }} 
					</a>
					<a v-show="item" class="ml-3" href="#" @click.prevent="onRemove(index)">
						<v-icon>mdi-window-close</v-icon>
					</a>
				</v-flex> 
			</v-layout>
			<v-layout row v-show="canCreate">
				<v-flex>
					<a href="#" class="text-truncate" @click.prevent="onAdd">
						{{ title }}：
					</a>
				</v-flex> 
			</v-layout>
		</v-flex>
     
   </v-layout>
    <v-dialog v-model="select.active" :max-width="select.maxWidth">
      <v-card>
         <v-card-title>
            <span class="headline">選擇{{ title }}</span>
            <v-spacer />
            <a href="#" @click.prevent="closeSelect">
               <v-icon>mdi-window-close</v-icon>
            </a>
         </v-card-title>
         <v-card-text>
            <v-container>
               <v-treeview v-if="select.active" :items="recruitList" item-children="subItems" item-text="title"
               open-all activatable hoverable  active-class="primary--text"
               :active.sync="select.ids"
               >
               </v-treeview>
            </v-container>
         </v-card-text>
      </v-card>
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { hasIntersection, onError } from '@/utils';

export default {
	name: 'RecruitSelector',
	props: {
      title: {
         type: String,
         default: '考古題'
      },
      selected_ids: {
         type: Array,
         default: null
      },
      multi: {
         type: Boolean,
         default: true
      },
		recruits: {
         type: Array,
         default: null
      },
      subject: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
         ready: false,

         years: [],
         subItems: [],
         parts: [],

         recruitList: [],

         select: {
            active: false,
            ids: [],
            index: 0,
            maxWidth: 480
         },

         selected: {
            recruits: [],
            ids: [],
            idsText: ''
         }
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      canCreate() {
         if(this.selected.ids.length) return this.multi;
         return true;
      },
      selectId() {
			if(this.select.ids.length) return this.select.ids[0];
			return 0;
		}
   },
   watch: {
      selectId: 'onSelectIdChanged'
   },
	methods: {
      init() {
         if(this.selected_ids) this.selected.ids = this.selected_ids.slice(0);
         
         this.loadEntities();
        
         this.selected.recruits = this.selected.ids.map(id => {
            return this.findRecruit(id);
         })

         this.submit();
      },
      loadEntities() {
         let years = this.recruits.map(item => {
            return { id: item.id, title: item.title, subjectIds: item.subjectIds } 
         });

         let subItems = [];
         let parts = [];
         this.recruits.forEach(item => {
           
            item.subItems.forEach(subItem => {
               subItems.push({
                  id: subItem.id, title: subItem.title, parentId: subItem.parentId, rootId: item.id
               });
               subItem.subItems.forEach(part => {
                  parts.push({
                     id: part.id, title: part.title, parentId: part.parentId, rootId: item.id
                  })
               })
           })
         });

         this.years = years;
         this.subItems = subItems;
         this.parts = parts;
      },
      findRecruit(id) {
         let model = this.findItem(id);
         let type = model.type;
         let item = model.item;
         if(model.item) {
            model.item.fullText = this.getFullText(type, item);
            return model.item;
         }else return null;
      },
      getFullText(type, item) {
         if(type === 'subItems') {
            let year = this.findYear(item.parentId);
            return `${year.title} > ${item.title}`
         }else if(type === 'parts') {
            let subItem = this.findSubItem(item.parentId);
            let year = this.findYear(subItem.parentId);
            return `${year.title} > ${subItem.title} > ${item.title}`
         }    
      },
      findItem(id) {
         let item = this.findSubItem(id);
         if(item) return { type: 'subItems', item  };

         item = this.parts.find(x => x.id === id);
         if(item) return { type: 'parts', item  };

         return null;
      },
      findSubItem(id) {
         return this.subItems.find(x => x.id === id);
      },
      findYear(id) {
         return this.years.find(x => x.id === id);
      },
      loadRecruitList() {
         let subject = this.subject;
			if(!subject) {
				this.recruitList = [];
            return;
         }

         let recruitList = [];
         let subjectIds = [subject.id].concat(subject.subIds);
         let allRecruits = this.recruits;
         for(let i = 0; i < allRecruits.length; i++) {
            let recruit = allRecruits[i];
            if(hasIntersection(subjectIds, recruit.subjectIds)) {
               recruitList.push(recruit);
            }
         }

         this.recruitList = recruitList;
      },
		submit(){
         this.selected.idsText = this.selected.ids ? this.selected.ids.join() : '';

         this.$emit('submit', this.selected);
         
      },
      onSelected(index) {
         this.launchSelect(index);
      },
      launchSelect(index) {
         if(this.contentMaxWidth) this.select.maxWidth = this.contentMaxWidth;
         this.select.index = index;
         this.select.active = true;
      },
      closeSelect() {
         this.select.ids = [];
         this.select.active = false;
      },
      onAdd() {
         this.loadRecruitList();
         this.launchSelect(-1);
      },
      onRemove(index) {

         this.selected.ids.splice(index, 1);
         this.selected.recruits.splice(index, 1);

         this.submit();
      },
      onSelectIdChanged() {
         let id = this.selectId;
         if(!id) return;
         //判斷點選項目是否為年度
         let idx = this.recruitList.findIndex(item => item.id === id);
         if(idx < 0) {
            let item = this.findRecruit(id);
            this.setSelectedItem(item);
            this.closeSelect();

            this.submit();
         }
      },
      setSelectedItem(item) {
         let selectingIndex = this.select.index;
         let rootIds = this.selected.recruits.map(item => item.rootId);

			if(selectingIndex < 0) {
				//新增
            if(!item) return;
            if(this.selected.ids.includes(item.id)) return;

            if(rootIds.includes(item.rootId)) return;

            this.selected.ids.push(item.id);
            this.selected.recruits.push(item);

            
			}else {
            if(!item) return;
            if(this.selected.ids.includes(item.id)) return;

            let sameRootIdx = rootIds.findIndex(x => x === item.rootId);
            if(sameRootIdx < 0 || sameRootIdx === selectingIndex) {
               this.selected.ids.splice(selectingIndex, 1, item.id);
               this.selected.recruits.splice(selectingIndex, 1, item);
            }
         }
      }
	}
}
</script>
