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
                <a class="templates__link" href="${uri}"></a>
            </div>
        `
    }

    json.forEach((title) => {
        html += getHtml(title);
    });

    container.innerHTML = html;
}

const formHandler = () => {
    const form = document.getElementById("uploadSiteArchive");

    if (!form) {
        return;
    }

    const formData = new FormData(form);

    form.onsubmit = async (e) => {
        e.preventDefault();

        await fetch(`http://${host}/upload`, {
            method: "POST",
            body: formData,
        });

        await getSites();
    }
}

formHandler();
getSites();