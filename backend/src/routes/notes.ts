import * as NotesController from "../controllers/notes";
import express  from "express";
import handlePagination from "../middleware/handlePagination";

const router = express.Router();

router.get("/", handlePagination, NotesController.getNotes);

router.get("/:noteId", NotesController.getNote);

router.post("/", NotesController.createNote);

router.patch("/:noteId", NotesController.updateNote);

router.delete("/:noteId", NotesController.deleteNote);

export default router;