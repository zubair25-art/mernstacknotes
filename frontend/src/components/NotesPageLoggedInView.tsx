import  React,{ useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from "../models/note";
import * as NotesApi from "../network/notes-api";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditNoteDialog from "./AddEditNoteDialog";
import Note from "./Note";
// import * as clapsSound from "../sounds"

const NotesPageLoggedInView = () => {
      const [notes, setNotes] = useState<NoteModel[]>([]);
      const [notesLoading, setNotesLoading] = useState(true);
      const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
    
      const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
      const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

      const [currentPage, setCurrentPage] =  useState(1);
      const [totalPages, setTotalPages]   = useState(1);

      // const playClapSound = () => {
      //   const audio = new Audio(clapsSound); 
      //   audio.play();
      // };

      useEffect(() => {
        async function loadNotes() {
          try {
              setShowNotesLoadingError(false);
              setNotesLoading(true);
              // const notes = await NotesApi.fetchNotes();
              const response = await NotesApi.fetchNotes(currentPage);
              // setNotes(notes);
              setNotes(response.notes);
              setTotalPages(response.totalPages);
          } catch (error) {
              console.error(error);
              // alert(error);
              setShowNotesLoadingError(true);
          } finally {
             setNotesLoading(false);
          }
        }
        loadNotes();
      }, [currentPage]);
    
      async function deleteNote(note: NoteModel) {
        try {
          await NotesApi.deleteNote(note._id);
          setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
        } catch (error) {
          console.error(error);
          alert(error);
        }
      }
    
      const notesGrid = (
         <Row xs={1} md={2} className={`g-4 ${styles.notesGrid}`}>
            {notes.map((note) => (
                <Col key={note._id}>
                    <Note
                        note={note}
                        className={styles.note}
                        onNoteClicked={setNoteToEdit}
                        onDeleteNoteClicked={deleteNote}
                    />
                </Col> 
            ))}
         </Row>
      );

      const  handleNextPage = () => {
        if (currentPage <totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
          // playClapSound();
        }  
      };

      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage((prevPage) => prevPage -1);
          // playClapSound();
        } 
      };


  return (
    <>
      <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}
      >
        <FaPlus />
        Add new note
      </Button>
      {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && (
        <p>Something Went Wrong Please Refresh The Page</p>
      )}
      {!notesLoading && !showNotesLoadingError && (
        <>
          {notes.length > 0 ? (
          <>
          {notesGrid} 
          {/* Pagination Controls */}
          <div className={styles.paginationControls}>
             <Button
                 onClick={handlePrevPage}
                 disabled={currentPage === 1}
                 className="me-2"
                 >
                  Previous
                  </Button>
                  <span>
                     Page {currentPage} of {totalPages}
                  </span>
                  <Button
                     onClick={handleNextPage}
                     disabled= {currentPage === totalPages}
                     className="ns-2"
                  >
                    Next
                  </Button> 
          </div>
          </>
        ) : ( 
           <p>you don't have any Notes Yet</p>
        )}
        </>
      )}
      {showAddNoteDialog && (
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id
                  ? updatedNote
                  : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default NotesPageLoggedInView;
