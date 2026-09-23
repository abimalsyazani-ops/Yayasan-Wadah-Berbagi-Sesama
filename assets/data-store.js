(function(){
  const seed={
    programs:[
      {id:'sosial-yatim',category:'sosial',title:'Santunan dan Pembinaan Anak Yatim',description:'Pendampingan rutin, santunan, dan pembinaan karakter bagi anak yatim.',image:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80'},
      {id:'sosial-bencana',category:'sosial',title:'Tanggap Bencana',description:'Bantuan cepat untuk masyarakat terdampak bencana dan keadaan darurat.',image:'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80'},
      {id:'sosial-dhuafa',category:'sosial',title:'Pendampingan Keluarga Dhuafa',description:'Bantuan kebutuhan dasar dan pendampingan menuju kemandirian.',image:'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&q=80'},
      {id:'pendidikan-beasiswa',category:'pendidikan',title:'Beasiswa Anak Yatim',description:'Dukungan biaya sekolah bagi anak yatim dan dhuafa berprestasi.',image:'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80'},
      {id:'pendidikan-tahfidz',category:'pendidikan',title:'Rumah Tahfidz Al-Qur\'an',description:'Pembinaan generasi penghafal Al-Qur\'an dengan kurikulum terarah.',image:'https://images.unsplash.com/photo-1609234656388-0ff363383899?w=800&q=80'},
      {id:'pendidikan-belajar',category:'pendidikan',title:'Rumah Belajar WBS',description:'Ruang belajar gratis, literasi, dan pendampingan akademik.',image:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'},
      {id:'kesehatan-gratis',category:'kesehatan',title:'Layanan Kesehatan Gratis',description:'Pemeriksaan dan pengobatan dasar bagi masyarakat prasejahtera.',image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'},
      {id:'kesehatan-pengobatan',category:'kesehatan',title:'Bantuan Biaya Pengobatan',description:'Dukungan pengobatan untuk pasien dhuafa dengan kondisi mendesak.',image:'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80'},
      {id:'kesehatan-gizi',category:'kesehatan',title:'Gizi Ibu dan Anak',description:'Paket gizi dan edukasi kesehatan untuk keluarga rentan.',image:'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&q=80'},
      {id:'pangan-sembako',category:'pangan',title:'Paket Sembako Dhuafa',description:'Distribusi pangan pokok rutin bagi keluarga prasejahtera.',image:'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80'},
      {id:'pangan-jumat',category:'pangan',title:'Jumat Berbagi',description:'Makanan siap santap untuk yatim, pekerja informal, dan dhuafa.',image:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80'},
      {id:'pangan-ramadhan',category:'pangan',title:'Pangan Ramadhan',description:'Paket sahur, berbuka, dan sembako selama bulan Ramadhan.',image:'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'}
    ],
    campaigns:[],
    articles:[],
    gallery:[],
    videos:[],
    documents:[],
    volunteers:[],book_donations:[],donors:[],messages:[]
  };

  // Mode demo aman untuk uji tampilan/fungsi lokal, tetapi bukan bukti keamanan produksi.
  // Ganti ke "production" setelah Supabase Auth, Database, Storage, dan RLS sudah dikonfigurasi.
  const APP_MODE='production';
  const keys={programs:'wbs_programs_v2',campaigns:'wbs_campaigns_v2',articles:'wbs_articles_v2',documents:'wbs_documents_v2',gallery:'wbs_gallery_v2',videos:'wbs_videos_v2',volunteers:'wbs_volunteers_v2',book_donations:'wbs_book_donations_v2',donors:'wbs_donors_v2',messages:'wbs_messages_v2',audit_logs:'wbs_audit_logs_v2'};
  const retiredSeedIds={
    campaigns:new Set(['zakat-maal','sedekah-yatim','wakaf-quran','beasiswa-yatim','pangan-lansia','pengobatan-dhuafa']),
    articles:new Set(['pangan-ramadhan-2026','keutamaan-sedekah','wakaf-produktif','adab-memberi']),
    gallery:new Set(['gal-1','gal-2','gal-3','gal-4','gal-5','gal-6']),
    videos:new Set(['vid-1','vid-2','vid-3']),
    documents:new Set(['doc-kegiatan','doc-penyaluran','doc-dokumentasi','doc-keuangan','doc-tahunan','doc-legal'])
  };
  const syncTables=['programs','campaigns','articles','documents','gallery','videos','volunteers','book_donations','donors','messages'];
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
    headers(extra={}){return{apikey:this.key,Authorization:'Bearer '+(this.accessToken||this.key),'Content-Type':'application/json',...extra}}
    endpoint(type,query=''){return this.url+'/rest/v1/'+type+query}
    canWrite(type){return Boolean(this.accessToken)||['donors','volunteers','book_donations','messages'].includes(type)}
    async list(type){if(APP_MODE!=='production'||!this.enabled||!this.tables.includes(type))return[];const response=await fetch(this.endpoint(type,'?select=*&order=createdAt.desc.nullslast'),{headers:this.headers()});if(!response.ok)throw new Error('Supabase list '+type+' failed: '+response.status);return response.json()}
    async upsert(type,item){if(APP_MODE!=='production'||!this.enabled||!this.tables.includes(type)||!this.canWrite(type))return null;const response=await fetch(this.endpoint(type,'?on_conflict=id'),{method:'POST',headers:this.headers({Prefer:'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(item)});if(!response.ok)throw new Error('Supabase save '+type+' failed: '+response.status);return true}
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
