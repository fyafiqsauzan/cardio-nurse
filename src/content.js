// Semua isi di file ini adalah CONTOH untuk prototipe.
// Naskah final disusun peneliti dan wajib divalidasi ahli materi (dokter/perawat kardiovaskular).

export const DEMO_LOGIN = { code: 'CN-001', pin: '123456' }

export const CONTACTS = {
  nurse: { label: 'Perawat poli jantung', number: '081200000000', shown: '0812-0000-0000', note: 'Nomor contoh. Ganti dengan nomor yang sudah diizinkan.' },
  emergency: { label: 'Gawat darurat', number: '119', shown: '119' },
}

export const MODULES = [
  {
    id: 'mengenal',
    title: 'Mengenal gagal jantung',
    minutes: 3,
    sections: [
      {
        heading: 'Apa itu gagal jantung?',
        body: 'Gagal jantung artinya jantung tidak memompa darah sekuat seharusnya. Jantung tetap berdetak, tetapi aliran darah ke seluruh tubuh berkurang dan cairan bisa menumpuk di paru-paru, kaki, atau perut.',
      },
      {
        heading: 'Keluhan yang sering muncul',
        body: 'Sesak napas saat beraktivitas atau saat berbaring, cepat lelah, bengkak di kaki atau pergelangan kaki, dan berat badan naik dengan cepat.',
      },
      {
        heading: 'Bisa dikendalikan',
        body: 'Dengan minum obat teratur, makan rendah garam, membatasi cairan sesuai anjuran dokter, dan memantau berat badan serta gejala setiap hari, Bapak/Ibu bisa tetap beraktivitas dengan nyaman.',
      },
    ],
    quiz: [
      {
        q: 'Gagal jantung artinya…',
        options: ['Jantung berhenti berdetak', 'Jantung tidak memompa darah sekuat seharusnya', 'Penyakit pada paru-paru'],
        answer: 1,
        why: 'Jantung tetap berdetak, tetapi pompanya lebih lemah dari seharusnya.',
      },
      {
        q: 'Mana yang bisa menjadi tanda cairan menumpuk di tubuh?',
        options: ['Bengkak di kaki', 'Rambut rontok', 'Kulit gatal'],
        answer: 0,
        why: 'Cairan yang menumpuk sering terlihat sebagai bengkak di kaki atau pergelangan kaki.',
      },
      {
        q: 'Gagal jantung bisa dikendalikan dengan…',
        options: ['Berhenti minum obat saat merasa sehat', 'Minum air sebanyak-banyaknya', 'Obat teratur dan perawatan diri setiap hari'],
        answer: 2,
        why: 'Obat yang teratur ditambah kebiasaan sehari-hari adalah kunci perawatan mandiri.',
      },
    ],
  },
  {
    id: 'obat',
    title: 'Obat dan cara minumnya',
    minutes: 3,
    sections: [
      {
        heading: 'Minum sesuai jadwal',
        body: 'Minum obat setiap hari sesuai jadwal dari dokter, walaupun Bapak/Ibu sedang merasa sehat. Jangan menghentikan atau mengubah dosis sendiri.',
      },
      {
        heading: 'Obat yang membuat sering buang air kecil',
        body: 'Sebagian pasien mendapat obat yang membuang kelebihan cairan lewat air kecil. Tanyakan ke dokter jam minum yang paling cocok, biasanya pagi atau siang supaya tidur malam tidak terganggu.',
      },
      {
        heading: 'Hati-hati dengan obat bebas dan jamu',
        body: 'Beberapa obat pereda nyeri yang dijual bebas bisa memperberat gagal jantung. Tanyakan dulu ke dokter, perawat, atau apoteker sebelum minum obat baru, termasuk jamu dan suplemen.',
      },
      {
        heading: 'Bawa daftar obat saat kontrol',
        body: 'Simpan daftar semua obat yang diminum dan bawa setiap kali kontrol ke rumah sakit atau puskesmas.',
      },
    ],
    quiz: [
      {
        q: 'Bapak/Ibu sudah merasa sehat. Apa yang dilakukan dengan obat?',
        options: ['Tetap minum sesuai jadwal', 'Berhenti minum', 'Minum kalau ingat saja'],
        answer: 0,
        why: 'Obat tetap diperlukan walaupun keluhan sudah berkurang.',
      },
      {
        q: 'Sebelum minum obat pereda nyeri yang dibeli sendiri, sebaiknya…',
        options: ['Langsung diminum', 'Tanya dokter, perawat, atau apoteker dulu', 'Diminum dua tablet sekaligus'],
        answer: 1,
        why: 'Beberapa obat pereda nyeri bisa memperberat gagal jantung.',
      },
      {
        q: 'Kalau lupa minum obat, yang benar adalah…',
        options: ['Minum dua dosis sekaligus nanti', 'Ikuti petunjuk dokter atau apoteker, jangan menggandakan dosis', 'Tidak usah minum obat hari itu'],
        answer: 1,
        why: 'Menggandakan dosis bisa berbahaya. Tanyakan aturan untuk obat Bapak/Ibu.',
      },
    ],
  },
  {
    id: 'garam',
    title: 'Makan rendah garam',
    minutes: 3,
    sections: [
      {
        heading: 'Kenapa garam dibatasi?',
        body: 'Garam membuat tubuh menahan air. Akibatnya jantung bekerja lebih berat, dan bengkak atau sesak bisa bertambah.',
      },
      {
        heading: 'Makanan yang tinggi garam',
        body: 'Ikan asin, telur asin, kerupuk, mi instan, makanan kaleng, kecap, saus botolan, dan penyedap rasa.',
      },
      {
        heading: 'Ganti rasa dengan bumbu dapur',
        body: 'Pakai bawang merah, bawang putih, jahe, kunyit, serai, daun jeruk, atau perasan jeruk nipis supaya masakan tetap enak.',
      },
      {
        heading: 'Kebiasaan di meja makan',
        body: 'Cicipi dulu sebelum menambah garam, dan jangan menaruh tempat garam di meja makan.',
      },
    ],
    quiz: [
      {
        q: 'Garam yang berlebihan membuat tubuh…',
        options: ['Menahan air', 'Lebih cepat lapar', 'Tidur lebih nyenyak'],
        answer: 0,
        why: 'Air yang tertahan menambah beban kerja jantung.',
      },
      {
        q: 'Mana yang tinggi garam?',
        options: ['Pisang rebus', 'Ikan asin', 'Nasi putih'],
        answer: 1,
        why: 'Ikan asin diawetkan dengan banyak garam.',
      },
      {
        q: 'Supaya masakan tetap enak tanpa banyak garam, pakai…',
        options: ['Penyedap rasa', 'Kecap asin', 'Bawang dan rempah'],
        answer: 2,
        why: 'Penyedap rasa dan kecap juga mengandung banyak garam.',
      },
    ],
  },
  {
    id: 'cairan',
    title: 'Membatasi cairan',
    minutes: 2,
    sections: [
      {
        heading: 'Batasnya dari dokter',
        body: 'Banyak pasien gagal jantung diminta membatasi minum. Jumlahnya ditentukan dokter dan tidak sama untuk setiap orang.',
      },
      {
        heading: 'Yang dihitung sebagai cairan',
        body: 'Air putih, teh, kopi, susu, kuah sayur atau sop, es batu, dan buah yang banyak airnya seperti semangka.',
      },
      {
        heading: 'Tips saat haus',
        body: 'Pakai gelas kecil, minum sedikit-sedikit, atau berkumur dengan air dingin tanpa ditelan.',
      },
    ],
    quiz: [
      {
        q: 'Berapa banyak boleh minum dalam sehari ditentukan oleh…',
        options: ['Tetangga', 'Dokter', 'Iklan di televisi'],
        answer: 1,
        why: 'Batas cairan berbeda untuk setiap pasien.',
      },
      {
        q: 'Mana yang juga dihitung sebagai cairan?',
        options: ['Kuah sop', 'Roti', 'Nasi'],
        answer: 0,
        why: 'Kuah sayur dan sop ikut dihitung.',
      },
      {
        q: 'Saat haus sekali, sebaiknya…',
        options: ['Langsung minum satu botol besar', 'Minum sedikit-sedikit pakai gelas kecil', 'Minum es teh manis'],
        answer: 1,
        why: 'Gelas kecil membantu menjaga jumlah minum tetap dalam batas.',
      },
    ],
  },
  {
    id: 'aktivitas',
    title: 'Aktivitas dan istirahat',
    minutes: 2,
    sections: [
      {
        heading: 'Tetap bergerak',
        body: 'Gerak ringan seperti jalan santai baik untuk jantung, sesuai kemampuan dan setelah disetujui dokter. Mulai pelan-pelan.',
      },
      {
        heading: 'Kapan harus berhenti',
        body: 'Berhenti dan istirahat bila terasa sesak, nyeri dada, pusing, atau jantung berdebar kencang.',
      },
      {
        heading: 'Perhatikan cara tidur',
        body: 'Kalau Bapak/Ibu perlu bantal lebih banyak dari biasanya supaya bisa bernapas saat tidur, laporkan ke perawat.',
      },
    ],
    quiz: [
      {
        q: 'Gerak badan yang umumnya dianjurkan adalah…',
        options: ['Angkat beban berat', 'Jalan santai sesuai anjuran dokter', 'Lari jarak jauh'],
        answer: 1,
        why: 'Gerak ringan yang teratur lebih aman dan bermanfaat.',
      },
      {
        q: 'Saat jalan santai tiba-tiba nyeri dada, Bapak/Ibu…',
        options: ['Terus berjalan', 'Berhenti, istirahat, dan minta bantuan', 'Jalan lebih cepat'],
        answer: 1,
        why: 'Nyeri dada adalah tanda untuk berhenti dan segera minta bantuan.',
      },
      {
        q: 'Perlu bantal lebih banyak dari biasanya untuk tidur adalah…',
        options: ['Hal biasa', 'Tanda yang perlu dilaporkan ke perawat', 'Tanda badan sehat'],
        answer: 1,
        why: 'Ini bisa berarti cairan menumpuk di paru-paru.',
      },
    ],
  },
  {
    id: 'bahaya',
    title: 'Kenali tanda bahaya',
    minutes: 3,
    sections: [
      {
        heading: 'Timbang setiap pagi',
        body: 'Timbang berat badan setiap pagi, setelah buang air kecil dan sebelum makan, dengan pakaian yang mirip setiap hari. Catat hasilnya di aplikasi.',
      },
      {
        heading: 'Hubungi perawat bila',
        body: 'Berat badan naik cepat (contoh: lebih dari 2 kg dalam 3 hari), sesak bertambah, perlu bantal lebih banyak untuk tidur, bengkak kaki bertambah, atau batuk terus-menerus terutama malam hari.',
      },
      {
        heading: 'Segera ke IGD atau telepon 119 bila',
        body: 'Nyeri dada, sesak berat walaupun sedang istirahat, pingsan, atau bibir dan ujung jari tampak kebiruan.',
      },
    ],
    quiz: [
      {
        q: 'Kapan waktu terbaik untuk menimbang berat badan?',
        options: ['Pagi, setelah buang air kecil dan sebelum makan', 'Malam, setelah makan', 'Kapan saja'],
        answer: 0,
        why: 'Waktu dan kondisi yang sama membuat hasilnya bisa dibandingkan.',
      },
      {
        q: 'Berat badan naik lebih dari 2 kg dalam 3 hari. Apa yang dilakukan?',
        options: ['Dibiarkan saja', 'Hubungi perawat', 'Makan lebih sedikit'],
        answer: 1,
        why: 'Kenaikan berat yang cepat bisa berarti cairan menumpuk.',
      },
      {
        q: 'Bapak/Ibu merasakan nyeri dada. Apa yang dilakukan?',
        options: ['Tidur dulu', 'Minum jamu', 'Segera ke IGD atau telepon 119'],
        answer: 2,
        why: 'Nyeri dada adalah keadaan darurat.',
      },
    ],
  },
]

