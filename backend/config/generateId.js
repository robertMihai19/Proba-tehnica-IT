const count = require("./../models/counter");

const getValueForNextSequence = async (seqName) => {
    return new Promise((resolve, reject) => {
        count.findByIdAndUpdate({_id: seqName}, {"$inc": {"sequence_value": 1}}, (err, counter) => {
            if (err)
                reject(err);
            if (counter)
                resolve(counter.sequence_value + 1);
            else resolve(null);
        })
    })
}

const insertCounter = async (seqName) => {
    const newCounter = {_id: seqName, sequence_value: 1};
    return new Promise((resolve, reject) => {
        count.create(newCounter).then(data => {
            resolve(data.sequence_value)
        }).catch(err => reject(err));
    });
}

async function findId(seqName) {
    let ceva = 1;
    const counter = await getValueForNextSequence(seqName);
    if (!counter)
        return await insertCounter(seqName);
    return counter;
}

module.exports = {getValueForNextSequence, insertCounter, findId: findId};