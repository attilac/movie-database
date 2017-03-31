# Movie Database
###### Attila Cederbygd, JavaScript2, Fend 16 @Nackademin

Från uppgift [Design Pattern Assignment - Movie Database](https://github.com/FEND16/javascript2/blob/master/assignment_design_pattern.md)

###### Projektlänkar
**Livesida:** https://attilac.github.io/movie-database/

**Github Repo:** https://github.com/attilac/movie-database/

## Beskrivning av appen
Appen är en 'databas' med filmer

## Funktionalitet
**Användaren kan**
* Lägga till rating på filmer
* Lägga till/ta bort genres från filer
* Lägga till nya filmer
* Filtrera på
 * genres
 * år
 * rating
* Sortera
 * Stigande/Fallande

### Arbetsprocess
Jag använde flera moduler och designpatterns till uppgiften. Olika moduler fick oilka arbetsområden. Movie-modulen använder Revealing Prototype Pattern och har hand om skapa nya film-objekt med filmdata och funktioner som att hämta och räkna ut average-rating. Movie-database använder Revealing Module Pattern och dess syfte är att sortera och filtrera Movie-objekt. 

Revealing Module-strukturen valdes för att den har en clean struktur med funktionsdefinitioner och en return med publika funktioner längst ner. Funktioner och variabler kan hållas privata. Första iterationen hade alla DOM-funktioner i en fil blandat med HTML som appendades. De funktionerna blev långa och svårlästa och därav flyttades mycket av HTML-en till en egen template-modul. Det ledde till att koden blev mer logisk och lättare att hantera.

#### Svårigheter
Det var framförallt DOM-funktionerna som var utmanade. I början var tendensen alltför omständiga funktioner som gjorde för många saker. Med tiden bröts de ner i mindre bitar som returnerade värden. Då blev det lättare att koppla ihop olika funktiner och använde dem som parametrar till andra funktioner. 

Det var även svårt att få till editering av filmer, dels att komma fram till att man behöverskapa eventhandlare efter filmerna appendas för att skicka med id. Det utvecklades till att lägga in variabler i databasen som håller reda på vilken film som editeras, istället för att läsa av i html-en vilken knapp som tryckts på. Det förenklade mycket.

####TODO
* Få till Observer Pattern med att trigga events och skapa lyssnare som svarar på dem.









