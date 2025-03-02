import ElementConverter from "../../../modules/element-list/elementConverter.js";

export default class GenerateTokenConverter extends ElementConverter {
    convert(data) {
        const container = document.createElement("tr");
        let createdAt = Date.parse(data.createdAt);
        createdAt = new Date(createdAt);

        container.innerHTML = `
            <td role="button" class="copy-element" data-value="${data.token}">${data.token.slice(0, 20)}</td>
            <td>${createdAt.toLocaleString("ru-RU")}</td>
            <td>${data.count}</td>
            <td>
                <button class="btn btn-primary modal-button">Удалить</button>
            </td>
        `;

        return container;
    }
}