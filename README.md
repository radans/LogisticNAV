## Kolmanda osapoole komponendid

 * ExpressJS raamistik;
 * jQuery;
 * Lodash teek;

## Ehitus/kompileerimine

Formaadis .tgz paki loomine:

```
npm run tgz
```

Selle tulemusena genereeritakse fail veotellimused.tgz ülemisse kausta.

Paki versiooni kontrollimine: vaatada "version" välja failis
package.json paki seest.

## Plaanide editori komponendi kontrollskript

Kasutada käsku:

```
npm run check-ko
```

pärast editori osade muutmist. See kontrollib üle KnockoutJS
bind-avaldised vigade suhtes.

## Paigaldus ja uuendus

Lugeda eraldi paigaldusjuhendit.

## Maili testimine

http://10.0.1.47/mail/test?mail=test@example.com


# Setup
- install dependencies
 ``npm i``
  
- run migrations 
 ``node index.js -m``
  
- run dev server
 `` npm run node-watch``