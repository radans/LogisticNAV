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

Install dependencies
 
```
npm i
```
  
Run migrations 
 ```
 node index.js -m
 ```
Run dev server (will run front and backend)
 ```
 npm run dev
 ```

# How it works

File structure:

- query content (the actual query that will be sent to database): `/lib/repo`
- sending query to database is done by services in folder `/lib/service`
- routes (they return views) structure are located in `/lib/handler`
- generating pdf is in folder (its only for orders) `/lib/pdf`
- frontend is located in `/lib/views` and `public/js`




Backend is running on express server. It's structured in layers and communication with
database is done by reading content of sql files.


Frontend is written in react. In `/lib/views` are `.jsx` files that I didn't get to understend what's their purpose.
All logic for frontend is in `public/js/*.jsx` files. With React templating and everything, but at and od file there is 
mapping function and `ReactDOM.render` of component with filtered documents.
(My assumption for that is because react is added to classic express application. I'm not that familiar with ReactJs go
to go in details)