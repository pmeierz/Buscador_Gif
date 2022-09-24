let apiKey = "nfBWYUQ9w35T0IWyddbovwnAOLPQAZSo";

const makeImage = (element) => {
    const img = document.createElement("img");
    img.src = element?.images.original.url;
    img.alt = element?.title;
    return img;
}

const updateLocalStorageHistory = ( ListNode ) => {

    let arrayhistory = [];

    for (let item of ListNode.children) {
        arrayhistory.push(item.firstChild.innerText);
    }

    // Actualizar el localStorage del navegador
    window.localStorage.setItem('history', arrayhistory);

}

const updatehistory = ( newSearch ) => {

    let historyList = document.getElementById('gif_recent_list');

    if ( historyList.lastElementChild && Object.values(historyList.children).length === 3 ) 
        historyList.removeChild(historyList.lastElementChild);
    
    let newElemNode = document.createElement('li');
    let linkElemNode = document.createElement('a');

    linkElemNode.setAttribute("href", "#");
    linkElemNode.innerText = newSearch;

    newElemNode.appendChild(linkElemNode);

    historyList.insertBefore(newElemNode, historyList.firstChild);

    updateLocalStorageHistory(historyList);

}

window.addEventListener("load", () => {

    fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=5`)
        .then( res => res.json() )
        .then( ({ data }) => {
            let elemContainer = document.getElementById('gif_img_container');
            let arrImg = data.map((img) => makeImage(img));
            elemContainer.append(...arrImg);
        });

    let history = window.localStorage.getItem('history');

    if ( history ) {

        let arrRecentSeraches = history.split(',');

        let historyList = document.getElementById('gif_recent_list');

        let arrNodeLi = arrRecentSeraches.map((value) => {

            let newElemNode = document.createElement('li');
            let linkElemNode = document.createElement('a');

            linkElemNode.setAttribute("href", "#");
            linkElemNode.innerText = value;

            newElemNode.appendChild(linkElemNode);

            return newElemNode;

        });

        historyList.append(...arrNodeLi);

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
                updatehistory(val_search);
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