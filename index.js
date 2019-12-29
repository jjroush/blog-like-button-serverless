const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'roushio',
    keyFilename: './service-account.json'
});

exports.addLike = (request, response) => {
    const articleRef = firestore.doc('articles/test');
    articleRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('Creating new article');
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

    // response.status(200).send('liked');
};

exports.getLikes = (request, response) => {
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
