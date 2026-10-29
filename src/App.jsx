import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, INITIAL_TASKS, STATUSES, filterTasks, getProgress, readTasks, validateTask, writeTasks } from './tasks.js';

const STATUS_LABELS = { todo: 'Yapılacak', doing: 'Devam ediyor', done: 'Tamamlandı' };
const PRIORITY_LABELS = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };

function Icon({ name, size = 20 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    leaf: <><path d="M20 4C9 2 2 8 6 16c8 5 16-1 14-12Z" /><path d="M4 21 15 10" /></>,
    edit: <><path d="m15 5 4 4M4 20l5-1L21 7l-4-4L5 15Z" /></>,
    trash: <><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" /></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 18h4" /></>,
    book: <><path d="M12 5C8 2 4 3 2 4v15c3-2 7-1 10 1 3-2 7-3 10-1V4c-2-1-6-2-10 1Zm0 0v15" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}

function TaskCard({ task, onEdit, onRemove, onStatus }) {
  return <article className="task-card">
    <div className="card-top"><span className={`tag category-${task.category === 'Web' ? 'web' : task.category === 'Mobil' ? 'mobile' : 'learn'}`}>{task.category}</span><span className={`priority ${task.priority}`}><span aria-hidden="true">●</span> {PRIORITY_LABELS[task.priority]}</span></div>
    <h3>{task.title}</h3>
    {task.note && <p className="task-note">{task.note}</p>}
    <div className="card-bottom">
      <label className="sr-only" htmlFor={`status-${task.id}`}>{task.title} durumu</label>
      <select id={`status-${task.id}`} value={task.status} onChange={event => onStatus(task.id, event.target.value)}>{STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select>
      <div className="card-actions"><button className="icon-button" onClick={() => onEdit(task)} aria-label={`${task.title} görevini düzenle`}><Icon name="edit" size={16} /></button><button className="icon-button" onClick={() => onRemove(task)} aria-label={`${task.title} görevini sil`}><Icon name="trash" size={16} /></button></div>
    </div>
  </article>;
}

function TaskForm({ task, onSave, onClose }) {
  const [draft, setDraft] = useState(task || { title: '', note: '', category: 'Web', priority: 'medium', status: 'todo' });
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  useEffect(() => { titleRef.current?.focus(); }, []);
  function update(field, value) { setDraft(previous => ({ ...previous, [field]: value })); setError(''); }
  function submit(event) {
    event.preventDefault();
    const message = validateTask(draft);
    if (message) { setError(message); titleRef.current?.focus(); return; }
    onSave({ ...draft, title: draft.title.trim(), note: draft.note.trim() });
  }
  return <form onSubmit={submit} noValidate>
    <p className="eyebrow">BİR SONRAKİ ADIM</p><h2 id="dialog-title">{task ? 'Görevi düzenle' : 'Yeni görev oluştur'}</h2>
    <p className="muted">Küçük ve net bir adımla başla.</p>
    <label htmlFor="task-title">Başlık <span className="muted">(zorunlu)</span></label><input ref={titleRef} id="task-title" value={draft.title} onChange={event => update('title', event.target.value)} maxLength={100} placeholder="Örn. Mobil menüyü klavyeyle test et" aria-invalid={!!error} aria-describedby={error ? 'form-error' : undefined} />
    <label htmlFor="task-note">Not <span className="muted">(isteğe bağlı)</span></label><textarea id="task-note" value={draft.note} onChange={event => update('note', event.target.value)} maxLength={500} rows={3} placeholder="Neye dikkat etmek istiyorsun?" />
    <div className="form-grid"><div><label htmlFor="task-category">Alan</label><select id="task-category" value={draft.category} onChange={event => update('category', event.target.value)}>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></div><div><label htmlFor="task-priority">Öncelik</label><select id="task-priority" value={draft.priority} onChange={event => update('priority', event.target.value)}>{Object.entries(PRIORITY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div></div>
    <label htmlFor="task-status">Durum</label><select id="task-status" value={draft.status} onChange={event => update('status', event.target.value)}>{STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select>
    {error && <p id="form-error" className="form-error" role="alert">{error}</p>}
    <div className="dialog-actions"><button className="secondary-button" type="button" onClick={onClose}>Vazgeç</button><button className="primary-button" type="submit">{task ? 'Değişiklikleri kaydet' : 'Görevi ekle'}<Icon name="arrow" size={17} /></button></div>
  </form>;
}

export default function App() {
  const [initial] = useState(() => {
    try { return readTasks(window.localStorage); }
    catch { return readTasks(null); }
  });
  const [tasks, setTasks] = useState(initial.tasks);
  const [storageError, setStorageError] = useState(initial.error);
  const [canSave, setCanSave] = useState(!initial.error);
  const [category, setCategory] = useState('Tümü');
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('all');
  const [modal, setModal] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [undo, setUndo] = useState(null);
  const dialogRef = useRef(null);
  const returnFocus = useRef(null);
  const addButton = useRef(null);
  const progress = getProgress(tasks);
  const visible = filterTasks(tasks, { query, category, priority });
  const hasFilters = query.trim() || category !== 'Tümü' || priority !== 'all';

  useEffect(() => {
    if (canSave) {
      try { setStorageError(writeTasks(window.localStorage, tasks)); }
      catch { setStorageError(writeTasks(null, tasks)); }
    }
  }, [tasks, canSave]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (modal && !dialog.open) dialog.showModal();
    if (!modal && dialog.open) dialog.close();
  }, [modal]);

  function openModal(task = null) { returnFocus.current = document.activeElement; setModal({ task }); }
  function closeModal() {
    setModal(null);
    const target = returnFocus.current;
    requestAnimationFrame(() => (target?.isConnected ? target : addButton.current)?.focus());
  }
  function saveTask(draft) {
    setTasks(previous => draft.id ? previous.map(task => task.id === draft.id ? draft : task) : [...previous, { ...draft, id: crypto.randomUUID() }]);
    setAnnouncement(draft.id ? 'Görev güncellendi.' : 'Görev eklendi.');
    closeModal();
  }
  function removeTask(task) { setUndo({ task, index: tasks.findIndex(item => item.id === task.id) }); setTasks(previous => previous.filter(item => item.id !== task.id)); setAnnouncement('Görev silindi. Son silme işlemini geri alabilirsin.'); addButton.current?.focus(); }
  function undoRemove() { setTasks(previous => { const next = [...previous]; next.splice(Math.min(undo.index, next.length), 0, undo.task); return next; }); setUndo(null); setAnnouncement('Görev geri getirildi.'); }
  function changeStatus(id, status) { setTasks(previous => previous.map(task => task.id === id ? { ...task, status } : task)); setAnnouncement(`Görev durumu: ${STATUS_LABELS[status]}.`); }
  function clearFilters() { setQuery(''); setCategory('Tümü'); setPriority('all'); }

  return <div className="app-shell">
    <a className="skip-link" href="#main">İçeriğe geç</a>
    <aside className="sidebar" aria-label="Alan seçimi">
      <a className="brand" href="#main"><span className="brand-mark">f<span>.</span></span><span>focusboard<span className="brand-dot">.</span></span></a>
      <div className="workspace-label">KİŞİSEL ÇALIŞMA ALANI</div>
      <nav aria-label="Görev alanları">{['Tümü', ...CATEGORIES].map((item, index) => <button key={item} className={`nav-item ${category === item ? 'selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}><Icon name={['grid', 'code', 'phone', 'book'][index]} /><span>{item === 'Tümü' ? 'Genel bakış' : item === 'Öğrenme' ? 'Öğrenme yolculuğu' : `${item} geliştirme`}</span><span className="nav-count">{item === 'Tümü' ? tasks.length : tasks.filter(task => task.category === item).length}</span></button>)}</nav>
      <div className="sidebar-note"><Icon name="leaf" size={28} /><h2>Küçük adımlar.<br />Görünür ilerleme.</h2><p>Bugün tek bir şeyi ileri taşımak bile bir başlangıç.</p></div>
      <div className="sidebar-footer"><span className="avatar">EB</span><div><strong>Esmanur Bayka</strong><span>React öğrenme projesi</span></div></div>
    </aside>
    <main id="main" className="main" tabIndex={-1}>
      <header className="topbar"><span><span className="status-light" /> Kişisel görev panosu</span><a href="https://github.com/esmanur-bayka" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (yeni sekme)</span></a></header>
      <section className="page-heading"><div><p className="eyebrow">PLANLA · ODAKLAN · TAMAMLA</p><h1>Bir sonraki adıma<br /><em>odaklan.</em></h1><p className="page-intro">Fikirlerini küçük görevlere dönüştür.<br className="mobile-break" /> İlerlemeni tek bir yerde gör.</p></div><button ref={addButton} className="primary-button new-task" onClick={() => openModal()}><Icon name="plus" />Yeni görev</button></section>
      {storageError && <div className="storage-warning" role="alert"><p>{storageError}</p>{!canSave && <button className="secondary-button" onClick={() => { setCanSave(true); setTasks([]); setAnnouncement('Yeni liste başlatıldı.'); }}>Yeni boş liste başlat</button>}</div>}
      <section className="stats" aria-label="Görev özeti"><div className="stat-card"><div className="stat-icon"><Icon name="grid" /></div><div><span>Toplam görev</span><strong>{progress.total.toString().padStart(2, '0')}</strong></div><span className="stat-caption">Planın hazır.</span></div><div className="stat-card"><div className="stat-icon warm"><Icon name="clock" /></div><div><span>Devam ediyor</span><strong>{progress.doing.toString().padStart(2, '0')}</strong></div><span className="stat-caption">Bir adım daha.</span></div><div className="stat-card progress-card"><div className="progress-top"><div><span>Tamamlanma</span><strong>%{progress.percentage}</strong></div><span className="stat-icon green"><Icon name="check" /></span></div><progress value={progress.done} max={progress.total || 1} aria-label="Tamamlanan görevlerin oranı" /><span className="progress-caption">{progress.done} / {progress.total} görev tamamlandı</span></div></section>
      <section aria-labelledby="board-title" className="board-section"><div className="board-heading"><div><h2 id="board-title">{category === 'Tümü' ? 'Görev panon' : `${category} görevlerin`}</h2><p>{hasFilters ? `${visible.length} görev filtrelerle eşleşiyor` : 'Her fikir bir sonraki adımını bekliyor.'}</p></div><span className="demo-label">İlk açılışta örnek görevler</span></div>
        <div className="toolbar"><div className="search"><Icon name="search" size={19} /><label htmlFor="search" className="sr-only">Görevlerde ara</label><input id="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Görevlerde ara…" type="search" /></div><div className="filter"><label htmlFor="priority-filter">Öncelik</label><select id="priority-filter" value={priority} onChange={event => setPriority(event.target.value)}><option value="all">Tümü</option>{Object.entries(PRIORITY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>{hasFilters && <button className="text-button" onClick={clearFilters}>Filtreleri temizle</button>}</div>
        {visible.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name="leaf" size={34} /></span><h3>{hasFilters ? 'Bu filtrelerde görev yok.' : 'Yeni bir başlangıç için alan var.'}</h3><p>{hasFilters ? 'Farklı bir sözcük dene veya filtreleri temizle.' : 'İlk görevini ekle ve bir sonraki adımını belirle.'}</p><button className="secondary-button" onClick={hasFilters ? clearFilters : () => openModal()}>{hasFilters ? 'Filtreleri temizle' : 'İlk görevi ekle'}</button>{!hasFilters && <button className="text-button demo-button" onClick={() => { setTasks(INITIAL_TASKS.map(task => ({ ...task, id: crypto.randomUUID() }))); setAnnouncement('Örnek görevler eklendi.'); }}>Örnek görevleri yükle</button>}</div> : <div className="board">{STATUSES.map(status => <section key={status} className={`column column-${status}`} aria-labelledby={`column-${status}`}><div className="column-heading"><h3 id={`column-${status}`}><span className="column-dot" />{STATUS_LABELS[status]}</h3><span className="column-count">{visible.filter(task => task.status === status).length}</span></div><div className="column-cards">{visible.filter(task => task.status === status).map(task => <TaskCard key={task.id} task={task} onEdit={openModal} onRemove={removeTask} onStatus={changeStatus} />)}{visible.every(task => task.status !== status) && <p className="column-empty">Henüz görev yok</p>}</div></section>)}</div>}
      </section>
      <footer className="page-footer"><span>Esmanur Bayka <span aria-hidden="true">·</span> FocusBoard</span><span>Görevlerin bu tarayıcıda saklanır.</span></footer>
    </main>
    <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    {undo && <div className="toast"><span>Görev silindi.</span><button onClick={undoRemove}>Geri al</button><button className="icon-button" aria-label="Bildirimi kapat" onClick={() => setUndo(null)}><Icon name="close" size={16} /></button></div>}
    <dialog ref={dialogRef} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); closeModal(); }} onClick={event => { if (event.target === dialogRef.current) { const bounds = dialogRef.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal(); } }}><button className="dialog-close icon-button" aria-label="Pencereyi kapat" onClick={closeModal}><Icon name="close" /></button>{modal && <TaskForm key={modal.task?.id || 'new'} task={modal.task} onSave={saveTask} onClose={closeModal} />}</dialog>
  </div>;
}
