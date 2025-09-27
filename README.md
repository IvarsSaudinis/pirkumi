## Pirkumi

Radās ideja nedēļas nogales progammēšanas projektam – izveidot servisu uz kura e-pastu jebkurš var iestatīt pārsūtīšanu 
tiem e-pastiem, ko sūta Rimi vai citi veikali ar digitālajiem pirkuma čekiem. Serviss nolasīs datus savā pastkastē, saglabās 
tos datubāzē un veiks analīzi par pirkumiem, ko reizi mēnesī nosūtīs uz e-pastu kā vizuālu atskaiti. 

Lietotājiem būtu tikai nepieciešams iestatīt e-pastu pāradresāciju savā e-pasta servisa nodrošinātājā un 
sistēma pati to sasaistītu ar lietotāja kontu un datiem


### Darāmo darbu saraksts

- [x] Priekšprototipa izveide, lai testētu Gemini API iespējas pirkuma datu interpretācijā: https://pirkumi.ivars.lv/.
- [ ] Izpētīt Gemini API resursu patēriņu un izmaksas, lai saprastu, vai tas ir dzīvotspējīgs risinājums.
- [ ] Servisa izveide, kas lasīs savu e-pasta iesūtni, lai veiktu datu analīzi par pārsūtītiem pirkumu čekiem un reizi mēnesī sagatavotu atskaiti par pirkumiem.
- [ ] Veikt globālu datu analīzi un izveidot publiskas vizualizācijas, lai saprastu pirkumu tendences un paradumus.
- [ ] Izveidot lietotāja interfeisu, kurā varēs apskatīt pirkumu datus un vēsturiskās atskaites.


### Tehnoloģijas
- Vienkāršs php/Laravel/Inertia/React (vai vajag kaut ko sarežģītāku?)
- Gemini API

### Uzstādīšana
1. Repozitorija klonēšana
2. `.env` faila izveide, pamatojoties uz `.env.example` failu
3. `php artisan key:generate` izpilde
4. Atkarību instalēšana ar `composer install`, `'npm install'` un `'npm run build'`
5. Datubāzes migrācija ar `php artisan migrate`
6. GEMINI_API_KEY iestatīšana `.env` failā 
7. Servisa palaišana ar `composer run dev`
