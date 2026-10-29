import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';
import { STORAGE_KEY } from './tasks.js';

describe('task board user journeys', () => {
  it('creates a task and persists it across a remount', async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await user.click(screen.getByRole('button', { name: 'Yeni görev' }));
    await user.type(screen.getByLabelText(/Başlık/), 'Yeni React bileşeni');
    await user.click(screen.getByRole('button', { name: 'Görevi ekle' }));
    expect(screen.getByRole('heading', { name: 'Yeni React bileşeni' })).toBeInTheDocument();
    view.unmount();
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Yeni React bileşeni' })).toBeInTheDocument();
  });
  it('keeps the dialog open on whitespace-only input and shows an error', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Yeni görev' }));
    await user.type(screen.getByLabelText(/Başlık/), '   ');
    await user.click(screen.getByRole('button', { name: 'Görevi ekle' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Görev başlığını yaz.');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Başlık/)).toHaveFocus();
  });
  it('edits a task without creating a duplicate', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'React bileşenlerini keşfet görevini düzenle' }));
    await user.clear(screen.getByLabelText(/Başlık/));
    await user.type(screen.getByLabelText(/Başlık/), 'Props ve state çalış');
    await user.click(screen.getByRole('button', { name: 'Değişiklikleri kaydet' }));
    expect(screen.getByRole('heading', { name: 'Props ve state çalış' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(5);
  });
  it('moves a task between columns and updates progress', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText('React bileşenlerini keşfet durumu'), 'done');
    const column = screen.getByRole('region', { name: 'Tamamlandı' });
    expect(within(column).getByRole('heading', { name: 'React bileşenlerini keşfet' })).toBeInTheDocument();
    expect(screen.getByText('%60')).toBeInTheDocument();
  });
  it('deletes a task and restores it with undo', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'React bileşenlerini keşfet görevini sil' }));
    expect(screen.queryByRole('heading', { name: 'React bileşenlerini keşfet' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Geri al' }));
    expect(screen.getByRole('heading', { name: 'React bileşenlerini keşfet' })).toBeInTheDocument();
  });
  it('shows an empty search state and clears filters', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole('searchbox'), 'bulunmayan-görev');
    expect(screen.getByText('Bu filtrelerde görev yok.')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Filtreleri temizle' })[0]);
    expect(screen.getByRole('heading', { name: 'React bileşenlerini keşfet' })).toBeInTheDocument();
  });
  it('does not replace invalid stored data until the user starts a new list', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, '{broken');
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('otomatik kayıt durduruldu');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{broken');
    await user.click(screen.getByRole('button', { name: 'Yeni boş liste başlat' }));
    await waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).toBe('[]'));
  });
});
