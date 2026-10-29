# Tasarım kararları

## Bileşenler ve veri akışı

`App`, görev listesini ve filtreleri tutar. `TaskCard`, görevi gösterir; durum değiştirme, düzenleme ve silme isteklerini üst bileşene iletir. `TaskForm`, kaydetmeden önce kendi taslak durumunu tutar ve doğrular. Böylece vazgeçilen bir düzenleme ana listeyi değiştirmez.

`tasks.js` arayüzden bağımsız doğrulama, arama, ilerleme ve kayıt işlevlerini içerir. Bu ayrım iş kurallarını ayrı test etmeyi kolaylaştırır.

## Neden sade React?

Bu ölçek için global durum kütüphanesine veya yönlendiriciye ihtiyaç yok. Arama ve sayılar mevcut listeden hesaplanır; ayrı kopya durumlar tutulmaz. İkonlar küçük yerel SVG'lerdir; büyük bir ikon paketi eklenmemiştir.

## Yerel kayıt

`focusboard.tasks.v1` anahtarı şema sürümünü belirtir. Okunan veri tür, benzersiz kimlik ve izin verilen alan değerleri bakımından doğrulanır. Kayıt bozuksa otomatik yazma durur; eski içerik sessizce silinmez. Kullanıcı yeni liste başlatmayı seçebilir. Depolama dolu veya engelliyse değişiklikler bellekte çalışır ve kayıt uyarısı görünür.

İki farklı sekmenin aynı anda düzenlemesi için birleştirme/çakışma çözümü yoktur. En son kayıt geçerli olur.

## Erişilebilirlik

HTML form etiketleri, görünür odak çizgileri, ana içeriğe atlama bağlantısı, anlamlı düğme adları ve canlı durum mesajları kullanılır. Tarayıcının yerel `dialog` öğesi odak sınırını yönetir. Escape ile kapanır; kapandıktan sonra odak açan kontrole döner. Sürükle-bırak yerine her kartta standart durum seçimi vardır.

## Kapsam

Bu proje frontend öğrenme ve portfolyo içindir. Kimlik doğrulama, çok kullanıcılı veri, üretim sunucusu veya tıbbi/konuşma analizi içermez. SafeSpeech ile resmi bağlantısı yoktur.
