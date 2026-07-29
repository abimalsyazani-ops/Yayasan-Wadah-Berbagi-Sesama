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
    campaigns:[
      {id:'zakat-maal',category:'Zakat',title:'Zakat Maal untuk Keluarga Dhuafa',description:'Salurkan zakat maal untuk membantu keluarga dhuafa memenuhi kebutuhan dasar dan membangun kemandirian.',collected:0,target:150000000,deadline:'2026-07-09',image:'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=900&q=80',featured:true},
      {id:'sedekah-yatim',category:'Sedekah',title:'Sedekah Makan Anak Yatim Setiap Jumat',description:'Hadirkan makanan bergizi dan kebahagiaan bagi anak yatim setiap Jumat.',collected:0,target:75000000,deadline:'',image:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80',featured:true},
      {id:'wakaf-quran',category:'Wakaf',title:'Wakaf Al-Qur\'an dan Rumah Tahfidz',description:'Dukung penyediaan Al-Qur\'an dan pengembangan rumah tahfidz.',collected:0,target:250000000,deadline:'2026-07-22',image:'https://images.unsplash.com/photo-1609234656388-0ff363383899?w=900&q=80'},
      {id:'beasiswa-yatim',category:'Pendidikan',title:'Beasiswa Pendidikan Anak Yatim 2026',description:'Bantu anak yatim melanjutkan pendidikan dan meraih masa depan lebih baik.',collected:0,target:200000000,deadline:'2026-07-16',image:'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&q=80'},
      {id:'pangan-lansia',category:'Pangan',title:'Paket Sembako untuk Lansia dan Dhuafa',description:'Penuhi kebutuhan pangan pokok lansia dan keluarga prasejahtera.',collected:0,target:120000000,deadline:'2026-07-03',image:'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=900&q=80'},
      {id:'pengobatan-dhuafa',category:'Kesehatan',title:'Bantuan Pengobatan Pasien Dhuafa',description:'Ringankan biaya pengobatan pasien dhuafa dengan kondisi mendesak.',collected:0,target:150000000,deadline:'2026-08-01',image:'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=900&q=80'}
    ],
    articles:[
      {id:'pangan-ramadhan-2026',category:'Kegiatan Yayasan',title:'WBS Salurkan 50.000 Paket Pangan Selama Ramadhan',date:'2026-06-12',excerpt:'Kolaborasi donatur dan relawan menghadirkan paket pangan bagi keluarga di berbagai wilayah.',image:'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=900&q=80',content:'Yayasan Wadah Berbagi Sesama menyalurkan paket pangan selama Ramadhan kepada keluarga prasejahtera, lansia, dan anak yatim. Setiap penyaluran didahului verifikasi penerima manfaat dan didokumentasikan oleh tim lapangan.\n\nProgram ini menjadi bagian dari komitmen WBS untuk menjaga ketahanan pangan sekaligus memperluas kolaborasi kebaikan.'},
      {id:'keutamaan-sedekah',category:'Edukasi Sedekah',title:'Keutamaan Sedekah di Bulan-Bulan Mulia',date:'2026-06-08',excerpt:'Sedekah menjadi jalan sederhana untuk menumbuhkan kepedulian dan kebermanfaatan.',image:'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=900&q=80',content:'Sedekah mengajarkan kepedulian, rasa syukur, dan tanggung jawab sosial. Nilainya tidak hanya terletak pada jumlah, tetapi juga pada ketulusan dan ketepatan manfaat.\n\nWBS mendorong masyarakat memilih program yang jelas, terukur, dan dilaporkan secara terbuka.'},
      {id:'wakaf-produktif',category:'Edukasi Wakaf',title:'Mengenal Wakaf Produktif dan Manfaatnya bagi Umat',date:'2026-06-02',excerpt:'Wakaf produktif memungkinkan manfaat aset terus tumbuh dan dirasakan masyarakat.',image:'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=900&q=80',content:'Wakaf produktif dikelola agar aset pokok tetap terjaga sementara hasilnya mendukung kebutuhan umat. Pengelolaan yang profesional membutuhkan tata kelola, pelaporan, dan evaluasi berkala.\n\nMelalui program wakaf, WBS berupaya menghadirkan manfaat jangka panjang untuk pendidikan, air bersih, dan pemberdayaan.'},
      {id:'adab-memberi',category:'Artikel Islami',title:'Adab Memberi dalam Islam yang Perlu Diteladani',date:'2026-05-28',excerpt:'Memberi dengan santun menjaga kehormatan penerima dan ketulusan pemberi.',image:'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=900&q=80',content:'Kebaikan perlu disampaikan dengan cara yang baik. Menjaga privasi, tidak menyakiti perasaan, dan memilih penyaluran yang tepat merupakan bagian penting dari adab memberi.\n\nWBS menjaga dokumentasi program tanpa mengurangi martabat penerima manfaat.'}
    ],
    gallery:[
      {id:'gal-1',title:'Distribusi Paket Pangan',category:'Pangan',date:'2026-06-12',image:'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1000&q=80',images:['https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1000&q=80','https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1000&q=80','https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=80','https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=1000&q=80','https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1000&q=80']},
      {id:'gal-2',title:'Kegiatan Belajar Anak',category:'Pendidikan',date:'2026-06-06',image:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&q=80',images:['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&q=80','https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&q=80','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80','https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&q=80','https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&q=80']},
      {id:'gal-3',title:'Pemeriksaan Kesehatan',category:'Kesehatan',date:'2026-05-28',image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=80',images:['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=80','https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1000&q=80','https://images.unsplash.com/photo-1584515933487-779824d29309?w=1000&q=80','https://images.unsplash.com/photo-1580281657521-2c3bcb0f3c8a?w=1000&q=80','https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=1000&q=80']},
      {id:'gal-4',title:'Pembinaan Anak Yatim',category:'Sosial',date:'2026-05-20',image:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80',images:['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80','https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=1000&q=80','https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=80','https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1000&q=80','https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&q=80']},
      {id:'gal-5',title:'Relawan WBS di Lapangan',category:'Relawan',date:'2026-05-14',image:'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=80',images:['https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=80','https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&q=80','https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1000&q=80','https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1000&q=80','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80']},
      {id:'gal-6',title:'Program Gizi Keluarga',category:'Pangan',date:'2026-05-04',image:'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=1000&q=80',images:['https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=1000&q=80','https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=80','https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1000&q=80','https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1000&q=80','https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1000&q=80']}
    ],
    videos:[
      {id:'vid-1',title:'Dokumentasi Kegiatan WBS',category:'Dokumentasi',date:'2026-06-20',url:'https://www.youtube.com/watch?v=ysz5S6PUM-U'},
      {id:'vid-2',title:'Cerita Relawan WBS',category:'Relawan',date:'2026-06-14',url:'https://youtu.be/ysz5S6PUM-U'},
      {id:'vid-3',title:'Penyaluran Bantuan Pangan',category:'Pangan',date:'2026-06-08',url:'https://www.youtube.com/watch?v=ysz5S6PUM-U'}
    ],
    documents:[
      {id:'doc-kegiatan',category:'Laporan Kegiatan',title:'Laporan Kegiatan Yayasan',period:'Diperbarui berkala',url:'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Kegiatan%20WBS',fileName:''},
      {id:'doc-penyaluran',category:'Laporan Penyaluran',title:'Laporan Penyaluran Bantuan',period:'Diperbarui berkala',url:'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Penyaluran%20WBS',fileName:''},
      {id:'doc-dokumentasi',category:'Dokumentasi Program',title:'Dokumentasi Pelaksanaan Program',period:'Diperbarui berkala',url:'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Dokumentasi%20Program%20WBS',fileName:''},
      {id:'doc-keuangan',category:'Penggunaan Dana',title:'Laporan Penggunaan Dana',period:'Diperbarui berkala',url:'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Penggunaan%20Dana%20WBS',fileName:''},
      {id:'doc-tahunan',category:'Laporan Tahunan',title:'Laporan Tahunan Yayasan',period:'Tahunan',url:'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Laporan%20Tahunan%20WBS',fileName:''},
      {id:'doc-legal',category:'Legalitas',title:'SK Kemenkumham dan NIB Yayasan',period:'Tahun 2025',url:'mailto:wadahberbagisesama48@gmail.com?subject=Permintaan%20Legalitas%20WBS',fileName:''}
    ],
    volunteers:[],donors:[],messages:[]
  };

  // Mode demo aman untuk uji tampilan/fungsi lokal, tetapi bukan bukti keamanan produksi.
  // Ganti ke "production" setelah Supabase Auth, Database, Storage, dan RLS sudah dikonfigurasi.
  const APP_MODE='demo';
  const keys={programs:'wbs_programs_v2',campaigns:'wbs_campaigns_v2',articles:'wbs_articles_v2',documents:'wbs_documents_v2',gallery:'wbs_gallery_v2',videos:'wbs_videos_v2',volunteers:'wbs_volunteers_v2',donors:'wbs_donors_v2',messages:'wbs_messages_v2',audit_logs:'wbs_audit_logs_v2'};
  const syncTables=['programs','campaigns','articles','documents','gallery','videos','volunteers','donors','messages'];
  const supabaseConfig={url:'https://tnwnmotbjhdefkzsdpuj.supabase.co',key:'sb_publishable_i3e7OtL5w0cMANlQJ1xSXw_jG6laci0',tables:syncTables};
  const notifySync=type=>window.dispatchEvent(new CustomEvent('wbs:data-sync',{detail:{type}}));
  const safeParse=(value,fallback=[])=>{try{const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed:fallback}catch{return fallback}};
  const normalizeType=type=>{if(!Object.prototype.hasOwnProperty.call(keys,type))throw new Error('Jenis data tidak dikenali.');return type};
  const writeRows=(type,rows)=>{try{localStorage.setItem(keys[type],JSON.stringify(rows))}catch(error){throw new Error('Penyimpanan browser penuh atau tidak dapat diakses. Hapus data yang tidak perlu lalu coba lagi.')}};
  const recordAudit=(action,type,before,after)=>{
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
    canWrite(type){return Boolean(this.accessToken)||['donors','volunteers','messages'].includes(type)}
    async list(type){if(APP_MODE!=='production'||!this.enabled||!this.tables.includes(type))return[];const response=await fetch(this.endpoint(type,'?select=*&order=createdAt.desc.nullslast'),{headers:this.headers()});if(!response.ok)throw new Error('Supabase list '+type+' failed: '+response.status);return response.json()}
    async upsert(type,item){if(APP_MODE!=='production'||!this.enabled||!this.tables.includes(type)||!this.canWrite(type))return null;const response=await fetch(this.endpoint(type,'?on_conflict=id'),{method:'POST',headers:this.headers({Prefer:'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(item)});if(!response.ok)throw new Error('Supabase save '+type+' failed: '+response.status);return true}
    async remove(type,id){if(!this.enabled||!this.tables.includes(type)||!this.accessToken)return null;const response=await fetch(this.endpoint(type,'?id=eq.'+encodeURIComponent(id)),{method:'DELETE',headers:this.headers({Prefer:'return=minimal'})});if(!response.ok)throw new Error('Supabase delete '+type+' failed: '+response.status);return true}
    async hydrate(keys){const results=await Promise.allSettled(this.tables.map(async type=>{const rows=await this.list(type);if(Array.isArray(rows)){localStorage.setItem(keys[type],JSON.stringify(rows));notifySync(type)}}));return results}
  }
  const supabaseSync=new SupabaseRestSync(supabaseConfig);
  class LocalRepository{
    list(type){normalizeType(type);const custom=this.custom(type);const base=seed[type]||[];return [...custom,...base.filter(item=>!custom.some(entry=>entry.id===item.id))]}
    custom(type){normalizeType(type);return safeParse(localStorage.getItem(keys[type])||'[]',[])}
    save(type,item){normalizeType(type);if(!item||typeof item!=='object')throw new Error('Data tidak valid.');const now=new Date().toISOString(),rows=this.custom(type),index=rows.findIndex(row=>row.id===item.id),before=index>=0?{...rows[index]}:null,saved={...item,id:item.id||WBS.uid(type.slice(0,3).toUpperCase()),createdAt:item.createdAt||before?.createdAt||now,updatedAt:now};if(index>=0)rows[index]=saved;else rows.unshift(saved);writeRows(type,rows);recordAudit(before?'update':'create',type,before,saved);supabaseSync.upsert(type,saved).catch(error=>console.warn(error.message));notifySync(type);return saved}
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
  window.WBS={APP_MODE,seed,keys,supabaseConfig,supabaseSync,audit:recordAudit,hydrateFromSupabase(){return APP_MODE==='production'?supabaseSync.hydrate(keys):Promise.resolve([])},repository:new LocalRepository(),LocalRepository,SupabaseRepository,uid(prefix){return prefix+'-'+Date.now()+'-'+Math.random().toString(16).slice(2,8)}};
})();
