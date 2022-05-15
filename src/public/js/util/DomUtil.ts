export namespace DomUtil {
    export function getElementOrCreate<HTMLELEMENT extends HTMLElement>(selector: HTMLELEMENT | null, tagName = "div"): HTMLELEMENT {
        return selector || (document.createElement(tagName) as HTMLELEMENT);
    }

    export function hideElement(element: HTMLElement) {
        element.classList.add("hidden");
    }

    export function showElement(element: HTMLElement) {
        element.classList.remove("hidden");
    }
}