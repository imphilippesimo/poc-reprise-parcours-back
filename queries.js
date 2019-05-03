
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'process',
    password: 'password',
    port: 5432,
})

const getProcessInstanceById = async (processInstanceId) => {

    let result = {};
    await pool.query('SELECT * FROM process_instance WHERE process_instance_id = $1', [processInstanceId])
        .then(results => {
            result = results.rows[0];
        })
        .catch(error => setImmediate(() => { console.log(error); throw error; }));
    return result;
}

const createProcessInstance = async (processId, processInstanceId, url, savedDate, steps) => {
    let result;
    await pool.query(
        'INSERT INTO process_instance (process_id,process_instance_id,url,saved_date,steps) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [processId, processInstanceId, url, savedDate, steps])
        .then((results) => {
            console.log(`process instance created with ID: ${results.rows[0].process_instance_id}`);
            result = results.rows[0];
        })
        .catch((error) => setImmediate(() => {
            console.log(error);
            throw error;
        }));
    return result;
}

const updateProcessInstance = async (processInstanceId, url, savedDate, steps) => {

    let result;
    await pool.query(
        'UPDATE process_instance SET url = $1, saved_date = $2, steps = $3  WHERE process_instance_id = $4 RETURNING *',
        [url, savedDate, steps, processInstanceId])
        .then((results) => {
            console.log(`process instance with ID: ${results.rows[0].process_instance_id} successfully updated`);
            result = results.rows[0];
        })
        .catch((error) => setImmediate(() => {
            console.log(error);
            throw error;
        }));
    return result;
}

const deleteProcessInstance = (id) => {
    pool.query('DELETE FROM process_instance WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getProcessInstanceById,
    createProcessInstance,
    updateProcessInstance,
    deleteProcessInstance,
}