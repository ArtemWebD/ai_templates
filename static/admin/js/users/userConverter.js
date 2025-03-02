import ElementConverter from "../../../modules/element-list/elementConverter.js";

export default class UserConverter extends ElementConverter {
    /**
     * @param {{ id: number, email: string, name: string, type: string }} data
     * @returns {HTMLTableRowElement}
     */
    convert(data) {
        const container = document.createElement("tr");

        container.innerHTML = `
            <td>${data.email}</td>
            <td>${data.name}</td>
            <td>${data.type}</td>
            <td>
                <button class="btn btn-primary modal-button" data-userId="${data.id}" data-id="whitePageTokens">White page токены</button>
            </td>
        `;

        return container;
    }
}