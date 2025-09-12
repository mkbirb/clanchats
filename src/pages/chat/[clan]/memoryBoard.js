import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useRef, useState } from "react";
import { loadMemoryBoard, saveMemoryBoard } from "../../../components/firebaseConfig";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { useRouter } from "next/router";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  },
)

const MemoryBoard = ({boardId = "default-board"}) => {
  const { user } = useCurrentUser(); 

  const router = useRouter();
  const {clan} = router.query;
  
  const excalidrawRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  let latestScene = useRef({ elements: [], appState: {}, files: {} });
  const [initialData, setInitialData] = useState(null);


  useEffect(() => {
    // Only render after client mount
    setMounted(true);

    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    try {
      const { elements, appState = {}, files = {} } = await loadMemoryBoard(clan, boardId);

      // Ensure the Collaborators exist, so we do not get undefined
      const safeAppState = {
        ...appState,
        collaborators: Array.isArray(appState.collaborators) ? appState.collaborators : [],
      };

      setInitialData({ elements, appState: safeAppState, files });
      latestScene.current = { elements, appState: safeAppState, files };
    } 
    catch (error) {
      console.log("Could not Load Memory Board", error);
    }
  }


  // Handle the Saving of the Memory Board
  const handleSave = async () => {
    // Get the current state/elements of the whiteboard
    const { elements, appState, files } = latestScene.current;
    if (excalidrawRef.current) {

      // Store in the Database
      try {
        await saveMemoryBoard(
          clan,
          user,
          boardId,
          JSON.parse(JSON.stringify(elements)),
          JSON.parse(JSON.stringify(appState)),
          JSON.parse(JSON.stringify(files))
        );
      }
      catch (error) {
        console.log("Could not save Memory Board", error);
      }
    }
  }

  return (
    <>
      <p>Memory Board</p>
      {mounted && 
        (
            <>
                <div style={{ width: "800px", height: "600px", border: "1px solid #ccc" }}>
                <Excalidraw
                  ref={excalidrawRef}
                  initialData={initialData}
                  onChange={(elements, appState) => {
                    latestScene.current = { elements, appState, files: latestScene.current.files };
                  }}
                  onFileChange={(files) => {
                    latestScene.current.files = files;
                  }}
                />
                </div>
                <button onClick={handleSave}>Save Board</button>
            </>
        )}
    </>
  );
}

export default MemoryBoard;