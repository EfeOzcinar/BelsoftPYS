/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>INOMAP OKUL YÖNETİM SİSTEMLERİ Kişisel Verilerin Korunması Kanunu Metni</Text>
            
            <Text style={styles.sectionTitle}>1. Veri Sorumlusu</Text>
            <Text style={styles.text}>Veri Sorumlusu: INOMAP OKUL YÖNETİM SİSTEMLERİ</Text>
            
            <Text style={styles.sectionTitle}>2. İşlenen Kişisel Veriler</Text>
            <Text style={styles.text}>Ad, soyad, adres, telefon numarası gibi kişisel verileriniz işlenmektedir.</Text>
            
            <Text style={styles.sectionTitle}>3. Kişisel Verilerin İşlenme Amaçları</Text>
            <Text style={styles.text}>Kişisel verileriniz: </Text>
            <Text style={styles.text}>- Eğitim faaliyetlerinin yürütülmesi,</Text>
            <Text style={styles.text}>- İletişim faaliyetlerinin gerçekleştirilmesi,</Text>
            <Text style={styles.text}>- Hizmet kalitesinin arttırılması,</Text>
            <Text style={styles.text}>amaçlarıyla işlenmektedir.</Text>


            <Text style={styles.sectionTitle}>4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</Text>
            <Text style={styles.text}>Kişisel verileriniz, tarafınızca sağlanan bilgiler doğrultusunda, KVKK’nın 5. ve 6. maddelerinde belirtilen hukuki sebeplerle toplanmaktadır.</Text>
            
            <Text style={styles.sectionTitle}>5. Kişisel Verilerin Aktarılması</Text>
            <Text style={styles.text}>Kişisel verileriniz, yasal zorunluluklar gereği ve yukarıda belirtilen amaçlar doğrultusunda, ilgili kamu kurum ve kuruluşlarıyla paylaşılabilir.</Text>
            
            <Text style={styles.sectionTitle}>6. Kişisel Veri Sahibinin Hakları</Text>
            <Text style={styles.text}>KVKK’nın 11. maddesi uyarınca, kişisel veri sahipleri:</Text>
            <Text style={styles.text}>- Kişisel verilerinin işlenip işlenmediğini öğrenme,</Text>
            <Text style={styles.text}>
              - İşlenmişse bilgi talep etme,
            </Text>
            <Text style={styles.text}>
              - İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,
            </Text>
            <Text style={styles.text}>
              - Yurtiçinde veya yurtdışında aktarıldığı üçüncü kişileri bilme,
            </Text>
            <Text style={styles.text}>
              - Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,
            </Text>
            <Text style={styles.text}>
              - KVKK’nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,
              haklarına sahiptir.
            </Text>
            
            <Text style={styles.sectionTitle}>7. İletişim</Text>
            <Text style={styles.text}>Kişisel verilerinizin işlenmesi ile ilgili her türlü soru ve talepleriniz için bizimle iletişime geçebilirsiniz:</Text>
            <Text style={styles.text}>Adres: Batıkent, Adnan İnanıcı Cd. Batmaz Oğlu Konutları No 25, 27560 Şehitkamil/Gaziantep</Text>
            <Text style={styles.text}>Telefon:0850 307 9027</Text>
          </ScrollView>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PrivacyPolicy;
