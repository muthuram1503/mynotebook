
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Alert, Button, Modal, Form } from "react-bootstrap";
import { FaVideo, FaUpload, FaDownload, FaTrash, FaCamera, FaMicrophone } from "react-icons/fa";
import ChecklistModal from "./Checkmodel";
import axios from "axios";
// import jwtDecode from "jwt-decode"; // Install with: npm install jwt-decode
import { jwtDecode } from "jwt-decode"; // Use named import

const StudentNoteComponent = () => {
  // URL parameters and navigation
  const { classNumber, subject, chapter } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Component states
  const [notes, setNotes] = useState([]);
  const [media, setMedia] = useState([]);
  const [importantTopics, setImportantTopics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [editNote, setEditNote] = useState({ id: "", classNumber: "", subject: "", chapter: "", title: "", description: "" });
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("image");
  const [showChecklist, setShowChecklist] = useState(false);
  const [userId, setUserId] = useState(null);

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Audio recording states
  const [recordingActive, setRecordingActive] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [audioDataBlob, setAudioDataBlob] = useState(null);
  const [audioFileId, setAudioFileId] = useState(null);
  const recorderInstanceRef = useRef(null);
  const audioDataChunksRef = useRef([]);

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch data once token is available
  useEffect(() => {
    if (token) {
      fetchNotes();
      fetchMedia();
      fetchImportantTopics();
    }
  }, [classNumber, subject, chapter, token]);




// // getting the user id

useEffect(() => {

  if (!token) {
    console.error("No auth token found!");
    return;
  }
    // Check if user is admin
    // const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id); // Extract isAdmin from token
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }
  , [token]);




  // useEffect(() => {
  //   if (!token) {
  //     console.error("No auth token found!");
  //     return;
  //   }
  // const response=  axios.get("http://localhost:5000/api/user/getuser", {
  //     headers: {
  //       "auth-token": localStorage.getItem("token") // Pass token for authentication
  //     }
  //   })
  //   .then(response =>  setUserId( response.data.userId))
  //   .catch(error => console.error("Error fetching user ID:", error));
  //   // const fetchUserId = async () => {
  //   //   const id = await getUser(token); // Call getUser with the token
  //   //   setUserId(id);
  //   // };

  //   // fetchUserId();
  // }, [token]);
  console.log("hi");
  console.log(userId);














  // Fetch notes from the server
  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/studentnotes/${classNumber}/${subject}/${chapter}`, {
        method: "GET",
        headers: { "auth-token": token, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  // Fetch media files
  const fetchMedia = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/studentmedias/${classNumber}/${subject}/${chapter}`, {
        method: "GET",
        headers: { "auth-token": token },
      });
      if (!response.ok) throw new Error("Media not found");
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  // Fetch important topics
  const fetchImportantTopics = async () => {
    try {
      const url = `http://localhost:5000/api/topics/${classNumber}/${subject}/${chapter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Topics not found");
      const data = await response.json();
      setImportantTopics(data.topics || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setImportantTopics([]);
    }
  };

  // Note handlers
  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/studentnotes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify({ ...newNote, classNumber, subject, chapter }),
      });
      if (!response.ok) throw new Error("Failed to add note");
      fetchNotes();
      setShowModal(false);
      setNewNote({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleNoteDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/studentnotes/delete/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token },
      });
      if (!response.ok) throw new Error("Failed to delete note");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleNoteEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/studentnotes/update/${editNote.id}`, {
        method: "PUT",
        headers: { "auth-token": token, "Content-Type": "application/json" },
        body: JSON.stringify({
          classNumber: editNote.classNumber,
          subject: editNote.subject,
          chapter: editNote.chapter,
          title: editNote.title,
          description: editNote.description,
        }),
      });
      if (!response.ok) throw new Error("Failed to update note");
      fetchNotes();
      setEditModal(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Media file handlers
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("classNumber", classNumber);
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    formData.append("fileType", fileType);
    try {
      const response = await fetch("http://localhost:5000/api/studentmedias/upload", {
        method: "POST",
        headers: { "auth-token": token },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload file");
      await response.json();
      fetchMedia();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownloadFile = async (filePath, chapterName) => {
    try {
      const response = await fetch(`http://localhost:5000${filePath}`);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${chapterName}_${filePath.split('/').pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDeleteMedia = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/studentmedias/delete/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token },
      });
      if (!response.ok) throw new Error("Failed to delete file");
      fetchMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const uploadFile = async (file, fileType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("classNumber", classNumber);
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    formData.append("fileType", fileType);
    try {
      const response = await fetch("http://localhost:5000/api/studentmedias/upload", {
        method: "POST",
        headers: { "auth-token": token },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload file");
      fetchMedia();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Camera and video recording handlers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };
  // const startCamera = async () => {
  //   // Check if the camera is already open
  //   if (showCamera) return;
  
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     if (videoRef.current) videoRef.current.srcObject = stream;
  //     setShowCamera(true);
  //   } catch (error) {
  //     console.error("Error starting camera:", error);
  //   }
  // };
  
  
  const stopCamera = async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setShowCamera(false);
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], `${chapter}_photo.png`, { type: "image/png" });
      uploadFile(file, "image");
    }, "image/png");
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;
    mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject, { mimeType: "video/webm" });
    recordedChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const file = new File([blob], `${chapter}_video.webm`, { type: "video/webm" });
      uploadFile(file, "video");
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Audio recording handlers
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderInstanceRef.current = recorder;
      audioDataChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioDataChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioDataChunksRef.current, { type: "audio/wav" });
        setAudioDataBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioFileUrl(audioUrl);
      };
      recorder.start();
      setRecordingActive(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  const stopRecordingAudio = () => {
    if (recorderInstanceRef.current) {
      recorderInstanceRef.current.stop();
      setRecordingActive(false);
    }
  };

  const uploadAudioFile = async () => {
    if (!audioDataBlob) return alert("No recorded audio to upload!");
    const formData = new FormData();
    formData.append("file", audioDataBlob, "recording.wav");
    formData.append("classNumber", classNumber);
    formData.append("subject", subject);
    formData.append("chapter", chapter);
    formData.append("fileType", "audio");
    try {
      const response = await fetch("http://localhost:5000/api/studentmedias/upload", {
        method: "POST",
        headers: { "auth-token": token },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Failed to upload audio");
      setAudioFileId(data.fileId);
      setAudioFileUrl(null);
      setAudioDataBlob(null);
      setAudioFileId(null);
      fetchMedia();
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const downloadAudioFile = () => {
    if (!audioFileUrl) return alert("No audio to download!");
    const link = document.createElement("a");
    link.href = audioFileUrl;
    link.download = "recording.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteAudioFile = () => {
    setAudioFileUrl(null);
    setAudioDataBlob(null);
    setAudioFileId(null);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center text-primary fw-bold">Notes for {chapter} ({subject})</h2>

      {/* Important Topics */}
      <h4 className="text-info mt-4">Important Topics</h4>
      <Row>
        {importantTopics.length > 0 ? (
          importantTopics.map((topic, index) => (
            <Col md={6} key={index}>
              <Card className="mb-3 shadow-sm border-0 bg-light">
                <Card.Body>
                  <h5 className="fw-bold text-dark">{topic}</h5>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Alert variant="warning">No important topics available.</Alert>
        )}
      </Row>

      {/* Add Note Button */}
      <div className="text-center my-3">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Note
        </Button>
        <Button
        //  variant="primary"
         className="btn btn-primary mx-2" 
        onClick={() => setShowChecklist(true)}>
        📋Checklist
      </Button>
      </div>
      

      {/* Notes Section */}
      <Row className="mt-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Col md={6} key={note._id}>
              <Card className="mb-3 shadow-lg">
                <Card.Body>
                  <h5 className="text-primary fw-bold">{note.title}</h5>
                  <p className="text-muted">{note.description}</p>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="warning"
                      onClick={() => {
                        setEditModal(true);
                        setEditNote({
                          id: note._id,
                          classNumber: note.classNumber,
                          subject: note.subject,
                          chapter: note.chapter,
                          title: note.title,
                          description: note.description,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleNoteDelete(note._id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Alert variant="warning">No notes available.</Alert>
        )}
      </Row>

      {/* Add Note Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNoteSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newNote.description}
                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Add Note
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Note Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editNote.title}
                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editNote.description}
                onChange={(e) => setEditNote({ ...editNote, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNoteEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload Media Section */}
      <Card className="p-4 shadow-sm mt-4 bg-light">
        <h4 className="text-info fw-bold">Upload Media</h4>
        <Form onSubmit={handleUpload} className="d-flex flex-wrap align-items-center">
          <Form.Control
            type="file"
            className="me-3 mb-2"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <Form.Select
            className="me-3 mb-2"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="document">Document</option>
          </Form.Select>
          <Button type="submit" variant="success" className="mb-2">
            <FaUpload /> Upload
          </Button>
        </Form>
      </Card>

      {/* Uploaded Media Section */}
      <h4 className="text-info mt-4 fw-bold">Uploaded Media</h4>
      <Row className="mt-3">
        {media.length > 0 ? (
          media.map((item) => (
            <Col md={6} key={item._id}>
              <Card className="mb-3 shadow-sm border-0">
                <Card.Body className="text-center">
                  <h6 className="fw-bold">
                     {/* <h6 className="fw-bold">{item.subject+ "-"+item.chapter+item.fileName}</h6>  if you need the fileid in tile use this */}
                    {item.subject} - {item.chapter} - {item.fileType}
                  </h6>
                  {item.fileType === "image" ? (
                    <img
                      src={`http://localhost:5000${item.filePath}`}
                      alt={item.fileName}
                      className="img-fluid rounded shadow-sm mt-2"
                      style={{ maxWidth: "100px" }}
                    />
                  ) : item.fileType === "audio" ? (
                    <audio controls className="mt-2">
                      <source src={`http://localhost:5000${item.filePath}`} type="audio/mpeg" />
                      Your browser does not support the audio tag.
                    </audio>
                  ) : (
                    <p className="text-muted">{item.fileName}</p>
                  )}
                  <div className="mt-3 d-flex justify-content-center">
                    <Button variant="info" className="me-2" onClick={() => handleDownloadFile(item.filePath, item.chapter)}>
                      <FaDownload /> Download
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteMedia(item._id)}>
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Alert variant="warning" className="text-center">No media available.</Alert>
        )}
      </Row>

      {/* Camera Section */}
      {/* {showCamera && (
        <Card className="p-3 mt-4 shadow-lg text-center">
          <h5 className="text-primary fw-bold">📷 Live Camera</h5>
          <div className="d-flex justify-content-center">
            <video
              ref={videoRef}
              autoPlay
              className="border rounded shadow-lg"
              style={{ width: "100%", maxWidth: "500px", height: "auto" }}
            ></video>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
            <Button variant="warning" onClick={capturePhoto}>
              📸 Capture Photo
            </Button>
            {!isRecording ? (
              <Button variant="danger" onClick={startRecording}>
                <FaVideo /> Start Recording
              </Button>
            ) : (
              <Button variant="dark" onClick={stopRecording}>
                ⏹️ Stop Recording
              </Button>
            )}
            <Button variant="secondary" onClick={stopCamera}>
              ❌ Close Camera
            </Button>
          </div>
        </Card>
      )}
      <div className="text-center mt-4">
        <Button variant="primary" className="fw-bold px-4 py-2" onClick={startCamera}>
          <FaCamera /> Open Camera
        </Button>
      </div> */}

      {/* Audio Recorder Section */}
      {/* <div className="container mt-5 p-4 shadow-lg rounded bg-light">
        <h3 className="text-primary fw-bold mb-4 d-flex align-items-center">
          🎤 Audio Recorder
        </h3>
        {!recordingActive ? (
          <Button className="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold shadow-sm" onClick={startRecordingAudio}>
            <FaMicrophone className="me-2" /> Start Recording
          </Button>
        ) : (
          <Button className="btn btn-outline-danger px-4 py-2 rounded-pill fw-bold shadow-sm" onClick={stopRecordingAudio}>
            <FaTrash className="me-2" /> Stop Recording
          </Button>
        )}
        {audioFileUrl && (
          <div className="mt-4 p-3 bg-white rounded shadow-sm text-center">
            <audio controls src={audioFileUrl} className="d-block w-100 mb-3 border rounded"></audio>
            <div className="d-flex justify-content-center gap-3">
              <Button className="btn btn-success px-4 py-2 rounded-pill fw-bold shadow-sm" onClick={uploadAudioFile}>
                <FaUpload className="me-2" /> Upload
              </Button>
              <Button className="btn btn-warning px-4 py-2 rounded-pill fw-bold shadow-sm text-dark" onClick={downloadAudioFile}>
                <FaDownload className="me-2" /> Download
              </Button>
              <Button className="btn btn-danger px-4 py-2 rounded-pill fw-bold shadow-sm" onClick={deleteAudioFile}>
                <FaTrash className="me-2" /> Delete
              </Button>
            </div>
          </div>
        )}
      </div> */}

<div className="container mt-5">
  <Row>
    {/* Camera Section */}
    <Col md={6} className="mt-2">
   
      {showCamera ? (
        <Card className="p-3 shadow-lg text-center mb-3">
          <h5 className="text-primary fw-bold">📷 Live Camera</h5>
          <div className="d-flex justify-content-center">
            <video
              ref={videoRef}
              autoPlay
              className="border rounded shadow-lg"
              style={{ width: "100%", maxWidth: "500px", height: "auto" }}
            ></video>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
            <Button variant="warning" onClick={capturePhoto}>
              📸 Capture Photo
            </Button>
            {!isRecording ? (
              <Button variant="danger" onClick={startRecording}>
                <FaVideo /> Start Recording
              </Button>
            ) : (
              <Button variant="dark" onClick={stopRecording}>
                ⏹️ Stop Recording
              </Button>
            )}
            <Button variant="secondary" onClick={stopCamera}>
              ❌ OF Camera
            </Button>
            <Button variant="success" className="fw-bold px-3 py-2" onClick={startCamera}>
            <FaCamera /> ON Camera
          </Button>
          </div>
         
        </Card>
      ) : (


        <Button variant="primary" className="fw-bold px-4 py-2 w-100" onClick={startCamera}>
            <FaCamera /> Open Camera
          </Button> 

          // if not work use this
        // // <div className="text-center">
        //   <Button variant="primary" className="fw-bold px-4 py-2 w-100" onClick={startCamera}>
        //     <FaCamera /> Open Camera
        //   </Button>
        // // </div>
      )}
      
    </Col>

    {/* Audio Recorder Section */}
    




<Col xs={12} md={6} className="mt-2 bg-white ">
  <Card className=" rounded mb-4 bg-white ">
    {!recordingActive ? (
      <Button 
        className="btn btn-primary  py-2 fw-bold ="
        onClick={startRecordingAudio}
      >
        <FaMicrophone className="me-2" /> Take Voice Note
      </Button>
    ) : (
      <Button
        className="btn btn-outline-danger w-100 py-2 fw-bold "
        onClick={stopRecordingAudio}
      >
        <FaTrash className="me-2" /> Stop Recording
      </Button>
    )}

    {audioFileUrl && (
      <div className="mt-4 p-3 bg-white rounded shadow-sm text-center">
        <audio
          controls
          src={audioFileUrl}
          className="d-block w-100 mb-3 border rounded"
        ></audio>

        <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
          <Button
            className="btn btn-success w-100 py-2 fw-bold shadow-sm"
            onClick={uploadAudioFile}
          >
            <FaUpload className="me-2" /> Upload
          </Button>
          <Button
            className="btn btn-warning w-100 py-2 fw-bold shadow-sm text-dark"
            onClick={downloadAudioFile}
          >
            <FaDownload className="me-2" /> Download
          </Button>
          <Button
            className="btn btn-danger w-100 py-2 fw-bold shadow-sm"
            onClick={deleteAudioFile}
          >
            <FaTrash className="me-2" /> Delete
          </Button>
        </div>
      </div>
    )}
  </Card>
</Col>








  </Row>
</div>


{/* CHECKLIST */}

<div className="note-container">
    
      {/* Checklist Button */}

      {/* Checklist Modal */}
      <ChecklistModal 
        show={showChecklist} 
        handleClose={() => setShowChecklist(false)} 
        userId={userId} 
        classNumber={classNumber} 
        subject={subject} 
        chapter={chapter} 
      />
    </div>






    </Container>
  );
};

export default StudentNoteComponent;
