7.10.2014	Za poslední týden vymyšleno <b>GUI</b>,
rozpracována jeho realizace, vymyšleno několik nápadů, 
které jsou také upraveny ve <a target="blank" href="https://docs.google.com/document/d/1goM_UvtzGTrMLgIoYjw0wpgCoMu7Xk8x_q82LyYdnz4/edit">specifikaci</a>.
<br>
15.10.2014	Práce na <b>DISASSEMBLERU</b> - programovacím jazyku, který je 
přechodem mezi vyššími jazyky (typu JS), a brainfuckem. Jsou
naimplementovány příkazy pro kopírování, zavádění proměnných, výpis a 
přímé kódování. Čeká ještě hodně práce, ale základ je postaven.
<br>
21.10.2014 Práce na disassembleru, přidání ADDX, ADDS, ITER a ITRI.
Pomocí těchto poté sepsán skript pro násobení v disassembleru, který jsem zkompiloval a otestoval v brainfucku - funguje.
Oba skripty jsou dostupné ve složkách sampleBrainfuck a sampleDisassembler. Také jsem upravil index - už je vidět output.
<br>
4.11.2014 Dokončeno čtení bloků kódu disasembleru - nyní je možné zanořovat disassemblerové cykly do sebe.
Přidána funkce ITVX - iteruje podle hodnoty proměnné, přičemž ji mění. 
Dále opraven bug v SETV - nyní již předává MOVT správné argumenty
Rozhodl jsem se také vytvořit si dokumentaci jednotlivých disassemblerových funkcí, to určitě pomůže mě i někomu
jinému, kdyby se snažil pochopit, co jsem to tvořil.
<br>
12.11.2014 Práce na dokumentaci a debugging - procházení současných funkcionalit
programu a jejich oprava - ještě není hotovo, ale základní funkce už jsou popsané
v doc.html