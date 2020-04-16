
const snapshotToArray = (snapshot) => {
    if(!snapshot.val()) {
        return [];
    }
    const itemsObject = snapshot.val();
    // Object.keys = renvoi tableau de clés de categoriesObject
    // .map = boucle
    // map(key) = map(categoriesObject[i])
    const itemsList = Object.keys(itemsObject).map(key => ({
        ...itemsObject[key]
    }));

    return itemsList;
}

export default snapshotToArray;