export const FAQ = [
  {
    q: 'Bolehkah saya minum kopi?',
    a: 'Tanyakan ke dokter. Kalau boleh, kopi tetap dihitung sebagai cairan.',
  },
  {
    q: 'Timbangan saya berbeda dengan di rumah sakit. Bagaimana?',
    a: 'Tidak apa-apa. Yang penting selalu memakai timbangan yang sama di rumah, supaya perubahannya terlihat.',
  },
  {
    q: 'Saya lupa mengisi catatan kemarin.',
    a: 'Tidak masalah. Isi catatan hari ini seperti biasa.',
  },
  {
    q: 'Siapa yang bisa melihat catatan saya?',
    a: 'Di prototipe ini, catatan hanya tersimpan di HP ini. Aturan untuk versi penelitian ditentukan oleh peneliti.',
  },
]

// Contoh jadwal obat. Di versi penelitian, diisi sesuai resep tiap pasien.
export const SAMPLE_MEDS = [
  { id: 'm1', name: 'Obat diuretik (contoh)', kind: 'Obat dalam', rule: '1 kali sehari, 1 tablet', when: 'Pagi, sesudah makan', times: ['07.00'] },
  { id: 'm2', name: 'Obat jantung (contoh)', kind: 'Obat dalam', rule: '2 kali sehari, 1 tablet', when: 'Sesudah makan', times: ['07.00', '19.00'] },
]

// ATURAN TANDA BAHAYA: CONTOH. Angka dan pesan wajib dari klinisi sebelum dipakai ke pasien.
export const RULES = {
  weightGainKg: 2,
  weightGainDays: 3,
}
