const renderTemplate = (html, data) => {

    Object.keys(data).forEach(key => {

        html = html.replaceAll(

            `{{${key}}}`,

            data[key] ?? ""

        );

    });

    return html;

};

module.exports = renderTemplate;