Salut! Mi-am luat ales proba de backend. Am reusit sa fac toate task-urile, inclusiv pe cele bonus.

Cum se ruleaza aplicatia? Ca sa rulam, avem nevoie de JavaScript instalat, mongo DB, si postman pentru testarea api. Dupa ce ati dat git clone la repo
intrati in directorul curent (cd backend), si tastati comanta "npm install". Dupa ce tastati aceasta comanda asteptati putin sa se instaleze 
pachetele de care avem nevoie, si apoi rulati comanda "npm start". Dupa ce a rulat serverul, puteti accesa baza de date, instaland mongoDBCompass.
Intrati in acesta, si la "Paste your connection string (SRV or Standard )" introduceti "mongodb://127.0.0.1:27017/". Acesta este local host-ul bazei
de date. Pentru a testa api-ul, intrati in postman, si la path introduceti localhost:3000/api/x, unde x este continuarea path-ului dumneavoastra.
De ex, daca vreti sa testati inregistrarea unui utilizatoru, x va fi auth/register, si path-ul in postman va fi localhost:3000/api/auth/register.

Ce am implementat? Pentru inceput am implementat un sistem care creaza utilizatori, avand ca field-uri name, email, description. Acesta valideaza datele
si daca sunt corecte, le stocheaza in baza de date. Totodata, acesta trimite un mail utilizatorului, ca si-a facut cont. Am mai creat si un sistem
de login, care va genera un token. Acest token ne va ajuta, valindadu-ne identitatea atunci cand vrem sa postam un mesaj, sa facem o clasa de meditatii, 
sau sa ne inrolam la una. 

Challenge-urile pe care le-am intampitat au fost sa ma conectez la baza de date, sa fac id-ul un numar natural incepand cu 1, si fac sistemul de login.
Le-am rezolvat uitandu-ma pe forumuri si cerandu-i ajutor mentorului meu.
