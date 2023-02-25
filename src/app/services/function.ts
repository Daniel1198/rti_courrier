export function replaceAccent(chaine: string): string {
    let charactersWithAccent: string = 'àâäçéèëêïîôöuüùû';
    let charactersWithoutAccent: string = 'aaaceeeeiioouuuu';
    chaine = chaine.toLowerCase();
    
    for (let i = 0; i < charactersWithAccent.length; i++) {
        for (let j = 0; j < chaine.length; j++) {
            if (chaine[j] === charactersWithAccent[i])
                chaine = chaine.replace(charactersWithAccent[i], charactersWithoutAccent[i]);
        }
    }
    return chaine;
}