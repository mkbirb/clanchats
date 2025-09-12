import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useRef, useState } from "react";
import { loadMemoryBoard, saveMemoryBoard } from "../../../components/firebaseConfig";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { useRouter } from "next/router";
import ToClanHome from "../../../components/ToClanHome";

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

  // A Board is Dirty if it is Edited but has not been saved.
  const [isDirty, setIsDirty] = useState(false);
  const lastSavedScene = useRef(null);

  const isInitialLoad = useRef(true);
  const isNewBoard = useRef(true);

  useEffect(() => {
    if (!clan || !boardId) return;
    // Only render after client mount
    setMounted(true);

    loadBoard();
  }, [clan, boardId]);

  // Provide warning if the Board is Dirty (I.e edited but not saved) and User reloads or leaves tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty])

  // Provides warning user navigates away from page
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isDirty && !confirm("You have unsaved changes. Are you sure you want to leave?")) {
        // Cancel navigation by stopping the Router
        throw "Route change aborted by user"; 
      }
    }

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isDirty]);

  const loadBoard = async () => {
    try {
      const boardData = await loadMemoryBoard(clan, boardId);

      // If board not exists yet, use Empty Defaults
      const {
        elements = [],
        appState = {},
        files = {},
      } = boardData || {};

      // Ensure the Collaborators exist, so we do not get undefined
      const safeAppState = {
        ...appState,
        collaborators: Array.isArray(appState.collaborators) ? appState.collaborators : [],
      };

      setInitialData({ elements, appState: safeAppState, files });
      latestScene.current = { elements, appState: safeAppState, files };
      // Still treat the Board as clean, until the user actually edits the board
      lastSavedScene.current = boardData ? JSON.parse(JSON.stringify(latestScene.current)) : null;

      // New Board if Board is not saved in Database yet
      isNewBoard.current = !boardData;
    } 
    catch (error) {
      console.log("Could not Load Memory Board", error);
    }
  }

  // Checks whether or not the Board has been edited and not saved
  const handleChange = (elements, appState) => {
    latestScene.current.elements = elements;
    latestScene.current.appState = appState;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    
    // Consider dirty ONLY if user actually drew something
    if (!lastSavedScene.current) {
      const hasUserContent = elements.some(el => el.type !== "viewport"); // ignore viewport metadata
      setIsDirty(hasUserContent);
      return;
    }

    // Ignore seeing the change, until  the current last saved scene exists
    if (!lastSavedScene.current) return;

    // Dirty if the Elements and AppState from Exaclidraw are not the same as the latest saved scene!
    const dirty =
      JSON.stringify(latestScene.current.elements) !== JSON.stringify(lastSavedScene.current.elements) ||
      JSON.stringify(latestScene.current.appState) !== JSON.stringify(lastSavedScene.current.appState);

    setIsDirty(dirty);
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
        
        // Update the Lastest Saved Scene after the Saving has been done
        lastSavedScene.current = JSON.parse(JSON.stringify(latestScene.current));
        setIsDirty(false);
        isInitialLoad.current = true;
        isNewBoard.current = false;
      }
      catch (error) {
        console.log("Could not save Memory Board", error);
      }
    }
  }

  const handleFileChange = (files) => {
    latestScene.current.files = files;
    setIsDirty(true); 
  };

  return (
    <>
      <ToClanHome />
      <p>Memory Board</p>
      {mounted && initialData &&
        (
            <>
                <div style={{ width: "800px", height: "600px", border: "1px solid #ccc" }}>
                <Excalidraw
                  key={`${clan}-${boardId}`} 
                  ref={excalidrawRef}
                  initialData={initialData}
                  onChange={handleChange}
                  onFileChange={handleFileChange}
                />
                </div>
                <button onClick={handleSave}>Save Board</button>
            </>
        )}
    </>
  );
}

export default MemoryBoard;