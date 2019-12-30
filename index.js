const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'roushio',
    keyFilename: './service-account.json'
});

exports.addLike = (request, response) => {
    response.set('Access-Control-Allow-Origin', "*");
    const articleRef = firestore.doc('articles/a article with spaces');
    articleRef.get()
        .then(doc => {
            if (!doc.exists) {
                articleRef.add({ Likes: 1 }).then(documentReference => {
                    console.log(`Added document with name: ${documentReference.id}`);
                });
                response.status(500).send('doesn\'t exist');
            } else {
                articleRef.update('Likes', Firestore.FieldValue.increment(1));
                response.status(200).send('liked');
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            response.status(500).send('Error');
        });
};

exports.getLikes = (request, response) => {
    response.set('Access-Control-Allow-Origin', "*");
    console.log(request);
    const articleRef = firestore.doc('articles/test');
    articleRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('Creating new article');
            } else {
                response.status(200).send(doc.data());
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            response.status(500).send('Error');
        });
};
