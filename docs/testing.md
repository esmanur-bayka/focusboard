# Doğrulama notları

## Otomatik kontroller

29 Ekim 2026 tarihinde Node.js 24.22.1 üzerinde:

- Vitest: **15/15 test başarılı**, 2 test dosyası
- Vite üretim derlemesi: **başarılı**

`pnpm test` ve `pnpm build` ile yeniden çalıştırılabilir.

## Kapsam

| Kontrol | Otomatik test |
| --- | --- |
| Yeni görev ekleme ve yeniden açıldığında kalıcılık | Bileşen testi |
| Başlığı düzenleme, kopya görev oluşmaması | Bileşen testi |
| Durum değiştirme ve ilerleme oranı | Bileşen testi |
| Silme ve geri alma | Bileşen testi |
| Sonuçsuz arama ve filtre temizleme | Bileşen testi |
| Boş/uzun başlık, uzun not ve geçersiz seçenekler | Veri testi |
| Türkçe büyük/küçük harfli birleşik filtreleme | Veri testi |
| Bozuk JSON, kopya kimlikler, erişilemeyen depolama | Veri ve bileşen testi |
| Kayıtlı boş liste ile ilk açılış farkı | Veri testi |

## Gerçek tarayıcı kontrol listesi

Gerçek cihaz testi ve ekran okuyucu denetimi tamamlanmış olarak sunulmaz. jsdom dialog yöntemleri test ortamında uyarlanmıştır; odak sınırı ve Escape davranışı gerçek tarayıcıda ayrıca değerlendirilmelidir.

- Masaüstü ve 390 px mobil genişlikte yatay taşma, kart hizaları ve okunabilirlik
- Yeni görev formunun açılması, kaydedilmesi, Escape ile kapanması
- Klavye odağının kapatma sonrası geri dönmesi
- Kategori ve öncelik filtrelerinin birlikte kullanımı
- Uzun başlık/not ile kartların akışı
- Sayfa yenileme sonrası görevlerin korunması

Tarayıcı kontrollerine dair tamamlanan bulgular ayrıca bu dosyaya eklenir. Bu liste tek başına geçmiş test kanıtı değildir.
