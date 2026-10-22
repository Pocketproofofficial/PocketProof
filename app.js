(() => {
  const KEY = 'proof-pocket-receipts-v1';
  const $ = (id) => document.getElementById(id);
  const list = $('receipt-list'), addDialog = $('receipt-dialog'), detailDialog = $('detail-dialog'), form = $('receipt-form');
  let receipts = load(), pendingImage = '', activeId = null, toastTimer;
  function load(){ try { const x=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(x)?x:[]; } catch { return []; } }
  function persist(){ try { localStorage.setItem(KEY, JSON.stringify(receipts)); return true; } catch { showToast('Browser storage is full. Export your data and remove some large receipts.'); return false; } }
  function money(n){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n)||0)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function dateText(s){if(!s)return 'Date not set'; const d=new Date(s+'T12:00:00');return Number.isNaN(d.getTime())?s:d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
  function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3000)}
  function render(){
    $('receipt-count').textContent=receipts.length;
    $('savings-total').textContent=money(receipts.reduce((s,r)=>s+(Number(r.saving)||0),0));
    const now=new Date(); $('month-count').textContent=receipts.filter(r=>{const d=new Date((r.date||'')+'T12:00:00');return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()}).length;
    const q=$('search').value.trim().toLowerCase(), f=$('filter').value;
    const filtered=receipts.filter(r=>(!q||[r.shop,r.notes].some(x=>String(x||'').toLowerCase().includes(q)))&&(f==='all'||(f==='return'&&r.returnable)||(f==='saving'&&Number(r.saving)>0))).sort((a,b)=>b.created-a.created);
    if(!filtered.length){list.innerHTML=`<div class="empty-state"><div class="empty-icon">▤</div><h3>${receipts.length?'No matching receipts':'Your pocket is ready'}</h3><p>${receipts.length?'Try a different search or filter.':'Add a receipt photo to get started. You can review the extracted text before saving it.'}</p>${receipts.length?'':'<button class="primary" id="empty-add-render">Add your first receipt</button>'}</div>`;const b=$('empty-add-render');if(b)b.onclick=openAdd;return;}
    list.innerHTML=filtered.map(r=>`<article class="receipt-row" tabindex="0" role="button" data-id="${esc(r.id)}" aria-label="Open receipt from ${esc(r.shop)}"><div class="receipt-thumb">▤</div><div class="receipt-info"><strong>${esc(r.shop||'Untitled receipt')}</strong><div class="receipt-meta">${esc(dateText(r.date))}${r.returnable?' · Return / warranty':''}${r.notes?' · '+esc(r.notes.slice(0,58)):''}</div></div><div class="receipt-amount"><strong>${money(r.amount)}</strong>${Number(r.saving)>0?`<span>+ ${money(r.saving)} saved</span>`:''}</div></article>`).join('');
    list.querySelectorAll('.receipt-row').forEach(el=>{el.addEventListener('click',()=>openDetail(el.dataset.id));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(el.dataset.id)}})});
  }
  function openAdd(){form.reset();$('date').value=new Date().toISOString().slice(0,10);$('saving').value='0';$('ocr-status').textContent='Choose a photo to try text recognition. You can also enter details manually.';pendingImage='';addDialog.showModal()}
  function closeAdd(){addDialog.close()}
  function openDetail(id){const r=receipts.find(x=>x.id===id);if(!r)return;activeId=id;$('detail-title').textContent=r.shop||'Receipt';$('detail-content').innerHTML=`${r.image?`<img class="detail-image" src="${r.image}" alt="Saved receipt photo">`:''}<div class="detail-grid"><div class="detail-cell"><span>Date</span><strong>${esc(dateText(r.date))}</strong></div><div class="detail-cell"><span>Receipt total</span><strong>${money(r.amount)}</strong></div><div class="detail-cell"><span>Savings tracked</span><strong>${money(r.saving)}</strong></div><div class="detail-cell"><span>Reminder</span><strong>${r.returnable?'Return / warranty':'None marked'}</strong></div></div>${r.returnable?'<span class="tag">Return / warranty</span>':''}<p class="detail-notes">${esc(r.notes||'No notes added.')}</p>`;detailDialog.showModal()}
  $('hero-add').onclick=openAdd;$('add-button').onclick=openAdd;$('empty-add').onclick=openAdd;$('close-dialog').onclick=closeAdd;$('cancel-dialog').onclick=closeAdd;$('close-detail').onclick=()=>detailDialog.close();$('done-detail').onclick=()=>detailDialog.close();$('search').addEventListener('input',render);$('filter').addEventListener('change',render);
  $('receipt-image').addEventListener('change', async e=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){showToast('Please choose an image file.');return;}if(file.size>8*1024*1024){showToast('Choose an image smaller than 8 MB.');e.target.value='';return;}
    $('ocr-status').textContent='Preparing image…';
    try{pendingImage=await compressImage(file); }catch{pendingImage='';}
    if(!window.Tesseract){$('ocr-status').textContent='Photo attached. Text recognition could not load; enter details manually.';return;}
    try{
      $('ocr-status').textContent='Reading the receipt… this can take a little while.';
      const result=await Tesseract.recognize(file,'eng',{logger:m=>{if(m.status==='recognizing text')$('ocr-status').textContent=`Reading receipt… ${Math.round((m.progress||0)*100)}%`;}});
      const text=(result.data.text||'').trim();if(text){$('notes').value=text;const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!$('shop').value&&lines.length)$('shop').value=lines[0].slice(0,100);const amounts=[...text.matchAll(/(?:£|GBP\s*)\s*(\d{1,5}[.,]\d{2})/gi)].map(m=>Number(m[1].replace(',','.'))).filter(Number.isFinite);if(amounts.length&&!$('amount').value)$('amount').value=Math.max(...amounts).toFixed(2);$('ocr-status').textContent='Text recognised. Check the shop, date and total carefully before saving.';}else $('ocr-status').textContent='No readable text found. You can still enter details manually.';
    }catch(err){$('ocr-status').textContent='Text recognition failed or was blocked. Your photo is attached; enter details manually.';}
  });
  function compressImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const scale=Math.min(1,1000/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.72));};img.src=reader.result;};reader.readAsDataURL(file);});}
  form.addEventListener('submit',e=>{e.preventDefault();const shop=$('shop').value.trim(),date=$('date').value;if(!shop||!date){showToast('Please add a shop name and date.');return;}const amount=Math.max(0,Number($('amount').value)||0),saving=Math.max(0,Number($('saving').value)||0);if(saving>amount&&amount>0&&!confirm('Savings are higher than the receipt total. Save anyway?'))return;
    const r={id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),shop,date,amount,saving,notes:$('notes').value.trim(),returnable:$('returnable').checked,image:pendingImage,created:Date.now()};receipts.push(r);if(persist()){closeAdd();render();showToast('Receipt saved on this device.');}else{receipts.pop();}
  });
  $('delete-receipt').onclick=()=>{if(!activeId)return;if(!confirm('Delete this receipt from this browser?'))return;receipts=receipts.filter(r=>r.id!==activeId);persist();detailDialog.close();render();showToast('Receipt deleted.');};
  $('export-button').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),receipts},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='proof-pocket-export.json';a.click();URL.revokeObjectURL(url);showToast('Export created. Keep it somewhere safe.');};
  let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install-button').classList.remove('hidden')});$('install-button').onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('install-button').classList.add('hidden')};
  if('serviceWorker' in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  render();
})();
