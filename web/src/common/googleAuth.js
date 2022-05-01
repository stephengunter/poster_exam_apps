const ON_LOAD = 'onGapiLoad';
var auth2 = null;
var loadingPromise = null;

const createScript = () => {
    return new Promise((resolve, reject) => {
      const id = 'auth2_script_id';
      const el = document.getElementById(id);
      if (!el) {
         let tag = document.createElement('script');
         tag.setAttribute('id', id);
         tag.setAttribute('async', '');
         tag.setAttribute('defer', '');
         tag.setAttribute('src', 'https://apis.google.com/js/api.js');
         tag.setAttribute('onload', `${ON_LOAD}();`);
         tag.setAttribute('onreadystatechange', `${ON_LOAD}();`);
         document.head.appendChild(tag);
      }
      resolve(true);
    });

}


const onGapiLoadPromise = (params) => {
   return new Promise((resolve, reject) => {
      window[ON_LOAD] = () => {
         window.gapi.load('client:auth2', () => {
            window.gapi.client.init(
               Object.assign({}, params)
            ).then(() => {
               auth2 = window.gapi.auth2.getAuthInstance();
               resolve(true);
            }).catch(err => {
               reject(err);
            })
         })
      }
   })
}

const loadingAuth2 = (params) => {
   if (auth2) return Promise.resolve(auth2);
   else {
      if (!loadingPromise) loadingPromise = onGapiLoadPromise(params);
      return loadingPromise;
   }
}

const load = (params) => {
   return Promise.all(
      [loadingAuth2(params), createScript()])
      .then(results => {
         return results[0];
      });
}

const wrapper = (f, method) => {
   if (f)
      return f[method]();
   else {
      const err = { err: 'Script not loaded correctly, did you added the plugin or the client_id to the component?' };
      return Promise.reject(err);
   }
}

const signIn = () => wrapper(auth2, 'signIn');

const signOut = () => wrapper(auth2, 'signOut');

export default {
   load,
   signIn,
   signOut
}