const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'roushio',
    keyFilename: './service-account.json'
});

exports.addLike = (request, response) => {
    response.set('Access-Control-Allow-Origin', "*");
    const article = request.query.article;
    const articleRef = firestore.doc(`articles/${article}`);
    articleRef.get()
        .then(doc => {
            if (!doc.exists) {
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
    if (request.query.article) {
        const article = request.query.article;
        console.log(request.query)
        const articleRef = firestore.doc(`articles/${article}`);
        articleRef.get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('Creating new article');
                    firestore.collection('articles').doc(article).set({ Likes: 1 }).then(documentReference => {
                        response.status(200).send(doc.data());
                    });
                } else {
                    response.status(200).send(doc.data());
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                response.status(500).send('Error');
            });
    } else {
        const articleColRef = firestore.collection('articles');
        let articles = {};
        articleColRef.get()
            .then(docs => {
                docs.forEach(doc => {
                    articles[doc.id] = doc.data();
                });
                response.status(200).send(articles);
            })
            .catch(err => {
                console.log('Error getting all documents', err);
                response.status(500).send('Error');
            });
    }
};
