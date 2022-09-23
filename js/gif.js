let apiKey = "nfBWYUQ9w35T0IWyddbovwnAOLPQAZSo";

const makeImage = (element) => {
    const img = document.createElement("img");
    img.src = element?.images.original.url;
    img.alt = element?.title;
    return img;
}

const updateLocalStorage = ( ListNode ) => {

    let arrayPersist = [];

    for (let item of ListNode.children) {
        arrayPersist.push(item.firstChild.value);
    }

    // Actualizar el localStorage del navegador
    window.localStorage.setItem('recentSearches', arrayPersist);

}

const updateRecentSearches = ( newSearch ) => {

    let recentSearchesList = document.getElementById('gif_recent_list');

    if ( recentSearchesList.lastElementChild && Object.values(recentSearchesList.children).length === 3 ) 
        recentSearchesList.removeChild(recentSearchesList.lastElementChild);
    
    let newElemNode = document.createElement('li');
    let linkElemNode = document.createElement('a');

    linkElemNode.setAttribute("href", "#");
    linkElemNode.innerText = newSearch;

    newElemNode.appendChild(linkElemNode);

    recentSearchesList.insertBefore(newElemNode, recentSearchesList.firstChild);

    updateLocalStorage(recentSearchesList);

}

window.addEventListener("load", () => {

    fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=5`)
        .then( res => res.json() )
        .then( ({ data }) => {
            let elemContainer = document.getElementById('gif_img_container');
            let arrImg = data.map((img) => makeImage(img));
            elemContainer.append(...arrImg);
        });

    let recentSearches = window.localStorage.getItem('recentSearches');

    if ( recentSearches ) {

        let arrRecentSeraches = recentSearches.split(',');

        let recentSearchesList = document.getElementById('gif_recent_list');

        let arrNodeLi = arrRecentSeraches.map((value) => {

            let newElemNode = document.createElement('li');
            let linkElemNode = document.createElement('a');

            linkElemNode.setAttribute("href", "#");
            linkElemNode.innerText = value;

            newElemNode.appendChild(linkElemNode);

            return newElemNode;

        });

        recentSearchesList.append(...arrNodeLi);

    }  

    document.getElementById('gif_form').addEventListener('submit', (e) => {

        e.preventDefault();

        let val_search = e.target.elements.gif_search.value;

        fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${val_search}&limit=5`)
            .then(res => res.json())
            .then( ({ data }) => {
                if( data.length > 0 ) {
                    let elemContainer = document.getElementById('gif_img_container');
                    let arrImg = data.map((img) => makeImage(img));
                    elemContainer.innerHTML = "";
                    elemContainer.append(...arrImg);
                }
            }).finally(() => {
                updateRecentSearches(val_search);
            });

    });

    document.getElementById('gif_recent_list').addEventListener('click', e => {

        if ( e.target && e.target.nodeName == 'A' ) {

            let val_search = e.target.innerText;

            document.getElementById("gif_search").value = val_search;

            fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${val_search}&limit=5`)
                .then(res => res.json())
                .then( ({ data }) => {
                    if( data.length > 0 ) {
                        let elemContainer = document.getElementById('gif_img_container');
                        let arrImg = data.map((img) => makeImage(img));
                        elemContainer.innerHTML = "";
                        elemContainer.append(...arrImg);
                    }
                });

        }

    })


});