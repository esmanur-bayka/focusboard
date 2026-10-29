export const STORAGE_KEY = 'focusboard.tasks.v1';
export const STATUSES = ['todo', 'doing', 'done'];
export const PRIORITIES = ['high', 'medium', 'low'];
export const CATEGORIES = ['Web', 'Mobil', 'Öğrenme'];

export const INITIAL_TASKS = [
  { id: 'demo-1', title: 'Portfolyo mobil menüsünü iyileştir', note: 'Klavye ile açma, Escape ile kapatma ve görünür odak durumlarını kontrol et.', category: 'Web', priority: 'high', status: 'doing' },
  { id: 'demo-2', title: 'React bileşenlerini keşfet', note: 'Props ve state farkını küçük bir örnekle açıkla.', category: 'Öğrenme', priority: 'medium', status: 'todo' },
  { id: 'demo-3', title: 'Mobil ekran akışını tasarla', note: 'Liste, ekleme ve boş durum ekranları için taslak hazırla.', category: 'Mobil', priority: 'medium', status: 'todo' },
  { id: 'demo-4', title: 'Form doğrulamasını test et', note: 'Boş ve yalnızca boşluk içeren başlıkları kontrol et.', category: 'Web', priority: 'high', status: 'done' },
  { id: 'demo-5', title: 'Proje kurulumunu belgele', note: 'Yeni bir geliştiricinin izleyeceği adımları yaz.', category: 'Öğrenme', priority: 'low', status: 'done' },
];

export function validateTask(task) {
  if (!task || typeof task.title !== 'string' || !task.title.trim()) return 'Görev başlığını yaz.';
  if (task.title.trim().length > 100) return 'Başlık en fazla 100 karakter olabilir.';
  if (typeof task.note !== 'string' || task.note.length > 500) return 'Not en fazla 500 karakter olabilir.';
  if (!CATEGORIES.includes(task.category)) return 'Geçerli bir alan seç.';
  if (!PRIORITIES.includes(task.priority)) return 'Geçerli bir öncelik seç.';
  if (!STATUSES.includes(task.status)) return 'Geçerli bir durum seç.';
  return '';
}

export function readTasks(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { tasks: INITIAL_TASKS.map(task => ({ ...task })), error: '' };
    const tasks = JSON.parse(raw);
    const ids = new Set();
    if (!Array.isArray(tasks) || tasks.some(task => {
      if (!task || typeof task.id !== 'string' || !task.id || ids.has(task.id) || validateTask(task)) return true;
      ids.add(task.id);
      return false;
    })) throw new Error('Invalid saved data');
    return { tasks, error: '' };
  } catch {
    return { tasks: [], error: 'Kaydedilmiş görevler okunamadı. Veriyi korumak için otomatik kayıt durduruldu. Sayfayı yenileyebilir veya yeni bir liste başlatabilirsin.' };
  }
}

export function writeTasks(storage, tasks) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return '';
  } catch {
    return 'Görevler tarayıcıya kaydedilemedi. Bu oturumda çalışmaya devam edebilirsin; sayfayı kapatırsan değişiklikler kaybolabilir.';
  }
}

export function filterTasks(tasks, { query = '', category = 'Tümü', priority = 'all' } = {}) {
  const term = query.trim().toLocaleLowerCase('tr-TR');
  return tasks.filter(task => (category === 'Tümü' || task.category === category)
    && (priority === 'all' || task.priority === priority)
    && `${task.title} ${task.note}`.toLocaleLowerCase('tr-TR').includes(term));
}

export function getProgress(tasks) {
  const done = tasks.filter(task => task.status === 'done').length;
  return { total: tasks.length, done, doing: tasks.filter(task => task.status === 'doing').length, percentage: tasks.length ? Math.round(done / tasks.length * 100) : 0 };
}
