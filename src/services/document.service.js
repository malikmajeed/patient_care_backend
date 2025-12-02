const Document = require("../models/document.model");
const documentSchema = require("../schema/document.schema");

// create document
const create = async (docData) => {
    try {
        const { error } = documentSchema.createDocumentSchema.validate(docData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const document = await Document.create({
            doc_ID: docData.doc_ID,
            nurse_ID: docData.nurse_ID,
            attachment_url: docData.url,
            issuing_authority: docData.issuing_authority,
            issue_date: docData.issue_date,
            document_type: docData.type
        });
        return document;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all documents
const getAll = async () => {
    try {
        const docs = await Document.findAll();
        return docs;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get by id
const getById = async (docId) => {
    try {
        const doc = await Document.findByPk(docId);
        if (!doc) {
            throw new Error("Document not found");
        }
        return doc;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update
const update = async (docId, docData) => {
    try {
        const { error } = documentSchema.updateDocumentSchema.validate(docData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const doc = await Document.findByPk(docId);
        if (!doc) {
            throw new Error("Document not found");
        }

        const mapped = {
            nurse_ID: docData.nurse_ID,
            attachment_url: docData.url,
            issuing_authority: docData.issuing_authority,
            issue_date: docData.issue_date,
            document_type: docData.type
        };

        await Document.update(mapped, {
            where: { doc_ID: docId }
        });

        const updated = await Document.findByPk(docId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete
const remove = async (docId) => {
    try {
        const deleted = await Document.destroy({
            where: { doc_ID: docId }
        });
        if (!deleted) {
            throw new Error("Document not found");
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};


