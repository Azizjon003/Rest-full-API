# Rest-full-API

# Server url : http://18.181.217.30:8000/

<p>Bu berilgan vazifada men quyidagi topshiriqlarni bajardim: </p>
<ul>
<li> Foydalanuvchi va mahsulotlar modeli qurildi </li>
<li> Ular REST API dan foydalanib create read update delete  qilindi  </li>
<li> Jest va Supertest kutubxonalari orqali foydalanuvchi va product ga testlar yozildi </li>
<li> Auth qismi JWT bilan yaratildi </li>
<li> JOI kutubxonasi orqali esa ma'lumotlar validatsiya qilindi </li>
<li> Redis bilan mahsulotlar API siga tushadigan so'rovlar yengilashtirildi </li>
<li> Foydalanuvchi va mahsulotlar modeli qurildi </li>
<li> Uinston kutubxonasi bilan xatolar yozilmoqda </li>
<li> Foydalanuvchi va mahsulotlar modeli qurildi </li>
<li> Savatcha(cart)  uchun API yaratildi va cookielar bilan ishlandi</li>
<li> Tasvirlar bilan ishlashda (rasmlar)ni local saqlab olingan </li>
<li> Foydalanuvchi va mahsulotlar modeli qurildi </li>
<li> Mahsulotlar uchun filter va saralash,sahifalanish  funksiyalari ham qo'shildi </li>
</ul>

## Installation

```
npm install
```

env fayli quyidagi ko'rinishda bo'ladi

```
PORT = port
DB=mongodb url
DB_PASS =mongodb password
JWT_SECRET = secretkey
JWT_EXPIRES_IN = expires
REDIS_PORT = redisport(6379)
REDIS_HOST = host(localhost)
```

## Testlash uchun

```
npm  test -- auth #auth qismini testlash
npm  test -- product #product qismini testlash
npm  test -- user #user qismini testlash
```

## Default Foydalanuvchi

```
email:admin@gmail.com
password:Admin1234
```
