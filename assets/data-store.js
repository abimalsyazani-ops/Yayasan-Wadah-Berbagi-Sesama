(function(){
  const seed={
    programs:[],
    campaigns:[],
    articles:[],
    gallery:[],
    videos:[],
    documents:[],
    volunteers:[],book_donations:[],donors:[],donation_activity:[],messages:[]
  };

  // Mode demo aman untuk uji tampilan/fungsi lokal, tetapi bukan bukti keamanan produksi.
  // Ganti ke "production" setelah Supabase Auth, Database, Storage, dan RLS sudah dikonfigurasi.
  const APP_MODE='production';
  const keys={programs:'wbs_programs_v2',campaigns:'wbs_campaigns_v2',articles:'wbs_articles_v2',documents:'wbs_documents_v2',gallery:'wbs_gallery_v2',videos:'wbs_videos_v2',volunteers:'wbs_volunteers_v2',book_donations:'wbs_book_donations_v2',donors:'wbs_donors_v2',donation_activity:'wbs_donation_activity_v1',messages:'wbs_messages_v2',audit_logs:'wbs_audit_logs_v2'};
  const retiredSeedIds={
    campaigns:new Set(['zakat-maal','sedekah-yatim','wakaf-quran','beasiswa-yatim','pangan-lansia','pengobatan-dhuafa']),
    articles:new Set(['pangan-ramadhan-2026','keutamaan-sedekah','wakaf-produktif','adab-memberi']),
    gallery:new Set(['gal-1','gal-2','gal-3','gal-4','gal-5','gal-6']),
    videos:new Set(['vid-1','vid-2','vid-3']),
    documents:new Set(['doc-kegiatan','doc-penyaluran','doc-dokumentasi','doc-keuangan','doc-tahunan','doc-legal'])
  };
  const syncTables=['programs','campaigns','articles','documents','gallery','videos','volunteers','book_donations','donors','donation_activity','messages'];
  const runtimeRows=Object.fromEntries(syncTables.map(type=>[type,[]]));
  const supabaseConfig={url:'https://tnwnmotbjhdefkzsdpuj.supabase.co',key:'sb_publishable_i3e7OtL5w0cMANlQJ1xSXw_jG6laci0',tables:syncTables};
  const notifySync=type=>window.dispatchEvent(new CustomEvent('wbs:data-sync',{detail:{type}}));
  const safeParse=(value,fallback=[])=>{try{const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed:fallback}catch{return fallback}};
  const normalizeType=type=>{if(!Object.prototype.hasOwnProperty.call(keys,type))throw new Error('Jenis data tidak dikenali.');return type};
  const readRows=type=>APP_MODE==='production'?(runtimeRows[type]||[]):safeParse(localStorage.getItem(keys[type])||'[]',[]);
  const writeRows=(type,rows)=>{if(APP_MODE==='production'){runtimeRows[type]=rows;return}try{localStorage.setItem(keys[type],JSON.stringify(rows))}catch(error){throw new Error('Penyimpanan browser penuh atau tidak dapat diakses. Hapus data yang tidak perlu lalu coba lagi.')}};
  const recordAudit=(action,type,before,after)=>{
    if(APP_MODE==='production')return;
    try{
      const rows=safeParse(localStorage.getItem(keys.audit_logs),[]);
      rows.unshift({id:'AUD-'+Date.now()+'-'+Math.random().toString(16).slice(2,8),action,type,recordId:(after||before||{}).id||'',before:before||null,after:after||null,user:'local-demo',createdAt:new Date().toISOString(),userAgent:navigator.userAgent});
      localStorage.setItem(keys.audit_logs,JSON.stringify(rows.slice(0,500)));
    }catch(error){console.warn('Audit log gagal disimpan:',error.message)}
  };
  class SupabaseRestSync{
    constructor(config){this.url=config.url.replace(/\/$/,'');this.key=config.key;this.accessToken='';this.tables=config.tables;this.enabled=Boolean(this.url&&this.key)}
    setAccessToken(token){this.accessToken=token||''}
    headers(extra={}){const headers={apikey:this.key,'Content-Type':'application/json',...extra};if(this.accessToken)headers.Authorization='Bearer '+this.accessToken;return headers}
    endpoint(type,query=''){return this.url+'/rest/v1/'+type+query}
    canWrite(type){return Boolean(this.accessToken)||['donors','volunteers','book_donations','messages'].includes(type)}
    async list(type){if(APP_MODE!=='production'||!this.enabled||!this.tables.includes(type))return[];const response=await fetch(this.endpoint(type,'?select=*&order=createdAt.desc.nullslast'),{headers:this.headers()});if(!response.ok)throw new Error('Supabase list '+type+' failed: '+response.status);return response.json()}
    async upsert(type,item){
      if(APP_MODE!=='production'||!this.enabled||!this.tables.includes(type)||!this.canWrite(type))return null;
      const isPublicInsert=!this.accessToken&&['donors','volunteers','book_donations','messages'].includes(type);
      const endpoint=this.endpoint(type,isPublicInsert?'':'?on_conflict=id'),body=JSON.stringify(item);
      const prefer=isPublicInsert?'return=minimal':'resolution=merge-duplicates,return=minimal';
      const response=await fetch(endpoint,{method:'POST',headers:this.headers({Prefer:prefer}),body});
      if(!response.ok){let detail='';try{detail=String(await response.text()).replace(/\s+/g,' ').trim().slice(0,240)}catch{}throw new Error('Supabase save '+type+' failed: '+response.status+(detail?' - '+detail:''))}
      return true;
    }
    async remove(type,id){if(!this.enabled||!this.tables.includes(type)||!this.accessToken)return null;const response=await fetch(this.endpoint(type,'?id=eq.'+encodeURIComponent(id)),{method:'DELETE',headers:this.headers({Prefer:'return=minimal'})});if(!response.ok)throw new Error('Supabase delete '+type+' failed: '+response.status);return true}
    async hydrate(){const results=await Promise.allSettled(this.tables.map(async type=>{const rows=await this.list(type);if(Array.isArray(rows)){runtimeRows[type]=rows;try{localStorage.removeItem(keys[type])}catch{}notifySync(type)}}));try{localStorage.removeItem(keys.audit_logs)}catch{}return results}
  }
  const supabaseSync=new SupabaseRestSync(supabaseConfig);
  class LocalRepository{
    list(type){normalizeType(type);const custom=this.custom(type);const base=seed[type]||[];return [...custom,...base.filter(item=>!custom.some(entry=>entry.id===item.id))]}
    custom(type){normalizeType(type);const retired=retiredSeedIds[type];return readRows(type).filter(item=>!retired?.has(item.id))}
    save(type,item,options={}){normalizeType(type);if(!item||typeof item!=='object')throw new Error('Data tidak valid.');const now=new Date().toISOString(),rows=this.custom(type),index=rows.findIndex(row=>row.id===item.id),before=index>=0?{...rows[index]}:null,saved={...item,id:item.id||WBS.uid(type.slice(0,3).toUpperCase()),createdAt:item.createdAt||before?.createdAt||now,updatedAt:now};if(index>=0)rows[index]=saved;else rows.unshift(saved);writeRows(type,rows);recordAudit(before?'update':'create',type,before,saved);if(options.sync!==false)supabaseSync.upsert(type,saved).catch(error=>console.warn(error.message));notifySync(type);return saved}
    async saveAndSync(type,item){const before=item?.id?this.custom(type).find(row=>row.id===item.id):null,saved=this.save(type,item,{sync:false});try{await supabaseSync.upsert(type,saved);return saved}catch(error){const rows=this.custom(type).filter(row=>row.id!==saved.id);if(before)rows.unshift(before);writeRows(type,rows);notifySync(type);throw new Error('Data belum tersimpan ke server. Periksa koneksi lalu coba lagi. ('+error.message+')')}}
    remove(type,id){normalizeType(type);const rows=this.custom(type),before=rows.find(item=>item.id===id);writeRows(type,rows.filter(item=>item.id!==id));recordAudit('delete',type,before,null);supabaseSync.remove(type,id).catch(error=>console.warn(error.message));notifySync(type)}
    find(type,id){return this.list(type).find(item=>item.id===id)}
  }
  class SupabaseRepository{
    constructor(client){this.client=client}
    async list(type){const{data,error}=await this.client.from(type).select('*').order('createdAt',{ascending:false});if(error)throw error;return data}
    async save(type,item){const{data,error}=await this.client.from(type).upsert(item).select().single();if(error)throw error;return data}
    async remove(type,id){const{error}=await this.client.from(type).delete().eq('id',id);if(error)throw error}
    async find(type,id){const{data,error}=await this.client.from(type).select('*').eq('id',id).single();if(error)throw error;return data}
  }
  window.WBS={APP_MODE,seed,keys,supabaseConfig,supabaseSync,audit:recordAudit,hydrateFromSupabase(){return APP_MODE==='production'?supabaseSync.hydrate():Promise.resolve([])},repository:new LocalRepository(),LocalRepository,SupabaseRepository,uid(prefix){return prefix+'-'+Date.now()+'-'+Math.random().toString(16).slice(2,8)}};
})();
