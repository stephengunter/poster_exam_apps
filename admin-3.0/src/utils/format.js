export const initHighlight = (model) => {
   if(model.highlights) model.highlight = model.highlights.join('\n');
   else model.highlights = [];
}

export const initReference = (model) => {
   if(model.references && model.references.length) {
      model.reference = model.references.map(item => `${item.text},${item.id},${item.type}`).join('\n');
   }else model.reference = '';
}

export const resolveHighlights = (highlight) => highlight ? highlight.split('\n').filter(Boolean) : [];

export const resolveReferences = (reference) => {
   if(!reference) return [];
   let references = reference.split('\n').filter(Boolean);
   return references.map(item => {
      let parts = item.split(',');
      return { text: parts[0], id: parts[1] ? parts[1] : '', type:  parts[2] ? parts[2] : ''}
   });
}