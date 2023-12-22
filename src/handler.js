const { nanoid } = require("nanoid");
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNotes = {
        title, tags, body, id, createdAt, updatedAt,
    }

    notes.push(newNotes);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response ({
                status  : 'Success',
                message : 'Catatan berhasil ditambahkan',
                data    : {
                    noteId : id,
                },
            });
            response.code(201);
            return response;
    }
    else {
        const response = h.response ({
            status  : 'Fail',
            message : 'Catatan gagal ditambahkan',
        });
        response.code(500);
        return response;
    }
};

const getAllNotesHandler = () => ({
    status  : 'success',
    data    : {
        notes,
    },
});

const getNotesById = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status  : 'sucess',
            data    : {
                note,
            }
        }
    }
    else {
        const response = h.response({
            status  : 'fail',
            message : 'Catatan Tidak Ditemukan',
        });
        response.code(404);
        return response;
    }
}

const editNoteById = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((n) => n.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
        }
        const response = h.response ({
            status  : 'success',
            message : 'Catatan berhasil diedit',
        }) ;
        response.code(200);
        return response;
    }
    else {
        const response = h.response ({
            status  : 'fail',
            message : 'catatan gagal diedit, id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
}

const deleteNoteById = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((n) => n.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response ({
            status  : 'sucess',
            message : 'Catatan berhasil dihapus',
        })
        response.code(200);
        return response
    }
    else {
        const response = h.response ({
            status  : 'fail',
            message : 'Catatan gaga; dihapus, id tidak ditemukan'
        })
        response.code(404);
        return response;
    }
}

module.exports = { addNoteHandler, getAllNotesHandler, getNotesById, editNoteById, deleteNoteById }