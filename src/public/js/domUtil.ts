export function getElementOrCreate<HTMLELEMENT extends HTMLElement>(selector: HTMLELEMENT | null, tagName: string): HTMLELEMENT {
    return selector || (document.createElement(tagName) as HTMLELEMENT);
}