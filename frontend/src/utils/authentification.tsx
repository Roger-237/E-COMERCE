// src/utils/authentification.ts
interface Jetons {
    access: string;
    refresh: string;
}

export const sauvegarderJetons = (jetons: Jetons): void => {
    localStorage.setItem("jeton_acces", jetons.access);
    localStorage.setItem("jeton_rafraichissement", jetons.refresh);
};

export const effacerJetons = (): void => {
    localStorage.removeItem("jeton_acces");
    localStorage.removeItem("jeton_rafraichissement");
};

export const obtenirJetonAcces = (): string | null => {
    return localStorage.getItem("jeton_acces");
};

export const requeteAuthentifiee = (url: string, options: RequestInit = {}): Promise<Response> => {
    const jeton = obtenirJetonAcces();
    const enTetes = options.headers ? { ...options.headers } : {};
    if (jeton) (enTetes as Record<string, string>)['Authorization'] = `Bearer ${jeton}`;
    (enTetes as Record<string, string>)['Content-Type'] = (enTetes as Record<string, string>)['Content-Type'] || 'application/json';
    return fetch(url, { ...options, headers: enTetes });
};
