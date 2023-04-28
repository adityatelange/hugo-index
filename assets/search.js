import * as params from '@params';

let fuse;
let searchBox = document.getElementById('search');
let resList = document.getElementById('tableListBody');

window.onload = () => {
    fetch(params.BaseURL + 'index.json')
        .then(res => res.json())
        .then(data => {
            const options = {
                distance: 100,
                threshold: 0.0,
                ignoreLocation: true,
                keys: [
                    'title',
                    'tags.title',
                ]
            };
            const myIndex = Fuse.createIndex(options.keys, data)
            fuse = new Fuse(data, options, myIndex);
        });
}

searchBox.addEventListener('input', () => {
    let resultSet = '';
    let results = fuse.search(searchBox.value);
    if (results.length !== 0) {
        for (let item in results) {
            let tagList = '';
            if (results[item].item.tags) {
                results[item].item.tags.forEach(tag => {
                    tagList += `<li><a href="${tag.permalink}">${tag.title}</a></li>`
                });
            }
            resultSet += `<tr><td><a href="${results[item].item.permalink}">${results[item].item.title}</a></td><td><ul class="tagsList">${tagList}</ul></td></tr>`
        }
    } else {
        for (let item of fuse.getIndex().docs) {
            let tagList = '';
            if (item.tags) {
                item.tags.forEach(tag => {
                    tagList += `<li><a href="${tag.permalink}">${tag.title}</a></li>`
                });
            }
            resultSet += `<tr><td><a href="${item.permalink}">${item.title}</a></td><td><ul class="tagsList">${tagList}</ul></td></tr>`
        }
    }
    resList.innerHTML = resultSet;
})
