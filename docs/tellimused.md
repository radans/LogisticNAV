# Tellimuste süsteem

<!-- Size: A4 -->
<!-- FontSize: 12 -->
<!-- TitleFontSize: 25 -->
<!-- Author: Infdot OÜ -->
<!-- Header: Tellimuste süsteem -->

Tellimuste süsteemi kasutatakse ...

## Süsteemi kasutajad

Kasutajateks on ...

### Kasutajate identifitseerimine

Kasutaja logib süsteemi sisse oma e-posti aadressiga ja parooliga. E-posti
aadressidena sobivad ainult @lasita.ee lõpuga aadressid.

Parooli saamiseks tuleb sisselogimise vormil vajutada nupule "Mul ei ole
parooli". Selle järel saadab süsteem kasutajale e-kirja lingiga. Lingi
kaudu avaneb parooli muutmise vorm, mille kaudu saab kasutaja parooli
sisestada.

### Sessioon

Eduka sisselogimise järel omistatakse kasutajale sessioon. Sessioon kestab
nii kaua kuni lehitseja aken on avatud. Sessiooni kestel parooli vahetus
sessiooni ei katkesta. Sessiooni olemasolu tähistab seadistusfailis varem
määratud salajase võtmega signeeritud kasutaja e-posti aadress. Selle
kaudu toimub ka sessiooni sees oleva kasutaja identifitseerimine. Signeeritud
e-posti aadressi hoitakse lehitseja küpsise sees.

---

## Kasutajaliides

Kasutajaliidesele eraldi kujundust ei tehta. Kasutatakse lasita.ee
lehel olevat värviskeemi ja logo.

Kuupäevad kasutajaliideses kuvatakse formaadis DD.MM.YYYY HH:mm:ss eesti
ajatsoonis.

Kasutajaliidese programmeerimisel arvestatakse desktop-arvuti Full-HD
ekraanisuurusega (1920x1080).

Kasutajaliides tuleb eesti keeles. Tõlkimissüsteemi sisse ei ehitata.
Seda on võimalik hiljem lisada.

---

## Tellimused

Tellimuste süsteem sisaldab järgmisi osi/funktsionaalsust:

 * PDF põhjad

### Tellimuse PDF põhi

Põhja muudatused tuleb eraldi tellida (10 päeva). Põhja põhiandmeid
(logo, aadress) saab muuta Seadistuste alt. Ülejäänud andmed (vedaja,
Lasita esindaja, laadimiskohad) tulevad süsteemi erinevatest osadest.

Tellimuse PDF põhjal ei ole allkirja kohta.

---

## Koormaplaanide programmi muudatused

### Plaanide hoidmine serveris

Koormaplaane hakatakse hoidma keskses serveris, mis muudab võimalikuks
automaatse plaanide jagamise koostajate vahel.

Ühe plaani samaaegsel salvestamisel mitme koostaja poolt jäävad kehtima
viimati salvestanu muudatused. Olukorra tekke vähendamiseks kuvatakse
koormaplaanide nimekirjas plaani juurde viimati salvestanu nimi,
salvestamise aeg ja indikaator. Kui salvestamise aeg oli vähem kui
5 minutit tagasi, siis on indikaator punane, vastasel juhul roheline.

### Pakkide andmed API kaudu

Pakkide API kaudu loetakse Koormaplaanide programmi varem sisestatud
pakid. Siit saadud info põhjal toimub paki andmete automaatne täitmine
koodi (osalisel) sisestamisel.

### Plaani PDF fail

Plaanidele genereeritakse automaatselt A4 suurusega paberi PDF fail. See
vähendab sõltuvust lehitseja poolsest printimise süsteemist.

## Kolmanda osapoole komponendid

Süsteem kasutab erinevaid Vabavaralisi (Open Source) komponente soovitud
funktsionaalsuse realiseerimisel.

 * Node.js 8.x - serveriplatvorm, MIT litsents.
 * ExpressJS 4.x - veebirakenduste programmeerimise raamistik, MIT litsents.
 * PDFKit - PDF failide koostamiseks, MIT litsents.
 * React 15.x - lehitsejas kasutatav frontend raamistik, MIT litsents.
 * MySQL - andmebaasimootor, GPL litsents.
 * Bootstrap 3.x - front-end raamistik, MIT litsents.
 * Font Awesome - kasutajaliidese ikoonid, SIL Open Font License.

## Toetatud lehitsejad

Süsteemi arendamisel kasutatakse testimiseks uusimat stabiilset Google
Chrome lehitsejat. Teoreetiliselt on kasutatavad ka, alates versioonist:

 * Firefox 52.x
 * Google Chrome 56.x
 * Edge 14.x

Süsteemi programmeerimisel on arvestatud ES2017 standardi, sh async/await
JavaScripti süntaksi toega, mis on olemas eelpool nimetatud lehitsejate
versioonides.

---

## Paigaldus

Paigaldus on praeguseks lahtine kuni selguvad täpsemad nõuded.

Rakenduses tekkivad vead logitakse standardsesse veaväljundisse
(stderr), muud teated logitakse standardväljundisse (stdout).
Vealehel vea tehnilisi detailandmed ei kuvata.

## Pildiga leht

Tekst allpool pilti.

Headers - info headers kohta.

---

## Tellimuste tabel

Mauris at ante tellus. Vestibulum a metus lectus. Praesent tempor purus a
lacus blandit eget gravida ante hendrer.

 * Item 1
 * Item 2
 * Item 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in
suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus
et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi
aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit.
Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et
dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non
nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt
ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean
velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus
mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis.
Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a
turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
posuere cubilia Curae;

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in
suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus
et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi
aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit.
Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et
dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non
nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt
ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean
velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus
mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis.
Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a
turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
posuere cubilia Curae;
