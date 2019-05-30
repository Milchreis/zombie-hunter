var zombiegame = zombiegame || {};


zombiegame.language = {
    values: null,
    languages: {
        en: {
            pressStart: 'PRESS TO START',
            insertName: 'TYPE IN YOUR NAME',
            inserNamePlaceholder: 'Your name here ...',
            jump: 'JUMP',
            shoot: 'SHOOT',
            score: 'SCORE',
            best: 'BEST',

            impressive: 'IMPRESSIVE',
            nice: 'NICE',
            epic: 'EPIC',

            killer: '* KILLER *',
            hunter: '** HUNTER **',
            outlaw: '*** OUTLAW ***',
            freak: '**** FREAK ****',
            mania: 'ZOMBIE MANIA!',
        },
        
        de: {
            pressStart: 'ANTIPPEN ZUM STARTEN',
            insertName: 'WIE IST DEIN NAME?',
            inserNamePlaceholder: 'Dein Name ...',
            jump: 'SPRINGEN',
            shoot: 'SCHIESSEN',
            score: 'PUNKTE',
            best: 'BESTES',
            
            impressive: 'KRASS',
            nice: 'NICE',
            epic: 'EPISCH',
            
            killer: '* KILLER *',
            hunter: '** HUNTER **',
            outlaw: '*** OUTLAW ***',
            freak: '**** FREAK ****',
            mania: 'ZOMBIE MANIA!',
        }
    }
}

zombiegame.language.detectLang = function() {

    let localekey = navigator.language || navigator.userlanguage;

    // Default is english
    this.values = this.languages.en;
    // Extract short localekey (firefox and chrome are different)
    shortKey = localekey.substring(0, 2);

    if (shortKey in this.languages) {
        this.values = this.languages[shortKey];
    } else {
        this.values = this.languages.en;
    }
}
