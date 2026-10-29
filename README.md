# FocusBoard

**Bir sonraki adıma odaklan.**

React ile geliştirilmiş, web ve öğrenme görevlerini tek panoda düzenleyen, mobil ekranlara uyumlu bir görev takip uygulaması.

> Bu çalışma, Esmanur Bayka'nın staj portfolyosu için yapay zekâ desteğiyle hazırlanmış bir öğrenme projesidir. Müşteri işi, iş deneyimi veya mağazada yayımlanmış bir mobil uygulama değildir. Örnek görevler ürünün işleyişini göstermek içindir.

## Neler yapar?

- Görev oluşturma ve düzenleme; başlık/not uzunluğu ve boş başlık doğrulaması
- Yapılacak / Devam ediyor / Tamamlandı sütunları arasında durum değiştirme
- Alan, öncelik ve Türkçe karakterleri destekleyen metin araması
- Tamamlanma oranı ve görev sayıları
- Görev silme ve son silme işlemini geri alma
- Tarayıcıda yerel kayıt; bozuk veya erişilemeyen kayıtta açıklayıcı hata durumu
- Klavye ile kullanılabilen kontroller, yerel dialog ve ekran okuyucu bildirimleri

## Teknolojiler

React · JavaScript (ES modules) · CSS · Vite · Vitest · React Testing Library

Uygulama durumunu React hook'ları yönetir. Sunucu veya ücretli servis gerekmez. React Native kullanılmaz; mobil uyum, responsive web arayüzünü ifade eder.

## Kurulum

Node.js **24+** ve pnpm gereklidir. Test edilen pnpm sürümü: **11.25.0**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Terminalde yazan yerel adresi açın. Genellikle `http://127.0.0.1:5173` kullanılır.

```sh
pnpm test       # veri mantığı ve kullanıcı akışı testleri
pnpm build      # dist/ üretim çıktısı
pnpm preview    # üretim çıktısını yerelde aç
```

## Proje yapısı

```text
src/
  App.jsx          # pano, form ve kart bileşenleri
  tasks.js         # doğrulama, filtreleme, ilerleme ve kayıt işlemleri
  styles.css       # responsive arayüz
  App.test.jsx     # kullanıcı etkileşimi testleri
  tasks.test.js    # veri ve kayıt hatası testleri
docs/
  architecture.md  # tasarım kararları ve sınırlar
  testing.md       # doğrulama kapsamı
  learning.md      # projeyi anlama ve anlatma rehberi
```

## Test kapsamı

15 otomatik test; ekleme, düzenleme, durum değiştirme, silme/geri alma, arama, yeniden açılışta kalıcılık ve hatalı kayıt durumlarını kapsar. jsdom testleri gerçek tarayıcı veya gerçek cihaz testinin yerine geçmez. Ayrıntılar: [Test notları](docs/testing.md).

## Veri ve sınırlar

- Görevler yalnızca bu tarayıcının `localStorage` alanına yazılır; cihazlar arasında eşitlenmez.
- Hesap, sunucu, API, ekip paylaşımı ve mağaza yayını yoktur.
- Tarayıcı verilerinin temizlenmesi görevleri kaldırır; kalıcı yedekleme sunulmaz.
- Google Fonts yüklenmezse sistem yazı tipi kullanılır.
- Hassas kişisel verileri saklamak için tasarlanmamıştır.

## Sonraki geliştirmeler

- JSON dışa/içe aktarma ve şema sürümü geçişi
- Gerçek tarayıcı testlerini CI'a ekleme
- API destekli sürüm ve hata/yüklenme durumları
- Ayrı bir React Native öğrenme çalışması

## Geliştirici

**Esmanur Bayka** · Atatürk Üniversitesi, Web Tasarımı ve Kodlama, 2. sınıf

[GitHub](https://github.com/esmanur-bayka) · [LinkedIn](https://www.linkedin.com/in/lynapgrl/)
