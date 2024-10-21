const host = window.location.host;

const getSites = async () => {
    const response = await fetch(`http://${host}/templates`);
    let json;
    
    if (!response.ok) {
        return;
    }

    json = await response.json();
    const container = document.querySelector(".templates__container");
    let html = "";

    if (!container) {
        return;
    }

    const getHtml = (title) => {
        const uri = encodeURI(`http://${host}/static/templates/${title}?title=${title}`);

        return `
            <div class="col">
                <h3>${title}</h3>
                <iframe class="mt-2" src="${uri}" frameborder="0" width="1280" height="1280" scrolling="no">
                </iframe>
                <a class="templates__link" href="${uri}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"/>
                    </svg>
                </a>
                <div class="templates__delete" data-title="${title}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </div>
            </div>
        `
    }

    json.forEach((title) => {
        html += getHtml(title);
    });

    container.innerHTML = html;

    deleteHandler();
}

const deleteHandler = () => {
    const elements = document.querySelectorAll(".templates__delete");

    elements.forEach((el) => {
        el.onclick = async () => {
            const title = el.dataset.title;

            await fetch(`http://${host}/templates/${title}`, {
                method: "DELETE",
            });

            await getSites();
        }
    });
}

const formHandler = async () => {
    const form = document.getElementById("uploadSiteArchive");

    if (!form) {
        return;
    }

    form.onsubmit = async (e) => {
        e.preventDefault();

        const title = form.querySelector("#title");
        const siteArchive = form.querySelector("#siteArchive");

        if (!title || !siteArchive) {
            return;
        }

        const formData = new FormData();

        formData.append("title", title.value);
        formData.append("site", siteArchive.files[0]);

        await fetch(`http://${host}/upload`, {
            method: "POST",
            body: formData,
        });
        await getSites();
    }
}

formHandler();
getSites();